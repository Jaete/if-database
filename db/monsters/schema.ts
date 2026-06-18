import { Schema } from 'mongoose';
import IMonster from './monster';

const MonsterSchema = new Schema<IMonster>(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    size: { type: String },
    type: { type: String },
    alignment: { type: String },
    rarity: { type: String },
    icon: { type: String },
    image: { type: String },
    subtitle: { type: String },
    description: { type: String },
    cr: { type: String },
    xp: { type: Number },
    dice: { type: String },
    combat: {
      ac: {
        value: { type: Number },
        formula: { type: String },
      },
      hp: {
        value: { type: Number },
        formula: { type: String },
      },
      speed: {
        walk: { type: Number },
        fly: { type: Number },
        swim: { type: Number },
        climb: { type: Number },
        burrow: { type: Number },
        note: { type: String },
      },
    },
    stats: {
      str: { type: Number },
      dex: { type: Number },
      con: { type: Number },
      int: { type: Number },
      wis: { type: Number },
      cha: { type: Number },
    },
    proficiencies: {
      savingThrows: [
        {
          attribute: { type: String },
          value: { type: Number },
        },
      ],
      skills: [
        {
          name: { type: String },
          value: { type: Number },
        },
      ],
    },
    defenses: {
      vulnerabilities: [{ type: String }],
      resistances: [{ type: String }],
      damageImmunities: [{ type: String }],
      conditionImmunities: [{ type: String }],
    },
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
    spellcasting: {
      ability: { type: String },
      saveDC: { type: Number },
      attackBonus: { type: Number },
      casterLevel: { type: Number },
      spellLevels: [
        {
          level: { type: Number },
          slots: { type: Number },
          spells: [
            {
              name: { type: String },
              description: { type: String },
              usage: { type: String },
            },
          ],
        },
      ],
    },
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
    source: {
      book: { type: String },
      page: { type: Number },
    },
    drops: [
      {
        item: { type: String },
        range: { type: String },
      },
    ],
    levels: [
      {
        level: { type: Number, required: true },
        acquiredPerks: [
          {
            type: {
              type: String,
              enum: ['atributo', 'habilidade', 'acao', 'classe'],
              required: true,
            },
            name: { type: String },
            description: { type: String },
            attribute: { type: String },
            value: { type: Number },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

MonsterSchema.set('collection', 'monsters');

export default MonsterSchema;
