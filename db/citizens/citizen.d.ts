import ICreature from '../creatures/creatures';
import { IItem } from '../items/item.d';

export default interface ICitizen extends ICreature {
  age?: string;
  family?: string;
  equipment?: {
    head?: IItem;
    torso?: IItem;
    legs?: IItem;
    feet?: IItem;
    hand?: IItem;
    offhand?: IItem;
  };
}
