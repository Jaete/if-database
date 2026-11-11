'use client';

import { useCssHandles } from '@/hooks/useCssHandles';
import { PlusIcon } from '../Icons';
import RaceGhostAddHandles from './handles';
import '@/styles/components/raceControls.scss';

interface IProps {
  label: string;
  onClick: () => void;
}

/** O "+" tracejado que acrescenta um item a uma lista. */
const RaceGhostAdd = ({ label, onClick }: IProps) => {
  const handles = useCssHandles(RaceGhostAddHandles);
  return (
    <button type="button" className={handles.raceGhostAdd} onClick={onClick}>
      <PlusIcon />
      {label}
    </button>
  );
};

export default RaceGhostAdd;
