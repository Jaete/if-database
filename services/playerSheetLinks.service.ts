import type {
  ICitizenAbility,
  ICitizenRaceChoice,
  ICitizenTalent,
  IPlayerLineage,
  ITalentSlots,
} from '../db/citizens/citizen.d';
import type ICharacterClass from '../db/classes/class.d';
import type ITalentDoc from '../db/talents/talent.d';
import CharacterClassModel from '../db/classes/classes';
import TalentModel from '../db/talents/talents';
import type { IRaceCatalogEntry } from '../db/races/race.d';
import { getRaceCatalog } from './race.service';
import { buildLineage, raceAbility, sanitizeRaceChoice } from './raceLineage';
import { raceLabelOf, resolveRaceTraits } from './raceTraits.service';
import {
  GENERAL_TALENT_FIELDS,
  classTalentOptions,
  generalTalentOption,
  type ITalentOption,
} from './talentCatalog';
import { talentSlotsOf } from './talentSlots';

/**
 * Raça e talentos da ficha: a leitura que resolve o que a ficha guarda e a
 * escrita que confere o que chega.
 *
 * Mesma divisão de `resolveArchetype`/`stripDerivedArchetype`: o documento
 * guarda só a ESCOLHA (`raceId`, `raceChoice`, `talents[{key, level, name}]`),
 * e tudo o que a escolha significa — habilidades, linhagem, escopo e descrição
 * dos talentos, marcos da classe — vem do códice a cada leitura, para uma
 * correção lá chegar a todas as fichas.
 *
 * Sem 'use server' de propósito: exporta uma classe de erro e tipos, e só é
 * usado por outros serviços no servidor.
 */

/** Falha de validação do que o cliente mandou gravar; vira 400 na rota. */
export class PlayerSheetError extends Error {}

const OBJECT_ID = /^[0-9a-f]{24}$/i;
const MAX_TALENTS = 100;
const MAX_TALENT_LEVEL = 30;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

const shortString = (value: unknown, max = 200) =>
  typeof value === 'string' && value.length > 0 && value.length <= max
    ? value
    : undefined;

// ── Raça ─────────────────────────────────────────────────

interface IRaceBook {
  byId: Map<string, IRaceCatalogEntry>;
  bySlug: Map<string, IRaceCatalogEntry>;
}

async function loadRaceBook(): Promise<IRaceBook> {
  const catalog = await getRaceCatalog();
  return {
    byId: new Map(catalog.map((race) => [race.id, race])),
    bySlug: new Map(catalog.map((race) => [race.slug, race])),
  };
}

/**
 * Só o que a leitura de UMA ficha precisa: a raça dela e, numa mista, as raças
 * de origem. Evita baixar o catálogo inteiro a cada visita ao embed.
 */
async function loadRaceBookFor(
  raceId: string,
  choice: unknown
): Promise<IRaceBook> {
  const [race] = await getRaceCatalog({ _id: raceId });
  if (!race) return { byId: new Map(), bySlug: new Map() };
  const parents =
    isRecord(choice) && Array.isArray(choice.parents)
      ? choice.parents.filter((s): s is string => typeof s === 'string')
      : [];
  const others =
    parents.length > 0 ? await getRaceCatalog({ slug: { $in: parents } }) : [];
  return {
    byId: new Map([[race.id, race]]),
    bySlug: new Map([race, ...others].map((r) => [r.slug, r])),
  };
}

/**
 * As habilidades raciais e a placa de linhagem de uma ficha ligada a uma raça.
 * Sem `raceId` (ou com raça que sumiu do códice), a ficha segue como texto.
 */
export async function resolveRaceLink(player: {
  raceId?: unknown;
  raceChoice?: unknown;
}): Promise<{ abilities: ICitizenAbility[]; lineage?: IPlayerLineage }> {
  const id = String(player.raceId ?? '');
  if (!OBJECT_ID.test(id)) return { abilities: [] };

  const book = await loadRaceBookFor(id, player.raceChoice);
  const race = book.byId.get(id);
  if (!race) return { abilities: [] };

  const choice = isRecord(player.raceChoice)
    ? (player.raceChoice as ICitizenRaceChoice)
    : {};
  const traits = resolveRaceTraits(race, choice, book.bySlug);
  return {
    abilities: traits.map(raceAbility),
    lineage: buildLineage(race, choice, book.bySlug, traits),
  };
}

// ── Talentos ─────────────────────────────────────────────

interface IStoredTalent {
  key: string;
  level: number;
  name: string;
}

const readStoredTalents = (raw: unknown): IStoredTalent[] =>
  (Array.isArray(raw) ? raw : []).flatMap((item) => {
    if (!isRecord(item)) return [];
    const key = shortString(item.key);
    if (!key) return [];
    const level = Number(item.level);
    return [
      {
        key,
        level: Number.isFinite(level)
          ? Math.min(MAX_TALENT_LEVEL, Math.max(1, Math.round(level)))
          : 1,
        name: shortString(item.name) ?? key,
      },
    ];
  });

export type ClassForTalents = Pick<
  ICharacterClass,
  'slug' | 'name' | 'talents' | 'levels'
>;

async function loadClassForTalents(classId: unknown) {
  const id = String(classId ?? '');
  if (!OBJECT_ID.test(id)) return null;
  return CharacterClassModel.findById(id)
    .select('slug name talents levels')
    .lean<ClassForTalents>();
}

/** Os talentos da ficha com escopo, descrição e marcos resolvidos do códice. */
export async function resolveTalents(
  player: {
    classId?: unknown;
    talents?: unknown;
  },
  // A leitura carrega a classe uma vez; `undefined` = buscar aqui.
  preloaded?: ClassForTalents | null
): Promise<{ talents?: ICitizenTalent[]; talentSlots?: ITalentSlots }> {
  const stored = readStoredTalents(player.talents);
  const klass =
    preloaded === undefined
      ? await loadClassForTalents(player.classId)
      : preloaded;

  const talentSlots: ITalentSlots | undefined = klass
    ? {
        ...talentSlotsOf(klass.levels, (klass.talents ?? []).length > 0),
        className: klass.name,
      }
    : undefined;

  if (stored.length === 0) return talentSlots ? { talentSlots } : {};

  const classOptions = new Map(
    classTalentOptions(klass).map((option) => [option.key, option])
  );
  const generalKeys = [
    ...new Set(
      stored.filter((t) => !classOptions.has(t.key)).map((t) => t.key)
    ),
  ];
  const general = new Map(
    (generalKeys.length > 0
      ? await TalentModel.find({ slug: { $in: generalKeys } })
          .select(GENERAL_TALENT_FIELDS)
          .lean<ITalentDoc[]>()
      : []
    ).map((doc) => [doc.slug, generalTalentOption(doc)])
  );

  const talents = stored.map((entry): ICitizenTalent => {
    const option: ITalentOption | undefined =
      classOptions.get(entry.key) ?? general.get(entry.key);
    if (!option) return { ...entry, orphan: true };
    return {
      key: entry.key,
      level: entry.level,
      name: option.name,
      scope: option.scope,
      category: option.category,
      prerequisites: option.prerequisites,
      description: option.description,
      group: option.group,
      stackable: option.stackable,
    };
  });

  return { talents, ...(talentSlots ? { talentSlots } : {}) };
}

/** Só o que é escolha vai para o documento: sai tudo o que foi derivado. */
export function stripDerivedTalents(talents: unknown): IStoredTalent[] {
  return readStoredTalents(talents);
}

async function sanitizeTalents(
  raw: unknown,
  classId: unknown,
  storedRaw: unknown
): Promise<IStoredTalent[]> {
  if (!Array.isArray(raw)) {
    throw new PlayerSheetError('Os talentos precisam ser uma lista.');
  }
  if (raw.length > MAX_TALENTS) {
    throw new PlayerSheetError(`Talentos demais (máximo ${MAX_TALENTS}).`);
  }
  const incoming = readStoredTalents(raw);
  if (incoming.length !== raw.length) {
    throw new PlayerSheetError('Há um talento sem identificação.');
  }

  const stored = readStoredTalents(storedRaw);
  const storedCount = (key: string) =>
    stored.filter((t) => t.key === key).length;

  const klass = await loadClassForTalents(classId);
  const classOptions = new Map(
    classTalentOptions(klass).map((o) => [o.key, o])
  );
  const generalKeys = [
    ...new Set(
      incoming.filter((t) => !classOptions.has(t.key)).map((t) => t.key)
    ),
  ];
  const general = new Map(
    (generalKeys.length > 0
      ? await TalentModel.find({ slug: { $in: generalKeys } })
          .select(GENERAL_TALENT_FIELDS)
          .lean<ITalentDoc[]>()
      : []
    ).map((doc) => [doc.slug, generalTalentOption(doc)])
  );

  const counts = new Map<string, number>();
  return incoming.map((entry) => {
    const option = classOptions.get(entry.key) ?? general.get(entry.key);
    // Um talento que já estava gravado e saiu do catálogo (a classe mudou, o
    // tópico foi reimportado) é mantido: recusar travaria o save de quem só
    // quer mexer em outra coisa. Só o que entra agora precisa existir.
    if (!option && storedCount(entry.key) === 0) {
      throw new PlayerSheetError(`Talento desconhecido: "${entry.name}".`);
    }

    const count = (counts.get(entry.key) ?? 0) + 1;
    counts.set(entry.key, count);
    const allowed = option?.stackable
      ? Infinity
      : Math.max(1, storedCount(entry.key));
    if (count > allowed) {
      throw new PlayerSheetError(
        `"${option?.name ?? entry.name}" não pode ser escolhido mais de uma vez.`
      );
    }

    return {
      key: entry.key,
      level: entry.level,
      name: option?.name ?? entry.name,
    };
  });
}

// ── Escrita ──────────────────────────────────────────────

/** O que a escrita precisa saber do documento antes da alteração. */
export interface IStoredSheetLinks {
  race?: string;
  raceId?: unknown;
  raceChoice?: unknown;
  classId?: unknown;
  talents?: unknown;
}

/**
 * Confere e normaliza raça e talentos antes de gravar. Altera `update`.
 *
 *   - O texto livre `race` é regravado a partir de `raceId` + `raceChoice`,
 *     como `class` é de `classId`. Editar o texto à mão de uma ficha ligada
 *     desliga o vínculo, pelo mesmo motivo de `unlinkClassIfRenamed`.
 *   - `raceChoice` é reduzido ao que a raça admite (ver `sanitizeChoice`).
 *   - `talents` guarda só `{ key, level, name }`; a repetição só vale para
 *     talento que se pega mais de uma vez.
 */
export async function prepareSheetLinksWrite(
  stored: IStoredSheetLinks | null,
  update: Record<string, unknown>
): Promise<void> {
  const touchesRace = 'raceId' in update || 'raceChoice' in update;

  if (touchesRace) {
    const nextId = 'raceId' in update ? update.raceId : stored?.raceId;
    if (nextId === null || nextId === undefined || nextId === '') {
      update.raceId = null;
      update.raceChoice = null;
    } else {
      const id = String(nextId);
      if (!OBJECT_ID.test(id)) throw new PlayerSheetError('Raça inválida.');
      const book = await loadRaceBook();
      const race = book.byId.get(id);
      if (!race) throw new PlayerSheetError('Raça não encontrada no códice.');

      const sameRace = String(stored?.raceId ?? '') === id;
      const rawChoice =
        'raceChoice' in update
          ? update.raceChoice
          : sameRace
            ? stored?.raceChoice
            : undefined;
      const choice = sanitizeRaceChoice(race, rawChoice, book.bySlug);

      update.raceId = id;
      update.raceChoice = choice;
      update.race = raceLabelOf(race, choice, book.bySlug);
    }
  } else if (typeof update.race === 'string' && stored?.raceId) {
    const book = await loadRaceBook();
    const race = book.byId.get(String(stored.raceId));
    const choice = isRecord(stored.raceChoice)
      ? (stored.raceChoice as ICitizenRaceChoice)
      : {};
    // O texto que já estava gravado também vale: o editor completo devolve a
    // ficha inteira, e uma raça renomeada no códice não pode desligar o vínculo
    // de quem não tocou no campo.
    const untouched =
      !!race &&
      (update.race === raceLabelOf(race, choice, book.bySlug) ||
        update.race === stored.race);
    if (!untouched) {
      update.raceId = null;
      update.raceChoice = null;
    }
  }

  if ('talents' in update) {
    const classId = 'classId' in update ? update.classId : stored?.classId;
    update.talents = await sanitizeTalents(
      update.talents,
      classId,
      stored?.talents
    );
  }
}
