'use client';

import { useCssHandles } from '@/hooks/useCssHandles';
import AbilityCardHandles from './handles';
import '@/styles/components/abilityCard.scss';

interface IProps {
  name?: React.ReactNode;
  children?: React.ReactNode;
}

const AbilityCard = ({ name, children }: IProps) => {
  const handles = useCssHandles(AbilityCardHandles);

  return (
    <div className={handles.abilityCard}>
      {name && <strong className={handles.abilityCardName}>{name}</strong>}
      {children && <p className={handles.abilityCardDescription}>{children}</p>}
    </div>
  );
};

export default AbilityCard;
