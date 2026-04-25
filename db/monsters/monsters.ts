import { model, models } from 'mongoose';
import IMonster from './monsters.d';
import MonsterSchema from './schema';

const Monster = models.Monster || model<IMonster>('Monster', MonsterSchema);

export default Monster;
