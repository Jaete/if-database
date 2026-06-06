import ICreature from '../creatures/creatures';
import { IItem } from '../items/item.d';

export default interface ICitizen extends ICreature {
  race?: string;
  gender?: string;
  class?: string;
  age?: string;
  family?: string;
  abilities?: Array<{ name?: string; description?: string }>;
  equipment?: {
    head?: IItem;
    torso?: IItem;
    legs?: IItem;
    feet?: IItem;
    hand?: IItem;
    offhand?: IItem;
  };
}
