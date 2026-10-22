import { models, model } from 'mongoose';
import type ISpell from './spell.d';
import SpellSchema from './schema';

const SpellModel = models.Spell || model<ISpell>('Spell', SpellSchema);

export default SpellModel;
