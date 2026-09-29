import { NextRequest } from 'next/server';
import { forumCorsResponse, forumCorsOptions } from '@/lib/cors';
import {
  resolveForumUser,
  sanitizeForumAvatar,
} from '@/services/forumAuth.service';

// Passive registration: the forum-side script calls this on every page load
// for a logged-in user it hasn't seen before (tracked via localStorage), so
// members get a viewer account here just from using the forum — no SSO
// ticket, no session cookie, nothing set on this domain. It shares the same
// upsert as the SSO callback, so it inherits the same refusal for any
// username that already has a password or a non-viewer role.
export async function OPTIONS(request: NextRequest) {
  return forumCorsOptions(request.headers.get('origin'));
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');

  try {
    const { username, forumUserId, avatar } = await request.json();

    if (typeof username !== 'string' || username.trim().length < 1) {
      return forumCorsResponse({ error: 'Usuário inválido' }, origin, 400);
    }

    const id = Number(forumUserId);
    if (!Number.isInteger(id) || id <= 0) {
      return forumCorsResponse({ error: 'ID inválido' }, origin, 400);
    }

    // Anything that is not a forum-hosted image URL is simply dropped: the
    // account is still worth creating without an avatar.
    const result = await resolveForumUser(
      { username: username.trim(), forumUserId: id },
      sanitizeForumAvatar(avatar)
    );

    if (!result.success) {
      return forumCorsResponse({ error: result.error }, origin, 409);
    }

    return forumCorsResponse({ success: true }, origin);
  } catch (error) {
    console.error('Forum collect error:', error);
    return forumCorsResponse(
      { error: 'Erro interno do servidor' },
      origin,
      500
    );
  }
}
