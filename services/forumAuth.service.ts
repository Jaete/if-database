import { createHmac, timingSafeEqual, randomBytes } from 'crypto';
import { connectDB } from '@/lib/db';
import User from '@/db/users/users';
import Time from '@/lib/time';

const TICKET_SECRET = process.env.JWT_SECRET || 'fallback-dev-secret';
const TICKET_EXPIRY = Time.minutes(1);
const TICKET_PURPOSE = 'forum-sso';

const FORUM_BASE =
  process.env.FORUM_ORIGIN || 'https://isekaifantasy.forumbrasil.net';
const VERIFY_EXPIRY = Time.minutes(2);
const VERIFY_PURPOSE = 'forum-verify';

export interface ForumIdentity {
  username: string;
  forumUserId: number;
}

interface TicketPayload extends ForumIdentity {
  purpose: string;
  exp: number;
}

// ===== TICKET =====

function sign(body: string): string {
  return createHmac('sha256', TICKET_SECRET).update(body).digest('base64url');
}

export function signForumTicket(identity: ForumIdentity): string {
  const payload: TicketPayload = {
    ...identity,
    purpose: TICKET_PURPOSE,
    exp: Math.floor(Date.now() / 1000) + TICKET_EXPIRY,
  };
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${body}.${sign(body)}`;
}

export function verifyForumTicket(ticket: string): ForumIdentity | null {
  try {
    const parts = ticket.split('.');
    if (parts.length !== 2) return null;

    const [body, signature] = parts;
    const sigBuf = Buffer.from(signature, 'base64url');
    const expectedBuf = Buffer.from(sign(body), 'base64url');

    if (sigBuf.length !== expectedBuf.length) return null;
    if (!timingSafeEqual(sigBuf, expectedBuf)) return null;

    const payload: TicketPayload = JSON.parse(
      Buffer.from(body, 'base64url').toString('utf-8')
    );

    if (payload.purpose !== TICKET_PURPOSE) return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;

    return { username: payload.username, forumUserId: payload.forumUserId };
  } catch {
    return null;
  }
}

// ===== VERIFY NONCE (prova de identidade) =====
//
// Ao contrário do ticket de SSO (identidade só afirmada), este fluxo PROVA a
// posse da conta do fórum: o servidor emite um nonce, o dono o escreve no
// próprio campo de perfil, e o servidor lê a página pública /u{id}. Só o dono
// edita o próprio perfil, então um user_id forjado apontando para outro admin
// não passa (o atacante não consegue escrever o nonce no perfil alheio).

interface VerifyPayload {
  userId: number;
  nonce: string;
  purpose: string;
  exp: number;
}

export function generateNonce(): string {
  return randomBytes(12).toString('hex');
}

export function signVerifyTicket(userId: number, nonce: string): string {
  const payload: VerifyPayload = {
    userId,
    nonce,
    purpose: VERIFY_PURPOSE,
    exp: Math.floor(Date.now() / 1000) + VERIFY_EXPIRY,
  };
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${body}.${sign(body)}`;
}

export function verifyVerifyTicket(
  ticket: string
): { userId: number; nonce: string } | null {
  try {
    const parts = ticket.split('.');
    if (parts.length !== 2) return null;

    const [body, signature] = parts;
    const sigBuf = Buffer.from(signature, 'base64url');
    const expectedBuf = Buffer.from(sign(body), 'base64url');

    if (sigBuf.length !== expectedBuf.length) return null;
    if (!timingSafeEqual(sigBuf, expectedBuf)) return null;

    const payload: VerifyPayload = JSON.parse(
      Buffer.from(body, 'base64url').toString('utf-8')
    );

    if (payload.purpose !== VERIFY_PURPOSE) return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;

    return { userId: payload.userId, nonce: payload.nonce };
  } catch {
    return null;
  }
}

// Lê a página pública do perfil e extrai o username do dono e o valor do campo
// custom (profile_field_13_5, que renderiza como <dl id="field_id5">).
export async function readForumProfile(
  userId: number
): Promise<{ username: string; fieldValue: string } | null> {
  try {
    const res = await fetch(`${FORUM_BASE}/u${userId}`);
    if (!res.ok) return null;
    const html = await res.text();

    const titleMatch = html.match(
      /<title>\s*Perfil\s*-\s*([^<]+?)\s*<\/title>/i
    );
    const username = titleMatch ? titleMatch[1].trim() : '';
    if (!username) return null;

    const fieldMatch = html.match(
      /<dl id="field_id5">[\s\S]*?<div class="field_uneditable">([\s\S]*?)<\/div>/
    );
    const fieldValue = fieldMatch ? fieldMatch[1].trim() : '';

    return { username, fieldValue };
  } catch (error) {
    console.error('Forum profile read error:', error);
    return null;
  }
}

// ===== USER RESOLUTION =====

type ResolveResult =
  | { success: true; user: { username: string; role: string } }
  | { success: false; error: 'conta_local' | 'erro_interno' };

/**
 * The forum payload is unverifiable (it originates from browser JS), so a forum
 * identity may never take over an account that can authenticate on its own.
 */
export async function resolveForumUser(
  identity: ForumIdentity
): Promise<ResolveResult> {
  try {
    await connectDB();

    const linked = await User.findOne({ forumUserId: identity.forumUserId });

    if (linked) {
      if (linked.password || linked.role !== 'viewer') {
        return { success: false, error: 'conta_local' };
      }

      if (linked.username !== identity.username) {
        const taken = await User.findOne({ username: identity.username })
          .select('_id')
          .lean();
        if (!taken) {
          linked.username = identity.username;
          await linked.save();
        }
      }

      return {
        success: true,
        user: { username: linked.username, role: linked.role },
      };
    }

    const byName = await User.findOne({ username: identity.username });

    if (byName) {
      if (byName.password || byName.role !== 'viewer') {
        return { success: false, error: 'conta_local' };
      }

      byName.forumUserId = identity.forumUserId;
      byName.provider = 'forum';
      await byName.save();

      return {
        success: true,
        user: { username: byName.username, role: byName.role },
      };
    }

    const created = await User.create({
      username: identity.username,
      forumUserId: identity.forumUserId,
      provider: 'forum',
      role: 'viewer',
    });

    return {
      success: true,
      user: { username: created.username, role: created.role },
    };
  } catch (error) {
    console.error('Forum SSO resolve error:', error);
    return { success: false, error: 'erro_interno' };
  }
}

// Identidade PROVADA (via nonce no perfil). Diferente de resolveForumUser, não
// recusa admin/editor: a role vem do banco e é respeitada, porque já sabemos que
// é mesmo o dono da conta. Chaveia por forumUserId; o username é o autoritativo
// lido da página do perfil. Promover continua sendo manual no banco.
export async function resolveVerifiedForumUser(
  forumUserId: number,
  username: string
): Promise<ResolveResult> {
  try {
    await connectDB();

    const linked = await User.findOne({ forumUserId });
    if (linked) {
      if (linked.username !== username) {
        const taken = await User.findOne({ username }).select('_id').lean();
        if (!taken) {
          linked.username = username;
          await linked.save();
        }
      }
      return {
        success: true,
        user: { username: linked.username, role: linked.role },
      };
    }

    const byName = await User.findOne({ username });
    if (byName) {
      byName.forumUserId = forumUserId;
      byName.provider = 'forum';
      await byName.save();
      return {
        success: true,
        user: { username: byName.username, role: byName.role },
      };
    }

    const created = await User.create({
      username,
      forumUserId,
      provider: 'forum',
      role: 'viewer',
    });
    return {
      success: true,
      user: { username: created.username, role: created.role },
    };
  } catch (error) {
    console.error('Forum verified resolve error:', error);
    return { success: false, error: 'erro_interno' };
  }
}
