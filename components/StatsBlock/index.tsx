'use client';

import { type IStats } from '@/db/creatures/creatures.d';
import { statModifier } from '@/lib/stats';
import StatSection from '@/components/StatSection';
import AttributesGrid from '@/components/AttributesGrid';

interface IProps {
  stats: IStats;
}

const statLabels: Record<keyof IStats, string> = {
  str: 'FOR',
  dex: 'DES',
  con: 'CON',
  int: 'INT',
  wis: 'SAB',
  cha: 'CAR',
};

const StatBlock = ({ stats }: IProps) => (
  <StatSection title="Atributos">
    <AttributesGrid
      items={(Object.keys(statLabels) as Array<keyof IStats>).map((key) => ({
        key,
        label: statLabels[key],
        valueId: `stat-${key}`,
        value: stats?.[key] !== undefined ? statModifier(stats[key]) : '---',
        sub: stats?.[key] !== undefined ? stats[key] : undefined,
      }))}
    />
  </StatSection>
);

export default StatBlock;
