import { Schema } from 'mongoose';
import type IRace from './race.d';
import type {
  IRaceChoiceRule,
  IRaceImage,
  IRaceTrait,
  ISubrace,
} from './race.d';

/**
 * Links gravados vêm de texto livre na edição e são renderizados para todo
 * visitante (`href`, `src`). Só http(s) passa — nada de `javascript:` ou
 * `data:`.
 */
const HTTP_URL = {
  validator: (value?: string) => !value || /^https?:\/\//i.test(value),
  message: 'Use um link http(s).',
};

const ImageSchema = new Schema<IRaceImage>(
  {
    url: { type: String, required: true, validate: HTTP_URL },
    focus: String,
  },
  { _id: false }
);

const TraitOptionSchema = new Schema<IRaceTrait>(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
  },
  { _id: false }
);

// Opções só descem um nível: o fórum nunca aninha uma escolha dentro de outra,
// e um schema recursivo complicaria a validação à toa.
const TraitSchema = new Schema<IRaceTrait>(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    options: { type: [TraitOptionSchema], default: undefined },
  },
  { _id: false }
);

/** Os campos que raça e sub-raça compartilham (`IRaceProfile`). */
const profileFields = {
  history: String,
  behavior: String,
  physical: String,
  abilityScoreIncrease: String,
  age: String,
  alignment: String,
  size: String,
  speed: String,
  languages: String,
  traits: { type: [TraitSchema], default: [] },
  notes: { type: [String], default: undefined },
};

const SubraceSchema = new Schema<ISubrace>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    group: String,
    image: ImageSchema,
    ...profileFields,
  },
  { _id: false }
);

const ChoiceRuleSchema = new Schema<IRaceChoiceRule>(
  {
    kind: {
      type: String,
      enum: ['hybridHeritage', 'dominantBlood'],
      required: true,
    },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    count: { type: Number, min: 1 },
  },
  { _id: false }
);

const RaceSchema = new Schema<IRace>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    unique: { type: Boolean, default: false },
    summary: String,
    images: { type: [ImageSchema], default: [] },
    ...profileFields,
    baseOnlyTraits: { type: [TraitSchema], default: undefined },
    subraces: { type: [SubraceSchema], default: [] },
    choiceRules: { type: [ChoiceRuleSchema], default: undefined },
    sourceUrl: { type: String, validate: HTTP_URL },
    importedAt: Date,
  },
  { timestamps: true }
);

export default RaceSchema;
