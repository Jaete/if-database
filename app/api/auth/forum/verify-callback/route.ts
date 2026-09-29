import { NextRequest, NextResponse } from 'next/server';
import {
  signToken,
  sessionCookieOptions,
  COOKIE_NAME,
} from '@/services/auth.service';
import {
  verifyVerifyTicket,
  readForumProfile,
  resolveVerifiedForumUser,
} from '@/services/forumAuth.service';

function safePath(raw: string | null): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return '/';
  return raw;
}

// Relative Location keeps the browser on whatever host it used (see the SSO
// callback for the Render-proxy origin caveat).
function redirectTo(path: string) {
  return new NextResponse(null, { status: 307, headers: { Location: path } });
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const path = safePath(searchParams.get('path'));
  const fail = (reason: string) => redirectTo(`/?sso_error=${reason}`);

  try {
    const claim = verifyVerifyTicket(searchParams.get('ticket') ?? '');
    if (!claim) return fail('ticket_invalido');

    // Lê a página pública do usuário reivindicado e confere o nonce. Só o dono
    // consegue ter escrito o nonce nesse perfil.
    const profile = await readForumProfile(claim.userId);
    if (!profile) return fail('erro_interno');
    if (profile.fieldValue !== claim.nonce) return fail('prova_falhou');

    const result = await resolveVerifiedForumUser(
      claim.userId,
      profile.username
    );
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
    console.error('Forum verify-callback error:', error);
    return fail('erro_interno');
  }
}
