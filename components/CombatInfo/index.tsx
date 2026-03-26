import { useCssHandles } from '@/hooks/useCssHandles';
import CombatInfoHandles from './handles';
import { ICombat } from '@/db/monsters/monsters.d';
import './CombatInfo.scss';

interface IProps {
  combat: ICombat;
}

const CombatInfo = ({ combat }: IProps) => {
  const handles = useCssHandles(CombatInfoHandles);

  return (
    <div className={handles.statSection}>
      <h4>Informações de Combate</h4>
      <div className={handles.combatInfo}>
        <div className={handles.infoRow}>
          <span className={handles.infoLabel}>Tipo:</span>{' '}
          <span id="type">{combat.type ?? '---'}</span>
        </div>
        <div className={handles.infoRow}>
          <span className={handles.infoLabel}>Classe de Armadura:</span>{' '}
          <span id="armor-class">{combat.ac ?? '---'}</span>
        </div>
        <div className={handles.infoRow}>
          <span className={handles.infoLabel}>Pontos de Vida:</span>{' '}
          <span id="hit-points">{combat.hp ?? '---'}</span>
        </div>
        <div className={handles.infoRow}>
          <span className={handles.infoLabel}>Deslocamento:</span>{' '}
          <span id="speed">{combat.speed ?? '---'}</span>
        </div>
      </div>
    </div>
  );
};

export default CombatInfo;
