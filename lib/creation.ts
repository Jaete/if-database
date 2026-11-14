// Regras PURAS da criação de ficha (nível 1): compra de pontos, arranjo padrão,
// rolagem 4d6, vida inicial, perícias, gil inicial, conjuração e o que falta
// para enviar. O servidor valida com elas e a tela usa as mesmas funções.
// Sem banco, sem React.

import { modifierOf, spellSaveDC, type AttributeKey } from './stats';
import {
  type IGrantTotals,
  checkRacialPicks,
  effectiveSubrace,
  raceBonus,
  resolveBonus,
  subraceIssue,
  type IRaceRulesInput,
} from './raceRules';

export const ATTRIBUTES: readonly AttributeKey[] = [
  'str',
  'dex',
  'con',
  'int',
  'wis',
  'cha',
];

export type AttributeMethod = 'pointBuy' | 'standardArray' | 'roll';
export type PlayerStatus =
  'blank' | 'draft' | 'submitted' | 'returned' | 'approved';

export type Base = Partial<Record<AttributeKey, number>>;

// ── Atributos ────────────────────────────────────────────

export const POINT_BUY_BUDGET = 27;
export const POINT_BUY_MIN = 8;
export const POINT_BUY_MAX = 15;
const COST: Record<number, number> = {
  8: 0,
  9: 1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 7,
  15: 9,
};

/** Custo em pontos de um valor da compra; `null` fora de 8 a 15. */
export const pointCost = (value: number): number | null =>
  Number.isInteger(value) && value in COST ? COST[value] : null;

/** Pontos gastos; valor fora da faixa devolve `null`. */
export function pointsSpent(base: Base): number | null {
  let sum = 0;
  for (const key of ATTRIBUTES) {
    const cost = pointCost(base[key] ?? POINT_BUY_MIN);
    if (cost === null) return null;
    sum += cost;
  }
  return sum;
}

export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8] as const;

const sameMultiset = (a: number[], b: readonly number[]) =>
  a.length === b.length &&
  [...a]
    .sort((x, y) => x - y)
    .every((v, i) => v === [...b].sort((x, y) => x - y)[i]);

export interface IBaseCheck {
  ok: boolean;
  /** Tudo atribuído e nas regras do método. */
  complete: boolean;
  message?: string;
}

/**
 * Confere os valores base contra o método. Rascunho parcial é válido (a ficha
 * salva aos poucos); `complete` diz se dá para enviar.
 *
 * `rollSums` são os seis totais gravados no servidor: com `roll`, os valores
 * atribuídos só podem ser esses, cada um tantas vezes quanto saiu.
 */
export function checkBase(
  method: AttributeMethod | undefined,
  base: Base,
  rollSums?: readonly number[]
): IBaseCheck {
  if (!method) return { ok: true, complete: false };
  const given = ATTRIBUTES.filter((k) => base[k] !== undefined);
  if (given.some((k) => !Number.isInteger(base[k]))) {
    return { ok: false, complete: false, message: 'Valor inválido.' };
  }
  if (method === 'pointBuy') {
    const spent = pointsSpent(base);
    if (spent === null) {
      return {
        ok: false,
        complete: false,
        message: `Cada atributo vai de ${POINT_BUY_MIN} a ${POINT_BUY_MAX}.`,
      };
    }
    if (spent > POINT_BUY_BUDGET) {
      return {
        ok: false,
        complete: false,
        message: `Passou dos ${POINT_BUY_BUDGET} pontos.`,
      };
    }
    return {
      ok: true,
      complete: given.length === 6 && spent === POINT_BUY_BUDGET,
    };
  }
  const pool = method === 'roll' ? (rollSums ?? []) : STANDARD_ARRAY;
  if (method === 'roll' && pool.length !== 6) {
    return { ok: false, complete: false, message: 'Nada foi rolado ainda.' };
  }
  const values = given.map((k) => base[k] as number);
  const left = [...pool];
  for (const v of values) {
    const at = left.indexOf(v);
    if (at < 0) {
      return {
        ok: false,
        complete: false,
        message:
          method === 'roll'
            ? 'Só valem os seis totais rolados, cada um uma vez.'
            : 'Só valem 15, 14, 13, 12, 10 e 8, cada um uma vez.',
      };
    }
    left.splice(at, 1);
  }
  return {
    ok: true,
    complete: given.length === 6 && sameMultiset(values, pool),
  };
}

export type Rng = () => number;

const die = (sides: number, rand: Rng) => 1 + Math.floor(rand() * sides);

/** Seis linhas de 4d6 em ordem de rolagem, e o total (sem o menor) de cada. */
export function rollAttributeSets(rand: Rng): {
  sets: number[][];
  sums: number[];
} {
  const sets = Array.from({ length: 6 }, () =>
    Array.from({ length: 4 }, () => die(6, rand))
  );
  return { sets, sums: sets.map(dropLowestSum) };
}

export const dropLowestSum = (dice: number[]) =>
  dice.reduce((a, b) => a + b, 0) - Math.min(...dice);

/** Um dado do conjunto é o descartado (o primeiro menor), para riscar na tela. */
export const droppedIndex = (dice: number[]) => dice.indexOf(Math.min(...dice));

/** Os seis valores, da maior para a menor (as "pedras" da tela). */
export const sortedDesc = (values: readonly number[]) =>
  [...values].sort((a, b) => b - a);

// ── Totais ───────────────────────────────────────────────

export interface IAttrLine {
  base: number;
  race: number;
  total: number;
  mod: number;
}

export function attributeTotals(
  base: Base,
  race: IRaceRulesInput | undefined,
  subrace: string | undefined,
  picks: readonly string[],
  dominant?: IRaceRulesInput
): Record<AttributeKey, IAttrLine> {
  const bonus = resolveBonus(raceBonus(race, subrace, dominant), picks);
  const out = {} as Record<AttributeKey, IAttrLine>;
  for (const key of ATTRIBUTES) {
    const b = base[key] ?? 0;
    const total = b + bonus[key];
    out[key] = { base: b, race: bonus[key], total, mod: modifierOf(total) };
  }
  return out;
}

// ── Vida do nível 1 ──────────────────────────────────────

/**
 * Regra geral de D&D, por decisão da mesa: no 1º nível a vida é o MÁXIMO do
 * dado de vida mais o modificador de CON final (com raça). Mínimo 1. O texto
 * `hpAtFirstLevel` da classe é só informativo.
 */
export const level1Hp = (hitDie: number, conTotal: number): number =>
  Math.max(1, hitDie + modifierOf(conTotal));

// ── Conjuração ───────────────────────────────────────────

/**
 * CD das magias e bônus de ataque saem da CLASSE (atributo de conjuração +
 * proficiência), por decisão da mesa. Os CDs que alguns textos de magia trazem
 * ficam superados pelo da classe até as magias serem revistas.
 */
export function castingNumbers(abilityTotal: number, proficiency: number) {
  const mod = modifierOf(abilityTotal);
  return {
    saveDC: spellSaveDC(mod, proficiency),
    attackBonus: mod + proficiency,
  };
}

/**
 * "Sugerir pela classe": a ordem dos atributos do mais importante ao menos.
 * Conjuração primeiro, depois as resistências da classe, depois CON e DES.
 */
export function suggestOrder(
  castingAbility: AttributeKey | undefined,
  savingThrows: readonly AttributeKey[]
): AttributeKey[] {
  const order: AttributeKey[] = [];
  const push = (key?: AttributeKey) => {
    if (key && !order.includes(key)) order.push(key);
  };
  push(castingAbility);
  savingThrows.forEach(push);
  push('con');
  push('dex');
  ATTRIBUTES.forEach(push);
  return order;
}

// ── Perícias ─────────────────────────────────────────────

const fold = (text: string) =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

const NUMBERS: Record<string, number> = {
  uma: 1,
  um: 1,
  duas: 2,
  dois: 2,
  tres: 3,
  quatro: 4,
  cinco: 5,
  seis: 6,
};

/** Os nomes da ficha; o texto das classes usa sinônimos e erros de grafia. */
const SKILL_ALIASES: Record<string, string> = {
  arcana: 'Arcanismo',
  arcanismo: 'Arcanismo',
  intimidar: 'Intimidação',
  intimidacao: 'Intimidação',
  performance: 'Atuação',
  atuacao: 'Atuação',
  'adestrar animais': 'Lidar com Animais',
  'lidar com animais': 'Lidar com Animais',
};

export interface ISkillChoice {
  /** Quantas escolher; `null` = frase ausente (escolha livre). */
  n: number | null;
  list: string[];
}

/**
 * "Escolha três entre Acrobacia, Atletismo e Furtividade" → `{ n: 3, list }`.
 * Sem a frase, `{ n: null, list: [] }` e a dona escolhe à vontade.
 */
export function parseSkillChoice(text?: string | null): ISkillChoice {
  const raw = (text ?? '').trim();
  if (!raw) return { n: null, list: [] };
  const m =
    /escolha\s+(uma?|duas?|dois|tr[eê]s|quatro|cinco|seis|\d+)\s+(?:entre|dentre|d[ao]s?)?\s*:?\s*(.*)$/i.exec(
      raw
    );
  if (!m) return { n: null, list: [] };
  const n = NUMBERS[fold(m[1])] ?? (Number(m[1]) || null);
  const list = m[2]
    .replace(/[.]+$/g, '')
    .split(/,|\be\b/i)
    .map((s) => s.trim().replace(/^e\s+/i, ''))
    .filter(Boolean)
    .map(
      (s) => SKILL_ALIASES[fold(s)] ?? s.replace(/^./, (c) => c.toUpperCase())
    );
  return { n, list: [...new Set(list)] };
}

// ── Gil inicial ──────────────────────────────────────────

export interface IGilFormula {
  count: number;
  sides: number;
  mult: number;
  add: number;
}

/** "4d6 × 10", "1d100", "2d100 + 50", "10d6". */
export function parseGilFormula(text?: string | null): IGilFormula | null {
  const m =
    /^\s*(\d+)\s*d\s*(\d+)\s*(?:[×x*]\s*(\d+))?\s*(?:\+\s*(\d+))?\s*(?:gil)?\s*$/i.exec(
      text ?? ''
    );
  if (!m) return null;
  const count = Number(m[1]);
  const sides = Number(m[2]);
  if (count < 1 || count > 50 || sides < 2 || sides > 1000) return null;
  return { count, sides, mult: Number(m[3] ?? 1), add: Number(m[4] ?? 0) };
}

export function gilOf(formula: IGilFormula, dice: number[]): number {
  return dice.reduce((a, b) => a + b, 0) * formula.mult + formula.add;
}

export function rollGil(formula: IGilFormula, rand: Rng) {
  const dice = Array.from({ length: formula.count }, () =>
    die(formula.sides, rand)
  );
  return { dice, total: gilOf(formula, dice) };
}

// ── O que falta para enviar ──────────────────────────────

export type CreationStep =
  | 'identidade'
  | 'raca'
  | 'classe'
  | 'atributos'
  | 'nivel1'
  | 'pericias'
  | 'magias'
  | 'equipamento'
  | 'historia';

export type WizardStepId = CreationStep | 'revisao';

export interface IIssue {
  step: CreationStep;
  kind: 'required' | 'recommended';
  message: string;
}

export interface ICreationInput {
  name?: string;
  race?: IRaceRulesInput;
  raceChoice?: {
    subrace?: string;
    parents?: string[];
    dominantParent?: string;
    hybridTraits?: unknown[];
  };
  /** O Mestiço pede origens, sangue forte e herança. */
  mixedNeeds?: { parents: number; hybrid: number };
  /** A raça dominante do Mestiço (Sangue Forte): dela vem o bônus de atributo. */
  dominantRace?: IRaceRulesInput;
  /** O que a raça concede na criação, e o que a dona escolheu. */
  grantTotals?: IGrantTotals;
  grants?: ICreationGrantPicks;
  klass?: {
    skills: ISkillChoice;
    /** Concessões do nível 1 que são escolha (uma opção por concessão). */
    featureChoiceCount: number;
    cantripsKnown: number;
    preparedLimit: number;
    caster: boolean;
  };
  method?: AttributeMethod;
  base: Base;
  rollSums?: readonly number[];
  racialPicks: string[];
  featureChoices: string[];
  /** As perícias da CLASSE escolhidas (as raciais ficam em `grants`). */
  skills: string[];
  /** Truques e magias preparadas escolhidos. */
  cantrips: number;
  prepared: number;
  soft: {
    equipment?: boolean;
    history?: boolean;
    portrait?: boolean;
    extraLanguage?: boolean;
  };
}

/** Os mesmos critérios no cliente e no servidor. */
export function creationIssues(input: ICreationInput): IIssue[] {
  const out: IIssue[] = [];
  const need = (step: CreationStep, message: string) =>
    out.push({ step, kind: 'required', message });
  const soft = (step: CreationStep, message: string) =>
    out.push({ step, kind: 'recommended', message });

  if (!input.name?.trim()) need('identidade', 'Falta o nome do personagem.');

  const race = input.race;
  if (!race) need('raca', 'Falta escolher a raça.');
  else {
    const mixed = (race.choiceRules?.length ?? 0) > 0;
    if (mixed) {
      const parents = input.raceChoice?.parents?.length ?? 0;
      if (parents < (input.mixedNeeds?.parents ?? 2)) {
        need('raca', 'Falta escolher as duas origens do Mestiço.');
      } else if (!input.raceChoice?.dominantParent) {
        need('raca', 'Falta escolher o sangue forte.');
      } else if (
        (input.raceChoice?.hybridTraits?.length ?? 0) <
        (input.mixedNeeds?.hybrid ?? 2)
      ) {
        need('raca', 'Falta escolher a herança híbrida.');
      }
    } else {
      const issue = subraceIssue(race, input.raceChoice?.subrace);
      if (issue) need('raca', issue);
    }
    const sub = effectiveSubrace(race, input.raceChoice?.subrace);
    const picks = checkRacialPicks(
      raceBonus(race, sub, input.dominantRace),
      input.racialPicks
    );
    if (!picks.ok || !picks.complete) {
      need(
        'atributos',
        picks.message ?? 'Faltam os bônus de atributo à escolha da raça.'
      );
    }
  }

  if (!input.klass) need('classe', 'Falta escolher a classe.');

  const base = checkBase(input.method, input.base, input.rollSums);
  if (!input.method) need('atributos', 'Falta escolher o método de atributos.');
  else if (!base.ok) need('atributos', base.message ?? 'Atributos inválidos.');
  else if (!base.complete) need('atributos', 'Faltam atribuir os valores.');

  const k = input.klass;
  if (k) {
    if (input.featureChoices.filter(Boolean).length < k.featureChoiceCount) {
      need('nivel1', 'Falta uma escolha de característica do nível 1.');
    }
    const n = k.skills.n;
    if (n !== null ? input.skills.length !== n : input.skills.length === 0) {
      need(
        'pericias',
        n !== null
          ? `Escolha ${n} perícia${n === 1 ? '' : 's'} (${input.skills.length} de ${n}).`
          : 'Escolha as perícias.'
      );
    }
    if (k.caster) {
      if (input.cantrips < k.cantripsKnown) {
        need(
          'magias',
          `Faltam truques (${input.cantrips} de ${k.cantripsKnown}).`
        );
      }
      if (input.prepared < k.preparedLimit) {
        need(
          'magias',
          `Faltam magias preparadas (${input.prepared} de ${k.preparedLimit}).`
        );
      }
    }
  }

  // ── O que a raça concede na criação ──
  if (input.grantTotals) {
    const t = input.grantTotals;
    const g = input.grants ?? emptyGrantPicks();
    if (g.skills.length < t.skills) {
      need(
        'pericias',
        `Falta escolher ${t.skills - g.skills.length} perícia(s) racial(is).`
      );
    }
    if (g.versatile.filter((v) => v.value.trim()).length < t.versatile) {
      need(
        'pericias',
        'Falta a escolha versátil da raça (perícia, ferramenta, instrumento ou idioma).'
      );
    }
    if (g.languages.filter((l) => l.trim()).length < t.languages) {
      need('pericias', 'Falta escolher o idioma extra concedido pela raça.');
    }
    if (g.talents.length < t.talents) {
      need('nivel1', 'Falta escolher o talento racial.');
    }
  }

  if (!input.soft.extraLanguage)
    soft('pericias', 'Sem idioma extra escolhido.');
  if (!input.soft.equipment) soft('equipamento', 'Sem equipamento descrito.');
  if (!input.soft.history) soft('historia', 'Sem história nem aparência.');
  if (!input.soft.portrait) soft('historia', 'Sem retrato.');
  return out;
}

// ── Perícias → atributo ──────────────────────────────────

/** O atributo que governa cada perícia da ficha (a lista é fixa no sistema). */
export const SKILL_ATTR: Record<string, AttributeKey> = {
  Atletismo: 'str',
  Acrobacia: 'dex',
  Furtividade: 'dex',
  Prestidigitação: 'dex',
  Arcanismo: 'int',
  História: 'int',
  Investigação: 'int',
  Natureza: 'int',
  Religião: 'int',
  Intuição: 'wis',
  Medicina: 'wis',
  Percepção: 'wis',
  Sobrevivência: 'wis',
  'Lidar com Animais': 'wis',
  Atuação: 'cha',
  Enganação: 'cha',
  Intimidação: 'cha',
  Persuasão: 'cha',
};

/** Resistências da classe ("Destreza, Carisma", "for, carisma") → atributos. */
export function parseSavingThrows(text?: string | null): AttributeKey[] {
  const out: AttributeKey[] = [];
  for (const part of (text ?? '').split(/,|\be\b/i)) {
    const word = fold(part);
    const hit = (
      [
        ['str', /^(for|forca)/],
        ['dex', /^(des|dex|destreza)/],
        ['con', /^(con|constituicao)/],
        ['int', /^(int|inteligencia)/],
        ['wis', /^(sab|sabedoria)/],
        ['cha', /^(car|carisma)/],
      ] as [AttributeKey, RegExp][]
    ).find(([, re]) => re.test(word));
    if (hit && !out.includes(hit[0])) out.push(hit[0]);
  }
  return out;
}

// ── Escolhas das concessões raciais ──────────────────────

export const SKILL_NAMES: readonly string[] = Object.keys(SKILL_ATTR);

export const VERSATILE_KINDS = [
  'skill',
  'tool',
  'instrument',
  'language',
] as const;
export type VersatileKind = (typeof VERSATILE_KINDS)[number];

export interface IVersatilePick {
  kind: VersatileKind;
  value: string;
}

/** O que a dona escolheu nas concessões da raça. */
export interface ICreationGrantPicks {
  /** Perícias extras, de qualquer das 18. */
  skills: string[];
  /** Chaves de talentos GERAIS. */
  talents: string[];
  languages: string[];
  versatile: IVersatilePick[];
}

export const emptyGrantPicks = (): ICreationGrantPicks => ({
  skills: [],
  talents: [],
  languages: [],
  versatile: [],
});

const MAX_FREE_TEXT = 60;

/**
 * Confere as escolhas contra o que a raça concede: contagem, perícias das 18 e
 * sem repetir (nem com as da classe), textos curtos. Rascunho parcial vale
 * (`complete` diz se cobre tudo). Talentos, que dependem do catálogo, o
 * servidor confere à parte.
 */
export function checkGrantPicks(
  totals: IGrantTotals,
  picks: ICreationGrantPicks,
  classSkills: readonly string[],
  lockedLanguages: readonly string[] = []
): { ok: boolean; complete: boolean; message?: string } {
  const bad = (message: string) => ({ ok: false, complete: false, message });
  if (picks.skills.length > totals.skills)
    return bad('Perícias raciais demais.');
  if (picks.talents.length > totals.talents)
    return bad('Talentos raciais demais.');
  if (picks.languages.length > totals.languages)
    return bad('Idiomas raciais demais.');
  if (picks.versatile.length > totals.versatile)
    return bad('Escolhas versáteis demais.');

  const taken = new Set(classSkills.map(fold));
  const claim = (name: string) => {
    if (!SKILL_NAMES.includes(name)) return `"${name}" não é uma das perícias.`;
    if (taken.has(fold(name))) return `"${name}" já foi escolhida.`;
    taken.add(fold(name));
    return null;
  };
  for (const name of picks.skills) {
    const err = claim(name);
    if (err) return bad(err);
  }
  for (const v of picks.versatile) {
    if (!VERSATILE_KINDS.includes(v.kind))
      return bad('Tipo de escolha inválido.');
    if (v.value.length > MAX_FREE_TEXT) return bad('Texto longo demais.');
    if (v.kind === 'skill' && v.value) {
      const err = claim(v.value);
      if (err) return bad(err);
    }
  }
  const langs = new Set(lockedLanguages.map(fold));
  const allLangs = [
    ...picks.languages,
    ...picks.versatile.filter((v) => v.kind === 'language').map((v) => v.value),
  ].filter(Boolean);
  for (const l of allLangs) {
    if (l.length > 40) return bad('Nome de idioma longo demais.');
    if (langs.has(fold(l))) return bad(`"${l}" já é um idioma da ficha.`);
    langs.add(fold(l));
  }
  if (new Set(picks.talents).size !== picks.talents.length) {
    return bad('Talento repetido.');
  }
  return {
    ok: true,
    complete:
      picks.skills.length === totals.skills &&
      picks.talents.length === totals.talents &&
      picks.languages.filter(Boolean).length === totals.languages &&
      picks.versatile.filter((v) => v.value.trim()).length === totals.versatile,
  };
}
