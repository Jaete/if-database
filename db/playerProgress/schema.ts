import { Schema } from 'mongoose';
import type { ICreationRoll, IHpRoll, IPlayerEvent } from './playerProgress';

// Coleções próprias, e não um array dentro da ficha: o histórico cresce sem
// limite e o documento do jogador é lido inteiro a cada abertura da ficha.

export const PlayerEventSchema = new Schema<IPlayerEvent>(
  {
    playerId: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      required: true,
      index: true,
    },
    kind: {
      type: String,
      enum: [
        'grant',
        'correction',
        'seal',
        'reopen',
        'edit',
        'create',
        'submit',
        'approve',
        'return',
      ],
      required: true,
    },
    amount: { type: Number },
    reason: { type: String, required: true },
    lines: [{ _id: false, line: String, value: Number }],
    reversalOf: { type: Schema.Types.ObjectId },
    level: { type: Number },
    earnedAfter: { type: Number },
    byUsername: { type: String, required: true },
    byForumUserId: { type: Number, required: true },
    at: { type: Date, required: true, default: () => new Date() },
  },
  { collection: 'playerevents' }
);
PlayerEventSchema.index({ playerId: 1, at: -1 });

export const HpRollSchema = new Schema<IHpRoll>(
  {
    rollId: { type: String, required: true, unique: true },
    playerId: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      required: true,
    },
    level: { type: Number, required: true },
    die: { type: Number, required: true },
    result: { type: Number, required: true },
    byUsername: { type: String, required: true },
    byForumUserId: { type: Number, required: true },
    at: { type: Date, required: true, default: () => new Date() },
  },
  { collection: 'hprolls' }
);
// Uma rolagem por nível: é o que impede um segundo sorteio, mesmo com duas
// requisições simultâneas.
HpRollSchema.index({ playerId: 1, level: 1 }, { unique: true });

export const CreationRollSchema = new Schema<ICreationRoll>(
  {
    rollId: { type: String, required: true, unique: true },
    playerId: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      required: true,
    },
    kind: { type: String, enum: ['attributes', 'gil'], required: true },
    classSlug: String,
    sets: [[Number]],
    sums: [Number],
    formula: String,
    byUsername: { type: String, required: true },
    byForumUserId: { type: Number, required: true },
    at: { type: Date, required: true, default: () => new Date() },
  },
  { collection: 'creationrolls' }
);
// Uma rolagem de atributos por ficha, e uma de gil POR CLASSE (sem `classSlug`
// nos atributos): é o que impede rolar de novo, mesmo com duas requisições
// simultâneas.
CreationRollSchema.index(
  { playerId: 1, kind: 1, classSlug: 1 },
  { unique: true }
);
