import { Schema } from 'mongoose';
import ICitizen from './citizen';

const CitizenSchema = new Schema<ICitizen>({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  race: { type: String, required: true },
  gender: { type: String, required: true },
  class: { type: String, required: true },
  rarity: { type: String },
  image: { type: String },
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
  equipment: {
    head: { type: String },
    torso: { type: String },
    legs: { type: String },
    feet: { type: String },
    hand: { type: String },
    offhand: { type: String },
  },
});

CitizenSchema.set('collection', 'citizens');

export default CitizenSchema;
