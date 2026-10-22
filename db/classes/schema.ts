import { Schema } from 'mongoose';
import type ICharacterClass from './class.d';
import type {
  IClassLevel,
  IClassFeature,
  IArchetype,
  IClassCatalog,
  IClassCatalogItem,
  ITalent,
  IContentBlock,
} from './class.d';

const LevelSchema = new Schema<IClassLevel>(
  {
    // Sem teto: 20 é onde as tabelas do fórum param hoje, não um limite do
    // sistema. O piso fica, porque nível 0 ou negativo não é nada.
    level: { type: Number, required: true, min: 1 },
    proficiencyBonus: Number,
    cantripsKnown: Number,
    spellSlots: [{ type: Number }],
    spellSlotsRaw: String,
    grants: [
      {
        _id: false,
        options: [
          {
            _id: false,
            name: { type: String, required: true },
            requiresPrerequisite: Boolean,
          },
        ],
      },
    ],
    features: [{ type: String }],
    abilityScoreIncrease: String,
    // Mixed porque o conjunto de colunas específicas varia por classe.
    columns: { type: Schema.Types.Mixed },
  },
  { _id: false }
);

const TableSchema = new Schema(
  {
    headers: [{ type: String }],
    rows: [[{ type: String }]],
  },
  { _id: false }
);

const FeatureSchema = new Schema<IClassFeature>(
  {
    name: { type: String, required: true },
    level: Number,
    description: String,
    tables: [TableSchema],
  },
  { _id: false }
);

const ArchetypeSchema = new Schema<IArchetype>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: String,
    features: [FeatureSchema],
  },
  { _id: false }
);

const CatalogItemSchema = new Schema<IClassCatalogItem>(
  {
    name: { type: String, required: true },
    description: String,
    tables: [TableSchema],
  },
  { _id: false }
);

const CatalogSchema = new Schema<IClassCatalog>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: String,
    items: [CatalogItemSchema],
  },
  { _id: false }
);

const TalentSchema = new Schema<ITalent>(
  {
    name: { type: String, required: true },
    requirement: String,
    description: String,
    tables: [TableSchema],
    // A lista de talentos avançados a que ele pertence, e a regra de destrave
    // dela. Ver ITalent.
    group: String,
    unlock: String,
    affectsSpellcasting: Boolean,
  },
  { _id: false }
);

const ContentBlockSchema = new Schema<IContentBlock>(
  {
    kind: {
      type: String,
      enum: [
        'unknown',
        'obs',
        'spellList',
        'domainFeature',
        'nestedProgression',
      ],
      required: true,
    },
    title: String,
    content: { type: String, required: true },
    post: Number,
    sourceHint: String,
    tables: [TableSchema],
  },
  { _id: false }
);

// O candidato repete a forma das listas publicadas de propósito: é o mesmo
// conteúdo, num lugar que a classe não lê — aceitar é mover, não converter.
const CandidateSchema = new Schema(
  {
    reason: { type: String, required: true },
    coverage: { type: Number, required: true },
    features: [FeatureSchema],
    archetypes: [ArchetypeSchema],
    talents: [TalentSchema],
    parsedAt: Date,
  },
  { _id: false }
);

const CharacterClassSchema = new Schema<ICharacterClass>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    aliases: [{ type: String, index: true }],
    description: String,

    hitDie: String,
    hpAtFirstLevel: String,
    hpPerLevel: String,

    proficiencies: {
      armor: String,
      weapons: String,
      tools: String,
      savingThrows: String,
      skills: String,
      raw: String,
    },
    startingEquipment: [{ type: String }],

    levels: [LevelSchema],
    features: [FeatureSchema],
    archetypes: [ArchetypeSchema],
    talents: [TalentSchema],
    catalogs: [CatalogSchema],

    isSpellcaster: Boolean,
    isUnique: Boolean,

    sourceUrl: String,
    importedAt: Date,
    unparsedSections: [{ type: String }],
    contentBlocks: [ContentBlockSchema],
    candidate: CandidateSchema,
  },
  { timestamps: true }
);

// O Mongoose pluralizaria 'CharacterClass' em 'characterclasses'. A coleção é
// fixada aqui para o nome acompanhar a rota e o resto do vocabulário.
CharacterClassSchema.set('collection', 'classes');

export default CharacterClassSchema;
