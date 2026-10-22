import { Schema } from 'mongoose';
import type ITalentDoc from './talent.d';

/**
 * O slug é derivado do nome sem acento nem caixa, e é único: é ele que faz a
 * reimportação do tópico atualizar os talentos no lugar em vez de duplicá-los.
 */
const TalentDocSchema = new Schema<ITalentDoc>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },

    category: { type: String, index: true },

    prerequisites: String,
    benefit: String,
    normal: String,
    special: String,
    slotIncrease: String,
    description: String,

    sourceUrl: String,
    importedAt: Date,
  },
  { timestamps: true }
);

export default TalentDocSchema;
