'use client';

import type { IAbilityChip } from '@/lib/raceAbilityChips';
import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import RaceChipsHandles from './handles';
import '@/styles/components/raceChips.scss';

interface IProps {
  chips: IAbilityChip[];
  label?: string;
}

/** Os chips de incremento de atributo ("CON +2", "+1 em 2 à escolha"). */
const RaceChips = ({ chips, label = 'Incremento de atributo' }: IProps) => {
  const handles = useCssHandles(RaceChipsHandles);
  if (chips.length === 0) return null;

  return (
    <div className={handles.raceChips} role="group" aria-label={label}>
      {chips.map((chip) => (
        <span
          key={chip.label}
          className={`${handles.raceChip}${
            chip.kind === 'free'
              ? ` ${applyModifiers(handles.raceChip, 'free')}`
              : ''
          }`}
        >
          {chip.label}
        </span>
      ))}
    </div>
  );
};

export default RaceChips;
