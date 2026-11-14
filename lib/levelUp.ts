// Tipos e regras PURAS da subida de nível: o servidor valida com elas e a tela
// de subida usa os mesmos tipos. Sem banco, sem React.

import { modifierOf, type AttributeKey } from './stats';

export const ATTRIBUTE_KEYS: readonly AttributeKey[] = [
  'str',
  'dex',
  'con',
  'int',
  'wis',
  'cha',
];

/** Rótulos de tela dos atributos, na ordem da ficha. */
export const ATTRIBUTE_LABELS: Record<AttributeKey, [string, string]> = {
  str: ['FOR', 'Força'],
  dex: ['DES', 'Destreza'],
  con: ['CON', 'Constituição'],
  int: ['INT', 'Inteligência'],
  wis: ['SAB', 'Sabedoria'],
  cha: ['CAR', 'Carisma'],
};

export const ATTRIBUTE_CAP = 20;
export const NOVELTY_DAYS = 7;

// ── O que a ficha guarda ─────────────────────────────────

export type HpMode = 'fixed' | 'roll' | 'manual';

/** As escolhas de um nível, como o dono as manda e como ficam seladas. */
export interface ISealChoices {
  /** Uma opção por concessão com escolha, na ordem do plano. */
  features: string[];
  archetypeSlug?: string;
  archetypeFeatures: string[];
  /** Um por vaga de talento só da classe neste nível. */
  classTalentKeys: string[];
  milestone?:
    | { use: 'attribute'; points: Partial<Record<AttributeKey, number>> }
    | { use: 'talent'; talentKey: string };
  spellIds: string[];
  /** Itens das listas de escolha da classe (opcional: selos antigos não têm). */
  catalogPicks?: { catalog: string; item: string }[];
  /** Truques novos do nível (opcional: selos antigos não têm). */
  cantripIds?: string[];
  hp: { mode: HpMode; manual?: number };
}

export interface ILevelLock {
  level: number;
  status: 'sealed' | 'reopened';
  sealedAt: string;
  byUsername: string;
  byForumUserId: number;
  choices: ISealChoices;
  /** Os nomes dos itens escolhidos, para o marco ler sem catálogo. */
  summary: string;
  hp: {
    mode: HpMode;
    /** Vida somada neste nível; em `manual`, a diferença para a anterior. */
    gain: number;
    base: number;
    conMod: number;
    rollId?: string;
    rolledAt?: string;
  };
  /** O que o selo mudou, para a reabertura poder desfazer exatamente isso. */
  undo: {
    proficiencyBefore?: number;
    archetypeSlugBefore?: string | null;
    talentKeys: string[];
    attributePoints: Partial<Record<AttributeKey, number>>;
    spellIds: string[];
    archetypeFeatures: string[];
  };
  reopened?: {
    byUsername: string;
    at: string;
    reason: string;
  };
  editedBy?: { byUsername: string; at: string };
}

export interface IFeatureChoiceRecord {
  level: number;
  name: string;
}

export interface INovelty {
  key: string;
  section: 'status' | 'talentos' | 'magias' | 'cronica' | 'habilidades';
  label: string;
  at: string;
}

// ── O plano de um nível ──────────────────────────────────

export interface IPlanOption {
  name: string;
  description: string;
  requiresPrerequisite?: boolean;
}

export interface IPlanTalent {
  key: string;
  name: string;
  scope: 'general' | 'class';
  description: string;
  prerequisites: string;
  ok: boolean;
  missing: string[];
  stackable: boolean;
}

export interface IPlanSpell {
  id: string;
  name: string;
  circle: number;
  school: string;
  castingTime: string;
  range: string;
  duration: string;
  description: string;
}

export interface IPlanCatalog {
  slug: string;
  name: string;
  description: string;
  need: number;
  options: IPlanOption[];
  /** Só vale para quem tem este arquétipo (slug). */
  requiresArchetype?: string;
  /** A lista aceita um item de texto livre com este rótulo. */
  freeTextLabel?: string;
  /** O que a ficha já escolheu nesta lista (os de texto livre não se repetem). */
  taken: string[];
}

export interface ILevelPlan {
  level: number;
  /** Nível alcançado por XP (o plano é do `level` selado + 1). */
  earned: number;
  className: string;
  playerName: string;
  proficiency: { from: number | null; to: number | null };
  autoFeatures: IPlanOption[];
  featureChoices: { raw: string; options: IPlanOption[] }[];
  archetype: null | {
    pickSlug: boolean;
    currentSlug: string | null;
    archetypes: {
      slug: string;
      name: string;
      description: string;
      features: IPlanOption[];
    }[];
    featureSlots: number;
    taken: string[];
  };
  classTalentSlots: number;
  /** O arquétipo que a ficha já tem (as listas podem exigir um). */
  archetypeSlug: string | null;
  /**
   * As listas de escolha da classe com escolhas neste nível ("Técnicas de
   * Investida"): `need` itens, fora os já escolhidos antes.
   */
  catalogPicks: IPlanCatalog[];
  milestone: { text: string } | null;
  talentOptions: IPlanTalent[];
  attributes: Record<AttributeKey, { total: number; base: number }>;
  spells: {
    slots: number[];
    prevSlots: number[];
    adds: { circle: number; add: number }[];
    maxCircle: number;
    need: number;
    /**
     * Quantas magias ainda cabem entre as PREPARADAS: o limite é o total de
     * espaços de todos os círculos, não um por círculo.
     */
    room: number;
    options: IPlanSpell[];
  };
  cantrips: {
    /** Quantos truques o nível ensina (aumento de `cantripsKnown`). */
    need: number;
    /** Quantos ainda cabem no limite da classe. */
    capacity: number;
    options: IPlanSpell[];
  };
  hp: {
    mode: 'dice' | 'manual';
    /** Sem dado: o teto do ganho que o dono pode informar (o admin não tem). */
    manualMax: number;
    die: number | null;
    fixed: number | null;
    formula: string;
    conMod: number;
    current: number;
    roll: null | {
      rollId: string;
      result: number;
      die: number;
      at: string;
      byUsername: string;
    };
  };
  /** Escolhas gravadas do nível, quando ele já foi selado (edição do admin). */
  sealed: ILevelLock | null;
}

// ── Contas puras ─────────────────────────────────────────

/**
 * Lê o dado de vida da classe. `hpPerLevel` tem várias grafias no códice
 * ("1d8 (ou 5)", "1d10(ou 6)", "1d12 (ou 8 )", "d6"), então o dado e o valor
 * fixo saem por padrão. Sem valor fixo escrito, vale a média arredondada para
 * cima (d8 → 5). Sem dado, `null`: a ficha pede a "Vida máxima" à mão.
 */
export function parseHitDie(
  hpPerLevel?: string,
  hitDie?: string
): { die: number; fixed: number } | null {
  const text = `${hpPerLevel ?? ''} ${hitDie ?? ''}`;
  const die = text.match(/\bd(\d{1,3})\b|\d+\s*d(\d{1,3})\b/i);
  const sides = Number(die?.[1] ?? die?.[2]);
  if (!Number.isFinite(sides) || sides < 2) return null;
  const fixed = hpPerLevel?.match(/\(\s*ou\s*(\d+)/i)?.[1];
  return {
    die: sides,
    fixed: fixed ? Number(fixed) : Math.floor(sides / 2) + 1,
  };
}

/** Os ganhos de espaços de um nível sobre o anterior, por círculo. */
export function spellAdds(
  slots: number[],
  prevSlots: number[]
): { circle: number; add: number }[] {
  const adds: { circle: number; add: number }[] = [];
  slots.forEach((n, i) => {
    const add = n - (prevSlots[i] ?? 0);
    if (add > 0) adds.push({ circle: i + 1, add });
  });
  return adds;
}

/**
 * Quantas magias o nível deixa PREPARAR: uma por espaço novo, limitada pelo que
 * ainda cabe no total de espaços e pelo que há no grimório. Todas as magias da
 * classe até o maior círculo já são conhecidas; preparar é que tem limite.
 * Magia faltando deixa a vaga aberta e não trava o selo.
 */
export function spellNeed(args: {
  slotsNew: number;
  room: number;
  available: number;
}): number {
  return Math.max(0, Math.min(args.slotsNew, args.room, args.available));
}

export interface IAttributeState {
  base: number;
  raceBonus?: number;
  classBonus?: number;
  total: number;
  modifier: number;
}

/** Soma pontos ao valor base e refaz total e modificador. */
export function addAttributePoints(
  stats: Record<string, Partial<IAttributeState> | undefined>,
  points: Partial<Record<AttributeKey, number>>
): Record<string, IAttributeState> {
  const out: Record<string, IAttributeState> = {};
  for (const key of ATTRIBUTE_KEYS) {
    const cur = stats[key] ?? {};
    const base = Number(cur.base ?? cur.total ?? 10);
    const raceBonus = Number(cur.raceBonus) || 0;
    const classBonus = Number(cur.classBonus) || 0;
    const nextBase = base + (points[key] ?? 0);
    const total = nextBase + raceBonus + classBonus;
    out[key] = {
      base: nextBase,
      raceBonus,
      classBonus,
      total,
      modifier: modifierOf(total),
    };
  }
  return out;
}

/** O ganho de vida do nível: dado (ou fixo) + CON deste nível, no mínimo 1. */
export const hpGainOf = (base: number, conMod: number) =>
  Math.max(1, base + conMod);

/** A rolagem de um dado de `sides` faces. `random` injetável para teste. */
export const rollDie = (sides: number, random: () => number = Math.random) =>
  1 + Math.floor(random() * sides);

/** A novidade ainda vale? Some depois de 7 dias. */
export const noveltyActive = (n: INovelty, now: number = Date.now()) =>
  now - new Date(n.at).getTime() < NOVELTY_DAYS * 24 * 3600 * 1000;
