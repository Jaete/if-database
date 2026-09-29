import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { updateMonster, deleteMonster } from '@/services/monster.service';
import { getAuthorizedSession } from '@/services/auth.service';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getAuthorizedSession();
    if (!session || session.role === 'viewer') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
    }

    await connectDB();
    const body = await request.json();
    const slug = (await params).slug;
    const result = await updateMonster(slug, body);
    if (!result.success) throw new Error('Falha ao atualizar monstro');
    return NextResponse.json(result.data);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getAuthorizedSession();
    if (!session || session.role === 'viewer') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
    }

    await connectDB();
    const slug = (await params).slug;
    const result = await deleteMonster(slug);
    if (!result.success) throw new Error('Falha ao deletar monstro');
    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
