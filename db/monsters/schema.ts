import { Schema } from 'mongoose';
import IMonster from './monsters.d';

const MonsterSchema = new Schema<IMonster>(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    rarity: { type: String },
    icon: { type: String },
    image: { type: String },
    subtitle: { type: String },
    description: { type: String },
    combat: { type: Schema.Types.Mixed },
    stats: { type: Schema.Types.Mixed },
    abilities: [
      {
        name: { type: String },
        description: { type: String },
      },
    ],
    actions: [
      {
        name: { type: String },
        description: { type: String },
      },
    ],
    senses: { type: Schema.Types.Mixed },
    drops: [{ type: Schema.Types.Mixed }],
  },
  {
    timestamps: true,
    collection: 'monsters',
  }
);

export default MonsterSchema;
