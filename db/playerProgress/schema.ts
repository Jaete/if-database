import { Schema } from 'mongoose';
import type { IHpRoll, IPlayerEvent } from './playerProgress';

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
      enum: ['grant', 'correction', 'seal', 'reopen', 'edit'],
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
