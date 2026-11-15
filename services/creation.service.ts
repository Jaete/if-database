import { randomInt, randomUUID } from 'node:crypto';
import type { Types } from 'mongoose';
import PlayerModel from '../db/players/players';
import UserModel from '../db/users/users';
import CharacterClassModel from '../db/classes/classes';
import SpellModel from '../db/spells/spells';
import PlayerEventModel from '../db/playerProgress/playerEvents';
import CreationRollModel from '../db/playerProgress/creationRolls';
import type ICharacterClass from '../db/classes/class.d';
import type { IRaceCatalogEntry } from '../db/races/race.d';
import type { ICreationState, IReviewEntry } from '../db/players/player.d';
import type { PlayerEventKind } from '../db/playerProgress/playerProgress';
import { stripUnsafeKeys } from '../lib/sanitize';
import { MAX_PROFICIENCY, setStaffLevel, skillTotal } from '../lib/skills';
import { OWN_SHEET_MESSAGE } from '../lib/sheetAccess';
import { isImageUrl, isUploadedImageUrl } from '../lib/imageUrl';
import { modifierOf, type AttributeKey } from '../lib/stats';
import { xpToNext } from '../lib/xp';
import { parseHitDie } from '../lib/levelUp';
import {
  ATTRIBUTES,
  SKILL_ATTR,
  SKILL_NAMES,
  attributeTotals,
  checkGrantPicks,
  emptyGrantPicks,
  skillSources,
  skillSourcesIssue,
  type ICreationGrantPicks,
  castingNumbers,
  checkBase,
  creationIssues,
  level1Hp,
  parseGilFormula,
  parseSavingThrows,
  parseSkillChoice,
  rollAttributeSets,
  rollGil,
  type AttributeMethod,
  type Base,
  type CreationStep,
  type ICreationInput,
  type IIssue,
  type PlayerStatus,
} from '../lib/creation';
import {
  checkRacialPicks,
  effectiveSubrace,
  raceBonus,
  raceLanguages,
  racialGrants,
  raceSpeed,
  sumGrants,
  type IRaceRulesInput,
} from '../lib/raceRules';
import { ATTRIBUTE_LABELS } from '../lib/levelUp';
import { featureKey } from '../db/l10n/classes';
import TalentModel from '../db/talents/talents';
import type ITalentDoc from '../db/talents/talent.d';
import { GENERAL_TALENT_FIELDS, generalTalentOption } from './talentCatalog';
import { requiredLevel } from '../lib/talentPrerequisite';
import { getRaceCatalog } from './race.service';
import { getPlayerById, updatePlayerById } from './player.service';
import { normalizeSkills, normalizeSpellDC, normalizeStats } from './sheetEdit';
import { pickWritablePlayerFields } from '../db/players/publicFields';
import { getClassCasting } from './classSpells.service';
import {
  PlayerSheetError,
  assertSpellLimits,
  guardUniqueAfterWrite,
  prepareSheetLinksWrite,
  type IStoredSheetLinks,
} from './playerSheetLinks.service';
import { auditActor, type IActor } from './levelUp.service';
import { rawSheet, recordAudit } from './sheetAudit';

/**
 * Criação da ficha: a staff abre uma ficha vazia para uma conta do fórum, a dona
 * a preenche no nível 1 (rascunho no servidor), envia, e a staff aprova ou
 * devolve com observações.
 *
 * Permissão em duas camadas, relidas do banco a cada chamada (como a subida de
 * nível): a DONA mexe no rascunho enquanto a ficha não está aprovada; o ADMIN
 * mexe sempre. Nada aqui amplia a edição geral da ficha: são rotas à parte, com
 * escopo de criação, e a rota de edição livre segue só de admin.
 *
 * Sem 'use server': exporta classe de erro e tipos, e só roda no servidor.
 */

export class CreationError extends Error {
  status: number;
  issues?: IIssue[];
  constructor(message: string, status = 400, issues?: IIssue[]) {
    super(message);
    this.name = 'CreationError';
    this.status = status;
    this.issues = issues;
  }
}

type Doc = Record<string, unknown>;
const OBJECT_ID = /^[0-9a-f]{24}$/i;
const isRecord = (v: unknown): v is Doc =>
  !!v && typeof v === 'object' && !Array.isArray(v);

const STEPS: CreationStep[] = [
  'identidade',
  'raca',
  'classe',
  'atributos',
  'nivel1',
  'pericias',
  'magias',
  'equipamento',
  'historia',
];

// ── Carga ────────────────────────────────────────────────

interface ISheet extends Doc {
  _id: Types.ObjectId;
  slug: string;
  status?: PlayerStatus;
  name?: string;
  classId?: unknown;
  raceId?: unknown;
  raceChoice?: Doc;
  creation?: ICreationState;
  review?: IReviewEntry[];
  equipment?: Doc;
  level?: number;
  proficiencies?: Doc;
  playerSpellcasting?: { spellRefs?: { spellId: string }[] } & Doc;
  ownerForumUserId?: number;
  ownerUsername?: string;
  image?: string;
}

async function loadSheet(id: string): Promise<ISheet> {
  if (!OBJECT_ID.test(id))
    throw new CreationError('Ficha não encontrada.', 404);
  const sheet = await PlayerModel.findById(id).lean<ISheet>();
  if (!sheet) throw new CreationError('Ficha não encontrada.', 404);
  return sheet;
}

function assertInCreation(sheet: ISheet) {
  if (!sheet.status) {
    throw new CreationError('Esta ficha não passou pela criação.', 409);
  }
}

/** Edita o rascunho: a dona até a aprovação, o admin sempre. */
function assertCanEdit(actor: IActor, sheet: ISheet) {
  assertInCreation(sheet);
  if (actor.isStaff) return;
  if (!actor.isOwner) {
    throw new CreationError(
      'Só a dona da ficha ou um admin pode editá-la.',
      403
    );
  }
  if (sheet.status === 'approved') {
    throw new CreationError(
      'A ficha já foi aprovada: daqui em diante, só a subida de nível.',
      403
    );
  }
}

/**
 * Escrita no rascunho: além da permissão, a ficha precisa estar de fato no
 * nível 1 e fora da aprovação. Os derivados são refeitos para o nível 1; numa
 * ficha que já subiu eles corromperiam o que a subida selou. O admin edita uma
 * ficha aprovada pelo editor completo, não por aqui.
 */
function assertWritable(actor: IActor, sheet: ISheet) {
  assertCanEdit(actor, sheet);
  if (sheet.status === 'approved') {
    throw new CreationError(
      'A ficha já foi aprovada: use o editor completo da ficha.',
      409
    );
  }
  if ((Number(sheet.level) || 1) > 1) {
    throw new CreationError('A ficha já passou do nível 1.', 409);
  }
}

/** Filtro de escrita: a dona nunca grava numa ficha aprovada. */
const writeFilter = (id: string, actor: IActor) => ({
  _id: id,
  ...(actor.isStaff ? {} : { status: { $ne: 'approved' as const } }),
});

function assertAdmin(actor: IActor) {
  if (!actor.isStaff) {
    throw new CreationError(
      actor.isOwner && actor.hasStaffRole
        ? OWN_SHEET_MESSAGE
        : 'Só a staff pode fazer isto.',
      403
    );
  }
}

// ── Contexto: raça, classe e magias ──────────────────────

export interface IClassInfo {
  id: string;
  slug: string;
  name: string;
  hitDie: number | null;
  hpAtFirstLevel?: string;
  skills: { n: number | null; list: string[] };
  savingThrows: AttributeKey[];
  spellcastingAbility?: AttributeKey;
  startingGil?: string;
  proficiencyBonus: number;
  /** Concessões do nível 1 que são escolha, com os nomes das opções. */
  featureChoices: { options: string[] }[];
  /** Características garantidas do nível 1. */
  autoFeatures: string[];
  /** Texto de cada característica do nível 1 (opção ou garantida), por nome. */
  featureText: Record<string, string>;
  cantripsKnown: number;
  slots: number[];
  preparedLimit: number;
  maxCircle: number;
  caster: boolean;
}

export interface ICreationContext {
  race: IRaceCatalogEntry | null;
  parents: IRaceCatalogEntry[];
  klass: IClassInfo | null;
}

const CLASS_FIELDS =
  'name slug hitDie hpAtFirstLevel hpPerLevel startingGil spellcastingAbility proficiencies levels features isSpellcaster';

export async function loadClassInfo(
  classId: unknown
): Promise<IClassInfo | null> {
  const id = String(classId ?? '');
  if (!OBJECT_ID.test(id)) return null;
  const klass = await CharacterClassModel.findById(id)
    .select(CLASS_FIELDS)
    .lean<ICharacterClass & Doc>();
  if (!klass) return null;
  const row = (klass.levels ?? []).find((l) => l.level === 1);
  const casting = await getClassCasting(id, 1, klass);
  const die = parseHitDie(klass.hpPerLevel, klass.hitDie);
  const grants = row?.grants ?? [];
  return {
    id,
    slug: klass.slug,
    name: klass.name,
    hitDie: die?.die ?? null,
    hpAtFirstLevel: klass.hpAtFirstLevel,
    skills: parseSkillChoice(klass.proficiencies?.skills),
    savingThrows: parseSavingThrows(klass.proficiencies?.savingThrows),
    spellcastingAbility: klass.spellcastingAbility,
    startingGil: klass.startingGil,
    proficiencyBonus: row?.proficiencyBonus ?? 2,
    featureChoices: grants
      .filter((g) => g.options.length > 1)
      .map((g) => ({ options: g.options.map((o) => o.name) })),
    autoFeatures: grants
      .filter((g) => g.options.length === 1)
      .map((g) => g.options[0].name),
    featureText: Object.fromEntries(
      grants.flatMap((g) =>
        g.options.map((o) => [
          o.name,
          (klass.features ?? []).find(
            (f) => featureKey(f.name) === featureKey(o.name)
          )?.description ?? '',
        ])
      )
    ),
    cantripsKnown: casting?.cantripsKnown ?? 0,
    slots: casting?.slots ?? [],
    preparedLimit: casting?.preparedLimit ?? 0,
    maxCircle: casting?.maxCircle ?? 0,
    caster: !!casting,
  };
}

async function loadContext(sheet: ISheet): Promise<ICreationContext> {
  const raceId = String(sheet.raceId ?? '');
  const [race] = OBJECT_ID.test(raceId)
    ? await getRaceCatalog({ _id: raceId })
    : [];
  const parentSlugs = Array.isArray(sheet.raceChoice?.parents)
    ? (sheet.raceChoice.parents as string[])
    : [];
  const parents =
    parentSlugs.length > 0
      ? await getRaceCatalog({ slug: { $in: parentSlugs } })
      : [];
  return {
    race: race ?? null,
    parents,
    klass: await loadClassInfo(sheet.classId),
  };
}

async function spellCounts(refs: { spellId: string }[]) {
  const ids = refs.map((r) => r.spellId).filter((i) => OBJECT_ID.test(i));
  if (ids.length === 0) return { cantrips: 0, prepared: 0 };
  const docs = await SpellModel.find({ _id: { $in: ids } })
    .select('circle')
    .lean<{ circle: number }[]>();
  return {
    cantrips: docs.filter((d) => d.circle === 0).length,
    prepared: docs.filter((d) => d.circle > 0).length,
  };
}

const rollSumsOf = async (sheetId: Types.ObjectId) => {
  const roll = await CreationRollModel.findOne({
    playerId: sheetId,
    kind: 'attributes',
  }).lean();
  return roll?.sums;
};

/** A raça dominante do Mestiço (Sangue Forte), entre as origens carregadas. */
const dominantOf = (
  race: IRaceCatalogEntry | null,
  choice: Doc | undefined,
  parents: IRaceCatalogEntry[]
): IRaceRulesInput | undefined => {
  if (!race || (race.choiceRules?.length ?? 0) === 0) return undefined;
  const slug =
    typeof choice?.dominantParent === 'string' ? choice.dominantParent : '';
  return parents.find((p) => p.slug === slug);
};

/** As concessões da raça (e da sub-raça que vale) e o que já foi escolhido. */
function grantsOf(ctx: ICreationContext, sheet: ISheet) {
  const choice = sheet.raceChoice;
  const sub = ctx.race
    ? effectiveSubrace(
        ctx.race,
        typeof choice?.subrace === 'string' ? choice.subrace : undefined
      )
    : undefined;
  const entries = racialGrants(ctx.race ?? undefined, sub);
  const picks: ICreationGrantPicks = {
    ...emptyGrantPicks(),
    ...(sheet.creation?.grants ?? {}),
  };
  return { entries, totals: sumGrants(entries), picks, sub };
}

const classSkillsOf = (sheet: ISheet) => sheet.creation?.classSkills ?? [];

/** O que falta, no servidor, com as MESMAS regras que a tela usa. */
export async function evaluateSheet(sheet: ISheet, ctx?: ICreationContext) {
  const context = ctx ?? (await loadContext(sheet));
  const creation = sheet.creation ?? {};
  const counts = await spellCounts(sheet.playerSpellcasting?.spellRefs ?? []);
  const g = grantsOf(context, sheet);
  const rule = context.race?.choiceRules ?? [];
  const input: ICreationInput = {
    name: sheet.name,
    race: context.race ?? undefined,
    raceChoice: sheet.raceChoice,
    dominantRace: dominantOf(context.race, sheet.raceChoice, context.parents),
    grantTotals: g.totals,
    grants: g.picks,
    mixedNeeds: {
      parents: 2,
      hybrid: rule.find((r) => r.kind === 'hybridHeritage')?.count ?? 2,
    },
    klass: context.klass
      ? {
          skills: context.klass.skills,
          featureChoiceCount: context.klass.featureChoices.length,
          cantripsKnown: context.klass.cantripsKnown,
          preparedLimit: context.klass.preparedLimit,
          caster: context.klass.caster,
        }
      : undefined,
    method: creation.method,
    base: creation.base ?? {},
    rollSums:
      creation.method === 'roll' ? await rollSumsOf(sheet._id) : undefined,
    racialPicks: creation.racialPicks ?? [],
    featureChoices: creation.featureChoices ?? [],
    skills: classSkillsOf(sheet),
    cantrips: counts.cantrips,
    prepared: counts.prepared,
    soft: {
      equipment: !!String(sheet.equipment?.backpack ?? '').trim(),
      history:
        !!String(sheet.backstory ?? '').trim() &&
        !!String(sheet.appearance ?? '').trim(),
      portrait: !!sheet.image,
      extraLanguage: !!creation.extraLanguage,
    },
  };
  const issues = creationIssues(input);
  // Fontes de proficiência: sem repetir na mesma lista e no máximo duas
  // aplicações por perícia (o servidor já recusa ao salvar; aqui é o envio).
  const skillIssue = skillSourcesIssue(
    skillSources(classSkillsOf(sheet), g.entries, g.picks)
  );
  if (skillIssue) {
    issues.push({ step: 'pericias', kind: 'required', message: skillIssue });
  }
  if (
    context.race &&
    Object.keys(
      raceSpeed(
        context.race,
        effectiveSubrace(
          context.race,
          typeof sheet.raceChoice?.subrace === 'string'
            ? sheet.raceChoice.subrace
            : undefined
        )
      )
    ).length === 0
  ) {
    issues.push({
      step: 'raca',
      kind: 'recommended',
      message: 'Deslocamento: a raça não define, a staff confirma.',
    });
  }
  // O gil, quando a classe tem fórmula, vale o da rolagem gravada PARA ELA.
  // Depois da aprovação o gil é da ficha: a staff pode ter dado mais.
  if (
    sheet.status !== 'approved' &&
    context.klass &&
    parseGilFormula(context.klass.startingGil)
  ) {
    const roll = await CreationRollModel.findOne({
      playerId: sheet._id,
      kind: 'gil',
      classSlug: context.klass.slug,
    }).lean();
    const gil = sheet.equipment?.gil;
    if (!roll) {
      issues.push({
        step: 'equipamento',
        kind: 'recommended',
        message: 'O gil inicial da classe ainda não foi rolado.',
      });
    } else if (gil !== roll.sums[0]) {
      issues.push({
        step: 'equipamento',
        kind: 'required',
        message: 'O gil da ficha não confere com a rolagem da classe.',
      });
    }
  }
  return issues;
}

// ── Derivados ────────────────────────────────────────────

/**
 * Regrava tudo o que a ficha DERIVA do que a dona escolheu: totais de atributo
 * (base + raça), vida do nível 1, bônus de proficiência, resistências,
 * perícias, idiomas, características escolhidas e a conjuração da classe. É
 * chamada depois de cada escrita, então o documento nunca guarda um número que
 * não bate com as escolhas ao lado dele.
 */
async function recompute(id: string) {
  const sheet = await loadSheet(id);
  const ctx = await loadContext(sheet);
  const creation = sheet.creation ?? {};
  const set: Doc = {};
  const sub = effectiveSubrace(
    ctx.race ?? ({ subraces: [], name: '', slug: '' } as never),
    typeof sheet.raceChoice?.subrace === 'string'
      ? (sheet.raceChoice.subrace as string)
      : undefined
  );
  const totals = attributeTotals(
    creation.base ?? {},
    ctx.race ?? undefined,
    sub,
    creation.racialPicks ?? [],
    dominantOf(ctx.race, sheet.raceChoice, ctx.parents)
  );
  const complete = ATTRIBUTES.every((k) => creation.base?.[k] !== undefined);
  const pb = ctx.klass?.proficiencyBonus ?? 2;

  if (complete) {
    const stats: Doc = {};
    const flat: Doc = {};
    for (const key of ATTRIBUTES) {
      const t = totals[key];
      stats[key] = {
        base: t.base,
        raceBonus: t.race,
        classBonus: 0,
        total: t.total,
        modifier: t.mod,
      };
      flat[key] = String(t.total);
    }
    set.playerStats = stats;
    set.stats = flat;
  }
  set.proficiencyBonus = pb;

  if (ctx.klass?.hitDie && complete) {
    const hp = level1Hp(ctx.klass.hitDie, totals.con.total);
    set['combat.hp.value'] = hp;
    set['combat.hp.formula'] =
      `${hp} (d${ctx.klass.hitDie} máximo + ${modifierOf(totals.con.total)} CON)`;
  }

  if (ctx.klass) {
    set['proficiencies.savingThrows'] = ctx.klass.savingThrows.map((k) => ({
      attribute: ATTRIBUTE_LABELS[k][1],
      value: totals[k].mod + pb,
    }));
    // As perícias da ficha: as da classe mais as concedidas pela raça (a
    // perícia versátil entra aqui também), sem repetir.
    const g = grantsOf(ctx, sheet);
    const sourceMap = skillSources(classSkillsOf(sheet), g.entries, g.picks);
    // O ajuste do narrador vem por último, sem restrição de fonte: leva a
    // perícia direto ao nível dele (o teto é 2). Ele pode inclusive tirar a
    // fonte da classe ou da raça.
    // A decisão é definitiva: vale também depois que a dona troca classe, raça
    // ou escolhas, e a remoção fica marcada (`staffOverride`, sem fontes).
    const overridden = new Set<string>();
    for (const { name, level } of creation.staffSkills ?? []) {
      sourceMap.set(name, setStaffLevel(sourceMap.get(name) ?? [], level));
      overridden.add(name);
    }
    set['proficiencies.skills'] = [...sourceMap].map(([name, sources]) => {
      const attr = SKILL_ATTR[name];
      const level = Math.min(MAX_PROFICIENCY, sources.length);
      return {
        name,
        proficient: level > 0,
        proficiencySources: sources.slice(0, MAX_PROFICIENCY),
        value: skillTotal(attr ? totals[attr].mod : 0, level, pb),
        ...(overridden.has(name) ? { staffOverride: true } : {}),
      };
    });
    set.featureChoices = (creation.featureChoices ?? [])
      .filter(Boolean)
      .map((name) => ({ level: 1, name }));

    if (ctx.klass.caster && ctx.klass.spellcastingAbility) {
      const key = ctx.klass.spellcastingAbility;
      const nums = castingNumbers(totals[key].total, pb);
      set['playerSpellcasting.ability'] = ATTRIBUTE_LABELS[key][1];
      set['playerSpellcasting.saveDC'] = nums.saveDC;
      set['playerSpellcasting.attackBonus'] = nums.attackBonus;
      set['playerSpellcasting.casterLevel'] = 1;
    }
  }

  // O gil vale por classe: trocar de classe troca para a rolagem gravada dela,
  // ou esvazia (e exige rolar).
  const unsetGil: Doc = {};
  // Deslocamento: da raça (ou da sub-raça, se ela tiver o seu texto). Sem texto
  // (a Lapinara), a ficha fica sem deslocamento e a staff confirma.
  const speed = raceSpeed(
    (ctx.race as (IRaceCatalogEntry & { speed?: string }) | null) ?? undefined,
    sub
  );
  if (Object.keys(speed).length > 0) set['combat.speed'] = speed;
  else unsetGil['combat.speed'] = '';
  if (ctx.klass) {
    const gil = await CreationRollModel.findOne({
      playerId: sheet._id,
      kind: 'gil',
      classSlug: ctx.klass.slug,
    }).lean();
    if (gil) {
      set['equipment.gil'] = gil.sums[0];
      set['creation.startingGil'] = gil.sums[0];
    } else {
      unsetGil['equipment.gil'] = '';
      unsetGil['creation.startingGil'] = '';
    }
  }

  const locked = ctx.race ? raceLanguages(ctx.race, sub, ctx.parents) : [];
  const grants = grantsOf(ctx, sheet).picks;
  const langs: string[] = [];
  for (const l of [
    ...locked,
    creation.extraLanguage ?? '',
    ...grants.languages,
    ...grants.versatile
      .filter((v) => v.kind === 'language')
      .map((v) => v.value),
  ]) {
    if (l && !langs.some((x) => asciiFold(x) === asciiFold(l))) langs.push(l);
  }
  set.languages = langs;
  set['proficiencies.tools'] = grants.versatile
    .filter((v) => (v.kind === 'tool' || v.kind === 'instrument') && v.value)
    .map((v) => v.value);

  // O talento racial é um talento de nível 1 marcado `source: 'race'`: não
  // ocupa vaga de marco nem conta como acima do limite. No nível 1 não há
  // outros talentos, então a lista inteira vem das concessões.
  if (grants.talents.length > 0) {
    const docs = await TalentModel.find({ slug: { $in: grants.talents } })
      .select(GENERAL_TALENT_FIELDS)
      .lean<ITalentDoc[]>();
    set.talents = grants.talents.flatMap((key) => {
      const doc = docs.find((d) => d.slug === key);
      return doc
        ? [{ key, level: 1, name: doc.name, source: 'race' as const }]
        : [];
    });
  } else {
    set.talents = [];
  }

  await PlayerModel.updateOne(
    { _id: id },
    {
      $set: set,
      ...(Object.keys(unsetGil).length ? { $unset: unsetGil } : {}),
    }
  );
}

// ── Eventos ──────────────────────────────────────────────

async function record(
  sheet: ISheet,
  kind: PlayerEventKind,
  reason: string,
  actor: { username: string; forumUserId: number }
) {
  await PlayerEventModel.create({
    playerId: sheet._id,
    kind,
    reason,
    byUsername: actor.username,
    byForumUserId: actor.forumUserId,
    at: new Date(),
  });
}

// ── Criar a ficha vazia (staff, no app) ──────────────────

const randomUnit = () => randomInt(0, 1_000_000) / 1_000_000;

export async function createBlankSheet(
  ownerForumUserId: number,
  staff: { username: string; forumUserId?: number }
) {
  if (!Number.isInteger(ownerForumUserId)) {
    throw new CreationError('Escolha uma conta do fórum.');
  }
  const owner = await UserModel.findOne({ forumUserId: ownerForumUserId })
    .select('username forumUserId')
    .lean<{ username: string } | null>();
  if (!owner) {
    throw new CreationError('Conta do fórum não encontrada.', 404);
  }
  const created = await PlayerModel.create({
    // O slug é provisório e muda quando o nome é escolhido; a tag do fórum usa
    // o `_id`, que não muda.
    slug: `ficha-${randomUUID().slice(0, 8)}`,
    status: 'blank',
    ownerForumUserId,
    ownerUsername: owner.username,
    level: 1,
    experience: { current: 0, nextLevel: xpToNext(1) ?? 0 },
    proficiencyBonus: 2,
    creation: {},
    review: [],
  } as never);
  await record(
    created.toObject() as unknown as ISheet,
    'create',
    `Ficha vazia criada para ${owner.username}`,
    { username: staff.username, forumUserId: staff.forumUserId ?? 0 }
  );
  await recordAudit(
    created._id,
    null,
    () => rawSheet(created._id),
    { username: staff.username, forumUserId: staff.forumUserId, isStaff: true },
    'app-create',
    { force: true, reason: `Ficha vazia criada para ${owner.username}` }
  );
  return { id: String(created._id), ownerUsername: owner.username };
}

/** As contas do fórum e as fichas que cada uma já tem, para o seletor da staff. */
export async function listOwnersWithSheets() {
  const users = await UserModel.find({ forumUserId: { $exists: true } })
    .select('username forumUserId avatarUrl')
    .sort({ username: 1 })
    .lean<{ username: string; forumUserId: number; avatarUrl?: string }[]>();
  const sheets = await PlayerModel.find({
    ownerForumUserId: { $in: users.map((u) => u.forumUserId) },
  })
    .select('name ownerForumUserId status class')
    .lean<
      {
        _id: unknown;
        name?: string;
        ownerForumUserId: number;
        status?: PlayerStatus;
        class?: string;
      }[]
    >();
  return users.map((u) => ({
    username: u.username,
    forumUserId: u.forumUserId,
    avatarUrl: u.avatarUrl,
    sheets: sheets
      .filter((s) => s.ownerForumUserId === u.forumUserId)
      .map((s) => ({
        id: String(s._id),
        name: s.name || '',
        status: s.status ?? 'approved',
        class: s.class,
      })),
  }));
}

// ── Leitura para a dona e a staff ────────────────────────

const rollView = (r: {
  rollId: string;
  kind: string;
  sets: number[][];
  sums: number[];
  formula?: string;
  classSlug?: string;
  at: Date;
  byUsername: string;
}) => ({
  rollId: r.rollId,
  kind: r.kind,
  classSlug: r.classSlug,
  sets: r.sets,
  sums: r.sums,
  formula: r.formula,
  at: new Date(r.at).toISOString(),
  byUsername: r.byUsername,
});

export async function getCreation(id: string, actor: IActor) {
  const sheet = await loadSheet(id);
  assertInCreation(sheet);
  // A leitura vale também depois da aprovação, mas só para a staff conferir.
  if (!actor.isStaff && !(actor.isOwner && sheet.status !== 'approved')) {
    throw new CreationError('Sem permissão para ver este rascunho.', 403);
  }
  const ctx = await loadContext(sheet);
  const rolls = await CreationRollModel.find({ playerId: sheet._id }).lean();
  return {
    status: sheet.status as PlayerStatus,
    creation: sheet.creation ?? {},
    review: sheet.review ?? [],
    context: ctx,
    rolls: rolls.map(rollView),
    issues: await evaluateSheet(sheet, ctx),
    // A ficha como a leitura a resolve (raça, classe e magias já ligadas).
    player: await getPlayerById(id),
  };
}

// ── Rascunho ─────────────────────────────────────────────

const SCALARS: Record<string, number> = {
  name: 120,
  subtitle: 160,
  gender: 60,
  age: 60,
  height: 60,
  family: 120,
  kingdom: 120,
  clan: 120,
  deity: 120,
  image: 600,
  appearance: 20000,
  backstory: 20000,
  narrationStyle: 6000,
};
const MAX_FREE_SKILLS = 20;
const EQUIPMENT_KEYS = [
  'head',
  'torso',
  'legs',
  'feet',
  'hand',
  'offhand',
  'accessory1',
  'accessory2',
  'backpack',
];

const asciiFold = (text: string) =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export const slugOf = (name: string) =>
  asciiFold(name)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

async function uniqueSlug(
  name: string,
  id: Types.ObjectId
): Promise<string | null> {
  const base = slugOf(name);
  if (!base) return null;
  for (let n = 1; n < 50; n += 1) {
    const slug = n === 1 ? base : `${base}-${n}`;
    const clash = await PlayerModel.findOne({ slug, _id: { $ne: id } })
      .select('_id')
      .lean();
    if (!clash) return slug;
  }
  return null;
}

export interface IDraftBody {
  fields?: Doc;
  creation?: Partial<ICreationState>;
  skills?: string[];
  /** Só a staff: o nível de cada perícia, direto (ver `ICreationState.staffSkills`). */
  staffSkills?: { name: string; level: number }[];
  /** As escolhas das concessões da raça. */
  grants?: Partial<ICreationGrantPicks>;
}

export async function saveDraft(id: string, body: IDraftBody, actor: IActor) {
  const sheet = await loadSheet(id);
  assertWritable(actor, sheet);

  const fields = stripUnsafeKeys(
    isRecord(body?.fields) ? body.fields : {}
  ) as Doc;
  const update: Doc = {};
  const unset: Doc = {};

  for (const [key, max] of Object.entries(SCALARS)) {
    if (!(key in fields)) continue;
    const value = fields[key];
    if (typeof value !== 'string') continue;
    const text = value.slice(0, max);
    if (key === 'image' && text.trim()) {
      // A dona só usa imagem enviada ao app; o admin também pode colar http(s).
      const ok = actor.isStaff ? isImageUrl(text) : isUploadedImageUrl(text);
      if (!ok) {
        throw new CreationError(
          actor.isStaff
            ? 'Use um link http(s) ou uma imagem enviada.'
            : 'Envie o retrato como arquivo: links externos não são aceitos.'
        );
      }
    }
    if (text.trim()) update[key] = text;
    else unset[key] = '';
  }

  if (isRecord(fields.equipment)) {
    // Caminho ponto a ponto, e não o objeto inteiro: uma gravação concorrente
    // (a rolagem do gil) não pode ser desfeita por um instantâneo velho. O gil
    // só muda pela rolagem, então nem está na lista.
    for (const key of EQUIPMENT_KEYS) {
      const value = (fields.equipment as Doc)[key];
      if (typeof value === 'string') {
        update[`equipment.${key}`] = value.slice(0, 20000);
      }
    }
  }

  const stored: IStoredSheetLinks = {
    _id: sheet._id,
    slug: sheet.slug,
    race: sheet.race as string | undefined,
    raceId: sheet.raceId,
    raceChoice: sheet.raceChoice,
    classId: sheet.classId,
    level: 1,
    talents: sheet.talents,
    playerSpellcasting: sheet.playerSpellcasting,
  };
  const prev = {
    classId: sheet.classId,
    class: sheet.class as string | undefined,
    raceId: sheet.raceId,
    race: sheet.race as string | undefined,
    raceChoice: sheet.raceChoice,
  };

  const link: Doc = {};
  if ('raceId' in fields) link.raceId = fields.raceId;
  if ('raceChoice' in fields) link.raceChoice = fields.raceChoice;
  if ('classId' in fields) link.classId = fields.classId;
  const nextRace =
    'raceId' in link ? String(link.raceId ?? '') : String(sheet.raceId ?? '');
  const nextClass =
    'classId' in link
      ? String(link.classId ?? '')
      : String(sheet.classId ?? '');
  const raceChanged = nextRace !== String(sheet.raceId ?? '');
  const classChanged = nextClass !== String(sheet.classId ?? '');

  if (Object.keys(link).length > 0) {
    try {
      await prepareSheetLinksWrite(stored, link);
    } catch (error) {
      if (error instanceof PlayerSheetError) {
        throw new CreationError(
          error.message,
          error.name === 'UniqueConflictError' ? 409 : 400
        );
      }
      throw error;
    }
    Object.assign(update, link);
    if ('classId' in link && link.classId === null) unset.class = '';
    // Sem raça, o texto da raça também sai.
    if ('raceId' in link && link.raceId === null) unset.race = '';
    // O nível 1 da raça e da classe é o único que existe: nada de talento.
    update.talents = [];
    update.talentMilestones = [];
  }

  // Magias: truques e preparadas juntos em `spellRefs`, dentro dos limites.
  const castingIn = isRecord(fields.playerSpellcasting)
    ? fields.playerSpellcasting
    : null;
  let nextRefs: { spellId: string; prepared: boolean }[] | null = null;
  if (castingIn && Array.isArray(castingIn.spellRefs)) {
    nextRefs = (castingIn.spellRefs as unknown[]).flatMap((ref) => {
      const spellId = isRecord(ref) ? String(ref.spellId ?? '') : '';
      return OBJECT_ID.test(spellId) ? [{ spellId, prepared: true }] : [];
    });
  }
  if (classChanged) nextRefs = [];
  if (nextRefs) {
    try {
      await assertSpellLimits({
        classId: nextClass || null,
        level: 1,
        nextRefs,
        storedRefs: sheet.playerSpellcasting?.spellRefs,
      });
    } catch (error) {
      if (error instanceof PlayerSheetError) {
        throw new CreationError(error.message, 400);
      }
      throw error;
    }
    update['playerSpellcasting.spellRefs'] = nextRefs;
  }

  // ── O que é estado da criação ──
  const incoming = isRecord(body?.creation) ? body.creation : {};
  // `creation` é lido para validar, mas gravado por caminho ponto
  // (`creation.method`, `creation.base`…): nunca o objeto inteiro de um
  // instantâneo, que desfaria uma rolagem ou outro passo concorrente.
  const creation: ICreationState = { ...(sheet.creation ?? {}) };

  if (raceChanged) {
    creation.racialPicks = [];
    update['creation.racialPicks'] = [];
    creation.grants = {};
    update['creation.grants'] = {};
  }
  if (classChanged) {
    creation.featureChoices = [];
    update['creation.featureChoices'] = [];
    creation.classSkills = [];
    update['creation.classSkills'] = [];
  }

  if ('method' in incoming) {
    const method = incoming.method as AttributeMethod | undefined;
    if (method && !['pointBuy', 'standardArray', 'roll'].includes(method)) {
      throw new CreationError('Método de atributos inválido.');
    }
    if (creation.rollId && method !== 'roll') {
      throw new CreationError(
        'Os atributos já foram rolados: a rolagem trava os outros métodos.',
        409
      );
    }
    if (method === 'roll' && !creation.rollId) {
      throw new CreationError('Role os atributos para usar a rolagem.', 409);
    }
    if (method !== creation.method) {
      creation.method = method;
      creation.base = {};
      if (method) update['creation.method'] = method;
      else unset['creation.method'] = '';
      update['creation.base'] = {};
    }
  }

  if ('base' in incoming) {
    const base: Base = {};
    const raw = isRecord(incoming.base) ? incoming.base : {};
    for (const key of ATTRIBUTES) {
      if (raw[key] !== undefined && raw[key] !== null) {
        base[key] = Number(raw[key]);
      }
    }
    const check = checkBase(
      creation.method,
      base,
      creation.method === 'roll' ? await rollSumsOf(sheet._id) : undefined
    );
    if (!creation.method) {
      throw new CreationError('Escolha o método de atributos primeiro.');
    }
    if (!check.ok)
      throw new CreationError(check.message ?? 'Atributos inválidos.');
    creation.base = base;
    update['creation.base'] = base;
  }

  // A raça (e o que vale dela) como ficará depois desta escrita.
  const choiceNext = (update.raceChoice ?? sheet.raceChoice) as Doc | undefined;
  const raceInfo = async () => {
    const race = OBJECT_ID.test(nextRace)
      ? (await getRaceCatalog({ _id: nextRace }))[0]
      : undefined;
    const sub = race
      ? effectiveSubrace(
          race,
          typeof choiceNext?.subrace === 'string'
            ? choiceNext.subrace
            : undefined
        )
      : undefined;
    const parentSlugs = Array.isArray(choiceNext?.parents)
      ? (choiceNext.parents as string[])
      : [];
    const parents =
      race && parentSlugs.length > 0
        ? await getRaceCatalog({ slug: { $in: parentSlugs } })
        : [];
    const dominant = dominantOf(race ?? null, choiceNext, parents);
    return { race, sub, parents, dominant };
  };

  const choiceTouched = 'raceChoice' in link || raceChanged;
  if ('racialPicks' in incoming || choiceTouched) {
    if ('racialPicks' in incoming) {
      creation.racialPicks = Array.isArray(incoming.racialPicks)
        ? incoming.racialPicks.map(String)
        : [];
      update['creation.racialPicks'] = creation.racialPicks;
    }
    const { race, sub, dominant } = await raceInfo();
    const spec = raceBonus(race, sub, dominant);
    const dominantChanged =
      String(choiceNext?.dominantParent ?? '') !==
      String(sheet.raceChoice?.dominantParent ?? '');
    const check = checkRacialPicks(spec, creation.racialPicks ?? []);
    if (!check.ok && 'racialPicks' in incoming) {
      throw new CreationError(check.message ?? 'Bônus de atributo inválido.');
    }
    // Trocar a raça dominante do Mestiço refaz o bônus: as escolhas livres
    // anteriores não valem mais.
    if (
      !('racialPicks' in incoming) &&
      (!check.ok || (dominantChanged && (creation.racialPicks ?? []).length))
    ) {
      creation.racialPicks = [];
      update['creation.racialPicks'] = [];
    }
    // As concessões também seguem a raça: o que passa do novo total sai.
    const totals = sumGrants(racialGrants(race, sub));
    const cur = { ...emptyGrantPicks(), ...(creation.grants ?? {}) };
    const trimmed = {
      skills: cur.skills.slice(0, totals.skills),
      talents: cur.talents.slice(0, totals.talents),
      languages: cur.languages.slice(0, totals.languages),
      versatile: cur.versatile.slice(0, totals.versatile),
    };
    if (JSON.stringify(trimmed) !== JSON.stringify(cur)) {
      creation.grants = trimmed;
      update['creation.grants'] = trimmed;
    }
  }

  if ('featureChoices' in incoming) {
    const info = await loadClassInfo(nextClass);
    const picks = Array.isArray(incoming.featureChoices)
      ? incoming.featureChoices.map(String)
      : [];
    const grants = info?.featureChoices ?? [];
    if (picks.length > grants.length) {
      throw new CreationError('Escolhas de característica demais.');
    }
    picks.forEach((pick, i) => {
      if (pick && !grants[i]?.options.includes(pick)) {
        throw new CreationError(`Opção inválida: "${pick}".`);
      }
    });
    creation.featureChoices = picks;
    update['creation.featureChoices'] = picks;
  }

  if ('extraLanguage' in incoming) {
    const lang = String(incoming.extraLanguage ?? '')
      .trim()
      .slice(0, 40);
    if (lang) {
      creation.extraLanguage = lang;
      update['creation.extraLanguage'] = lang;
    } else {
      delete creation.extraLanguage;
      unset['creation.extraLanguage'] = '';
    }
  }

  // ── Ajuste do narrador nas perícias ──
  if (body?.staffSkills !== undefined) {
    // Só a staff NESTA ficha (a dona nunca é staff na própria): a jogadora não
    // aplica especialização direto, só pelas fontes.
    if (!actor.isStaff) {
      throw new CreationError(
        'Só a staff aplica proficiência direto, fora das fontes.',
        403
      );
    }
    if (!Array.isArray(body.staffSkills) || body.staffSkills.length > 40) {
      throw new CreationError('Ajuste de perícias inválido.');
    }
    const byName = new Map<string, 0 | 1 | 2>();
    for (const item of body.staffSkills) {
      const name = String((item as { name?: unknown })?.name ?? '');
      const level = Number((item as { level?: unknown })?.level);
      if (!SKILL_NAMES.includes(name) || ![0, 1, 2].includes(level)) {
        throw new CreationError(`Perícia ou nível inválido: "${name}".`);
      }
      byName.set(name, level as 0 | 1 | 2);
    }
    const list = [...byName].map(([name, level]) => ({ name, level }));
    creation.staffSkills = list;
    update['creation.staffSkills'] = list;
  }

  if (Array.isArray(body?.skills)) {
    const info = await loadClassInfo(nextClass);
    if (!info) throw new CreationError('Escolha a classe antes das perícias.');
    const wanted = body.skills.map(String);
    // Sem lista na classe a escolha é livre: limita quantidade e tamanho.
    if (wanted.length > MAX_FREE_SKILLS || wanted.some((w) => w.length > 40)) {
      throw new CreationError('Perícias demais ou com nome longo demais.');
    }
    const allowed = info.skills.list;
    const canonical = wanted.map((w) => {
      if (allowed.length === 0) return w;
      const hit = allowed.find((a) => asciiFold(a) === asciiFold(w));
      if (!hit)
        throw new CreationError(`"${w}" não é uma perícia desta classe.`);
      return hit;
    });
    if (info.skills.n !== null && canonical.length > info.skills.n) {
      throw new CreationError(`Esta classe escolhe ${info.skills.n} perícias.`);
    }
    // A mesma perícia duas vezes na MESMA lista é erro; já com a de outra fonte
    // (a raça), vira especialização, até duas aplicações.
    const { race: raceNow, sub: subNow } = await raceInfo();
    const issue = skillSourcesIssue(
      skillSources(canonical, racialGrants(raceNow, subNow), {
        ...emptyGrantPicks(),
        ...(creation.grants ?? {}),
      })
    );
    if (issue) throw new CreationError(issue);
    creation.classSkills = canonical;
    update['creation.classSkills'] = canonical;
  }

  // ── Concessões da raça ("Concede na criação") ──
  if (isRecord(body?.grants)) {
    const { race, sub, parents } = await raceInfo();
    const totals = sumGrants(racialGrants(race, sub));
    const g = body.grants as Doc;
    const strings = (v: unknown, max: number) =>
      (Array.isArray(v) ? v : [])
        .map((x) =>
          String(x ?? '')
            .trim()
            .slice(0, max)
        )
        .filter(Boolean);
    const next = { ...emptyGrantPicks(), ...(creation.grants ?? {}) };
    if ('skills' in g) next.skills = strings(g.skills, 40);
    if ('talents' in g) next.talents = [...new Set(strings(g.talents, 80))];
    if ('languages' in g) next.languages = strings(g.languages, 40);
    if ('versatile' in g) {
      next.versatile = (Array.isArray(g.versatile) ? g.versatile : [])
        .filter(isRecord)
        .map((v) => ({
          kind: String(v.kind) as 'skill',
          value: String(v.value ?? '')
            .trim()
            .slice(0, 60),
        }));
    }
    const locked = race ? raceLanguages(race, sub, parents) : [];
    if (creation.extraLanguage) locked.push(creation.extraLanguage);
    const check = checkGrantPicks(
      totals,
      next,
      creation.classSkills ?? [],
      locked,
      racialGrants(race, sub)
    );
    if (!check.ok) {
      throw new CreationError(check.message ?? 'Escolha racial inválida.');
    }
    // Talento racial: geral, que existe e é permitido no nível 1.
    if (next.talents.length > 0) {
      const docs = await TalentModel.find({ slug: { $in: next.talents } })
        .select(GENERAL_TALENT_FIELDS)
        .lean<ITalentDoc[]>();
      for (const key of next.talents) {
        const doc = docs.find((d) => d.slug === key);
        if (!doc) throw new CreationError(`Talento desconhecido: "${key}".`);
        const option = generalTalentOption(doc);
        if (requiredLevel(option.prerequisites, undefined) > 1) {
          throw new CreationError(
            `"${option.name}" pede nível acima do 1 e não pode ser o talento racial.`
          );
        }
      }
    }
    for (const key of Object.keys(g)) {
      if (key in next) {
        const value = (next as unknown as Doc)[key];
        creation.grants = { ...(creation.grants ?? {}), [key]: value };
        update[`creation.grants.${key}`] = value;
      }
    }
  }

  // O nome define o slug (que não é a chave da tag do fórum, o `_id` é).
  if (typeof update.name === 'string' && sheet.status !== 'approved') {
    const slug = await uniqueSlug(update.name as string, sheet._id);
    if (slug && slug !== sheet.slug) update.slug = slug;
  }

  if (sheet.status === 'blank') update.status = 'draft';

  const $set: Doc = { ...update };
  const $unset: Doc = { ...unset };
  if (Object.keys($set).length === 0 && Object.keys($unset).length === 0) {
    return getCreation(id, actor);
  }
  const written = await PlayerModel.updateOne(writeFilter(id, actor), {
    ...(Object.keys($set).length ? { $set } : {}),
    ...(Object.keys($unset).length ? { $unset } : {}),
  });
  if (written.matchedCount === 0) {
    throw new CreationError(
      'A ficha mudou de estado enquanto você editava.',
      409
    );
  }

  if (update.classId || update.raceId) {
    await guardUniqueAfterWrite(id, prev, update).catch((error) => {
      if (error instanceof PlayerSheetError) {
        throw new CreationError(
          error.message,
          error.name === 'UniqueConflictError' ? 409 : 400
        );
      }
      throw error;
    });
  }

  await recompute(id);
  // Salvamentos seguidos do mesmo autor viram uma entrada (janela de 10 min).
  await recordAudit(
    id,
    sheet,
    () => rawSheet(id),
    auditActor(actor),
    'creation-draft',
    {
      group: true,
    }
  );
  return getCreation(id, actor);
}

// ── Rolagens (definitivas) ───────────────────────────────

let rollIndexReady: Promise<unknown> | null = null;

/**
 * Garante o índice único (ficha, tipo, classe) antes do primeiro sorteio. O
 * índice antigo (ficha, tipo) impediria um segundo gil, de outra classe, então
 * é descartado se ainda existir.
 */
function ensureRollIndex() {
  rollIndexReady ??= (async () => {
    await CreationRollModel.collection
      .dropIndex('playerId_1_kind_1')
      .catch(() => undefined);
    await CreationRollModel.init();
  })().catch((error) => {
    // Falha passageira (rede, Atlas): a próxima rolagem tenta de novo, em vez
    // de herdar a promessa rejeitada até o processo reiniciar.
    rollIndexReady = null;
    throw error;
  });
  return rollIndexReady;
}

async function recordRoll(
  sheet: ISheet,
  kind: 'attributes' | 'gil',
  build: () => { sets: number[][]; sums: number[]; formula?: string },
  actor: IActor,
  classSlug?: string
) {
  const where = {
    playerId: sheet._id,
    kind,
    ...(classSlug ? { classSlug } : { classSlug: { $exists: false } }),
  };
  const existing = await CreationRollModel.findOne(where).lean();
  if (existing) return { ...rollView(existing), alreadyRolled: true };

  await ensureRollIndex();
  try {
    const created = await CreationRollModel.create({
      rollId: `rol-${randomUUID().slice(0, 8)}`,
      playerId: sheet._id,
      kind,
      ...(classSlug ? { classSlug } : {}),
      ...build(),
      byUsername: actor.username,
      byForumUserId: actor.forumUserId,
      at: new Date(),
    });
    return { ...rollView(created), alreadyRolled: false };
  } catch (error) {
    if ((error as { code?: number }).code === 11000) {
      const winner = await CreationRollModel.findOne(where).lean();
      if (winner) return { ...rollView(winner), alreadyRolled: true };
    }
    throw error;
  }
}

/** 6×4d6 no servidor, uma vez só. Recarregar devolve a mesma rolagem. */
export async function rollAttributes(id: string, actor: IActor) {
  const sheet = await loadSheet(id);
  assertWritable(actor, sheet);
  const result = await recordRoll(
    sheet,
    'attributes',
    () => rollAttributeSets(randomUnit),
    actor
  );
  // Rolagem nova, ou rolagem que ficou sem o vínculo na ficha (a gravação do
  // vínculo falhou depois do sorteio): religa o método e o `rollId`. A base já
  // atribuída não se apaga numa rolagem que já existia.
  const relink = !result.alreadyRolled || !sheet.creation?.rollId;
  if (relink) {
    await PlayerModel.updateOne(writeFilter(id, actor), {
      $set: {
        'creation.method': 'roll',
        'creation.rollId': result.rollId,
        ...(result.alreadyRolled ? {} : { 'creation.base': {} }),
        ...(sheet.status === 'blank' ? { status: 'draft' } : {}),
      },
    });
  }
  if (!result.alreadyRolled) {
    await recordAudit(
      id,
      sheet,
      () => rawSheet(id),
      auditActor(actor),
      'creation-roll',
      {
        extra: [
          {
            path: 'roll.attributes',
            label: 'Rolagem de atributos (6 × 4d6)',
            before: null,
            after: { totals: result.sums, rollId: result.rollId },
          },
        ],
        force: true,
      }
    );
  }
  return result;
}

/**
 * O gil inicial da classe, rolado no servidor, uma vez só POR CLASSE. Trocar de
 * classe pede outra rolagem e guarda a anterior; voltar a uma classe já rolada
 * reaproveita a rolagem dela.
 */
export async function rollStartingGil(id: string, actor: IActor) {
  const sheet = await loadSheet(id);
  assertWritable(actor, sheet);
  const info = await loadClassInfo(sheet.classId);
  if (!info) throw new CreationError('Escolha a classe antes do gil.', 409);
  const formula = parseGilFormula(info.startingGil);
  if (!formula) {
    throw new CreationError('Esta classe não tem fórmula de gil inicial.', 409);
  }
  const result = await recordRoll(
    sheet,
    'gil',
    () => {
      const r = rollGil(formula, randomUnit);
      return { sets: [r.dice], sums: [r.total], formula: info.startingGil };
    },
    actor,
    info.slug
  );
  // Sempre alinha a ficha com a rolagem DESTA classe (também religa uma
  // rolagem que ficou sem a gravação).
  await PlayerModel.updateOne(writeFilter(id, actor), {
    $set: {
      'equipment.gil': result.sums[0],
      'creation.startingGil': result.sums[0],
      ...(sheet.status === 'blank' ? { status: 'draft' } : {}),
    },
  });
  if (!result.alreadyRolled) {
    await recordAudit(
      id,
      sheet,
      () => rawSheet(id),
      auditActor(actor),
      'creation-roll',
      {
        extra: [
          {
            path: 'roll.gil',
            label: `Gil inicial rolado (${result.formula ?? ''})`,
            before: null,
            after: {
              dice: result.sets[0],
              total: result.sums[0],
              rollId: result.rollId,
            },
          },
        ],
        force: true,
      }
    );
  }
  return result;
}

// ── Enviar, aprovar, devolver ────────────────────────────

const pushReview = (entry: IReviewEntry) => ({
  $push: { review: entry },
});

const REASON_RETURN = 'Ficha devolvida';

/**
 * Enviar: de rascunho ou devolvida. Reenviar uma ficha já enviada não repete
 * a entrada de revisão nem o evento. A mudança de estado é uma escrita só,
 * com o estado de origem no filtro: duas requisições simultâneas não duplicam.
 */
export async function submitSheet(id: string, actor: IActor) {
  const sheet = await loadSheet(id);
  assertWritable(actor, sheet);
  const issues = await evaluateSheet(sheet);
  if (issues.some((i) => i.kind === 'required')) {
    throw new CreationError('Ainda falta o que é obrigatório.', 422, issues);
  }
  if (sheet.status === 'submitted') {
    return { status: 'submitted' as const, issues };
  }
  const at = new Date().toISOString();
  const moved = await PlayerModel.updateOne(
    { _id: id, status: { $in: ['blank', 'draft', 'returned'] as const } },
    {
      $set: { status: 'submitted', 'creation.submittedAt': at },
      ...pushReview({ kind: 'submit', by: actor.username, at }),
    }
  );
  if (moved.matchedCount === 0) {
    const now = await loadSheet(id);
    if (now.status === 'submitted') {
      return { status: 'submitted' as const, issues };
    }
    throw new CreationError('A ficha mudou de estado.', 409);
  }
  await record(sheet, 'submit', 'Ficha enviada para aprovação', actor);
  await recordAudit(
    id,
    sheet,
    () => rawSheet(id),
    auditActor(actor),
    'submit',
    {
      force: true,
    }
  );
  return { status: 'submitted' as const, issues };
}

/** Os rótulos dos campos da ficha, para o histórico (nunca os valores). */
const FIELD_LABELS: Record<string, string> = {
  name: 'Nome',
  race: 'Raça',
  gender: 'Gênero',
  class: 'Classe',
  classId: 'Classe',
  raceId: 'Raça',
  raceChoice: 'Escolha de raça',
  age: 'Idade',
  height: 'Altura',
  family: 'Família',
  kingdom: 'Reino',
  clan: 'Clã',
  deity: 'Divindade',
  subtitle: 'Epíteto',
  image: 'Retrato',
  size: 'Tamanho',
  type: 'Tipo',
  alignment: 'Tendência',
  chi: 'Ki',
  proficiencyBonus: 'Proficiência',
  combat: 'Combate',
  stats: 'Atributos',
  playerStats: 'Atributos',
  proficiencies: 'Perícias e proficiências',
  defenses: 'Defesas',
  senses: 'Sentidos',
  languages: 'Idiomas',
  abilities: 'Habilidades',
  traits: 'Traços',
  actions: 'Ações',
  bonusActions: 'Ações bônus',
  reactions: 'Reações',
  legendaryActions: 'Ações lendárias',
  playerSpellcasting: 'Magias',
  archetype: 'Arquétipo',
  talents: 'Talentos',
  talentMilestones: 'Marcos de talento',
  equipment: 'Equipamento e gil',
  professions: 'Profissões',
  appearance: 'Aparência',
  backstory: 'História',
  narrationStyle: 'Narração',
};

/**
 * Aprova a ficha. Sem `edits` é a aprovação simples. Com `edits.fields` é a
 * "aprovação com ajustes": o narrador edita a ficha (as mesmas regras da edição
 * da staff numa ficha aprovada) e ela já sai aprovada, numa escrita só, com o
 * estado de origem no filtro (enviada ou devolvida). Os campos editados valem
 * como estão: nada é recalculado depois (o recompute da criação só roda em
 * rascunho, e a ficha aprovada o recusa).
 */
export async function approveSheet(
  id: string,
  actor: IActor,
  edits?: { fields?: unknown; updatedAt?: unknown }
) {
  assertAdmin(actor);
  const sheet = await loadSheet(id);
  assertInCreation(sheet);
  if (sheet.status === 'approved') {
    throw new CreationError('A ficha já foi aprovada.', 409);
  }
  const adjusting = !!edits && edits.fields !== undefined;
  if (
    adjusting &&
    sheet.status !== 'submitted' &&
    sheet.status !== 'returned'
  ) {
    throw new CreationError(
      'Só uma ficha enviada ou devolvida pode ser aprovada com ajustes.',
      409
    );
  }
  const issues = await evaluateSheet(sheet);
  if (issues.some((i) => i.kind === 'required')) {
    throw new CreationError('Ainda falta o que é obrigatório.', 422, issues);
  }
  const at = new Date().toISOString();

  if (!adjusting) {
    const moved = await PlayerModel.updateOne(
      {
        _id: id,
        status: { $in: ['blank', 'draft', 'submitted', 'returned'] as const },
      },
      {
        $set: { status: 'approved' },
        ...pushReview({ kind: 'approve', by: actor.username, at }),
      }
    );
    if (moved.matchedCount === 0) {
      throw new CreationError('A ficha já foi aprovada.', 409);
    }
    await record(sheet, 'approve', 'Ficha aprovada', actor);
    await recordAudit(
      id,
      sheet,
      () => rawSheet(id),
      auditActor(actor),
      'approve',
      {
        force: true,
      }
    );
    return { status: 'approved' as const };
  }

  const data = pickWritablePlayerFields(edits.fields);
  normalizeStats(data);
  normalizeSkills(data);
  if (Object.keys(data).length === 0) {
    throw new CreationError('Nada para ajustar: aprove sem ajustes.');
  }
  const current = await getPlayerById(id);
  if (!current) throw new CreationError('Ficha não encontrada.', 404);
  // Edição concorrente: a ficha mudou desde que o narrador a abriu.
  if (edits.updatedAt) {
    const storedAt = current.updatedAt
      ? new Date(current.updatedAt).getTime()
      : 0;
    if (storedAt && storedAt !== new Date(String(edits.updatedAt)).getTime()) {
      throw new CreationError('Esta ficha foi alterada em outro lugar.', 409);
    }
  }
  normalizeSpellDC(data, current as unknown as Doc);

  // Os rótulos do que mudou (nunca os valores).
  const labels = [
    ...new Set(
      Object.keys(data)
        .filter(
          (key) =>
            JSON.stringify((current as unknown as Doc)[key] ?? null) !==
            JSON.stringify(data[key] ?? null)
        )
        .map((key) => FIELD_LABELS[key] ?? key)
    ),
  ];
  const entry: IReviewEntry = {
    kind: 'approve',
    notes: `Aprovada com ajustes: ${labels.join(', ') || 'sem alteração de campo'}`,
    by: actor.username,
    at,
  };
  let updated;
  try {
    updated = await updatePlayerById(id, data, {
      where: {
        status: { $in: ['submitted', 'returned'] },
        // Se foi dado, a ficha tem de estar como o narrador a abriu.
        ...(edits.updatedAt
          ? { updatedAt: new Date(String(edits.updatedAt)) }
          : {}),
      },
      set: { status: 'approved' },
      push: { review: entry },
      // Perdida a corrida da raça/classe única, a ficha volta ao que era.
      revert: {
        set: { status: sheet.status },
        pull: { review: { kind: 'approve', at: entry.at } },
      },
    });
  } catch (error) {
    if (error instanceof PlayerSheetError) {
      throw new CreationError(
        error.message,
        error.name === 'UniqueConflictError' ? 409 : 400
      );
    }
    throw error;
  }
  if (!updated) {
    throw new CreationError(
      'A ficha mudou de estado enquanto você editava.',
      409
    );
  }
  await record(
    sheet,
    'approve',
    `Aprovada com ajustes: ${labels.join(', ') || 'sem alteração de campo'}`,
    actor
  );
  // A auditoria guarda o antes e o depois de cada campo (o histórico amigável
  // só os rótulos).
  await recordAudit(
    id,
    sheet,
    () => rawSheet(id),
    auditActor(actor),
    'approve-adjust',
    { reason: 'Aprovada com ajustes', force: true }
  );
  return { status: 'approved' as const, adjusted: labels };
}

export async function returnSheet(
  id: string,
  body: { notes?: unknown; steps?: unknown },
  actor: IActor
) {
  assertAdmin(actor);
  const sheet = await loadSheet(id);
  assertInCreation(sheet);
  const notes = typeof body.notes === 'string' ? body.notes.trim() : '';
  if (!notes) {
    throw new CreationError('Escreva as observações para a dona da ficha.');
  }
  if (sheet.status !== 'submitted') {
    throw new CreationError('Só uma ficha enviada pode ser devolvida.', 409);
  }
  const steps = (Array.isArray(body.steps) ? body.steps : [])
    .map(String)
    .filter((s): s is CreationStep => STEPS.includes(s as CreationStep));
  const at = new Date().toISOString();
  const moved = await PlayerModel.updateOne(
    { _id: id, status: 'submitted' },
    {
      $set: { status: 'returned' },
      ...pushReview({
        kind: 'return',
        notes: notes.slice(0, 4000),
        steps,
        by: actor.username,
        at,
      }),
    }
  );
  if (moved.matchedCount === 0) {
    throw new CreationError('A ficha mudou de estado.', 409);
  }
  // As observações ficam só em `review` (que a leitura pública não entrega); o
  // histórico de eventos não as repete.
  await record(sheet, 'return', REASON_RETURN, actor);
  await recordAudit(
    id,
    sheet,
    () => rawSheet(id),
    auditActor(actor),
    'return',
    {
      force: true,
    }
  );
  return { status: 'returned' as const };
}
