import { model, models } from 'mongoose';
import IEvolutionTree from './evolutionTree';
import EvolutionTreeSchema from './schema';

const modelName = 'EvolutionTree';

if (models[modelName]) {
  delete models[modelName];
}

const EvolutionTree = model<IEvolutionTree>(modelName, EvolutionTreeSchema);

export default EvolutionTree;
