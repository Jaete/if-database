import { model, models } from 'mongoose';
import ICitizen from './citizen';
import CitizenSchema from './schema';

// Força a recriação do modelo para evitar problemas de cache em scripts CLI
const modelName = 'Citizen';

// Remove o modelo do cache se já existir para garantir que estamos usando o schema correto
if (models[modelName]) {
  delete models[modelName];
}

const Citizen = model<ICitizen>(modelName, CitizenSchema);

export default Citizen;
