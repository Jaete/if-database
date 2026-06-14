import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import {
  updateEvolutionTree,
  deleteEvolutionTree,
} from '@/services/evolutionTree.service';
import { getSessionFromCookie } from '@/services/auth.service';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getSessionFromCookie();
    if (!session || session.role === 'viewer') {
      return NextResponse.json({ error: 'Nao autorizado' }, { status: 403 });
    }

    await connectDB();
    const body = await request.json();
    const slug = (await params).slug;
    const result = await updateEvolutionTree(slug, body);
    if (!result.success) throw new Error('Falha ao atualizar arvore');
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
    const session = await getSessionFromCookie();
    if (!session || session.role === 'viewer') {
      return NextResponse.json({ error: 'Nao autorizado' }, { status: 403 });
    }

    await connectDB();
    const slug = (await params).slug;
    const result = await deleteEvolutionTree(slug);
    if (!result.success) throw new Error('Falha ao deletar arvore');
    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
