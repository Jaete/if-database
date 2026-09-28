import { NextResponse } from 'next/server';
import {
  getSessionFromCookie,
  setSessionCookie,
  refreshToken,
  COOKIE_NAME,
} from '@/services/auth.service';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const session = await getSessionFromCookie();

    if (!session) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    // Reset token expiry on every successful verify
    const cookieStore = await cookies();
    const rawToken = cookieStore.get(COOKIE_NAME)?.value;

    if (rawToken) {
      const newToken = refreshToken(rawToken);
      if (newToken) {
        await setSessionCookie(newToken);
        return NextResponse.json({
          user: {
            username: session.username,
            role: session.role,
            provider: session.provider,
          },
          token: newToken,
        });
      }
    }

    return NextResponse.json({
      user: {
        username: session.username,
        role: session.role,
        provider: session.provider,
      },
    });
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
