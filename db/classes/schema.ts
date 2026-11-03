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
  IClassDomain,
  IClassDomainPower,
  IClassDomainSpell,
  IDivineOrder,
  IDivineOrderAbility,
  IRelationFact,
  IRelationAbility,
  IRelationListItem,
  IRelationEntity,
  IRelationGroup,
} from './class.d';
import { CLASS_ROLES } from '../l10n/classes';

const CLASS_ROLE_IDS = CLASS_ROLES.map((role) => role.id);

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
    spell: String,
  },
  { _id: false }
);

const RelationFactSchema = new Schema<IRelationFact>(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const RelationAbilitySchema = new Schema<IRelationAbility>(
  {
    name: { type: String, required: true },
    level: Number,
    description: { type: String, required: true },
    tables: [TableSchema],
  },
  { _id: false }
);

const RelationListItemSchema = new Schema<IRelationListItem>(
  {
    rank: { type: Number, required: true },
    name: { type: String, required: true },
  },
  { _id: false }
);

const RelationEntitySchema = new Schema<IRelationEntity>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    subtitle: String,
    image: String,
    description: String,
    facts: [RelationFactSchema],
    abilities: [RelationAbilitySchema],
    list: {
      label: String,
      items: [RelationListItemSchema],
    },
    relatedSlugs: [{ type: String }],
  },
  { _id: false }
);

const RelationGroupSchema = new Schema<IRelationGroup>(
  {
    label: { type: String, required: true },
    unitSingular: { type: String, required: true },
    unitPlural: { type: String, required: true },
    entities: [RelationEntitySchema],
  },
  { _id: false }
);

const CatalogSchema = new Schema<IClassCatalog>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    kind: { type: String, enum: ['magias', 'habilidades', 'relacao'] },
    icon: String,
    description: String,
    items: [CatalogItemSchema],
    groupA: RelationGroupSchema,
    groupB: RelationGroupSchema,
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

const DomainPowerSchema = new Schema<IClassDomainPower>(
  {
    name: { type: String, required: true },
    level: Number,
    description: { type: String, required: true },
  },
  { _id: false }
);

const DomainSpellSchema = new Schema<IClassDomainSpell>(
  {
    circle: { type: Number, required: true },
    name: { type: String, required: true },
  },
  { _id: false }
);

const ClassDomainSchema = new Schema<IClassDomain>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, required: true },
    powers: [DomainPowerSchema],
    spells: [DomainSpellSchema],
  },
  { _id: false }
);

const DivineOrderAbilitySchema = new Schema<IDivineOrderAbility>(
  {
    name: { type: String, required: true },
    level: { type: Number, required: true },
    description: { type: String, required: true },
    tables: [TableSchema],
  },
  { _id: false }
);

const DivineOrderSchema = new Schema<IDivineOrder>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    deity: String,
    image: String,
    description: { type: String, required: true },
    spellcasting: { type: String, required: true },
    skill: { type: String, required: true },
    weapon: { type: String, required: true },
    domainSlugs: [{ type: String }],
    abilities: [DivineOrderAbilitySchema],
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
    shortDescription: String,
    roles: [{ type: String, enum: CLASS_ROLE_IDS }],
    image: String,

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
    // Derivado das fichas de jogador; ver `playerCount` em class.d.ts.
    playerCount: { type: Number, default: 0 },

    sourceUrl: String,
    importedAt: Date,
    unparsedSections: [{ type: String }],
    contentBlocks: [ContentBlockSchema],
    domains: [ClassDomainSchema],
    divineOrders: [DivineOrderSchema],
    candidate: CandidateSchema,
  },
  { timestamps: true }
);

// O Mongoose pluralizaria 'CharacterClass' em 'characterclasses'. A coleção é
// fixada aqui para o nome acompanhar a rota e o resto do vocabulário.
CharacterClassSchema.set('collection', 'classes');

// `playerCount` só é escrito pela recontagem (`db/players/classPlayerCount.ts`),
// que usa `bulkWrite` e por isso não passa por estes hooks. O formulário da
// classe devolve o documento inteiro no PUT; sem esta guarda, o número que
// estava na tela quando o modal abriu sobrescreveria o atual.
function stripPlayerCount(update: Record<string, unknown> | null) {
  if (!update) return;
  delete update.playerCount;
  for (const op of ['$set', '$setOnInsert', '$inc', '$unset']) {
    const target = update[op] as Record<string, unknown> | undefined;
    if (target) delete target.playerCount;
  }
}

CharacterClassSchema.pre(
  ['findOneAndUpdate', 'updateOne', 'updateMany'],
  function guardPlayerCount() {
    stripPlayerCount(this.getUpdate() as Record<string, unknown> | null);
  }
);

// Uma classe recém-criada não tem ficha nenhuma apontando para ela.
CharacterClassSchema.pre('save', function resetPlayerCount() {
  if (this.isNew) this.playerCount = 0;
});

export default CharacterClassSchema;
