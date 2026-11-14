import type {
  ICitizenAbility,
  ICitizenRaceChoice,
  ICitizenTalent,
  IPlayerLineage,
  ITalentMilestone,
  ITalentSlots,
} from '../db/citizens/citizen.d';
import type ICharacterClass from '../db/classes/class.d';
import type ITalentDoc from '../db/talents/talent.d';
import { Types } from 'mongoose';
import CharacterClassModel from '../db/classes/classes';
import TalentModel from '../db/talents/talents';
import type { IRaceCatalogEntry } from '../db/races/race.d';
import { getRaceCatalog, uniqueRaceConflict } from './race.service';
import { uniqueClassConflict } from './class.service';
import { buildLineage, raceAbility, sanitizeRaceChoice } from './raceLineage';
import { raceLabelOf, resolveRaceTraits } from './raceTraits.service';
import {
  GENERAL_TALENT_FIELDS,
  classTalentOptions,
  generalTalentOption,
  type ITalentOption,
} from './talentCatalog';
import { talentSlotsOf } from './talentSlots';
import { requiredLevel } from '../lib/talentPrerequisite';
import { getClassCasting } from './classSpells.service';
import SpellModel from '../db/spells/spells';

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

/** Classe ou raça única tomada por outra ficha; as rotas respondem 409. */
export class UniqueConflictError extends PlayerSheetError {
  constructor(message: string) {
    super(message);
    this.name = 'UniqueConflictError';
  }
}

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
  'slug' | 'name' | 'talents' | 'levels' | 'features' | 'talentLevels'
>;

/**
 * A classe como talentos e vagas a precisam: só as características cujo nome
 * começa com "Talento(s)" (a regra de vagas e de repetição mora no texto
 * delas), em vez das dezenas de características completas.
 */
export async function loadClassForTalents(classId: unknown) {
  const id = String(classId ?? '');
  if (!OBJECT_ID.test(id)) return null;
  const [klass] = await CharacterClassModel.aggregate<ClassForTalents>([
    { $match: { _id: new Types.ObjectId(id) } },
    {
      $project: {
        slug: 1,
        name: 1,
        talents: 1,
        levels: 1,
        talentLevels: 1,
        features: {
          $filter: {
            input: { $ifNull: ['$features', []] },
            as: 'f',
            cond: {
              $regexMatch: {
                input: { $ifNull: ['$$f.name', ''] },
                regex: '^\\s*talentos?\\b',
                options: 'i',
              },
            },
          },
        },
      },
    },
  ]);
  return klass ?? null;
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
        ...talentSlotsOf(klass),
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
  storedRaw: unknown,
  characterLevel?: number
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

    // Pré-requisito de NÍVEL é regra dura: um talento que pede nível acima do
    // personagem não entra (os já gravados ficam, como acima). Já o número de
    // vagas de talento é só informativo e não bloqueia: um bônus de classe ou
    // decisão do mestre pode dar mais talentos do que a tabela diz.
    if (
      option &&
      characterLevel &&
      count > storedCount(entry.key) &&
      requiredLevel(option.prerequisites, klass?.name) > characterLevel
    ) {
      throw new PlayerSheetError(
        `"${option.name}" pede nível ${requiredLevel(option.prerequisites, klass?.name)}, acima do nível do personagem.`
      );
    }
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

// ── Marcos de talento ────────────────────────────────────

/**
 * Em cada marco geral ("+2 em um atributo ou +1 em dois ou um Talento") a
 * ficha grava o que o jogador fez com ele. Só a escolha: a lista de marcos vem
 * da tabela da classe. Um item por nível; o resto é descartado em silêncio,
 * porque o cliente só manda o que a tela oferece.
 */
export function sanitizeMilestones(raw: unknown): ITalentMilestone[] {
  if (!Array.isArray(raw)) return [];
  const byLevel = new Map<number, ITalentMilestone>();
  for (const item of raw) {
    if (!isRecord(item)) continue;
    const level = Math.round(Number(item.level));
    if (!Number.isFinite(level) || level < 1 || level > MAX_TALENT_LEVEL) {
      continue;
    }
    if (item.use !== 'attribute' && item.use !== 'talent') continue;
    byLevel.set(level, { level, use: item.use });
  }
  return [...byLevel.values()].sort((a, b) => a.level - b.level);
}

// ── Classe ───────────────────────────────────────────────

/**
 * A ficha embutida agora escolhe a classe (a camada de escolha do códice), então
 * `classId` precisa das mesmas conferências do editor do app: a classe existe,
 * não é única de outra pessoa, e o texto `class` acompanha o nome dela.
 */
async function prepareClassWrite(
  stored: IStoredSheetLinks | null,
  update: Record<string, unknown>
): Promise<void> {
  const next = update.classId;
  if (next === null || next === undefined || next === '') {
    update.classId = null;
    return;
  }
  const id = String(next);
  if (!OBJECT_ID.test(id)) throw new PlayerSheetError('Classe inválida.');

  const klass = await CharacterClassModel.findById(id)
    .select('name')
    .lean<{ name?: string }>();
  if (!klass) throw new PlayerSheetError('Classe não encontrada no códice.');

  const conflict = await uniqueClassConflict(id, stored?.slug);
  if (conflict) throw new PlayerSheetError(conflict);

  update.classId = id;
  update.class = klass.name;
}

// ── Escrita ──────────────────────────────────────────────

/** O que a escrita precisa saber do documento antes da alteração. */
export interface IStoredSheetLinks {
  _id?: unknown;
  slug?: string;
  race?: string;
  raceId?: unknown;
  raceChoice?: unknown;
  classId?: unknown;
  level?: unknown;
  talents?: unknown;
  playerSpellcasting?: { spellRefs?: unknown };
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

      // Raça única: quem já a tem a mantém; para qualquer outra ficha a vaga
      // está tomada. É aqui que a regra é aplicada, não no seletor.
      const conflict = await uniqueRaceConflict(id, {
        id: stored?._id ? String(stored._id) : undefined,
        slug: stored?.slug,
      });
      if (conflict) throw new PlayerSheetError(conflict);

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

  if ('classId' in update) await prepareClassWrite(stored, update);

  if ('talentMilestones' in update) {
    update.talentMilestones = sanitizeMilestones(update.talentMilestones);
  }

  if ('talents' in update) {
    const classId = 'classId' in update ? update.classId : stored?.classId;
    const level = Number('level' in update ? update.level : stored?.level);
    update.talents = await sanitizeTalents(
      update.talents,
      classId,
      stored?.talents,
      Number.isFinite(level) && level > 0 ? level : undefined
    );
  }
}

// ── Limite de magias e unicidade ─────────────────────────

const refIds = (raw: unknown): string[] =>
  (Array.isArray(raw) ? raw : []).flatMap((ref) =>
    isRecord(ref) && OBJECT_ID.test(String(ref.spellId))
      ? [String(ref.spellId)]
      : []
  );

/**
 * As magias preparadas não passam dos espaços do círculo na tabela da classe
 * (truques: `cantripsKnown`). Só recusa o círculo que CRESCEU além do limite:
 * uma ficha antiga já acima dele continua podendo salvar outras coisas.
 */
export async function assertSpellLimits(args: {
  classId: unknown;
  level: unknown;
  nextRefs: unknown;
  storedRefs: unknown;
}): Promise<void> {
  const next = refIds(args.nextRefs);
  if (next.length === 0) return;
  const casting = await getClassCasting(
    args.classId ? String(args.classId) : undefined,
    Number(args.level)
  );
  if (!casting) return;

  const stored = refIds(args.storedRefs);
  const docs = await SpellModel.find({ _id: { $in: [...next, ...stored] } })
    .select('circle')
    .lean<{ _id: unknown; circle: number }[]>();
  const circleOf = new Map(docs.map((d) => [String(d._id), d.circle]));
  const tally = (ids: string[]) => {
    const out = new Map<number, number>();
    for (const id of ids) {
      const c = circleOf.get(id);
      if (c !== undefined) out.set(c, (out.get(c) ?? 0) + 1);
    }
    return out;
  };
  const after = tally(next);
  const before = tally(stored);
  for (const [circle, count] of after) {
    const limit =
      circle === 0
        ? casting.cantripsKnown
        : circle <= casting.maxCircle
          ? (casting.slots[circle - 1] ?? 0)
          : 0;
    if (count > limit && count > (before.get(circle) ?? 0)) {
      throw new PlayerSheetError(
        circle === 0
          ? `Truques demais: a classe conhece ${limit}.`
          : `Magias demais no ${circle}º círculo: a classe tem ${limit} espaço(s).`
      );
    }
  }
}

interface IPrevLinks {
  classId?: unknown;
  class?: string;
  raceId?: unknown;
  race?: string;
  raceChoice?: unknown;
}

/**
 * Classe e raça únicas, conferidas DEPOIS da escrita: a conferência de antes
 * (`uniqueClassConflict`/`uniqueRaceConflict`) não é atômica, e duas fichas
 * gravando ao mesmo tempo passariam as duas. Se, com a escrita feita, mais de
 * uma ficha tem a mesma classe/raça única, a mudança é desfeita (ou, numa
 * criação, a ficha é apagada) e o chamador responde 409.
 */
export async function guardUniqueAfterWrite(
  id: string,
  prev: IPrevLinks | null,
  next: { classId?: unknown; raceId?: unknown }
): Promise<void> {
  const [{ default: PlayerModel }, { default: CitizenModel }] =
    await Promise.all([
      import('../db/players/players'),
      import('../db/citizens/citizens'),
    ]);

  const revert = async (set: Record<string, unknown>) => {
    if (prev) await PlayerModel.updateOne({ _id: id }, { $set: set });
    else await PlayerModel.deleteOne({ _id: id });
  };

  const classId = next.classId ? String(next.classId) : '';
  if (classId && classId !== String(prev?.classId ?? '')) {
    const klass = await CharacterClassModel.findById(classId)
      .select('name isUnique')
      .lean<{ name?: string; isUnique?: boolean }>();
    if (klass?.isUnique) {
      const holders =
        (await PlayerModel.countDocuments({ classId })) +
        (await CitizenModel.countDocuments({ classId }));
      if (holders > 1) {
        await revert({ classId: prev?.classId ?? null, class: prev?.class });
        throw new UniqueConflictError(
          `${klass.name ?? 'Esta classe'} é uma classe única e foi tomada por outra ficha ao mesmo tempo. A troca foi desfeita.`
        );
      }
    }
  }

  const raceId = next.raceId ? String(next.raceId) : '';
  if (raceId && raceId !== String(prev?.raceId ?? '')) {
    const { default: RaceModel } = await import('../db/races/races');
    const race = await RaceModel.findById(raceId)
      .select('name unique')
      .lean<{ name?: string; unique?: boolean }>();
    if (race?.unique && (await PlayerModel.countDocuments({ raceId })) > 1) {
      await revert({
        raceId: prev?.raceId ?? null,
        raceChoice: prev?.raceChoice ?? null,
        race: prev?.race,
      });
      throw new UniqueConflictError(
        `${race.name ?? 'Esta raça'} é uma raça única e foi tomada por outra ficha ao mesmo tempo. A troca foi desfeita.`
      );
    }
  }
}

/**
 * Passa o corpo de uma criação pela mesma limpeza da edição (raça, classe,
 * talentos, marcos). Sem `classId` a ficha nasce com o texto `class` que veio;
 * limpar `classId` numa edição também deixa o texto como está, de propósito:
 * o texto é o que a ficha mostra.
 */
export async function prepareSheetLinksCreate(
  data: Record<string, unknown>
): Promise<void> {
  if (
    'raceId' in data ||
    'raceChoice' in data ||
    'talents' in data ||
    'talentMilestones' in data ||
    'classId' in data
  ) {
    await prepareSheetLinksWrite(null, data);
  }
}
