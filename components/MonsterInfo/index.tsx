import type IMonster from "@/db/monsters/monsters.d";
import { useCssHandles } from "@/hooks/useCssHandles";
import MonsterInfoHandles from "./handles";

interface IProps {
  monster: IMonster;
}

const MonsterInfo = ({ monster }: IProps) => {
  const handles = useCssHandles(MonsterInfoHandles);

  return (
    <div className={handles.monsterInfoList}>
      <div className={handles.infoRow}>
        <span className={handles.infoLabel}>Tipo: </span>
        <span className={handles.infoValue}>{monster.type ?? "---"}</span>
      </div>
      <div className={handles.infoRow}>
        <span className={handles.infoLabel}>Classe de Armadura (CA): </span>
        <span className={handles.infoValue}>{monster.ac ?? "---"}</span>
      </div>
      <div className={handles.infoRow}>
        <span className={handles.infoLabel}>Pontos de Vida (PV): </span>
        <span className={handles.infoValue}>{monster.hp ?? "---"}</span>
      </div>
      <div className={handles.infoRow}>
        <span className={handles.infoLabel}>Velocidade: </span>
        <span className={handles.infoValue}>{monster.speed ?? "---"}</span>
      </div>
    </div>
  );
};

export default MonsterInfo;
