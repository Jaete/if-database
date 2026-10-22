import { models, model } from 'mongoose';
import type ITalentDoc from './talent.d';
import TalentDocSchema from './schema';

const TalentModel =
  models.Talent || model<ITalentDoc>('Talent', TalentDocSchema);

export default TalentModel;
