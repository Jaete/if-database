import { model, models, type Model } from 'mongoose';
import type { IHpRoll } from './playerProgress';
import { HpRollSchema } from './schema';

const HpRoll: Model<IHpRoll> =
  (models.HpRoll as Model<IHpRoll>) || model<IHpRoll>('HpRoll', HpRollSchema);

export default HpRoll;
