import { randomInt, randomUUID } from 'node:crypto';
import { Types } from 'mongoose';
import PlayerModel from '../db/players/players';
import CharacterClassModel from '../db/classes/classes';
import SpellModel from '../db/spells/spells';
import PlayerEventModel from '../db/playerProgress/playerEvents';
import HpRollModel from '../db/playerProgress/hpRolls';
import type {
  IPlayerEvent,
  IXpLine,
  PlayerEventKind,
} from '../db/playerProgress/playerProgress';
import type ICharacterClass from '../db/classes/class.d';
import type { IClassLevel } from '../db/classes/class.d';
import { archetypePickOf, featureKey } from '../db/l10n/classes';
import { OWN_SHEET_MESSAGE, sheetFlags } from '../lib/sheetAccess';
import { modifierOf, type AttributeKey } from '../lib/stats';
import { archetypeFeatureOpen } from '../lib/archetypeFeatureLevel';
import { earnedLevel, xpToNext, MAX_LEVEL } from '../lib/xp';
import {
  ATTRIBUTE_CAP,
  ATTRIBUTE_KEYS,
  ATTRIBUTE_LABELS,
  addAttributePoints,
  hpGainOf,
  parseHitDie,
  rollDie,
  spellAdds,
  spellNeed,
  type IFeatureChoiceRecord,
  type ILevelLock,
  type ILevelPlan,
  type INovelty,
  type IPlanOption,
  type IPlanSpell,
  type IPlanTalent,
  type ISealChoices,
} from '../lib/levelUp';
import { requiredLevel } from '../lib/talentPrerequisite';
import { talentScheduleOf } from './talentSlots';
import { getTalentOptions } from './talent.service';
import { assertSpellLimits } from './playerSheetLinks.service';

/**
 * Experiência e subida de nível da ficha.
 *
 * Duas ideias organizam tudo:
 *
 *   - `level` é o nível SELADO e `experience.current` é a XP contada a partir
 *     do início dele. O nível ALCANÇADO é derivado (`earnedLevel`), então a
 *     subida libera sozinha quando a XP basta e não existe ação de destravar.
 *   - Selar é a única escrita da subida: o servidor refaz o plano do nível,
 *     valida as escolhas contra ele e só então grava, num documento só e com
 *     filtro pelo nível anterior (dois selos simultâneos não passam).
 *
 * Sem 'use server': exporta classe de erro e tipos, e só roda no servidor.
 */

export class LevelUpError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.name = 'LevelUpError';
    this.status = status;
  }
}

export interface IActor {
  username: string;
  forumUserId: number;
  /** Poder de staff NESTA ficha (nunca na própria). Ver lib/sheetAccess.ts. */
  isStaff: boolean;
  isOwner: boolean;
  /** Tem papel de staff, mesmo sendo a dona: só para a mensagem de recusa. */
  hasStaffRole?: boolean;
}

type Doc = Record<string, unknown>;
const OBJECT_ID = /^[0-9a-f]{24}$/i;
const isRecord = (v: unknown): v is Doc =>
  !!v && typeof v === 'object' && !Array.isArray(v);
const asArray = <T>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

// ── Carga ────────────────────────────────────────────────

interface IPlayerDoc extends Doc {
  _id: Types.ObjectId;
  name: string;
  classId?: Types.ObjectId;
  level?: number;
  experience?: { current?: number; nextLevel?: number };
  ownerForumUserId?: number;
  updatedAt?: Date;
}

async function loadPlayer(
  id: string,
  options: { allowCreation?: boolean } = {}
): Promise<IPlayerDoc> {
  if (!OBJECT_ID.test(id)) throw new LevelUpError('Ficha não encontrada.', 404);
  const player = await PlayerModel.findById(id).lean<IPlayerDoc>();
  if (!player) throw new LevelUpError('Ficha não encontrada.', 404);
  // Uma ficha ainda em criação não sobe de nível: sem `status` é ficha antiga.
  const status = (player as { status?: string }).status;
  if (!options.allowCreation && status && status !== 'approved') {
    throw new LevelUpError('A ficha ainda está em criação.', 409);
  }
  return player;
}

type ClassDoc = ICharacterClass & Doc;

async function loadClass(player: IPlayerDoc): Promise<ClassDoc> {
  if (!player.classId) {
    throw new LevelUpError('Esta ficha não tem classe ligada ao códice.', 409);
  }
  const klass = await CharacterClassModel.findById(
    player.classId
  ).lean<ClassDoc>();
  if (!klass) throw new LevelUpError('Classe não encontrada.', 404);
  return klass;
}

const levelOf = (p: IPlayerDoc) =>
  Math.max(1, Math.floor(Number(p.level) || 1));
const poolOf = (p: IPlayerDoc) => Number(p.experience?.current) || 0;

/** O acesso de quem está vendo: dono da ficha OU staff (nunca os dois). */
export async function getAccess(
  playerId: string,
  session: { forumUserId: number; role: string } | null
) {
  if (!session || !OBJECT_ID.test(playerId)) {
    return { isStaff: false, isOwner: false, hasStaffRole: false };
  }
  const player = await PlayerModel.findById(playerId)
    .select('ownerForumUserId')
    .lean<{ ownerForumUserId?: number }>();
  const isOwner =
    !!player &&
    typeof player.ownerForumUserId === 'number' &&
    player.ownerForumUserId === session.forumUserId;
  // O dono vence o papel: quem é dono da ficha é só jogador nela.
  return sheetFlags(session.role, isOwner);
}

function assertLevelPermission(actor: IActor) {
  if (!actor.isStaff && !actor.isOwner) {
    throw new LevelUpError(
      'Só o dono da ficha ou a staff pode subir de nível.',
      403
    );
  }
}
function assertAdmin(actor: IActor) {
  if (!actor.isStaff) {
    throw new LevelUpError(
      actor.isOwner && actor.hasStaffRole
        ? OWN_SHEET_MESSAGE
        : 'Só a staff pode fazer isto.',
      403
    );
  }
}

// ── XP ───────────────────────────────────────────────────

export interface IEventView {
  id: string;
  kind: PlayerEventKind;
  amount?: number;
  reason: string;
  lines?: IXpLine[];
  level?: number;
  earnedAfter?: number;
  byUsername: string;
  at: string;
  /** Concessão que já foi estornada: não oferece "Estornar" de novo. */
  reversed: boolean;
  reversalOf?: string;
}

export async function getHistory(
  playerId: string,
  limit = 60,
  before?: string
) {
  if (!OBJECT_ID.test(playerId)) return [];
  const cursor = before ? new Date(before) : null;
  const events = await PlayerEventModel.find({
    playerId,
    ...(cursor && !Number.isNaN(cursor.getTime())
      ? { at: { $lt: cursor } }
      : {}),
  })
    .sort({ at: -1 })
    .limit(limit)
    .lean<(IPlayerEvent & { _id: Types.ObjectId })[]>();
  // Estornada ou não: pergunta ao banco, porque o estorno pode estar numa
  // página mais nova que a desta lista.
  const reversal = await PlayerEventModel.find({
    playerId,
    reversalOf: { $in: events.map((e) => e._id) },
  })
    .select('reversalOf')
    .lean<{ reversalOf: Types.ObjectId }[]>();
  const reversed = new Set(reversal.map((e) => String(e.reversalOf)));
  return events.map((e): IEventView => ({
    id: String(e._id),
    kind: e.kind,
    amount: e.amount,
    reason: e.reason,
    lines: e.lines,
    level: e.level,
    earnedAfter: e.earnedAfter,
    byUsername: e.byUsername,
    at: new Date(e.at).toISOString(),
    reversed: reversed.has(String(e._id)),
    ...(e.reversalOf ? { reversalOf: String(e.reversalOf) } : {}),
  }));
}

export interface IGrantInput {
  amount: number;
  reason: string;
  lines?: IXpLine[];
  reversalOf?: string;
}

/**
 * Concede (ou corrige) XP. Só admin. A concessão entra no histórico e soma ao
 * `experience.current`; o nível NUNCA cai, e a barra pode ficar negativa.
 */
export async function grantXp(
  playerId: string,
  input: IGrantInput,
  actor: IActor
) {
  assertAdmin(actor);
  const amount = Math.round(Number(input.amount));
  if (!Number.isFinite(amount) || amount === 0) {
    throw new LevelUpError('Informe um valor de XP diferente de zero.');
  }
  if (Math.abs(amount) > 1_000_000) {
    throw new LevelUpError('Valor de XP fora do limite.');
  }
  const reason = String(input.reason ?? '')
    .trim()
    .slice(0, 300);
  if (!reason) throw new LevelUpError('Escreva o motivo.');

  const lines = asArray<IXpLine>(input.lines)
    .slice(0, 30)
    .flatMap((l) =>
      isRecord(l) && Number.isFinite(Number(l.value))
        ? [
            {
              line: String(l.line ?? '').slice(0, 120),
              value: Math.round(Number(l.value)),
            },
          ]
        : []
    );

  const player = await loadPlayer(playerId, { allowCreation: true });

  let reversalOf: Types.ObjectId | undefined;
  if (input.reversalOf) {
    if (!OBJECT_ID.test(input.reversalOf))
      throw new LevelUpError('Lançamento inválido.');
    const original = await PlayerEventModel.findOne({
      _id: input.reversalOf,
      playerId: player._id,
      kind: 'grant',
    }).lean<IPlayerEvent & { _id: Types.ObjectId }>();
    if (!original)
      throw new LevelUpError('Concessão a estornar não encontrada.', 404);
    if (
      await PlayerEventModel.exists({
        playerId: player._id,
        reversalOf: original._id,
      })
    ) {
      throw new LevelUpError('Esta concessão já foi estornada.', 409);
    }
    if (amount !== -(original.amount ?? 0)) {
      throw new LevelUpError(
        'O estorno precisa ter o valor oposto ao da concessão.'
      );
    }
    reversalOf = original._id;
  }

  const level = levelOf(player);
  const updated = await withEvent(
    player._id,
    amount < 0 ? 'correction' : 'grant',
    actor,
    {
      amount,
      reason,
      lines,
      ...(reversalOf ? { reversalOf } : {}),
    },
    () =>
      PlayerModel.findOneAndUpdate(
        { _id: player._id },
        {
          $inc: { 'experience.current': amount },
          $set: { 'experience.nextLevel': xpToNext(level) ?? 0 },
        },
        { returnDocument: 'after' }
      ).lean<IPlayerDoc>(),
    (doc) => ({ earnedAfter: earnedLevel(levelOf(doc), poolOf(doc)) })
  );
  const earned = earnedLevel(levelOf(updated), poolOf(updated));
  return { current: poolOf(updated), level: levelOf(updated), earned };
}

// ── O plano de um nível ──────────────────────────────────

const ATTRIBUTE_TEXT = /atributo/i;
const TALENT_TEXT = /talent/i;

/** "Aura do medo (escolha 2)" → "Aura do medo": o parêntese é anotação da tabela. */
const cleanName = (raw: string) =>
  raw.replace(/\s*\((?:escolha|escolher)[^)]*\)/i, '').trim();

interface ISnapshot {
  /** Versão do documento lida: o selo só grava se ela ainda for a atual. */
  updatedAt: Date | undefined;
  level: number;
  pool: number;
  proficiencyBonus?: number;
  playerStats: Record<
    string,
    | { base?: number; total?: number; raceBonus?: number; classBonus?: number }
    | undefined
  >;
  combat: Doc;
  talents: { key: string; level: number; name: string }[];
  milestones: { level: number; use: string }[];
  archetype: { slug?: string; features?: string[] } | null;
  spellRefs: { spellId: string; prepared?: boolean }[];
  featureChoices: IFeatureChoiceRecord[];
  levelLocks: ILevelLock[];
  novelties: INovelty[];
}

function snapshotOf(p: IPlayerDoc): ISnapshot {
  const casting = isRecord(p.playerSpellcasting) ? p.playerSpellcasting : {};
  return {
    updatedAt: p.updatedAt as Date | undefined,
    level: levelOf(p),
    pool: poolOf(p),
    proficiencyBonus:
      typeof p.proficiencyBonus === 'number' ? p.proficiencyBonus : undefined,
    playerStats: isRecord(p.playerStats)
      ? (p.playerStats as ISnapshot['playerStats'])
      : {},
    combat: isRecord(p.combat) ? { ...p.combat } : {},
    talents: asArray<ISnapshot['talents'][number]>(p.talents).map((t) => ({
      key: String(t.key),
      level: Number(t.level),
      name: String(t.name),
    })),
    milestones: asArray<ISnapshot['milestones'][number]>(p.talentMilestones),
    archetype: isRecord(p.archetype)
      ? (p.archetype as ISnapshot['archetype'])
      : null,
    spellRefs: asArray<ISnapshot['spellRefs'][number]>(casting.spellRefs).map(
      (r) => ({
        spellId: String(r.spellId),
        prepared: r.prepared,
      })
    ),
    featureChoices: asArray<IFeatureChoiceRecord>(p.featureChoices),
    levelLocks: asArray<ILevelLock>(p.levelLocks),
    novelties: asArray<INovelty>(p.novelties),
  };
}

const hpValueOf = (snap: ISnapshot) => {
  const hp = snap.combat.hp as { value?: number } | undefined;
  return Number(hp?.value) || 0;
};

function describeFeatures(klass: ClassDoc) {
  return new Map(
    (klass.features ?? []).map((f) => [
      featureKey(f.name),
      { name: f.name, description: f.description ?? '' },
    ])
  );
}

const rowOf = (klass: ClassDoc, level: number): IClassLevel | undefined =>
  (klass.levels ?? []).find((l) => l.level === level);

/** Em que nível a classe manda escolher o arquétipo. */
function archetypePickLevel(klass: ClassDoc): number | null {
  for (const row of [...(klass.levels ?? [])].sort(
    (a, b) => a.level - b.level
  )) {
    for (const grant of row.grants ?? []) {
      if (grant.options.length !== 1) continue;
      if (archetypePickOf(grant.options[0].name)?.kind === 'archetype')
        return row.level;
    }
  }
  return null;
}

async function buildPlanFor(
  player: IPlayerDoc,
  snap: ISnapshot,
  klass: ClassDoc,
  level: number
): Promise<ILevelPlan> {
  const row = rowOf(klass, level);
  if (!row) {
    throw new LevelUpError(
      `A classe ${klass.name} não tem tabela para o nível ${level}.`,
      409
    );
  }
  const prev = rowOf(klass, level - 1);
  const described = describeFeatures(klass);
  // O nome da descrição vence o da tabela: é o acentuado e o da página da classe.
  const describe = (name: string): IPlanOption => {
    const feature = described.get(featureKey(name));
    return {
      name: feature?.name ?? name,
      description: feature?.description ?? '',
    };
  };

  const autoFeatures: IPlanOption[] = [];
  const featureChoices: ILevelPlan['featureChoices'] = [];
  let archetypePick = false;
  let archetypeSlots = 0;

  for (const grant of row.grants ?? []) {
    const options = grant.options;
    if (options.length === 1) {
      const [option] = options;
      const pick = archetypePickOf(option.name);
      if (pick) {
        if (pick.kind === 'archetype') archetypePick = true;
        else archetypeSlots += 1;
        if (pick.rest) autoFeatures.push(describe(cleanName(pick.rest)));
        continue;
      }
      if (option.requiresPrerequisite) continue;
      // Marcos de atributo e talentos saem do cronograma de talentos abaixo.
      if (
        ATTRIBUTE_TEXT.test(option.name) ||
        /^(um\s+)?talentos?(\s|$)/i.test(option.name.trim())
      )
        continue;
      autoFeatures.push(describe(cleanName(option.name)));
      continue;
    }
    if (
      options.some(
        (o) => ATTRIBUTE_TEXT.test(o.name) || TALENT_TEXT.test(o.name)
      )
    )
      continue;
    if (options.some((o) => archetypePickOf(o.name))) continue;
    featureChoices.push({
      raw: options.map((o) => o.name).join(' | '),
      options: options.map((o) => ({
        ...describe(cleanName(o.name)),
        ...(o.requiresPrerequisite ? { requiresPrerequisite: true } : {}),
      })),
    });
  }

  // ── Arquétipo ──
  const pickLevel = archetypePickLevel(klass);
  const currentSlug = snap.archetype?.slug ?? null;
  const archetype: ILevelPlan['archetype'] =
    (archetypePick && !currentSlug) || archetypeSlots > 0
      ? {
          pickSlug: archetypePick && !currentSlug && pickLevel === level,
          currentSlug,
          archetypes: (klass.archetypes ?? []).map((a) => ({
            slug: a.slug,
            name: a.name,
            description: a.description ?? '',
            // Só o que o nível que está sendo selado já alcança: a habilidade
            // de 5º nível não entra na escolha do 3º. A validação do selo usa
            // esta mesma lista, então o servidor também recusa as de cima.
            features: (a.features ?? [])
              .filter((f) => archetypeFeatureOpen(f, level))
              .map((f) => ({
                name: f.name,
                description: f.description ?? '',
              })),
          })),
          featureSlots: archetypeSlots,
          taken: snap.archetype?.features ?? [],
        }
      : null;

  // ── Talentos ──
  const schedule = talentScheduleOf(klass);
  const classTalentSlots = schedule.classOnly.filter((l) => l === level).length;
  const hasMilestone = schedule.general.includes(level);
  const talentOptions: IPlanTalent[] = [];
  if (classTalentSlots > 0 || hasMilestone) {
    const options = await getTalentOptions(String(klass._id));
    const taken = new Map<string, number>();
    for (const t of snap.talents) taken.set(t.key, (taken.get(t.key) ?? 0) + 1);
    for (const o of options) {
      const missing: string[] = [];
      if (requiredLevel(o.prerequisites, klass.name) > level) {
        missing.push(
          `${klass.name} ${requiredLevel(o.prerequisites, klass.name)}`
        );
      }
      if (!o.stackable && taken.has(o.key)) missing.push('já escolhido');
      talentOptions.push({
        stackable: !!o.stackable,
        key: o.key,
        name: o.name,
        scope: o.scope,
        description: o.description ?? '',
        prerequisites: o.prerequisites ?? '',
        ok: missing.length === 0,
        missing,
      });
    }
  }

  // ── Atributos ──
  const attributes = {} as ILevelPlan['attributes'];
  for (const key of ATTRIBUTE_KEYS) {
    const s = snap.playerStats[key];
    attributes[key] = {
      total: Number(s?.total ?? s?.base ?? 10),
      base: Number(s?.base ?? s?.total ?? 10),
    };
  }

  // ── Magias ──
  const slots = (row.spellSlots ?? []).map((n) => Number(n) || 0);
  const prevSlots = (prev?.spellSlots ?? []).map((n) => Number(n) || 0);
  const maxCircle = slots.reduce((m, n, i) => (n > 0 ? i + 1 : m), 0);
  const adds = spellAdds(slots, prevSlots);
  let options: IPlanSpell[] = [];
  let room = 0;
  let need = 0;
  if (adds.length > 0 && maxCircle > 0) {
    const refIds = snap.spellRefs.map((r) => r.spellId);
    const prepared = refIds.length
      ? await SpellModel.find({ _id: { $in: refIds } })
          .select('circle')
          .lean<{ circle: number }[]>()
      : [];
    // O limite de preparadas é o TOTAL de espaços, não um por círculo.
    const total = slots.reduce((sum, n) => sum + n, 0);
    room = Math.max(0, total - prepared.filter((s) => s.circle >= 1).length);
    const docs = await SpellModel.find({
      classIds: klass._id,
      circle: { $gte: 1, $lte: maxCircle },
      _id: { $nin: refIds },
    })
      .sort({ circle: 1, name: 1 })
      .lean<IPlanSpellDoc[]>();
    options = docs.map((d) => ({
      id: String(d._id),
      name: d.name,
      circle: d.circle,
      school: d.school ?? '',
      castingTime: d.castingTime ?? '',
      range: d.range ?? '',
      duration: d.duration ?? '',
      description: d.description ?? '',
    }));
    need = spellNeed({
      slotsNew: adds.reduce((sum, a) => sum + a.add, 0),
      room,
      available: options.length,
    });
  }

  // ── Truques ──
  // O nível ensina tantos quanto `cantripsKnown` cresceu, dentro do limite.
  const cantripsDelta = Math.max(
    0,
    (Number(row.cantripsKnown) || 0) - (Number(prev?.cantripsKnown) || 0)
  );
  let cantripOptions: IPlanSpell[] = [];
  let cantripCapacity = 0;
  let cantripNeed = 0;
  if (cantripsDelta > 0) {
    const refIds = snap.spellRefs.map((r) => r.spellId);
    const prepared = refIds.length
      ? await SpellModel.find({ _id: { $in: refIds }, circle: 0 })
          .select('_id')
          .lean()
      : [];
    cantripCapacity = Math.max(
      0,
      (Number(row.cantripsKnown) || 0) - prepared.length
    );
    const docs = await SpellModel.find({
      classIds: klass._id,
      circle: 0,
      _id: { $nin: refIds },
    })
      .sort({ name: 1 })
      .lean<IPlanSpellDoc[]>();
    cantripOptions = docs.map((d) => ({
      id: String(d._id),
      name: d.name,
      circle: 0,
      school: d.school ?? '',
      castingTime: d.castingTime ?? '',
      range: d.range ?? '',
      duration: d.duration ?? '',
      description: d.description ?? '',
    }));
    cantripNeed = Math.min(
      cantripsDelta,
      cantripCapacity,
      cantripOptions.length
    );
  }

  // ── Vida ──
  const spec = parseHitDie(klass.hpPerLevel, klass.hitDie);
  const stored = await HpRollModel.findOne({
    playerId: player._id,
    level,
  }).lean<{
    rollId: string;
    result: number;
    die: number;
    at: Date;
    byUsername: string;
  }>();

  return {
    level,
    earned: earnedLevel(snap.level, snap.pool),
    className: klass.name,
    playerName: String(player.name),
    proficiency: {
      from: prev?.proficiencyBonus ?? null,
      to: row.proficiencyBonus ?? null,
    },
    autoFeatures,
    featureChoices,
    archetype,
    classTalentSlots,
    milestone: hasMilestone
      ? {
          text:
            row.abilityScoreIncrease ||
            '+2 em um atributo ou +1 em dois atributos ou um Talento',
        }
      : null,
    talentOptions,
    attributes,
    spells: { slots, prevSlots, adds, maxCircle, need, room, options },
    cantrips: {
      need: cantripNeed,
      capacity: cantripCapacity,
      options: cantripOptions,
    },
    hp: {
      mode: spec ? 'dice' : 'manual',
      manualMax: Math.max(1, 12 + modifierOf(attributes.con.total)),
      die: spec?.die ?? null,
      fixed: spec?.fixed ?? null,
      formula: klass.hpPerLevel ?? '',
      conMod: modifierOf(attributes.con.total),
      current: hpValueOf(snap),
      roll: stored
        ? {
            rollId: stored.rollId,
            result: stored.result,
            die: stored.die,
            at: new Date(stored.at).toISOString(),
            byUsername: stored.byUsername,
          }
        : null,
    },
    sealed: snap.levelLocks.find((l) => l.level === level) ?? null,
  };
}

interface IPlanSpellDoc {
  _id: Types.ObjectId;
  name: string;
  circle: number;
  school?: string;
  castingTime?: string;
  range?: string;
  duration?: string;
  description?: string;
}

/** O nível da subida em andamento: o próximo do selado, se a XP já o alcançou. */
export async function getLevelPlan(playerId: string, actor: IActor) {
  assertLevelPermission(actor);
  const player = await loadPlayer(playerId);
  const snap = snapshotOf(player);
  const target = snap.level + 1;
  if (earnedLevel(snap.level, snap.pool) < target) {
    throw new LevelUpError('Ainda não há nível para subir.', 409);
  }
  return buildPlanFor(player, snap, await loadClass(player), target);
}

/** O plano de um nível já selado, sem o efeito dele (edição do admin). */
export async function getSealedPlan(
  playerId: string,
  level: number,
  actor: IActor
) {
  assertAdmin(actor);
  const player = await loadPlayer(playerId);
  const snap = snapshotOf(player);
  const lock = snap.levelLocks.find(
    (l) => l.level === level && l.status === 'sealed'
  );
  if (!lock) throw new LevelUpError('Este nível não está selado.', 404);
  return buildPlanFor(
    player,
    planSnapshotFor(snap, lock),
    await loadClass(player),
    level
  );
}

// ── Rolagem de vida ──────────────────────────────────────

/**
 * Rola o dado de vida NO SERVIDOR e grava na hora. Uma rolagem por (ficha,
 * nível): chamar de novo devolve a gravada, então recarregar a página ou
 * abrir duas abas não sorteia outra vez.
 */
export async function rollHp(playerId: string, actor: IActor) {
  assertLevelPermission(actor);
  const player = await loadPlayer(playerId);
  const snap = snapshotOf(player);
  const level = snap.level + 1;
  if (earnedLevel(snap.level, snap.pool) < level) {
    throw new LevelUpError('Ainda não há nível para subir.', 409);
  }
  const klass = await loadClass(player);
  const spec = parseHitDie(klass.hpPerLevel, klass.hitDie);
  if (!spec) throw new LevelUpError('Esta classe não tem dado de vida.', 409);

  const view = (r: {
    rollId: string;
    result: number;
    die: number;
    at: Date;
    byUsername: string;
  }) => ({
    rollId: r.rollId,
    result: r.result,
    die: r.die,
    at: new Date(r.at).toISOString(),
    byUsername: r.byUsername,
  });

  const existing = await HpRollModel.findOne({
    playerId: player._id,
    level,
  }).lean();
  if (existing) return { ...view(existing), alreadyRolled: true };

  // Garante o índice único (ficha, nível) antes do primeiro sorteio.
  await HpRollModel.init();
  try {
    const created = await HpRollModel.create({
      rollId: `rol-${randomUUID().slice(0, 8)}`,
      playerId: player._id,
      level,
      die: spec.die,
      // O sorteio vem do CSPRNG do servidor.
      result: rollDie(spec.die, () => randomInt(0, 1_000_000) / 1_000_000),
      byUsername: actor.username,
      byForumUserId: actor.forumUserId,
      at: new Date(),
    });
    return { ...view(created), alreadyRolled: false };
  } catch (error) {
    // Duas requisições ao mesmo tempo: a do índice único perdeu.
    if ((error as { code?: number }).code === 11000) {
      const winner = await HpRollModel.findOne({
        playerId: player._id,
        level,
      }).lean();
      if (winner) return { ...view(winner), alreadyRolled: true };
    }
    throw error;
  }
}

// ── Validação das escolhas ───────────────────────────────

export type CanonResult = { choices: ISealChoices } | { error: string };

/**
 * Valida o corpo contra o plano e devolve as escolhas CANÔNICAS: só os campos
 * validados, normalizados. É isto que `applyChoices` e `lock.choices` usam; o
 * corpo cru nunca chega lá.
 */
export function canonicalizeChoices(
  plan: ILevelPlan,
  raw: unknown,
  actor: Pick<IActor, 'isStaff'>
): CanonResult {
  if (!isRecord(raw)) return { error: 'Escolhas inválidas.' };
  const c = raw;
  const bad = (error: string): CanonResult => ({ error });

  // Característica: uma opção por concessão com escolha (nenhuma, sem elas).
  const features = asArray<unknown>(c.features);
  if (features.length !== plan.featureChoices.length) {
    return bad('Escolha uma característica em cada concessão do nível.');
  }
  for (let i = 0; i < features.length; i += 1) {
    if (
      typeof features[i] !== 'string' ||
      !plan.featureChoices[i].options.some((o) => o.name === features[i])
    ) {
      return bad(`Característica inválida: "${String(features[i])}".`);
    }
  }

  // Arquétipo.
  let archetypeSlug: string | undefined;
  let archetypeFeatures: string[] = [];
  if (plan.archetype) {
    const a = plan.archetype;
    let slug = a.currentSlug;
    if (a.pickSlug) {
      slug = typeof c.archetypeSlug === 'string' ? c.archetypeSlug : null;
      if (!slug || !a.archetypes.some((x) => x.slug === slug)) {
        return bad('Escolha o arquétipo.');
      }
      archetypeSlug = slug;
    }
    const chosen = a.archetypes.find((x) => x.slug === slug);
    const feats = asArray<unknown>(c.archetypeFeatures);
    const pool = (chosen?.features ?? []).filter(
      (f) => !a.taken.includes(f.name)
    );
    const want = Math.min(a.featureSlots, pool.length);
    if (feats.length !== want) {
      return bad(`Escolha ${want} habilidade(s) do arquétipo.`);
    }
    const seen = new Set<string>();
    for (const f of feats) {
      if (
        typeof f !== 'string' ||
        seen.has(f) ||
        !pool.some((x) => x.name === f)
      ) {
        return bad(`Habilidade de arquétipo inválida: "${String(f)}".`);
      }
      seen.add(f);
    }
    archetypeFeatures = feats as string[];
  } else if (c.archetypeSlug || asArray(c.archetypeFeatures).length > 0) {
    return bad('Este nível não escolhe arquétipo.');
  }

  // Talentos só da classe: únicos, salvo os que se repetem.
  const classKeys = asArray<unknown>(c.classTalentKeys);
  const classOptions = plan.talentOptions.filter(
    (t) => t.scope === 'class' && t.ok
  );
  const classWant = classOptions.length > 0 ? plan.classTalentSlots : 0;
  if (classKeys.length !== classWant) {
    return bad(`Escolha ${classWant} talento(s) da classe.`);
  }
  const seenTalents = new Set<string>();
  for (const key of classKeys) {
    const t = classOptions.find((x) => x.key === key);
    if (typeof key !== 'string' || !t)
      return bad('Talento da classe inválido.');
    if (seenTalents.has(key) && !t.stackable) return bad('Talento repetido.');
    seenTalents.add(key);
  }

  // Marco geral: atributos ou talento.
  let milestone: ISealChoices['milestone'];
  const m = c.milestone;
  if (plan.milestone) {
    if (!isRecord(m)) return bad('Use o marco: atributos ou um talento.');
    if (m.use === 'attribute') {
      const pts = isRecord(m.points) ? m.points : {};
      const points: Partial<Record<AttributeKey, number>> = {};
      let sum = 0;
      for (const [k, v] of Object.entries(pts)) {
        if (!ATTRIBUTE_KEYS.includes(k as AttributeKey)) {
          return bad('Atributo inválido.');
        }
        const n = Number(v);
        if (!Number.isInteger(n) || n < 0 || n > 2)
          return bad('Pontos inválidos.');
        if (n === 0) continue;
        sum += n;
        points[k as AttributeKey] = n;
        if (plan.attributes[k as AttributeKey].total + n > ATTRIBUTE_CAP) {
          return bad(`O teto de atributo é ${ATTRIBUTE_CAP}.`);
        }
      }
      if (sum !== 2) return bad('Distribua exatamente 2 pontos.');
      milestone = { use: 'attribute', points };
    } else if (m.use === 'talent') {
      const t = plan.talentOptions.find((x) => x.key === m.talentKey);
      if (!t || !t.ok) {
        return bad('Talento do marco inválido ou com requisito pendente.');
      }
      if ((classKeys as string[]).includes(t.key) && !t.stackable) {
        return bad('Talento repetido.');
      }
      milestone = { use: 'talent', talentKey: t.key };
    } else return bad('Use o marco: atributos ou um talento.');
  } else if (m) return bad('Este nível não tem marco de atributos.');

  // Magias e truques.
  const pickSpells = (
    rawIds: unknown,
    options: IPlanSpell[],
    need: number,
    room: number,
    label: string,
    verb: string
  ): string[] | string => {
    const ids = asArray<unknown>(rawIds);
    if (ids.length !== need) return `${verb} ${need} ${label} neste nível.`;
    if (ids.length > room) return `Não há espaço para ${label}.`;
    const used = new Set<string>();
    for (const id of ids) {
      const spell = options.find((s) => s.id === id);
      if (typeof id !== 'string' || !spell || used.has(id)) {
        return `${label[0].toUpperCase()}${label.slice(1)}: escolha inválida.`;
      }
      used.add(id);
    }
    return ids as string[];
  };
  const spellIds = pickSpells(
    c.spellIds,
    plan.spells.options,
    plan.spells.need,
    plan.spells.room,
    'magia(s)',
    'Prepare'
  );
  if (typeof spellIds === 'string') return bad(spellIds);
  const cantripIds = pickSpells(
    c.cantripIds,
    plan.cantrips.options,
    plan.cantrips.need,
    plan.cantrips.capacity,
    'truque(s)',
    'Escolha'
  );
  if (typeof cantripIds === 'string') return bad(cantripIds);

  // Vida.
  const hp: { mode?: unknown; manual?: unknown } = isRecord(c.hp) ? c.hp : {};
  let hpChoice: ISealChoices['hp'];
  if (plan.hp.mode === 'manual') {
    // Sem dado: o jogador informa só o GANHO do nível, dentro de um teto; o
    // admin não tem teto.
    const v = Number(hp.manual);
    const conMod = modifierOf(
      plan.attributes.con.total +
        (milestone?.use === 'attribute' ? (milestone.points.con ?? 0) : 0)
    );
    const max = actor.isStaff ? 100_000 : Math.max(1, 12 + conMod);
    if (hp.mode !== 'manual' || !Number.isInteger(v) || v < 1 || v > max) {
      return bad(
        actor.isStaff
          ? 'Informe a vida ganha neste nível.'
          : `Informe a vida ganha neste nível (de 1 a ${max}).`
      );
    }
    hpChoice = { mode: 'manual', manual: v };
  } else if (hp.mode === 'roll') {
    if (!plan.hp.roll) return bad('Role o dado de vida antes de selar.');
    hpChoice = { mode: 'roll' };
  } else if (hp.mode === 'fixed') {
    if (plan.hp.roll) {
      return bad('O dado deste nível já foi rolado: o resultado é definitivo.');
    }
    hpChoice = { mode: 'fixed' };
  } else return bad('Escolha entre valor fixo e rolagem.');

  return {
    choices: {
      features: features as string[],
      ...(archetypeSlug ? { archetypeSlug } : {}),
      archetypeFeatures,
      classTalentKeys: classKeys as string[],
      ...(milestone ? { milestone } : {}),
      spellIds,
      cantripIds,
      hp: hpChoice,
    },
  };
}

// ── Aplicar e desfazer um nível (puras, sobre o instantâneo) ──

/** Tira do instantâneo o que o selo do nível acrescentou. */
function undoLock(snap: ISnapshot, lock: ILevelLock): ISnapshot {
  const next: ISnapshot = {
    ...snap,
    combat: { ...snap.combat },
    talents: [...snap.talents],
    milestones: snap.milestones.filter((m) => m.level !== lock.level),
    spellRefs: snap.spellRefs.filter(
      (r) => !lock.undo.spellIds.includes(r.spellId)
    ),
    featureChoices: snap.featureChoices.filter((f) => f.level !== lock.level),
    levelLocks: snap.levelLocks.filter((l) => l.level !== lock.level),
    playerStats: { ...snap.playerStats },
    archetype: snap.archetype ? { ...snap.archetype } : null,
  };
  const hp = { ...(next.combat.hp as Doc | undefined) };
  hp.value = (Number(hp.value) || 0) - lock.hp.gain;
  next.combat.hp = hp;

  for (const key of lock.undo.talentKeys) {
    const at = next.talents.findIndex(
      (t) => t.key === key && t.level === lock.level
    );
    if (at >= 0) next.talents.splice(at, 1);
  }
  const points = lock.undo.attributePoints;
  if (Object.keys(points).length > 0) {
    const negative: Partial<Record<AttributeKey, number>> = {};
    for (const [k, v] of Object.entries(points))
      negative[k as AttributeKey] = -(v ?? 0);
    next.playerStats = addAttributePoints(next.playerStats, negative);
  }
  if (next.archetype) {
    next.archetype.features = (next.archetype.features ?? []).filter(
      (f) => !lock.undo.archetypeFeatures.includes(f)
    );
    if (lock.undo.archetypeSlugBefore === null) delete next.archetype.slug;
    else if (lock.undo.archetypeSlugBefore)
      next.archetype.slug = lock.undo.archetypeSlugBefore;
  }
  if (lock.undo.proficiencyBefore !== undefined) {
    next.proficiencyBonus = lock.undo.proficiencyBefore;
  }
  return next;
}

interface IApplied {
  snap: ISnapshot;
  lock: Omit<ILevelLock, 'sealedAt' | 'byUsername' | 'byForumUserId'>;
  novelties: INovelty[];
}

function applyChoices(
  snap: ISnapshot,
  plan: ILevelPlan,
  row: IClassLevel,
  choices: ISealChoices
): IApplied {
  const level = plan.level;
  const next: ISnapshot = {
    ...snap,
    combat: { ...snap.combat },
    talents: [...snap.talents],
    milestones: [...snap.milestones],
    spellRefs: [...snap.spellRefs],
    featureChoices: [...snap.featureChoices],
    archetype: snap.archetype ? { ...snap.archetype } : null,
  };
  const names: string[] = [];
  const novelties: INovelty[] = [];
  const now = new Date().toISOString();
  const novel = (key: string, section: INovelty['section'], label: string) =>
    novelties.push({ key, section, label, at: now });

  for (const f of plan.autoFeatures) {
    names.push(f.name);
    novel(`feat:${f.name}`, 'habilidades', f.name);
  }
  choices.features.forEach((name) => {
    next.featureChoices.push({ level, name });
    names.push(name);
    novel(`feat:${name}`, 'habilidades', name);
  });

  const undo: ILevelLock['undo'] = {
    proficiencyBefore: snap.proficiencyBonus,
    archetypeSlugBefore: snap.archetype?.slug ?? null,
    talentKeys: [],
    attributePoints: {},
    spellIds: [],
    archetypeFeatures: [],
  };

  if (plan.archetype) {
    const slug = plan.archetype.pickSlug
      ? choices.archetypeSlug!
      : plan.archetype.currentSlug!;
    const chosen = plan.archetype.archetypes.find((a) => a.slug === slug);
    next.archetype = {
      ...(next.archetype ?? {}),
      slug,
      features: [
        ...(next.archetype?.features ?? []),
        ...choices.archetypeFeatures,
      ],
    };
    undo.archetypeFeatures = [...choices.archetypeFeatures];
    if (plan.archetype.pickSlug && chosen) {
      names.push(chosen.name);
      novel(`arch:${slug}`, 'habilidades', chosen.name);
    }
    for (const f of choices.archetypeFeatures) {
      names.push(f);
      novel(`feat:${f}`, 'habilidades', f);
    }
  }

  const addTalent = (key: string) => {
    const t = plan.talentOptions.find((x) => x.key === key)!;
    next.talents.push({ key, level, name: t.name });
    undo.talentKeys.push(key);
    names.push(t.name);
    novel(`tal:${key}`, 'talentos', t.name);
  };
  choices.classTalentKeys.forEach(addTalent);

  let stats = snap.playerStats;
  if (plan.milestone && choices.milestone) {
    if (choices.milestone.use === 'talent') {
      addTalent(choices.milestone.talentKey);
      next.milestones = [
        ...next.milestones.filter((m) => m.level !== level),
        { level, use: 'talent' },
      ];
    } else {
      const points = Object.fromEntries(
        Object.entries(choices.milestone.points).filter(([, v]) => (v ?? 0) > 0)
      ) as Partial<Record<AttributeKey, number>>;
      stats = addAttributePoints(snap.playerStats, points);
      undo.attributePoints = points;
      next.milestones = [
        ...next.milestones.filter((m) => m.level !== level),
        { level, use: 'attribute' },
      ];
      names.push(
        Object.entries(points)
          .map(([k, v]) => `${ATTRIBUTE_LABELS[k as AttributeKey][0]} +${v}`)
          .join(', ')
      );
      novel('attr', 'status', 'atributos');
    }
  }
  next.playerStats = stats;

  for (const id of choices.spellIds) {
    next.spellRefs.push({ spellId: id, prepared: true });
    undo.spellIds.push(id);
    const s = plan.spells.options.find((x) => x.id === id)!;
    names.push(s.name);
    novel(`sp:${id}`, 'magias', s.name);
  }

  for (const id of choices.cantripIds ?? []) {
    next.spellRefs.push({ spellId: id, prepared: true });
    undo.spellIds.push(id);
    const s = plan.cantrips.options.find((x) => x.id === id)!;
    names.push(s.name);
    novel(`sp:${id}`, 'magias', s.name);
  }

  // Vida: a CON conta no valor FINAL deste nível (depois dos pontos), e só nele.
  const conMod = modifierOf(
    Number(
      (stats.con as { total?: number } | undefined)?.total ??
        plan.attributes.con.total
    )
  );
  const hpCurrent = hpValueOf(snap);
  let base = 0;
  let gain: number;
  const hp = { ...(next.combat.hp as Doc | undefined) };
  if (choices.hp.mode === 'manual') {
    // Sem dado, o valor informado é o GANHO do nível.
    gain = Number(choices.hp.manual);
    hp.value = hpCurrent + gain;
  } else {
    base = choices.hp.mode === 'roll' ? plan.hp.roll!.result : plan.hp.fixed!;
    gain = hpGainOf(base, conMod);
    hp.value = hpCurrent + gain;
  }
  next.combat.hp = hp;
  names.push(`${gain >= 0 ? '+' : '−'}${Math.abs(gain)} vida`);
  novel('hp', 'status', 'vida');
  novel('lvl', 'status', `nível ${level}`);

  if (typeof row.proficiencyBonus === 'number')
    next.proficiencyBonus = row.proficiencyBonus;
  next.level = level;

  return {
    snap: next,
    novelties,
    lock: {
      level,
      status: 'sealed',
      choices,
      summary: names.join(', '),
      hp: {
        mode: choices.hp.mode,
        gain,
        base,
        conMod,
        ...(choices.hp.mode === 'roll'
          ? { rollId: plan.hp.roll!.rollId, rolledAt: plan.hp.roll!.at }
          : {}),
      },
      undo,
    },
  };
}

/** O que gravar no documento a partir do instantâneo. */
function fieldsOf(snap: ISnapshot, extra: Doc = {}): Doc {
  return {
    level: snap.level,
    ...(snap.proficiencyBonus !== undefined
      ? { proficiencyBonus: snap.proficiencyBonus }
      : {}),
    experience: { current: snap.pool, nextLevel: xpToNext(snap.level) ?? 0 },
    combat: snap.combat,
    playerStats: snap.playerStats,
    talents: snap.talents,
    talentMilestones: snap.milestones,
    archetype: snap.archetype ?? undefined,
    'playerSpellcasting.spellRefs': snap.spellRefs,
    featureChoices: snap.featureChoices,
    levelLocks: snap.levelLocks,
    novelties: snap.novelties,
    ...extra,
  };
}

/**
 * Filtro de gravação: o documento tem de estar como foi lido (`updatedAt`) e no
 * mesmo nível selado. Qualquer concessão, edição ou selo no meio muda o
 * `updatedAt` e faz a gravação não casar (409), em vez de sobrescrever a XP.
 */
const guardOf = (player: IPlayerDoc, snap: ISnapshot) => ({
  _id: player._id,
  level: snap.level,
  ...(snap.updatedAt ? { updatedAt: snap.updatedAt } : {}),
});

/**
 * O histórico e a ficha são dois documentos e não há transação aqui (o plano
 * do Atlas pode não ter). Então o evento é gravado PRIMEIRO e, se a escrita da
 * ficha falhar ou não casar, é desfeito: nunca fica um selo ou uma concessão
 * no histórico sem ter acontecido. O oposto (ficha mudada sem registro) não
 * pode ocorrer, porque a ficha só é escrita depois do evento existir.
 */
async function withEvent<T>(
  playerId: Types.ObjectId,
  kind: PlayerEventKind,
  actor: IActor,
  data: Partial<IPlayerEvent> & { reason: string },
  write: () => Promise<T | null>,
  after?: (result: T) => Partial<IPlayerEvent>
): Promise<T> {
  const event = await PlayerEventModel.create({
    playerId,
    kind,
    byUsername: actor.username,
    byForumUserId: actor.forumUserId,
    at: new Date(),
    ...data,
  });
  try {
    const result = await write();
    if (result === null) {
      await PlayerEventModel.deleteOne({ _id: event._id });
      throw new LevelUpError('A ficha mudou. Recarregue e tente de novo.', 409);
    }
    if (after) {
      await PlayerEventModel.updateOne(
        { _id: event._id },
        { $set: after(result) }
      );
    }
    return result;
  } catch (error) {
    await PlayerEventModel.deleteOne({ _id: event._id });
    throw error;
  }
}

/** O instantâneo de um nível selado sem o efeito dele, para planejar a edição. */
function planSnapshotFor(snap: ISnapshot, lock: ILevelLock): ISnapshot {
  const undone = undoLock(snap, lock);
  // As magias dos selos POSTERIORES saem só do plano, para o limite de cada
  // círculo ser o do nível editado; continuam na ficha.
  const later = snap.levelLocks
    .filter((l) => l.level > lock.level && l.status === 'sealed')
    .flatMap((l) => l.undo.spellIds);
  return {
    ...undone,
    spellRefs: undone.spellRefs.filter((r) => !later.includes(r.spellId)),
  };
}

/** Valida magias contra os limites de sempre antes de gravar. */
async function assertWritable(
  player: IPlayerDoc,
  snap: ISnapshot,
  before: ISnapshot
) {
  try {
    await assertSpellLimits({
      classId: player.classId,
      level: snap.level,
      nextRefs: snap.spellRefs,
      storedRefs: before.spellRefs,
    });
  } catch (error) {
    throw new LevelUpError(
      error instanceof Error ? error.message : 'Magias inválidas.'
    );
  }
}

// ── Selar, reabrir e editar ──────────────────────────────

/**
 * Sela o próximo nível. O servidor refaz o plano, valida as escolhas contra
 * ele e grava tudo num só `$set`, filtrando pelo nível anterior: quem selar
 * duas vezes ou em duas abas recebe 409 na segunda.
 */
export async function sealLevel(
  playerId: string,
  choices: unknown,
  actor: IActor
) {
  assertLevelPermission(actor);
  const player = await loadPlayer(playerId);
  const snap = snapshotOf(player);
  const level = snap.level + 1;
  if (earnedLevel(snap.level, snap.pool) < level || level > MAX_LEVEL) {
    throw new LevelUpError('Não há XP para este nível.', 409);
  }
  const klass = await loadClass(player);
  const plan = await buildPlanFor(player, snap, klass, level);
  const canon = canonicalizeChoices(plan, choices, actor);
  if ('error' in canon) throw new LevelUpError(canon.error);

  const applied = applyChoices(snap, plan, rowOf(klass, level)!, canon.choices);
  const lock: ILevelLock = {
    ...applied.lock,
    sealedAt: new Date().toISOString(),
    byUsername: actor.username,
    byForumUserId: actor.forumUserId,
  };
  const next = applied.snap;
  // Selar consome o limiar: a XP passa a contar do início do nível novo.
  next.pool = snap.pool - (xpToNext(snap.level) ?? 0);
  next.levelLocks = [...snap.levelLocks.filter((l) => l.level !== level), lock];
  next.novelties = [
    ...snap.novelties.filter(
      (n) => !applied.novelties.some((x) => x.key === n.key)
    ),
    ...applied.novelties,
  ];
  await assertWritable(player, next, snap);

  const saved = await withEvent(
    player._id,
    'seal',
    actor,
    {
      level,
      reason: `Nível ${level} selado: ${lock.summary}${
        lock.hp.mode === 'manual' ? ' (vida informada pelo jogador)' : ''
      }`,
    },
    () =>
      PlayerModel.findOneAndUpdate(
        guardOf(player, snap),
        { $set: fieldsOf(next) },
        { returnDocument: 'after' }
      ).lean<IPlayerDoc>()
  );
  return {
    level,
    earned: earnedLevel(levelOf(saved), poolOf(saved)),
    summary: lock.summary,
    hpGain: lock.hp.gain,
  };
}

/**
 * Reabre o último nível selado (admin, com motivo): desfaz os efeitos, volta
 * o nível selado para o anterior e devolve a XP ao pool. A rolagem de vida
 * fica gravada e vale de novo no próximo selo.
 */
export async function reopenLevel(
  playerId: string,
  level: number,
  reason: string,
  actor: IActor
) {
  assertAdmin(actor);
  const why = String(reason ?? '')
    .trim()
    .slice(0, 300);
  if (!why) throw new LevelUpError('Escreva o motivo da reabertura.');
  const player = await loadPlayer(playerId);
  const snap = snapshotOf(player);
  const lock = snap.levelLocks.find(
    (l) => l.level === level && l.status === 'sealed'
  );
  if (!lock) throw new LevelUpError('Este nível não está selado.', 404);
  if (level !== snap.level) {
    throw new LevelUpError(
      'Só o último nível selado pode ser reaberto. Para os anteriores, edite as escolhas.',
      409
    );
  }
  const undone = undoLock(snap, lock);
  undone.level = level - 1;
  undone.pool = snap.pool + (xpToNext(level - 1) ?? 0);
  undone.levelLocks = [
    ...undone.levelLocks,
    {
      ...lock,
      status: 'reopened',
      reopened: {
        byUsername: actor.username,
        at: new Date().toISOString(),
        reason: why,
      },
    },
  ];
  const saved = await withEvent(
    player._id,
    'reopen',
    actor,
    { level, reason: `Nível ${level} reaberto: ${why}` },
    () =>
      PlayerModel.findOneAndUpdate(
        guardOf(player, snap),
        { $set: fieldsOf(undone) },
        { returnDocument: 'after' }
      ).lean<IPlayerDoc>()
  );
  return { level: levelOf(saved) };
}

/** O admin troca as escolhas de um nível já selado, no lugar. */
export async function editSealedLevel(
  playerId: string,
  level: number,
  choices: unknown,
  reason: string,
  actor: IActor
) {
  assertAdmin(actor);
  const why = String(reason ?? '')
    .trim()
    .slice(0, 300);
  if (!why) throw new LevelUpError('Escreva o motivo da edição.');
  const player = await loadPlayer(playerId);
  const snap = snapshotOf(player);
  const lock = snap.levelLocks.find(
    (l) => l.level === level && l.status === 'sealed'
  );
  if (!lock) throw new LevelUpError('Este nível não está selado.', 404);
  const klass = await loadClass(player);
  const undone = undoLock(snap, lock);
  const plan = await buildPlanFor(
    player,
    planSnapshotFor(snap, lock),
    klass,
    level
  );
  const canon = canonicalizeChoices(plan, choices, actor);
  if ('error' in canon) throw new LevelUpError(canon.error);

  const applied = applyChoices(
    undone,
    plan,
    rowOf(klass, level)!,
    canon.choices
  );
  const next = applied.snap;
  // Editar um nível não muda o nível selado nem a proficiência de HOJE: o
  // `applyChoices` põe a do nível editado, e o `undoLock` a de antes dele.
  next.level = snap.level;
  next.pool = snap.pool;
  next.proficiencyBonus = snap.proficiencyBonus;
  const edited: ILevelLock = {
    ...applied.lock,
    sealedAt: lock.sealedAt,
    byUsername: lock.byUsername,
    byForumUserId: lock.byForumUserId,
    editedBy: { byUsername: actor.username, at: new Date().toISOString() },
  };
  next.levelLocks = [...undone.levelLocks, edited].sort(
    (a, b) => a.level - b.level
  );
  await assertWritable(player, next, snap);

  await withEvent(
    player._id,
    'edit',
    actor,
    { level, reason: `Escolhas do nível ${level} editadas: ${why}` },
    () =>
      PlayerModel.findOneAndUpdate(
        guardOf(player, snap),
        { $set: fieldsOf(next) },
        { returnDocument: 'after' }
      ).lean<IPlayerDoc>()
  );
  return { level };
}

/** O dono abriu uma seção: as novidades dela deixam de aparecer. */
export async function markSeen(
  playerId: string,
  section: string,
  actor: IActor
) {
  assertLevelPermission(actor);
  if (!actor.isOwner) return { cleared: 0 };
  const player = await loadPlayer(playerId, { allowCreation: true });
  const novelties = asArray<INovelty>(player.novelties);
  const kept = novelties.filter((n) => n.section !== section);
  if (kept.length === novelties.length) return { cleared: 0 };
  await PlayerModel.updateOne(
    { _id: player._id },
    { $set: { novelties: kept } }
  );
  return { cleared: novelties.length - kept.length };
}
