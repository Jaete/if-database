import { models, model } from 'mongoose';
import type ICharacterClass from './class.d';
import CharacterClassSchema from './schema';

const CharacterClassModel =
  models.CharacterClass ||
  model<ICharacterClass>('CharacterClass', CharacterClassSchema);

export default CharacterClassModel;
