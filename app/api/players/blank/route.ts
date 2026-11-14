import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getAuthorizedSession } from '@/services/auth.service';
import { CreationError, createBlankSheet } from '@/services/creation.service';
import { isSameOrigin } from '@/lib/embedRequest';
import { fichaTag } from '@/lib/forumTag';
import User from '@/db/users/users';

export const dynamic = 'force-dynamic';

// POST { ownerForumUserId } → { id, tag }. Só a staff do app (admin ou editor),
// como a criação comum de jogador. A conta dona precisa ser do fórum.
export async function POST(request: NextRequest) {
  try {
    const session = await getAuthorizedSession();
    if (!session || session.role === 'viewer') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
    }
    // O app autentica por cookie ambiente; a origem barra o CSRF.
    if (!isSameOrigin(request)) {
      return NextResponse.json({ error: 'Origem inválida' }, { status: 403 });
    }
    const body = await request.json().catch(() => ({}));
    await connectDB();
    const staff = await User.findOne({ username: session.username })
      .select('forumUserId')
      .lean<{ forumUserId?: number } | null>();
    const created = await createBlankSheet(Number(body?.ownerForumUserId), {
      username: session.username,
      forumUserId: staff?.forumUserId,
    });
    return NextResponse.json(
      { ...created, tag: fichaTag(created.id) },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof CreationError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }
    console.error('Blank sheet error:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
