import type { IRaceProfile } from '@/db/races/race.d';

/** Os traços de ficha, na ordem em que a raça e a sub-raça os mostram. */
export const TRAIT_FIELDS = [
  { name: 'abilityScoreIncrease', label: 'Incremento de atributo' },
  { name: 'age', label: 'Idade' },
  { name: 'alignment', label: 'Tendência' },
  { name: 'size', label: 'Tamanho' },
  { name: 'speed', label: 'Deslocamento' },
  { name: 'languages', label: 'Idiomas' },
] as const satisfies readonly { name: keyof IRaceProfile; label: string }[];

/**
 * Os traços mais as correções da staff para a criação de ficha: o leitor de
 * texto (lib/raceRules.ts) é uma aproximação, e estes campos valem no lugar dele.
 * Ficam só nos editores, nunca na ficha da raça exibida.
 */
export const EDITOR_TRAIT_FIELDS = [
  ...TRAIT_FIELDS,
  {
    name: 'abilityBonusOverride',
    label: 'Correção do incremento (criação de ficha)',
    placeholder: 'ex.: CON+2, FOR+1 · LIVRE+1 = à escolha · NENHUM',
  },
  {
    name: 'languagesOverride',
    label: 'Correção dos idiomas (criação de ficha)',
    placeholder: 'ex.: Comum, Anão',
  },
] as const satisfies readonly {
  name: keyof IRaceProfile;
  label: string;
  placeholder?: string;
}[];

/** A crônica: três blocos de texto corrido. */
export const LORE_FIELDS = [
  { name: 'history', label: 'História' },
  { name: 'behavior', label: 'Comportamento' },
  { name: 'physical', label: 'Características físicas' },
] as const satisfies readonly { name: keyof IRaceProfile; label: string }[];

export const RULE_KINDS = {
  dominantBlood: 'Sangue forte · escolher a raça dominante',
  hybridHeritage: 'Herança Híbrida · escolher habilidades',
} as const;

export const NUMERALS = ['I', 'II', 'III', 'IV', 'V'] as const;

/** Corta num limite de caracteres sem partir palavra. */
export const clip = (text: string, limit: number) =>
  text.length > limit
    ? `${text.slice(0, text.lastIndexOf(' ', limit - 2))}…`
    : text;

/** Parágrafos: uma linha em branco separa. */
export const paragraphs = (text: string) =>
  text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

/** Giro de matiz da arte emprestada, por posição, para as sub-raças se distinguirem. */
export const BORROW_HUES = [0, 35, -35, 70, -70, 110] as const;

export const borrowHue = (index: number) =>
  BORROW_HUES[Math.max(0, index) % BORROW_HUES.length];

/** Quantos traços de ficha a sub-raça sobrescreve. */
export const ownTraitCount = (profile: IRaceProfile) =>
  TRAIT_FIELDS.filter(({ name }) => profile[name]).length;
