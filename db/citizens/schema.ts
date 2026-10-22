import { Schema } from 'mongoose';
import ICitizen from './citizen';

const CitizenSchema = new Schema<ICitizen>(
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

    // ── Equipamento (slots + mochila + moedas) ──
    // Mixed porque os slots existem nas duas formas no banco: a string crua que
    // este schema declarava antes e o objeto { name, description } de IEquipment.
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
  },
  {
    timestamps: true,
  }
);

CitizenSchema.set('collection', 'citizens');

export default CitizenSchema;
