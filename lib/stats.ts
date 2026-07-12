// Shared RPG stat helpers — single source of truth for how ability scores
// and modifiers are presented across creature and citizen views.

export const formatModifier = (mod: number): string =>
  mod >= 0 ? `+${mod}` : `${mod}`;

export const statModifier = (value?: number): string => {
  if (value === undefined) return '-';
  return formatModifier(Math.floor((value - 10) / 2));
};
