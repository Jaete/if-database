import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, setSessionCookie } from '@/services/auth.service';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Usuário e senha são obrigatórios' },
        { status: 400 }
      );
    }

    const result = await authenticateUser(username, password);

    if (!result.success || !result.token || !result.user) {
      return NextResponse.json(
        { error: result.error || 'Falha na autenticação' },
        { status: 401 }
      );
    }

    await setSessionCookie(result.token);

    return NextResponse.json({
      token: result.token,
      user: {
        username: result.user.username,
        role: result.user.role,
        provider: result.user.provider,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
