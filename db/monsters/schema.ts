import { Schema } from 'mongoose';
import IMonster from './monster';

const MonsterSchema = new Schema<IMonster>(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    rarity: { type: String },
    icon: { type: String },
    image: { type: String },
    subtitle: { type: String },
    description: { type: String },
    combat: {
      type: { type: String },
      ac: { type: String },
      hp: { type: String },
      speed: { type: String },
    },
    stats: {
      str: { type: String },
      dex: { type: String },
      con: { type: String },
      int: { type: String },
      wis: { type: String },
      cha: { type: String },
    },
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
    senses: {
      passivePerception: { type: String },
      darkvision: { type: String },
      blindsight: { type: String },
      tremorsense: { type: String },
      truesight: { type: String },
    },
    drops: [
      {
        range: { type: String },
        item: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

MonsterSchema.set('collection', 'monsters');

export default MonsterSchema;
