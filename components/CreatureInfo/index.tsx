import { useCssHandles } from '@/hooks/useCssHandles';
import CreatureInfoHandles from './handles';
import { ICombat } from '@/db/creatures/creatures.d';

interface IProps {
  stats: ICombat;
}

const CombatInfo = ({ stats }: IProps) => {
  const handles = useCssHandles(CreatureInfoHandles);

  return (
    <div className={handles.creatureInfoList}>
      <div className={handles.infoRow}>
        <span className={handles.infoLabel}>Tipo: </span>
        <span className={handles.infoValue}>{stats.type ?? '---'}</span>
      </div>
      <div className={handles.infoRow}>
        <span className={handles.infoLabel}>Classe de Armadura (CA): </span>
        <span className={handles.infoValue}>{stats.ac ?? '---'}</span>
      </div>
      <div className={handles.infoRow}>
        <span className={handles.infoLabel}>Pontos de Vida (PV): </span>
        <span className={handles.infoValue}>{stats.hp ?? '---'}</span>
      </div>
      <div className={handles.infoRow}>
        <span className={handles.infoLabel}>Velocidade: </span>
        <span className={handles.infoValue}>{stats.speed ?? '---'}</span>
      </div>
    </div>
  );
};

export default CombatInfo;
