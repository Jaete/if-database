'use client';

import { type IDrop } from '@/db/monsters/monster';
import { useCssHandles } from '@/hooks/useCssHandles';
import StatSection from '@/components/StatSection';
import StatTable from '@/components/StatTable';
import DropsBlockHandles from './handles';
import '@/styles/components/dropsBlock.scss';

interface IProps {
  drops: IDrop[];
  dice?: string;
}

const DropsBlock = ({ drops, dice }: IProps) => {
  const handles = useCssHandles(DropsBlockHandles);

  return (
    <StatSection title="Itens de Drop">
      {dice && (
        <div className={handles.dropDiceInfo}>
          Dado: <strong>{dice}</strong>
        </div>
      )}
      <StatTable
        bodyId="creature-drops"
        rows={(drops ?? []).map((drop, index) => ({
          key: `${drop.item || 'item'}-${index}`,
          cells: [drop.range ?? '---', drop.item ?? '---'],
        }))}
      />
    </StatSection>
  );
};

export default DropsBlock;
