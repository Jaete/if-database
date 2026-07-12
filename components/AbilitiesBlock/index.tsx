'use client';

import { type ITrait, type IAction } from '@/db/creatures/creatures.d';
import { useCssHandles } from '@/hooks/useCssHandles';
import StatSection from '@/components/StatSection';
import AbilityCard from '@/components/AbilityCard';
import AbilitiesBlockHandles from './handles';
import '@/styles/components/abilitiesBlock.scss';

interface IProps {
  abilities: Array<ITrait | IAction>;
  title?: string;
}

const AbilitiesBlock = ({ abilities, title }: IProps) => {
  const handles = useCssHandles(AbilitiesBlockHandles);

  return (
    <StatSection title={title || 'Habilidades'}>
      <div className={handles.abilitiesContainer}>
        {abilities?.map((ability, index) => (
          <AbilityCard key={`${ability.name}-${index}`} name={ability.name}>
            {ability.description}
          </AbilityCard>
        ))}
      </div>
    </StatSection>
  );
};

export default AbilitiesBlock;
