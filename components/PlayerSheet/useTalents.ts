'use client';

import type {
  ICitizenTalent,
  ITalentMilestone,
  ITalentSlots,
} from '@/db/citizens/citizen.d';
import { useEditing } from './EditingContext';
import { talentProgress } from './sheetData';

/** Um talento na lista: o mesmo talento pego várias vezes vira uma linha só. */
export interface ITalentGroup {
  key: string;
  talent: ICitizenTalent;
  /** Cada vez que foi pego: posição na lista gravada e nível. */
  picks: { at: number; level: number }[];
}

const PATH = 'talents';
const MILESTONES_PATH = 'talentMilestones';

/**
 * Os talentos de uma ficha e os marcos da classe.
 *
 * Os marcos e a descrição dos talentos já vêm resolvidos na leitura. Escolher
 * um talento é na camada de escolha (`CatalogLayer`), que grava no rascunho; aqui
 * ficam só a leitura, a troca de nível, a remoção e o registro do que cada
 * marco geral virou (atributos ou talento).
 */
export const useTalents = () => {
  const { value, read, objects, setField } = useEditing();
  const level = Number(value('level')) || 0;
  const talents = objects<ICitizenTalent>(PATH).filter((t) => t?.key);
  const slots = read<ITalentSlots>('talentSlots');
  const milestones = objects<ITalentMilestone>(MILESTONES_PATH);
  const progress = talentProgress(slots, talents, level, milestones);

  const groups: ITalentGroup[] = [];
  talents.forEach((talent, at) => {
    const group = groups.find((g) => g.key === talent.key);
    if (group) group.picks.push({ at, level: talent.level });
    else
      groups.push({
        key: talent.key,
        talent,
        picks: [{ at, level: talent.level }],
      });
  });
  for (const group of groups) group.picks.sort((a, b) => a.level - b.level);
  groups.sort((a, b) => a.picks[0].level - b.picks[0].level);

  const remove = (at: number) =>
    setField(
      PATH,
      talents.filter((_, i) => i !== at)
    );

  const setLevel = (at: number, next: number) =>
    setField(
      PATH,
      talents.map((t, i) => (i === at ? { ...t, level: next } : t))
    );

  /** Registra o que o marco geral do nível virou; `undefined` apaga o registro. */
  const setMilestone = (
    milestoneLevel: number,
    use: ITalentMilestone['use'] | undefined
  ) =>
    setField(
      MILESTONES_PATH,
      [
        ...milestones.filter((m) => m.level !== milestoneLevel),
        ...(use ? [{ level: milestoneLevel, use }] : []),
      ].sort((a, b) => a.level - b.level)
    );

  return {
    level,
    className: slots?.className ?? '',
    slots,
    talents,
    groups,
    progress,
    milestones,
    remove,
    setLevel,
    setMilestone,
  };
};
