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
