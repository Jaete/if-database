/**
 * As perícias do sistema (base D&D 5e), cada uma com o atributo que a governa.
 *
 * O app é a fonte da verdade: o valor de uma perícia é derivado do modificador
 * final do atributo mais o bônus de proficiência, quando marcada. Antes disso
 * cada ficha do fórum escrevia os números à sua maneira — "(+4) (*)",
 * "(Proficiente): + 2", ou nada — e não havia como confiar neles.
 */
export type SkillAttribute = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';

export interface ISkillDefinition {
  name: string;
  attribute: SkillAttribute;
}

const SKILLS: readonly ISkillDefinition[] = [
  { name: 'Atletismo', attribute: 'str' },

  { name: 'Acrobacia', attribute: 'dex' },
  { name: 'Furtividade', attribute: 'dex' },
  { name: 'Prestidigitação', attribute: 'dex' },

  { name: 'Arcanismo', attribute: 'int' },
  { name: 'História', attribute: 'int' },
  { name: 'Investigação', attribute: 'int' },
  { name: 'Natureza', attribute: 'int' },
  { name: 'Religião', attribute: 'int' },

  { name: 'Intuição', attribute: 'wis' },
  { name: 'Medicina', attribute: 'wis' },
  { name: 'Percepção', attribute: 'wis' },
  { name: 'Sobrevivência', attribute: 'wis' },
  { name: 'Lidar com Animais', attribute: 'wis' },

  { name: 'Atuação', attribute: 'cha' },
  { name: 'Enganação', attribute: 'cha' },
  { name: 'Intimidação', attribute: 'cha' },
  { name: 'Persuasão', attribute: 'cha' },
] as const;

// Acentuação e caixa variam entre fichas, então a busca é normalizada.
const normalize = (value: string) =>
  value.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export function findSkill(name: string): ISkillDefinition | undefined {
  const target = normalize(name);
  return SKILLS.find((skill) => normalize(skill.name) === target);
}

export default SKILLS;
