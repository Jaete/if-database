import Image from 'next/image';

import type IMonster from '@/db/monsters/monsters.d';
import { useCssHandles } from '@/hooks/useCssHandles';

import CombatInfo from '@/components/CombatInfo';
import StatBlock from '@/components/StatsBlock';
import AbilitiesBlock from '@/components/AbilitiesBlock';
import SensesBlock from '@/components/SensesBlock';
import DropsBlock from '@/components/DropsBlock';
import MonsterDataHandles from './handles';

interface IProps {
  monster: IMonster;
}

const MonsterData = ({ monster }: IProps) => {
  const handles = useCssHandles(MonsterDataHandles);

  return (
    <div key={monster.slug} className={handles.monsterData}>
      <div className={handles.monsterHeader}>
        <h2 className={handles.monsterName}>{monster.name}</h2>
      </div>
      <div className={handles.monsterImageContainer}>
        <div className={handles.monsterImageLoader} />
        <Image
          src={monster.image ?? ''}
          alt={monster.name}
          width={500}
          height={500}
          onLoad={(e) => e.currentTarget.classList.add('loaded')}
          className={handles.monsterImage}
        />
      </div>
      <p className={handles.monsterDescription}>{monster.description}</p>
      <StatBlock stats={monster.stats ?? {}} />
      <CombatInfo combat={monster.combat ?? {}} />
      <AbilitiesBlock abilities={monster.abilities ?? []} title="Habilidades" />
      <AbilitiesBlock abilities={monster.actions ?? []} title="Ações" />
      <SensesBlock senses={monster.senses ?? {}} />
      <DropsBlock drops={monster.drops ?? []} />
    </div>
  );
};

export default MonsterData;
