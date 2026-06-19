import { Schema } from 'mongoose';
import ICitizen from './citizen';

const CitizenSchema = new Schema<ICitizen>({
  // ── Identidade ──
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  race: { type: String, required: true },
  gender: { type: String, required: true },
  class: { type: String, required: true },
  age: { type: String },
  height: { type: String },
  family: { type: String },
  deity: { type: String },

  // ── Geral (herdado de ICreature) ──
  rarity: { type: String },
  image: { type: String },
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

  // ── Profissões ──
  professions: { type: Schema.Types.Mixed },

  // ── Ações ──
  actions: [
    {
      name: { type: String },
      description: { type: String },
    },
  ],

  // ── Conjuração (foco em jogador) ──
  playerSpellcasting: { type: Schema.Types.Mixed },

  // ── Equipamento (slots + mochila + moedas) ──
  equipment: {
    head: { type: String },
    torso: { type: String },
    legs: { type: String },
    feet: { type: String },
    hand: { type: String },
    offhand: { type: String },
    gil: { type: Number },
    backpack: { type: [Schema.Types.Mixed] },
  },

  // ── Aparência e História ──
  appearance: { type: String },
  backstory: { type: String },
});

CitizenSchema.set('collection', 'citizens');

export default CitizenSchema;
