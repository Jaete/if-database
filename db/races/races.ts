import { models, model } from 'mongoose';
import type IRace from './race.d';
import RaceSchema from './schema';

const RaceModel = models.Race || model<IRace>('Race', RaceSchema);

export default RaceModel;
