import ICreature, { IDrops } from '../creatures/creatures.d';

export default interface IMonster extends ICreature {
  drops?: Array<IDrops>;
}
