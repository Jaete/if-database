import { model, models } from 'mongoose';
import ICreature from './creatures.d';
import CreatureSchema from './schema';

const Creature =
  models.Creature || model<ICreature>('Creature', CreatureSchema);

export default Creature;
