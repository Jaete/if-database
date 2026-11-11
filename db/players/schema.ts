// Espelha db/citizens/schema.ts, com os campos de vínculo e procedência no fim.
// Jogadores e cidadãos são coleções separadas de propósito: nenhuma consulta de
// uma precisa filtrar a outra.
import {
  Schema,
  type MongooseDefaultQueryMiddleware,
  type Query,
} from 'mongoose';
import IPlayer from './player';
import {
  classIdFromUpdate,
  recountClassPlayersSafely,
} from './classPlayerCount';

const PlayerSchema = new Schema<IPlayer>(
  {
    // ── Identidade ──
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    race: { type: String, required: true },
    gender: { type: String, required: true },
    class: { type: String, required: true },
    age: { type: String },
    height: { type: String },
    family: { type: String },
    kingdom: { type: String },
    clan: { type: String },
    deity: { type: String },

    // ── Geral (herdado de ICreature) ──
    size: { type: String },
    type: { type: String },
    alignment: { type: String },
    rarity: { type: String },
    icon: { type: String },
    image: { type: String },
    subtitle: { type: String },
    description: { type: String },

    // ── Combate (simplificado para cidadãos) ──
    combat: {
      ac: { type: Schema.Types.Mixed },
      hp: { type: Schema.Types.Mixed },
      speed: { type: Schema.Types.Mixed },
    },

    // ── Atributos (valor único, sem breakdown — compatibilidade) ──
    stats: {
      str: { type: String },
      dex: { type: String },
      con: { type: String },
      int: { type: String },
      wis: { type: String },
      cha: { type: String },
    },

    // ── Atributos com breakdown (Valor / +Raça / +Classe / Total / Mod) ──
    playerStats: { type: Schema.Types.Mixed },

    // ── Progressão ──
    level: { type: Number },
    experience: { type: Schema.Types.Mixed },

    // ── Recursos ──
    chi: { type: Schema.Types.Mixed },
    proficiencyBonus: { type: Number },

    // ── Proficiências ──
    proficiencies: { type: Schema.Types.Mixed },

    // ── Habilidades (classe, raciais, antecedente) ──
    abilities: [
      {
        name: { type: String },
        description: { type: String },
      },
    ],

    // ── Defesas ──
    // Mesma forma do schema de monstro. Sem esta declaração o Mongoose descartava
    // em silêncio o que o formulário de cidadão já enviava.
    defenses: {
      vulnerabilities: [{ type: String }],
      resistances: [{ type: String }],
      damageImmunities: [{ type: String }],
      conditionImmunities: [{ type: String }],
    },

    // ── Sentidos, idiomas e demais blocos herdados de ICreature ──
    // Mesmo caso das defesas acima. Um caminho não declarado não é apagado do
    // documento já gravado, mas o Mongoose o remove em silêncio do PAYLOAD de
    // escrita: sem estas declarações o valor podia ser lido e exibido, e nunca
    // editado — a gravação não acontecia, sem erro nenhum.
    senses: {
      passivePerception: { type: Number },
      darkvision: { type: Number },
      blindsight: { type: Number },
      tremorsense: { type: Number },
      truesight: { type: Number },
    },
    languages: [{ type: String }],
    traits: [
      {
        name: { type: String },
        description: { type: String },
      },
    ],

    // ── Profissões ──
    professions: { type: Schema.Types.Mixed },

    // ── Ações ──
    actions: [
      {
        name: { type: String },
        description: { type: String },
      },
    ],
    bonusActions: [
      {
        name: { type: String },
        description: { type: String },
      },
    ],
    reactions: [
      {
        name: { type: String },
        description: { type: String },
      },
    ],
    legendaryActions: [
      {
        name: { type: String },
        description: { type: String },
      },
    ],

    // ── Procedência da regra ──
    source: {
      book: { type: String },
      page: { type: Number },
    },

    // ── Conjuração (foco em jogador) ──
    classId: {
      type: Schema.Types.ObjectId,
      ref: 'CharacterClass',
      index: true,
    },

    playerSpellcasting: { type: Schema.Types.Mixed },

    // A escolha de arquétipo: `{ slug, features: [] }`. Mixed pelo mesmo motivo
    // do bloco acima — o que a ficha guarda é escolha, e o que dá forma a ela
    // é a tabela da classe, não este schema.
    archetype: { type: Schema.Types.Mixed },

    // A raça no códice e a escolha dentro dela (`ICitizenRaceChoice`). Mixed
    // pelo mesmo motivo do arquétipo: a forma da escolha vem da raça.
    raceId: { type: Schema.Types.ObjectId, ref: 'Race', index: true },
    raceChoice: { type: Schema.Types.Mixed },

    // ── Equipamento (slots + mochila + moedas) ──
    // Os slots são Mixed porque existem nas duas formas no banco: a string crua
    // que este schema declarava antes, e o objeto { name, description } que a
    // interface IEquipment descreve. readItem() (PlayerSheet/sheetData.ts) já lê
    // as duas; tipar como String aqui descartaria a descrição dos itens-objeto.
    equipment: {
      head: { type: Schema.Types.Mixed },
      torso: { type: Schema.Types.Mixed },
      legs: { type: Schema.Types.Mixed },
      feet: { type: Schema.Types.Mixed },
      hand: { type: Schema.Types.Mixed },
      offhand: { type: Schema.Types.Mixed },
      accessory1: { type: Schema.Types.Mixed },
      accessory2: { type: Schema.Types.Mixed },
      gil: { type: Number },
      backpack: { type: String },
    },

    // ── Aparência e História ──
    appearance: { type: String },
    backstory: { type: String },

    // Preferências de narração da pessoa, em texto livre. Ver ICitizen.
    narrationStyle: { type: String },

    // ── Vínculo com o jogador (a pessoa) e procedência da ficha ──
    ownerForumUserId: { type: Number, index: true },
    ownerUsername: { type: String, index: true },
    forumTopicUrl: { type: String },
    importedAt: { type: Date },
  },
  {
    // `updatedAt` é o que permite detectar edição concorrente entre dois
    // admins olhando a mesma ficha embutida no fórum.
    timestamps: true,
  }
);

PlayerSchema.set('collection', 'players');

/**
 * Remove, antes de gravar, as magias que vieram do grimório.
 *
 * A leitura funde as magias de `playerSpellcasting.spellRefs` dentro de
 * `spellLevels`, para que a ficha as renderize sem saber que existe um
 * grimório. O preço é que elas voltam no corpo do próximo save — e gravá-las
 * transformaria silenciosamente cada vínculo numa cópia embutida, desfazendo
 * a razão de a magia ser uma entidade própria.
 *
 * Isto mora no model, e não nas rotas, porque hoje há dois caminhos de escrita
 * de jogador (a ficha embutida e o formulário do app) e esquecer um deles
 * corromperia os dados em silêncio. `spellId` só existe em magia resolvida,
 * então a remoção não alcança as cópias legítimas das fichas antigas.
 */
function stripLinkedSpells(update: Record<string, unknown> | undefined) {
  if (!update) return;
  const target = (update.$set ?? update) as Record<string, unknown>;
  const casting = target.playerSpellcasting as
    { spellLevels?: { spells?: { spellId?: string }[] }[] } | undefined;
  if (!casting?.spellLevels) return;

  casting.spellLevels = casting.spellLevels.map((level) => ({
    ...level,
    spells: (level.spells ?? []).filter((spell) => !spell.spellId),
  }));
}

PlayerSchema.pre('findOneAndUpdate', function stripOnUpdate() {
  stripLinkedSpells(this.getUpdate() as Record<string, unknown>);
});

PlayerSchema.pre('updateOne', function stripOnUpdateOne() {
  stripLinkedSpells(this.getUpdate() as Record<string, unknown>);
});

// ── Contador de jogadores por classe (`playerCount`) ──
//
// Mora no model pelo mesmo motivo do strip acima: há vários caminhos de
// escrita de jogador (a ficha embutida, o formulário do app, os scripts de
// importação e vínculo), e um contador que dependesse de cada rota lembrar de
// atualizá-lo ficaria errado no primeiro que esquecesse.

// Criação e `save()` de documento. Num documento que já existia, o valor
// anterior de `classId` não fica disponível aqui; esse caso reconta todas.
PlayerSchema.pre('save', function markClassChange() {
  this.$locals.recountClass = this.isNew
    ? this.classId
      ? [this.classId]
      : false
    : this.isModified('classId')
      ? 'all'
      : false;
});

PlayerSchema.post('save', async function recountOnSave() {
  const target = this.$locals.recountClass as unknown[] | 'all' | false;
  if (!target) return;
  await recountClassPlayersSafely(target === 'all' ? undefined : target);
});

PlayerSchema.post('insertMany', async function recountOnInsertMany(docs) {
  // A tipagem do Mongoose declara o resultado como o model; em runtime é a
  // lista dos documentos inseridos.
  const inserted = docs as unknown as { classId?: unknown }[];
  const ids = inserted.map((d) => d.classId);
  if (ids.some(Boolean)) await recountClassPlayersSafely(ids);
});

// Updates e deletes por query. O `pre` guarda as classes de ANTES (as fichas
// que a query alcança), o `post` reconta essas mais a de destino — que é o que
// cobre a troca de classe, quando as duas pontas mudam de número.
const affectedClasses = new WeakMap<object, unknown[]>();

type PlayerQuery = Query<unknown, IPlayer>;

async function rememberClassesBefore(query: PlayerQuery, extra?: unknown) {
  const before = await query.model.distinct('classId', query.getFilter());
  affectedClasses.set(query, extra ? [...before, extra] : before);
}

async function recountRemembered(query: PlayerQuery) {
  const ids = affectedClasses.get(query);
  if (!ids) return;
  affectedClasses.delete(query);
  await recountClassPlayersSafely(ids);
}

const UPDATES: MongooseDefaultQueryMiddleware[] = [
  'findOneAndUpdate',
  'findOneAndReplace',
  'updateOne',
  'updateMany',
  'replaceOne',
];
const DELETES: MongooseDefaultQueryMiddleware[] = [
  'findOneAndDelete',
  'deleteOne',
  'deleteMany',
];

PlayerSchema.pre<PlayerQuery>(UPDATES, async function captureOnUpdate() {
  // Renomear a classe (`updateMany({ classId }, { class })`) e quase todo save
  // de ficha não tocam no vínculo: nada a contar.
  const change = classIdFromUpdate(
    this.getUpdate() as Record<string, unknown> | null
  );
  if (change.touched) await rememberClassesBefore(this, change.value);
});

PlayerSchema.pre<PlayerQuery>(DELETES, async function captureOnDelete() {
  await rememberClassesBefore(this);
});

PlayerSchema.post<PlayerQuery>(
  [...UPDATES, ...DELETES],
  async function recountOnQuery() {
    await recountRemembered(this);
  }
);

export default PlayerSchema;
