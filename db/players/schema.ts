// Espelha db/citizens/schema.ts, com os campos de vínculo e procedência no fim.
// Jogadores e cidadãos são coleções separadas de propósito: nenhuma consulta de
// uma precisa filtrar a outra.
import { Schema } from 'mongoose';
import IPlayer from './player';

const PlayerSchema = new Schema<IPlayer>({
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
  rarity: { type: String },
  icon: { type: String },
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

  // ── Defesas ──
  // Mesma forma do schema de monstro. Sem esta declaração o Mongoose descartava
  // em silêncio o que o formulário de cidadão já enviava.
  defenses: {
    vulnerabilities: [{ type: String }],
    resistances: [{ type: String }],
    damageImmunities: [{ type: String }],
    conditionImmunities: [{ type: String }],
  },

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
    accessory1: { type: String },
    accessory2: { type: String },
    gil: { type: Number },
    backpack: { type: String },
  },

  // ── Aparência e História ──
  appearance: { type: String },
  backstory: { type: String },

  // ── Vínculo com o jogador (a pessoa) e procedência da ficha ──
  ownerForumUserId: { type: Number, index: true },
  ownerUsername: { type: String, index: true },
  forumTopicUrl: { type: String },
  importedAt: { type: Date },
});

PlayerSchema.set('collection', 'players');

export default PlayerSchema;
