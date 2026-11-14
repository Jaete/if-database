import { model, models, type Model } from 'mongoose';
import type { IPlayerEvent } from './playerProgress';
import { PlayerEventSchema } from './schema';

const PlayerEvent: Model<IPlayerEvent> =
  (models.PlayerEvent as Model<IPlayerEvent>) ||
  model<IPlayerEvent>('PlayerEvent', PlayerEventSchema);

export default PlayerEvent;
