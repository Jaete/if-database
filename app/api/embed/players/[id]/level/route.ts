import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { isSameOrigin } from '@/lib/embedRequest';
import { resolveActor } from '@/services/embedActor.service';
import { getPlayerById } from '@/services/player.service';
import {
  LevelUpError,
  editSealedLevel,
  getHistory,
  getLevelPlan,
  getSealedPlan,
  markSeen,
  reopenLevel,
  rollHp,
  sealLevel,
} from '@/services/levelUp.service';
import type { ISealChoices } from '@/lib/levelUp';

/**
 * Subida de nível da ficha embutida.
 *
 * Permissão em duas camadas, as duas relidas do banco a cada chamada:
 *   - o DONO da ficha (a conta do fórum ligada a ela) pode rodar a subida da
 *     própria ficha: ver o plano, rolar a vida, selar, marcar novidades como
 *     vistas. Só isso: não passa pela rota de edição livre, que é de admin.
 *   - o ADMIN pode tudo isso e também reabrir e editar níveis selados.
 * O servidor refaz o plano a cada selo e valida as escolhas contra ele.
 */

export const dynamic = 'force-dynamic';

const fail = (error: unknown) => {
  if (error instanceof LevelUpError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status }
    );
  }
  console.error('Level-up error:', error);
  return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
};

// GET ?view=access            → { isAdmin, isOwner }
// GET ?view=plan              → o plano do próximo nível (dono ou admin)
// GET ?view=sealed&level=N    → o plano de um nível selado (admin)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const actor = await resolveActor(id);
    const view = request.nextUrl.searchParams.get('view');
    if (view === 'access') {
      return NextResponse.json({
        isAdmin: !!actor?.isAdmin,
        isOwner: !!actor?.isOwner,
      });
    }
    if (!actor) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
    }
    if (view === 'plan')
      return NextResponse.json(await getLevelPlan(id, actor));
    if (view === 'sealed') {
      const level = Number(request.nextUrl.searchParams.get('level'));
      return NextResponse.json(await getSealedPlan(id, level, actor));
    }
    return NextResponse.json({ error: 'Pedido inválido' }, { status: 400 });
  } catch (error) {
    return fail(error);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isSameOrigin(request)) {
      return NextResponse.json({ error: 'Origem inválida' }, { status: 403 });
    }
    const { id } = await params;
    await connectDB();
    const actor = await resolveActor(id);
    if (!actor) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
    }
    const body = await request.json().catch(() => ({}));
    const level = Number(body?.level);

    let result: Record<string, unknown> = {};
    switch (body?.action) {
      case 'roll':
        // A rolagem não devolve a ficha: só o resultado gravado.
        return NextResponse.json(await rollHp(id, actor));
      case 'seal':
        result = await sealLevel(id, body.choices as ISealChoices, actor);
        break;
      case 'reopen':
        result = await reopenLevel(id, level, String(body.reason ?? ''), actor);
        break;
      case 'edit':
        result = await editSealedLevel(
          id,
          level,
          body.choices as ISealChoices,
          String(body.reason ?? ''),
          actor
        );
        break;
      case 'seen':
        result = await markSeen(id, String(body.section ?? ''), actor);
        break;
      default:
        return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
    }

    return NextResponse.json({
      ...result,
      player: await getPlayerById(id),
      history: await getHistory(id),
    });
  } catch (error) {
    return fail(error);
  }
}
