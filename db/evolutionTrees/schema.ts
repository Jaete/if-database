import { Schema } from 'mongoose';
import IEvolutionTree from './evolutionTree';

const TreeNodeSchema = new Schema(
  {
    monsterId: { type: String, required: true },
    children: [{ type: Schema.Types.Mixed }],
  },
  { _id: false }
);

const EvolutionTreeSchema = new Schema<IEvolutionTree>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    nodes: { type: [TreeNodeSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

EvolutionTreeSchema.set('collection', 'evolution_trees');

export default EvolutionTreeSchema;
