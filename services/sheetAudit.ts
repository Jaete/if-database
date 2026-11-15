import type { Types } from 'mongoose';
import PlayerModel from '../db/players/players';
import SheetAuditModel from '../db/sheetAudit/sheetAudits';
import type {
  AuditVia,
  IAuditActor,
  IAuditChange,
} from '../db/sheetAudit/sheetAudit.d';
import { diffSheet, mergeChanges, type IChange } from '../lib/sheetDiff';
import { PLAYER_PUBLIC_FIELDS } from '../db/players/publicFields';

/**
 * Auditoria da ficha: TUDO o que muda nela, por quem, por onde, e o que era
 * antes. Só inclusão; visível a todos (com duas exceções aplicadas na leitura,
 * ver `listAudit`).
 *
 * Escolha de projeto (documentada): o registro é gravado DEPOIS da escrita da
 * ficha ter dado certo, com o `before` lido logo antes dela e o `after` logo
 * depois. Assim uma escrita que falha (409, validação) não deixa registro
 * órfão, e uma que dá certo sempre tem o dela. A falha do próprio registro (o
 * banco caiu entre as duas) é registrada no log e não derruba a escrita já
 * feita; sem transação (o plano do Atlas pode não ter) é o menor mal. O
 * histórico amigável (`playerevents`) segue como está: a auditoria é a camada
 * de campo a campo por baixo dele.
 */

/** A janela em que salvamentos de rascunho do mesmo autor viram uma entrada. */
export const GROUP_WINDOW_MS = 10 * 60 * 1000;

type Doc = Record<string, unknown>;

/** O documento CRU da ficha (sem a leitura resolvida). */
export async function rawSheet(id: unknown): Promise<Doc | null> {
  if (!/^[0-9a-f]{24}$/i.test(String(id))) return null;
  return PlayerModel.findById(id).lean<Doc>();
}

const toChange = (c: IChange): IAuditChange => ({
  path: c.path,
  label: c.label,
  before: c.before,
  after: c.after,
});

export interface IAuditOptions {
  reason?: string;
  /** Funde com a entrada aberta do mesmo autor (salvamentos de rascunho). */
  group?: boolean;
  /** Mudanças que não são campos da ficha (uma rolagem, por exemplo). */
  extra?: IAuditChange[];
  /** A ficha inteira, na exclusão. */
  snapshot?: Doc;
  /** Grava mesmo sem mudança de campo (exclusão, criação). */
  force?: boolean;
  /** Grava só o fato (sem os valores do diff): exclusão de rascunho. */
  factOnly?: boolean;
  now?: Date;
}

/**
 * Grava a diferença entre `before` e `after`. Sem mudança, não grava (salvo
 * `force`). Nunca lança: falha vira log.
 */
export async function recordAudit(
  playerId: unknown,
  before: Doc | null,
  /** Já lida, ou um leitor: a leitura pós-escrita falha dentro do try. */
  afterOrLoader: Doc | null | (() => Promise<Doc | null>),
  actor: IAuditActor,
  via: AuditVia,
  options: IAuditOptions = {}
): Promise<void> {
  try {
    const after =
      typeof afterOrLoader === 'function'
        ? await afterOrLoader()
        : afterOrLoader;
    const changes = [
      ...(options.factOnly ? [] : diffSheet(before, after).map(toChange)),
      ...(options.extra ?? []),
    ];
    // O estado da ficha depois da escrita (na exclusão, o último conhecido)
    // decide se a entrada é da fase de rascunho, que só a dona e a staff leem.
    const sheetStatus = String((after ?? before)?.status ?? '') || undefined;
    const draftPhase = !sheetStatus
      ? false
      : sheetStatus === 'blank' || sheetStatus === 'draft';
    const rawOwner = (after ?? before)?.ownerForumUserId;
    const sheetOwnerId = typeof rawOwner === 'number' ? rawOwner : undefined;
    if (changes.length === 0 && !options.force) return;
    const now = options.now ?? new Date();
    const who = {
      username: actor.username,
      forumUserId: actor.forumUserId,
      role: actor.role,
      isOwner: !!actor.isOwner,
      isStaff: !!actor.isStaff,
    };

    if (options.group) {
      const open = await SheetAuditModel.findOne({
        playerId: playerId as Types.ObjectId,
        via,
        'actor.forumUserId': actor.forumUserId ?? null,
        'actor.username': actor.username,
        openUntil: { $gte: now },
      }).sort({ lastAt: -1 });
      if (open) {
        const merged = mergeChanges(
          open.changes.map((c) => ({
            path: c.path,
            label: c.label,
            before: c.before,
            after: c.after,
          })),
          changes as IChange[]
        );
        // Os campos voltaram ao original: a entrada não diz mais nada.
        if (merged.length === 0) {
          await SheetAuditModel.deleteOne({ _id: open._id });
          return;
        }
        await SheetAuditModel.updateOne(
          { _id: open._id },
          {
            $set: {
              changes: merged,
              draftPhase,
              sheetStatus,
              lastAt: now,
              openUntil: new Date(now.getTime() + GROUP_WINDOW_MS),
            },
          }
        );
        return;
      }
    }

    await SheetAuditModel.create({
      playerId: playerId as Types.ObjectId,
      actor: who,
      via,
      at: now,
      lastAt: now,
      ...(options.group
        ? { openUntil: new Date(now.getTime() + GROUP_WINDOW_MS) }
        : {}),
      changes,
      draftPhase,
      ...(sheetStatus ? { sheetStatus } : {}),
      ...(sheetOwnerId !== undefined ? { sheetOwnerId } : {}),
      ...(options.reason ? { reason: options.reason } : {}),
      ...(options.snapshot ? { snapshot: options.snapshot } : {}),
    });
  } catch (error) {
    console.error('Sheet audit error:', error);
  }
}

/**
 * Roda uma escrita e audita o que ela mudou: lê a ficha crua antes e depois.
 * Se a escrita lança, não há registro.
 */
export async function withAudit<T>(
  playerId: unknown,
  actor: IAuditActor,
  via: AuditVia,
  write: () => Promise<T>,
  options: IAuditOptions = {}
): Promise<T> {
  const before = await rawSheet(playerId);
  const result = await write();
  await recordAudit(
    playerId,
    before,
    () => rawSheet(playerId),
    actor,
    via,
    options
  );
  return result;
}

// ── Leitura ──────────────────────────────────────────────

export const AUDIT_PAGE = 50;

export interface IAuditViewer {
  isOwner: boolean;
  isStaff: boolean;
  /** A conta de quem lê; só serve para reconhecer a dona de ficha excluída. */
  forumUserId?: number;
}

// O que um visitante pode ver de campo: a whitelist pública da ficha, mais as
// rolagens da criação e o aviso de observações. Dona e staff veem o resto.
// `ownerForumUserId` e `creation` não saem para ninguém.
const PUBLIC_ROOTS = new Set<string>([
  ...PLAYER_PUBLIC_FIELDS,
  'roll',
  'review',
]);
const rootOf = (path: string) => path.split(/[.[]/)[0];

export interface IAuditEntryView {
  id: string;
  actor: { username: string; isOwner: boolean; isStaff: boolean };
  via: AuditVia;
  at: string;
  lastAt: string;
  changes: IAuditChange[];
  reason?: string;
  deleted?: boolean;
}

/**
 * A página de auditoria (50 por vez, a mais recente primeiro). Pública, com
 * estas regras no SERVIDOR:
 *   - ficha em branco ou em rascunho (antes do primeiro envio): só a dona e a
 *     staff leem, como o resto da ficha; depois do envio, todos leem tudo;
 *   - `creation` e as observações da revisão nunca chegam (o diff já as trata,
 *     e aqui se confere de novo); o snapshot da exclusão não sai.
 */
export async function listAudit(
  playerId: string,
  viewer: IAuditViewer,
  before?: string
): Promise<{ entries: IAuditEntryView[]; hasMore: boolean; next?: string }> {
  if (!/^[0-9a-f]{24}$/i.test(playerId)) return { entries: [], hasMore: false };
  const sheet = await PlayerModel.findById(playerId)
    .select('status')
    .lean<{ status?: string }>();
  const cursor = before ? new Date(before) : null;
  const rows = await SheetAuditModel.find({
    playerId,
    ...(cursor && !Number.isNaN(cursor.getTime())
      ? { lastAt: { $lt: cursor } }
      : {}),
  })
    .sort({ lastAt: -1 })
    .limit(AUDIT_PAGE + 1)
    .lean();
  const page = rows.slice(0, AUDIT_PAGE);
  const owner =
    viewer.isOwner ||
    (!sheet &&
      typeof viewer.forumUserId === 'number' &&
      rows.some((r) => r.sheetOwnerId === viewer.forumUserId));
  const privileged = owner || viewer.isStaff;
  // Ficha em branco/rascunho: tudo é da fase de rascunho. Ficha excluída: só o
  // que a entrada marcou como fase de rascunho (sem marca, vale como privada).
  const hidden = (r: { draftPhase?: boolean }) =>
    !privileged &&
    (sheet
      ? sheet.status === 'blank' || sheet.status === 'draft'
      : r.draftPhase !== false);
  const entries = page
    .filter((r) => !hidden(r))
    .map((r): IAuditEntryView => ({
      id: String(r._id),
      actor: {
        username: r.actor.username,
        isOwner: !!r.actor.isOwner,
        isStaff: !!r.actor.isStaff,
      },
      via: r.via,
      at: new Date(r.at).toISOString(),
      lastAt: new Date(r.lastAt).toISOString(),
      changes: (r.changes ?? [])
        .filter(
          (c) =>
            !/^(creation|review\.|ownerForumUserId)/.test(c.path) &&
            (privileged || PUBLIC_ROOTS.has(rootOf(c.path)))
        )
        .map((c) =>
          c.path === 'review'
            ? { path: c.path, label: c.label }
            : { path: c.path, label: c.label, before: c.before, after: c.after }
        ),
      ...(r.reason ? { reason: r.reason } : {}),
      ...(r.via === 'app-delete' ? { deleted: true } : {}),
    }));
  const hasMore = rows.length > AUDIT_PAGE;
  return {
    entries,
    hasMore,
    ...(hasMore
      ? { next: new Date(page[page.length - 1].lastAt).toISOString() }
      : {}),
  };
}
