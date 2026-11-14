import { model, models, type Model } from 'mongoose';
import type { ICreationRoll } from './playerProgress';
import { CreationRollSchema } from './schema';

// Recria o model a cada avaliação do módulo (como db/players/players.ts): o
// índice e os campos mudaram (gil por classe), e um model guardado de uma
// avaliação anterior manteria o schema velho no dev server e em scripts.
if (models.CreationRoll) delete models.CreationRoll;

const CreationRoll: Model<ICreationRoll> = model<ICreationRoll>(
  'CreationRoll',
  CreationRollSchema
);

export default CreationRoll;
