// Regras PURAS que leem o texto das raças: bônus de atributo, idiomas e a regra
// de sub-raça. Sem banco, sem React: o servidor valida com elas e a tela de
// criação mostra o mesmo cálculo.
//
// O texto do fórum não é um formato, é prosa ("Seu valor de Constituição
// aumenta em +2 e sua força aumenta em 1."). O leitor abaixo cobre as frases
// que existem hoje; o que ele não alcançar a staff corrige no campo de
// correção da raça (`abilityBonusOverride` / `languagesOverride`).

import type { AttributeKey } from './stats';

const KEYS: readonly AttributeKey[] = [
  'str',
  'dex',
  'con',
  'int',
  'wis',
  'cha',
];

export interface IBonusSpec {
  /** Bônus fixo por atributo. */
  fixed: Partial<Record<AttributeKey, number>>;
  /** Cada item é um "+N à escolha"; a dona aponta o atributo de cada um. */
  free: number[];
}

const fold = (text: string) =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const ATTR_WORDS: Record<AttributeKey, string[]> = {
  str: ['forca', 'for', 'str'],
  dex: ['destreza', 'dex', 'des'],
  con: ['constituicao', 'con'],
  int: ['inteligencia', 'int'],
  wis: ['sabedoria', 'sab', 'wis'],
  cha: ['carisma', 'car', 'cha'],
};
const ATTR_PATTERN = Object.values(ATTR_WORDS)
  .flat()
  .sort((a, b) => b.length - a.length)
  .join('|');

const attrOf = (word: string): AttributeKey | null => {
  const needle = fold(word);
  for (const key of KEYS) if (ATTR_WORDS[key].includes(needle)) return key;
  return null;
};

const COUNT: Record<string, number> = {
  um: 1,
  uma: 1,
  dois: 2,
  duas: 2,
  tres: 3,
  quatro: 4,
};
const countOf = (word: string) => COUNT[word] ?? (Number(word) || 0);

const emptySpec = (): IBonusSpec => ({ fixed: {}, free: [] });

/**
 * O incremento de atributo de uma raça ou sub-raça, em `{ fixed, free }`.
 *
 * Só atributos entram: "+1 no modificador de todos os testes de agilidade" da
 * Lapinara é bônus de teste e fica de fora, porque o padrão exige o NOME de um
 * atributo logo depois do "em".
 */
export function parseAbilityIncrease(text?: string | null): IBonusSpec {
  const spec = emptySpec();
  if (!text) return spec;
  let rest = fold(text);

  // Cada padrão consome o trecho que leu, para o seguinte não contá-lo de novo
  // ("bonus de +2 em dex" casaria também com "+2 em dex").
  const take = (re: RegExp, read: (m: RegExpExecArray) => void) => {
    rest = rest.replace(re, (...args) => {
      const m = args.slice(0, -2) as unknown as RegExpExecArray;
      read(m);
      return ' '.repeat(String(args[0]).length);
    });
  };

  // "Dois de seus valores de habilidade aumentam em 1" /
  // "escolha dois valores de habilidade e adicione 1 ponto em cada".
  take(
    /\b(um|uma|dois|duas|tres|quatro|\d+)\s+(?:de\s+seus\s+)?valores?\s+de\s+(?:habilidade|atributo)s?(?:\s+(?:aumentam?|aumenta)\s+em\s+\+?(\d+))?(?:\s+e\s+adicione\s+(\d+))?/g,
    (m) => {
      const n = countOf(m[1]);
      const amount = Number(m[2] ?? m[3]) || 1;
      for (let i = 0; i < n; i += 1) spec.free.push(amount);
    }
  );
  take(
    new RegExp(
      `\\b(${ATTR_PATTERN})\\s+(?:aumenta|aumentam)\\s+(?:em\\s+)?\\+?(\\d+)`,
      'g'
    ),
    (m) => {
      const key = attrOf(m[1]);
      if (key) spec.fixed[key] = (spec.fixed[key] ?? 0) + Number(m[2]);
    }
  );
  take(
    new RegExp(
      `\\bbonus\\s+de\\s+\\+?(\\d+)\\s+(?:em|de)\\s+(${ATTR_PATTERN})\\b`,
      'g'
    ),
    (m) => {
      const key = attrOf(m[2]);
      if (key) spec.fixed[key] = (spec.fixed[key] ?? 0) + Number(m[1]);
    }
  );
  take(
    new RegExp(`\\+(\\d+)\\s+(?:em|de)\\s+(${ATTR_PATTERN})\\b`, 'g'),
    (m) => {
      const key = attrOf(m[2]);
      if (key) spec.fixed[key] = (spec.fixed[key] ?? 0) + Number(m[1]);
    }
  );
  return spec;
}

/**
 * A correção da staff, em notação curta: `CON+2, FOR+1, LIVRE+1, LIVRE+1`.
 * `NENHUM` é "sem bônus" explícito. Vazio devolve `null` (sem correção).
 */
export function parseBonusOverride(text?: string | null): IBonusSpec | null {
  const raw = (text ?? '').trim();
  if (!raw) return null;
  const spec = emptySpec();
  if (fold(raw) === 'nenhum') return spec;
  for (const part of raw.split(/[,;\s]+/)) {
    const m = /^([A-Za-zçãõéêíóúÇ]+)\+(\d+)$/.exec(part.trim());
    if (!m) continue;
    const amount = Number(m[2]);
    if (fold(m[1]) === 'livre') spec.free.push(amount);
    else {
      const key = attrOf(m[1]);
      if (key) spec.fixed[key] = (spec.fixed[key] ?? 0) + amount;
    }
  }
  return spec;
}

/** Soma raça e sub-raça. */
export function addBonus(a: IBonusSpec, b: IBonusSpec): IBonusSpec {
  const fixed = { ...a.fixed };
  for (const key of KEYS) {
    if (b.fixed[key]) fixed[key] = (fixed[key] ?? 0) + (b.fixed[key] ?? 0);
  }
  return { fixed, free: [...a.free, ...b.free] };
}

interface IProfile {
  abilityScoreIncrease?: string;
  abilityBonusOverride?: string;
  languages?: string;
  languagesOverride?: string;
}

/** O bônus de UM perfil: a correção da staff, quando existe, vale no lugar. */
export const bonusOf = (profile?: IProfile | null): IBonusSpec =>
  parseBonusOverride(profile?.abilityBonusOverride) ??
  parseAbilityIncrease(profile?.abilityScoreIncrease);

export interface IRaceRulesInput extends IProfile {
  name: string;
  slug: string;
  choiceRules?: { kind: string }[];
  baseOnlyTraits?: unknown[];
  subraces: (IProfile & { name: string; slug: string })[];
}

export const isMixed = (race: Pick<IRaceRulesInput, 'choiceRules'>) =>
  (race.choiceRules?.length ?? 0) > 0;

/**
 * O bônus final de atributo da raça escolhida. A raça mista (Mestiço) não tem
 * bônus de atributo. Raça e sub-raça SOMAM (Elfos +2 DES, Elfos comuns +1 SAB;
 * Yokais: dois +1 à escolha mais o fixo da sub-raça).
 */
export function raceBonus(
  race: IRaceRulesInput | undefined,
  subraceSlug?: string
): IBonusSpec {
  if (!race || isMixed(race)) return emptySpec();
  const sub = subraceSlug
    ? race.subraces.find((s) => s.slug === subraceSlug)
    : undefined;
  return addBonus(bonusOf(race), sub ? bonusOf(sub) : emptySpec());
}

/**
 * Os "+N à escolha" precisam apontar atributos DIFERENTES. Devolve os picks
 * válidos ou uma mensagem do que falta.
 */
export function checkRacialPicks(
  spec: IBonusSpec,
  picks: readonly string[]
): { ok: boolean; complete: boolean; message?: string } {
  if (spec.free.length === 0) {
    return picks.length
      ? {
          ok: false,
          complete: true,
          message: 'Esta raça não tem bônus à escolha.',
        }
      : { ok: true, complete: true };
  }
  if (picks.some((p) => !KEYS.includes(p as AttributeKey))) {
    return { ok: false, complete: false, message: 'Atributo inválido.' };
  }
  if (picks.length > spec.free.length) {
    return { ok: false, complete: false, message: 'Bônus demais.' };
  }
  if (new Set(picks).size !== picks.length) {
    return {
      ok: false,
      complete: false,
      message: 'Os bônus à escolha vão em atributos diferentes.',
    };
  }
  return { ok: true, complete: picks.length === spec.free.length };
}

/** O bônus por atributo depois das escolhas livres. */
export function resolveBonus(
  spec: IBonusSpec,
  picks: readonly string[]
): Record<AttributeKey, number> {
  const out = { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 };
  for (const key of KEYS) out[key] = spec.fixed[key] ?? 0;
  spec.free.forEach((amount, i) => {
    const key = picks[i] as AttributeKey | undefined;
    if (key && KEYS.includes(key)) out[key] += amount;
  });
  return out;
}

// ── Sub-raça ─────────────────────────────────────────────

export type SubraceRule =
  | { mode: 'none' }
  /** Raça mista: nada de sub-raça, e sim origens. */
  | { mode: 'mixed' }
  /** Há uma variante "comum": é a padrão, e a sub-raça é opcional. */
  | { mode: 'auto'; commonSlug: string }
  /** Sem variante comum, mas com habilidades só da base: "<Raça> comum". */
  | { mode: 'optional'; label: string }
  | { mode: 'required' };

const singular = (name: string) =>
  /as$/i.test(name) ? name.slice(0, -1) : name;

export const isCommonName = (name: string) =>
  /\bcomuns?\s*$/i.test(name.trim());

/**
 * A regra de sub-raça. Genérica: nada aqui cita uma raça pelo nome.
 *   - sem sub-raças: nada a escolher;
 *   - com variante "comum/comuns": ela vale quando a dona não escolhe outra;
 *   - com habilidades só da raça base (Fadas) e sem variante comum: opcional, e
 *     a ausência aparece como "<Raça> comum";
 *   - nos demais casos, a sub-raça é obrigatória.
 */
export function subraceRule(race: IRaceRulesInput): SubraceRule {
  if (isMixed(race)) return { mode: 'mixed' };
  if (race.subraces.length === 0) return { mode: 'none' };
  const common = race.subraces.find((s) => isCommonName(s.name));
  if (common) return { mode: 'auto', commonSlug: common.slug };
  if ((race.baseOnlyTraits?.length ?? 0) > 0) {
    return { mode: 'optional', label: `${singular(race.name)} comum` };
  }
  return { mode: 'required' };
}

/** A sub-raça que vale: a escolhida, ou a variante comum quando é o caso. */
export function effectiveSubrace(
  race: IRaceRulesInput,
  chosen?: string
): string | undefined {
  const rule = subraceRule(race);
  if (chosen && race.subraces.some((s) => s.slug === chosen)) return chosen;
  return rule.mode === 'auto' ? rule.commonSlug : undefined;
}

/** `null` quando a regra de sub-raça está satisfeita. */
export function subraceIssue(
  race: IRaceRulesInput,
  chosen?: string
): string | null {
  const rule = subraceRule(race);
  if (rule.mode === 'required' && !chosen) {
    return `${race.name} exige uma sub-raça.`;
  }
  return null;
}

// ── Idiomas ──────────────────────────────────────────────

const titleCase = (name: string) =>
  name.trim().replace(/^./, (c) => c.toUpperCase());

/** "Você pode falar, ler e escrever Comum e Anão." → ['Comum', 'Anão']. */
export function parseLanguages(text?: string | null): string[] {
  if (!text) return [];
  // Só o que vem depois do último verbo de fala: "falar, ler e escrever X".
  const verb = /(?:escrever|falar|fala|falam|conhece|conhecem|sabe|sabem)\b/gi;
  let from = 0;
  for (let m = verb.exec(text); m; m = verb.exec(text)) {
    from = m.index + m[0].length;
  }
  const names = text
    .slice(from)
    .replace(/[.;:]+$/g, '')
    .split(/,|\be\b|\//i)
    .map((s) => titleCase(s.replace(/[.]/g, '')))
    .filter((s) => s.length > 0 && s.length <= 40);
  return [...new Set(names)];
}

const splitList = (text?: string | null) => [
  ...new Set((text ?? '').split(/[,;]+/).map(titleCase).filter(Boolean)),
];

/** Os idiomas de UM perfil de raça; vazio quando o texto não diz nada. */
export const profileLanguages = (profile?: IProfile | null): string[] => {
  const override = splitList(profile?.languagesOverride);
  return override.length > 0 ? override : parseLanguages(profile?.languages);
};

/**
 * Os idiomas travados da ficha. A sub-raça que diz os seus vale no lugar dos da
 * raça; sem nenhum, Comum. O Mestiço soma os das origens.
 */
export function raceLanguages(
  race: IRaceRulesInput | undefined,
  subraceSlug: string | undefined,
  parents: IRaceRulesInput[] = []
): string[] {
  if (!race) return [];
  if (isMixed(race)) {
    const union = [
      ...new Set(
        parents.flatMap((p) => {
          const own = profileLanguages(p);
          return own.length > 0 ? own : ['Comum'];
        })
      ),
    ];
    return union.length > 0 ? union : ['Comum'];
  }
  const sub = subraceSlug
    ? race.subraces.find((s) => s.slug === subraceSlug)
    : undefined;
  const own = profileLanguages(sub);
  if (own.length > 0) return own;
  const base = profileLanguages(race);
  return base.length > 0 ? base : ['Comum'];
}
