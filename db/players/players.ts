import { model, models } from 'mongoose';
import IPlayer from './player';
import PlayerSchema from './schema';

// Força a recriação do modelo para evitar problemas de cache em scripts CLI
const modelName = 'Player';

if (models[modelName]) {
  delete models[modelName];
}

const Player = model<IPlayer>(modelName, PlayerSchema);

export default Player;
