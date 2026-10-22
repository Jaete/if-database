import { Schema } from 'mongoose';
import type ISpell from './spell.d';

/**
 * O slug é derivado do nome sem acento nem caixa, e é único: é ele que faz a
 * reimportação de um tópico atualizar as magias no lugar em vez de duplicá-las.
 */
const SpellSchema = new Schema<ISpell>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    circle: { type: Number, required: true, min: 0, max: 9 },

    school: String,
    classes: String,
    castingTime: String,
    range: String,
    components: String,
    duration: String,
    target: String,
    area: String,
    effect: String,
    save: String,
    spellResistance: String,
    use: String,
    description: String,

    classIds: [
      { type: Schema.Types.ObjectId, ref: 'CharacterClass', index: true },
    ],

    sourceUrl: String,
    importedAt: Date,
  },
  { timestamps: true }
);

export default SpellSchema;
