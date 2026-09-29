import { NextRequest, NextResponse } from 'next/server';
import {
  signToken,
  sessionCookieOptions,
  COOKIE_NAME,
} from '@/services/auth.service';
import {
  verifyForumTicket,
  resolveForumUser,
} from '@/services/forumAuth.service';

function safePath(raw: string | null): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return '/';
  return raw;
}

// A relative Location keeps the browser on whatever host it already used.
// Building an absolute URL from request.nextUrl.origin would leak the origin
// the server sees internally, which behind Render's proxy is localhost:10000.
function redirectTo(path: string) {
  return new NextResponse(null, { status: 307, headers: { Location: path } });
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const path = safePath(searchParams.get('path'));

  const fail = (reason: string) => redirectTo(`/?sso_error=${reason}`);

  try {
    const identity = verifyForumTicket(searchParams.get('ticket') ?? '');
    if (!identity) return fail('ticket_invalido');

    const result = await resolveForumUser(identity);
    if (!result.success) return fail(result.error);

    const token = signToken({
      username: result.user.username,
      role: result.user.role,
      provider: 'forum',
    });
    const response = redirectTo(path);
    response.cookies.set(COOKIE_NAME, token, sessionCookieOptions());

    return response;
  } catch (error) {
    console.error('Forum callback error:', error);
    return fail('erro_interno');
  }
}
