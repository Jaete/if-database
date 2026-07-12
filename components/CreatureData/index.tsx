'use client';

import { useState } from 'react';
import type ICreature from '@/db/creatures/creatures.d';
import type IMonster from '@/db/monsters/monster';
import { useCssHandles } from '@/hooks/useCssHandles';

import EntityTitle from '@/components/EntityTitle';
import EntityImage from '@/components/EntityImage';
import EntityDescription from '@/components/EntityDescription';
import CombatInfo from '@/components/CombatInfo';
import StatBlock from '@/components/StatsBlock';
import AbilitiesBlock from '@/components/AbilitiesBlock';
import SensesBlock from '@/components/SensesBlock';
import DropsBlock from '@/components/DropsBlock';
import LevelProgressionModal from '@/components/LevelProgressionModal';
import CreatureDataHandles from './handles';
import '@/styles/components/creatureData.scss';

interface IProps {
  creature: ICreature;
}

const CreatureData = ({ creature }: IProps) => {
  const handles = useCssHandles(CreatureDataHandles);
  const [showLevels, setShowLevels] = useState(false);

  const monster = 'levels' in creature ? (creature as IMonster) : null;
  const hasLevels = monster && monster.levels && monster.levels.length > 0;

  return (
    <div key={creature.slug} className={handles.creatureData}>
      <EntityTitle>{creature.name}</EntityTitle>
      <EntityImage src={creature.image ?? ''} alt={creature.name} />
      <EntityDescription>{creature.description}</EntityDescription>

      {hasLevels && (
        <button
          className={handles.levelButton}
          onClick={() => setShowLevels(true)}
        >
          Ver Progressão de Níveis
        </button>
      )}
      <LevelProgressionModal
        isOpen={showLevels}
        onClose={() => setShowLevels(false)}
        monster={monster}
      />

      <StatBlock stats={creature.stats ?? {}} />
      <CombatInfo combat={creature.combat ?? {}} />
      <AbilitiesBlock abilities={creature.traits ?? []} title="Habilidades" />
      <AbilitiesBlock abilities={creature.actions ?? []} title="Ações" />
      {creature.bonusActions && creature.bonusActions.length > 0 && (
        <AbilitiesBlock abilities={creature.bonusActions} title="Ações Bônus" />
      )}
      {creature.reactions && creature.reactions.length > 0 && (
        <AbilitiesBlock abilities={creature.reactions} title="Reações" />
      )}
      {creature.legendaryActions && creature.legendaryActions.length > 0 && (
        <AbilitiesBlock
          abilities={creature.legendaryActions}
          title="Ações Lendárias"
        />
      )}
      <SensesBlock senses={creature.senses ?? {}} />
      {'drops' in creature && (creature as IMonster).drops && (
        <DropsBlock
          drops={(creature as IMonster).drops ?? []}
          dice={(creature as IMonster).dice}
        />
      )}
    </div>
  );
};

export default CreatureData;
