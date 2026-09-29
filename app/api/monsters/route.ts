import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import {
  getAllMonsters,
  getMonsterIndex,
  createMonster,
} from '@/services/monster.service';
import { getAuthorizedSession } from '@/services/auth.service';

export async function GET(request: Request) {
  try {
    await connectDB();
    const view = new URL(request.url).searchParams.get('view');
    const monsters =
      view === 'index' ? await getMonsterIndex() : await getAllMonsters();
    return NextResponse.json(monsters);
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
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
    }

    await connectDB();
    const body = await request.json();
    const result = await createMonster(body);
    if (!result.success) throw new Error('Falha ao criar monstro');
    return NextResponse.json(result.data);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
