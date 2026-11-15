import type { Types } from 'mongoose';

/** Por onde a mudança entrou na ficha. */
export type AuditVia =
  | 'embed-edit'
  | 'app-edit'
  | 'app-create'
  | 'app-delete'
  | 'creation-draft'
  | 'creation-roll'
  | 'submit'
  | 'approve'
  | 'approve-adjust'
  | 'return'
  | 'level-up'
  | 'reopen'
  | 'edit-level'
  | 'xp';

export interface IAuditActor {
  username: string;
  forumUserId?: number;
  role?: string;
  isOwner?: boolean;
  isStaff?: boolean;
}

export interface IAuditChange {
  path: string;
  label: string;
  before?: unknown;
  after?: unknown;
}

/**
 * Uma linha da auditoria da ficha: só inclusão (a única edição é a FUSÃO de
 * salvamentos de rascunho do mesmo autor numa janela de 10 minutos).
 */
export interface ISheetAudit {
  playerId: Types.ObjectId;
  actor: IAuditActor;
  via: AuditVia;
  /** Início da entrada. */
  at: Date;
  /** A última mudança fundida nela (ordena a lista). */
  lastAt: Date;
  /** Até quando um novo salvamento do mesmo autor ainda funde nesta entrada. */
  openUntil?: Date;
  changes: IAuditChange[];
  /** Estado da ficha na escrita (na exclusão, o último conhecido). */
  sheetStatus?: string;
  /** A entrada é da fase em branco/rascunho: só a dona e a staff leem. */
  draftPhase?: boolean;
  /** A dona da ficha na escrita; reconhece-a depois da exclusão. */
  sheetOwnerId?: number;
  reason?: string;
  /** A ficha inteira, só na exclusão. Nunca sai pela API. */
  snapshot?: Record<string, unknown>;
}
