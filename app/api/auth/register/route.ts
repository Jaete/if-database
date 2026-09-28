import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/db/users/users';
import {
  hashPassword,
  signToken,
  setSessionCookie,
} from '@/services/auth.service';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Usuário e senha são obrigatórios' },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        { error: 'Usuário deve ter pelo menos 3 caracteres' },
        { status: 400 }
      );
    }

    if (password.length < 4) {
      return NextResponse.json(
        { error: 'Senha deve ter pelo menos 4 caracteres' },
        { status: 400 }
      );
    }

    await connectDB();

    const existing = await User.findOne({ username }).lean();
    if (existing) {
      if (!existing.password) {
        return NextResponse.json(
          {
            error: 'Este usuário já está vinculado ao fórum',
            code: 'FORUM_ACCOUNT',
          },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: 'Usuário já existe' }, { status: 409 });
    }

    const hashed = hashPassword(password);

    await User.create({
      username,
      password: hashed,
      role: 'viewer',
      provider: 'local',
    });

    // Auto-login after registration
    const token = signToken({ username, role: 'viewer', provider: 'local' });
    await setSessionCookie(token);

    return NextResponse.json({
      token,
      user: { username, role: 'viewer', provider: 'local' },
    });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
