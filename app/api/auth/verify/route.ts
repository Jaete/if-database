import { NextResponse } from 'next/server';
import {
  getAuthorizedSession,
  signToken,
  setSessionCookie,
  clearSessionCookie,
} from '@/services/auth.service';

export async function GET() {
  try {
    // Reads the role fresh from the DB, so a promotion/demotion applied in the
    // database shows up on the next page load instead of being stuck in the JWT.
    const session = await getAuthorizedSession();

    if (!session) {
      await clearSessionCookie();
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    // Re-sign with the current role and reset expiry (sliding session).
    const token = signToken({
      username: session.username,
      role: session.role,
      provider: session.provider,
    });
    await setSessionCookie(token);

    return NextResponse.json({
      user: {
        username: session.username,
        role: session.role,
        provider: session.provider,
        avatarUrl: session.avatarUrl,
      },
      token,
    });
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
