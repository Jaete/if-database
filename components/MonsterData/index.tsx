import type IMonster from "@/db/monsters/monsters.d";
import Image from "next/image";
import MonsterInfo from "../MonsterInfo";
import StatBlock from "@/components/StatsBlock";
import { useCssHandles } from "@/hooks/useCssHandles";
import MonsterDataHandles from "./handles";
import AbilitiesBlock from "../AbilitiesBlock";

interface IProps {
  monster: IMonster;
}

const MonsterData = ({ monster }: IProps) => {
  const handles = useCssHandles(MonsterDataHandles);

  return (
    <div className={handles.monsterData}>
      <div className={handles.monsterHeader}>
        <h2 className={handles.monsterName}>{monster.name}</h2>
      </div>
      <div className={handles.monsterImageContainer}>
        <Image
          className={handles.monsterImage}
          src={monster.image ?? ""}
          alt="Monster Image"
          width={500}
          height={500}
          loading="eager"
        />
      </div>
      <p className={handles.monsterDescription}>{monster.description}</p>
      <MonsterInfo monster={monster} />
      <StatBlock monster={monster} />
      <AbilitiesBlock monster={monster} />
      <div className="stat-section">
        <h4>Ações</h4>
        <div id="creature-actions"></div>
      </div>
      <div className="stat-section">
        <h4>Sentidos</h4>
        <div className="senses-list">
          <div className="info-row">
            <span className="info-label">Percepção passiva:</span>{" "}
            <span id="sense-perception">---</span>
          </div>
          <div className="info-row">
            <span className="info-label">Visão no escuro:</span>{" "}
            <span id="sense-darkvision">---</span>
          </div>
        </div>
      </div>
      <div className="stat-section">
        <h4>Itens de Drop</h4>
        <table className="drops-table">
          <tbody id="creature-drops"></tbody>
        </table>
      </div>
    </div>
  );
};

export default MonsterData;
