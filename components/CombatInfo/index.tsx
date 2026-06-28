import { useCssHandles } from '@/hooks/useCssHandles';
import CombatInfoHandles from './handles';
import { ICombat, ISpeed } from '@/db/creatures/creatures.d';

interface IProps {
  combat: ICombat;
}

const getSpeedText = (speed?: ISpeed) => {
  if (!speed) return '---';
  const parts = [];
  if (speed.walk != null) parts.push(`${speed.walk} m`);
  if (speed.fly != null) parts.push(`voo ${speed.fly} m`);
  if (speed.swim != null) parts.push(`nado ${speed.swim} m`);
  if (speed.climb != null) parts.push(`escalar ${speed.climb} m`);
  if (speed.burrow != null) parts.push(`escavação ${speed.burrow} m`);
  if (speed.note) parts.push(`(${speed.note})`);
  return parts.join(', ') || '---';
};

const CombatInfo = ({ combat }: IProps) => {
  const handles = useCssHandles(CombatInfoHandles);

  return (
    <div className={handles.statSection}>
      <h3>Informações de Combate</h3>
      <div className={handles.combatInfo}>
        <div className={handles.infoRow}>
          <span className={handles.infoLabel}>Classe de Armadura:</span>{' '}
          <span id="armor-class">
            {combat.ac?.formula || combat.ac?.value || '---'}
          </span>
        </div>
        <div className={handles.infoRow}>
          <span className={handles.infoLabel}>Pontos de Vida:</span>{' '}
          <span id="hit-points">
            {combat.hp?.formula || combat.hp?.value || '---'}
          </span>
        </div>
        <div className={handles.infoRow}>
          <span className={handles.infoLabel}>Deslocamento:</span>{' '}
          <span id="speed">{getSpeedText(combat.speed)}</span>
        </div>
      </div>
    </div>
  );
};

export default CombatInfo;
