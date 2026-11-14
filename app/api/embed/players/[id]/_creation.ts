import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { isSameOrigin } from '@/lib/embedRequest';
import { resolveActor } from '@/services/embedActor.service';
import type { IActor } from '@/services/levelUp.service';
import { CreationError } from '@/services/creation.service';
import { LevelUpError } from '@/services/levelUp.service';

/**
 * O invólucro das rotas de criação da ficha embutida: origem, sessão do embed
 * e o mapa de erros. A PERMISSÃO fina (dona, admin, ficha aprovada) é do
 * serviço, relida do banco a cada chamada; aqui só se barra quem nem sessão
 * tem e requisição de outra origem.
 */
export const creationRoute = async (
  request: NextRequest,
  params: Promise<{ id: string }>,
  options: { write: boolean },
  run: (id: string, actor: IActor, request: NextRequest) => Promise<unknown>
) => {
  try {
    if (options.write && !isSameOrigin(request)) {
      return NextResponse.json({ error: 'Origem inválida' }, { status: 403 });
    }
    const { id } = await params;
    await connectDB();
    const actor = await resolveActor(id);
    if (!actor) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
    }
    return NextResponse.json(await run(id, actor, request));
  } catch (error) {
    if (error instanceof CreationError) {
      return NextResponse.json(
        {
          error: error.message,
          ...(error.issues ? { issues: error.issues } : {}),
        },
        { status: error.status }
      );
    }
    if (error instanceof LevelUpError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }
    console.error('Creation error:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
};
