import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getAllMonsters, createMonster } from '@/services/monster.service';
import { getSessionFromCookie } from '@/services/auth.service';

export async function GET() {
  try {
    await connectDB();
    const monsters = await getAllMonsters();
    return NextResponse.json(monsters);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSessionFromCookie();
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
