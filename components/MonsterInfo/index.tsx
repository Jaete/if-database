import { useCssHandles } from '@/hooks/useCssHandles';
import MonsterInfoHandles from './handles';
import { ICombat } from '@/db/monsters/monsters.d';

interface IProps {
  stats: ICombat;
}

const CombatInfo = ({ stats }: IProps) => {
  const handles = useCssHandles(MonsterInfoHandles);

  return (
    <div className={handles.monsterInfoList}>
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
