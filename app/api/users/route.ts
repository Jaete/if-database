import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/db/users/users';
import { getAuthorizedSession } from '@/services/auth.service';

/**
 * Lista enxuta de contas para o seletor de dono de personagem. Restrita a quem
 * pode editar: é a lista de membros do fórum, e não precisa ficar pública.
 * Nunca devolve `password`.
 */
export async function GET() {
  try {
    const session = await getAuthorizedSession();
    if (!session || session.role === 'viewer') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
    }

    await connectDB();
    const users = await User.find()
      .select('username avatarUrl forumUserId')
      .sort({ username: 1 })
      .lean();

    return NextResponse.json(users);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
