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

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const path = safePath(searchParams.get('path'));

  const fail = (reason: string) =>
    NextResponse.redirect(new URL(`/?sso_error=${reason}`, origin));

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
    const response = NextResponse.redirect(new URL(path, origin));
    response.cookies.set(COOKIE_NAME, token, sessionCookieOptions());

    return response;
  } catch (error) {
    console.error('Forum callback error:', error);
    return fail('erro_interno');
  }
}
