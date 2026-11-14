import type { Types } from 'mongoose';

/** Uma linha do recibo de XP: a fonte e quanto ela valeu. */
export interface IXpLine {
  line: string;
  value: number;
}

export type PlayerEventKind =
  'grant' | 'correction' | 'seal' | 'reopen' | 'edit';

/**
 * O histórico da ficha: só inclusão. Uma correção é um lançamento novo
 * (negativo ou estorno) com motivo, nunca uma edição do antigo.
 */
export interface IPlayerEvent {
  playerId: Types.ObjectId;
  kind: PlayerEventKind;
  /** XP do lançamento; ausente em reabertura, edição e selo. */
  amount?: number;
  reason: string;
  lines?: IXpLine[];
  /** Concessão que este lançamento estorna. */
  reversalOf?: Types.ObjectId;
  /** Nível a que o lançamento se refere (selo, reabertura, edição). */
  level?: number;
  /** Nível alcançado depois da concessão, para o rótulo "→ nível 8". */
  earnedAfter?: number;
  byUsername: string;
  byForumUserId: number;
  at: Date;
}

/** A rolagem de vida, gravada no servidor no instante em que acontece. */
export interface IHpRoll {
  rollId: string;
  playerId: Types.ObjectId;
  level: number;
  die: number;
  result: number;
  byUsername: string;
  byForumUserId: number;
  at: Date;
}
