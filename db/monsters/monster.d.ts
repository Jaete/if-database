import ICreature from '../creatures/creatures.d';

export interface IDrop {
  item?: string;
  chance?: number; // ex: 50 (porcentagem de 0 a 100)
}

export default interface IMonster extends ICreature {
  cr?: string; // ex: "1", "5", "1/4"
  xp?: number; // ex: 200, 1800
  drops?: IDrop[];
}
