// Shared RPG stat helpers — single source of truth for how ability scores
// and modifiers are presented across creature and citizen views.

export const formatModifier = (mod: number): string =>
  mod >= 0 ? `+${mod}` : `${mod}`;

export const statModifier = (value?: number): string => {
  if (value === undefined) return '-';
  return formatModifier(Math.floor((value - 10) / 2));
};

/** Modificador numérico de um valor de atributo (regra padrão d20). */
export const modifierOf = (score?: number): number =>
  score === undefined ? 0 : Math.floor((score - 10) / 2);

/**
 * Valor de uma perícia: o modificador final do atributo que a governa, mais o
 * bônus de proficiência quando o personagem é proficiente nela, mais qualquer
 * bônus extra (item, talento, traço racial).
 */
export const skillValue = (
  attributeModifier: number,
  proficient: boolean,
  proficiencyBonus = 0,
  bonus = 0
): number => attributeModifier + (proficient ? proficiencyBonus : 0) + bonus;

/**
 * CD de resistência das magias: 8 + modificador do atributo de conjuração +
 * bônus de proficiência.
 */
export const spellSaveDC = (
  abilityModifier: number,
  proficiencyBonus = 0
): number => 8 + abilityModifier + proficiencyBonus;

export type AttributeKey = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';

// Como cada atributo pode aparecer escrito numa ficha: o nome por extenso ou a
// abreviação em pt-BR. Mora aqui, e não na camada de apresentação, porque o
// servidor também precisa reconhecer o atributo de conjuração para recalcular
// o CD das magias.
const ATTRIBUTE_ALIASES: Record<AttributeKey, readonly string[]> = {
  str: ['forca', 'for'],
  dex: ['destreza', 'des'],
  con: ['constituicao', 'con'],
  int: ['inteligencia', 'int'],
  wis: ['sabedoria', 'sab'],
  cha: ['carisma', 'car'],
};

const foldAccents = (text: string) =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase();

/** Atributo correspondente a um nome escrito à mão, ou null se não bater. */
export const attributeKeyOf = (name?: string): AttributeKey | null => {
  if (!name) return null;
  const needle = foldAccents(name);
  const found = Object.entries(ATTRIBUTE_ALIASES).find(([, aliases]) =>
    aliases.includes(needle)
  );
  return (found?.[0] as AttributeKey) ?? null;
};
