import { type IStats } from '@/db/creatures/creatures.d';
import { useCssHandles } from '@/hooks/useCssHandles';
import StatBlockHandles from './handles';
import '@/styles/components/statsBlock.scss';

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

const getModifierText = (value?: number) => {
  if (value === undefined) return '';
  const mod = Math.floor((value - 10) / 2);
  return mod >= 0 ? `(+${mod})` : `(${mod})`;
};

const StatBlock = ({ stats }: IProps) => {
  const handles = useCssHandles(StatBlockHandles);

  return (
    <div className={handles.statSection}>
      <h3>Atributos</h3>
      <div className={handles.attributesGrid}>
        {stats &&
          (Object.keys(statLabels) as Array<keyof IStats>).map((key) => (
            <div key={key} className={handles.attrItem}>
              <span className={handles.attrLabel}>{statLabels[key]}</span>
              <span id={`stat-${key}`} className={handles.attrValue}>
                {stats?.[key] !== undefined
                  ? `${stats[key]} ${getModifierText(stats[key])}`
                  : '---'}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default StatBlock;
