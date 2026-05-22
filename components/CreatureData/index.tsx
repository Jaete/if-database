import Image from 'next/image';

import type ICreature from '@/db/creatures/creatures.d';
import { useCssHandles } from '@/hooks/useCssHandles';

import CombatInfo from '@/components/CombatInfo';
import StatBlock from '@/components/StatsBlock';
import AbilitiesBlock from '@/components/AbilitiesBlock';
import SensesBlock from '@/components/SensesBlock';
import DropsBlock from '@/components/DropsBlock';
import CreatureDataHandles from './handles';

interface IProps {
  creature: ICreature;
}

const CreatureData = ({ creature }: IProps) => {
  const handles = useCssHandles(CreatureDataHandles);

  return (
    <div key={creature.slug} className={handles.creatureData}>
      <div className={handles.creatureHeader}>
        <h2 className={handles.creatureName}>{creature.name}</h2>
      </div>
      <div className={handles.creatureImageContainer}>
        <div className={handles.creatureImageLoader} />
        <Image
          src={creature.image ?? ''}
          alt={creature.name}
          width={500}
          height={500}
          onLoad={(e) => e.currentTarget.classList.add('loaded')}
          className={handles.creatureImage}
        />
      </div>
      <p className={handles.creatureDescription}>{creature.description}</p>
      <StatBlock stats={creature.stats ?? {}} />
      <CombatInfo combat={creature.combat ?? {}} />
      <AbilitiesBlock
        abilities={creature.abilities ?? []}
        title="Habilidades"
      />
      <AbilitiesBlock abilities={creature.actions ?? []} title="Ações" />
      <SensesBlock senses={creature.senses ?? {}} />
      <DropsBlock drops={creature.drops ?? []} />
    </div>
  );
};

export default CreatureData;
