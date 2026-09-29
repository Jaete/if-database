'use client';

import { type IDefenses } from '@/db/creatures/creatures.d';
import { defensesMapping } from '@/db/l10n/attributesMapping';
import { normalizeList } from '@/lib/listValues';
import { useCssHandles } from '@/hooks/useCssHandles';
import StatSection from '@/components/StatSection';
import Chips, { type ChipTone } from '@/components/Chips';
import DefensesBlockHandles from './handles';
import '@/styles/components/defensesBlock.scss';

// A ordem vai do que mais afeta o combate para o que menos afeta; o tom separa
// visualmente o par fraqueza/resistência das imunidades.
const CATEGORIES: Array<{ key: keyof IDefenses; tone: ChipTone }> = [
  { key: 'vulnerabilities', tone: 'vuln' },
  { key: 'resistances', tone: 'resist' },
  { key: 'damageImmunities', tone: 'default' },
  { key: 'conditionImmunities', tone: 'default' },
];

interface IProps {
  defenses: IDefenses;
}

const DefensesBlock = ({ defenses }: IProps) => {
  const handles = useCssHandles(DefensesBlockHandles);

  // Uma entrada armazenada pode conter vários itens ("Ácido; Concussão"), e
  // cada um vira seu próprio chip.
  const filled = CATEGORIES.map(({ key, tone }) => ({
    key,
    tone,
    items: normalizeList(defenses[key]),
  })).filter(({ items }) => items.length > 0);

  if (filled.length === 0) return null;

  return (
    <StatSection title="Defesas">
      {filled.map(({ key, tone, items }) => (
        <div key={key} className={handles.defensesRow}>
          <span className={handles.defensesLabel}>{defensesMapping[key]}</span>
          <span className={handles.defensesValue}>
            <Chips items={items} tone={tone} />
          </span>
        </div>
      ))}
    </StatSection>
  );
};

export default DefensesBlock;
