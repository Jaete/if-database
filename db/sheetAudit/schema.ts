import { Schema } from 'mongoose';
import type { ISheetAudit } from './sheetAudit';

// Coleção própria, como o histórico: cresce sem limite e o documento da ficha é
// lido inteiro a cada abertura dela.
export const SheetAuditSchema = new Schema<ISheetAudit>(
  {
    playerId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    actor: {
      username: { type: String, required: true },
      forumUserId: Number,
      role: String,
      isOwner: Boolean,
      isStaff: Boolean,
    },
    via: { type: String, required: true },
    at: { type: Date, required: true, default: () => new Date() },
    lastAt: { type: Date, required: true, default: () => new Date() },
    openUntil: Date,
    changes: [
      {
        _id: false,
        path: String,
        label: String,
        before: Schema.Types.Mixed,
        after: Schema.Types.Mixed,
      },
    ],
    // Estado da ficha na escrita; `draftPhase` = blank/draft (só dona e staff).
    sheetStatus: String,
    draftPhase: Boolean,
    sheetOwnerId: Number,
    reason: String,
    snapshot: Schema.Types.Mixed,
  },
  { collection: 'sheetaudits' }
);
SheetAuditSchema.index({ playerId: 1, lastAt: -1 });
// A busca da entrada aberta para fundir salvamentos de rascunho.
SheetAuditSchema.index({
  playerId: 1,
  'actor.forumUserId': 1,
  via: 1,
  openUntil: 1,
});
