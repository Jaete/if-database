import { NextResponse } from 'next/server';
import MonsterModel from '@/db/monsters/monsters';
import type IMonster from '@/db/monsters/monster';
import { connectDB } from '@/lib/db';
import { createEntityService } from '@/services/createEntityService';
import { createCollectionHandlers } from '@/app/api/_entity/handlers';
import { getMonsterIndex } from '@/services/monster.service';

const handlers = createCollectionHandlers({
  service: createEntityService<IMonster>(MonsterModel),
  notFoundLabel: 'Monstro não encontrado',
  createErrorLabel: 'Falha ao criar monstro',
});

// GET próprio por causa de `?view=index`, que devolve só os campos que o grid
// usa. O resto é o handler compartilhado.
export async function GET(request: Request) {
  const view = new URL(request.url).searchParams.get('view');
  if (view !== 'index') return handlers.GET();

  try {
    await connectDB();
    return NextResponse.json(await getMonsterIndex());
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const POST = handlers.POST;
