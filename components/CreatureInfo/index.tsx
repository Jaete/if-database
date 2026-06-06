import { useCssHandles } from '@/hooks/useCssHandles';
import CreatureInfoHandles from './handles';
import { ICombat, ISpeed } from '@/db/creatures/creatures.d';

interface IProps {
  stats: ICombat;
}

const getSpeedText = (speed?: ISpeed) => {
  if (!speed) return '---';
  const parts = [];
  if (speed.walk !== undefined) parts.push(`${speed.walk} pés`);
  if (speed.fly !== undefined) parts.push(`voo ${speed.fly} pés`);
  if (speed.swim !== undefined) parts.push(`nado ${speed.swim} pés`);
  if (speed.climb !== undefined) parts.push(`escalar ${speed.climb} pés`);
  if (speed.burrow !== undefined) parts.push(`escavação ${speed.burrow} pés`);
  if (speed.note) parts.push(`(${speed.note})`);
  return parts.join(', ') || '---';
};

const CombatInfo = ({ stats }: IProps) => {
  const handles = useCssHandles(CreatureInfoHandles);

  return (
    <div className={handles.creatureInfoList}>
      <div className={handles.infoRow}>
        <span className={handles.infoLabel}>Classe de Armadura (CA): </span>
        <span className={handles.infoValue}>
          {stats.ac?.formula || stats.ac?.value || '---'}
        </span>
      </div>
      <div className={handles.infoRow}>
        <span className={handles.infoLabel}>Pontos de Vida (PV): </span>
        <span className={handles.infoValue}>
          {stats.hp?.formula || stats.hp?.value || '---'}
        </span>
      </div>
      <div className={handles.infoRow}>
        <span className={handles.infoLabel}>Velocidade: </span>
        <span className={handles.infoValue}>{getSpeedText(stats.speed)}</span>
      </div>
    </div>
  );
};

export default CombatInfo;
