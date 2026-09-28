import { createHmac, timingSafeEqual } from 'crypto';
import { connectDB } from '@/lib/db';
import User from '@/db/users/users';
import Time from '@/lib/time';

const TICKET_SECRET = process.env.JWT_SECRET || 'fallback-dev-secret';
const TICKET_EXPIRY = Time.minutes(1);
const TICKET_PURPOSE = 'forum-sso';

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
