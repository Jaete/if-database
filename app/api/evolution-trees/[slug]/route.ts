import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import {
  getEvolutionTreeBySlug,
  updateEvolutionTree,
  deleteEvolutionTree,
} from '@/services/evolutionTree.service';
import { getAuthorizedSession } from '@/services/auth.service';
import { corsResponse, corsOptions } from '@/lib/cors';

export async function OPTIONS() {
  return corsOptions();
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const slug = (await params).slug;
    const result = await getEvolutionTreeBySlug(slug);
    if (!result.success) {
      return corsResponse({ error: 'Arvore nao encontrada' }, 404);
    }
    return corsResponse(result.data);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return corsResponse({ error: errorMessage }, 500);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getAuthorizedSession();
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
    const session = await getAuthorizedSession();
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
