import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import {
  getAllEvolutionTrees,
  createEvolutionTree,
} from '@/services/evolutionTree.service';
import { getAuthorizedSession } from '@/services/auth.service';

export async function GET() {
  try {
    await connectDB();
    const trees = await getAllEvolutionTrees();
    return NextResponse.json(trees);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAuthorizedSession();
    if (!session || session.role === 'viewer') {
      return NextResponse.json({ error: 'Nao autorizado' }, { status: 403 });
    }

    await connectDB();
    const body = await request.json();
    const result = await createEvolutionTree(body);
    if (!result.success) throw new Error('Falha ao criar arvore');
    return NextResponse.json(result.data);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
