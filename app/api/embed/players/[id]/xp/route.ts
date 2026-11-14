import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { isSameOrigin } from '@/lib/embedRequest';
import { resolveActor } from '@/services/embedActor.service';
import { getPlayerById } from '@/services/player.service';
import { LevelUpError, getHistory, grantXp } from '@/services/levelUp.service';

/**
 * "Conceder XP": o único caminho que altera a experiência. Só admin, relido do
 * banco a cada chamada. Correção é um lançamento negativo (ou o estorno de uma
 * concessão) com motivo, e nunca baixa o nível.
 */

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const before = request.nextUrl.searchParams.get('before') ?? undefined;
    const history = await getHistory(id, 60, before);
    return NextResponse.json({ history, hasMore: history.length === 60 });
  } catch (error) {
    console.error('XP history error:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
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
    if (!actor?.isStaff) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
    }
    const body = await request.json().catch(() => ({}));
    const result = await grantXp(
      id,
      {
        amount: Number(body?.amount),
        reason: String(body?.reason ?? ''),
        lines: Array.isArray(body?.lines) ? body.lines : [],
        reversalOf:
          typeof body?.reversalOf === 'string' ? body.reversalOf : undefined,
      },
      actor
    );
    return NextResponse.json({
      ...result,
      player: await getPlayerById(id),
      history: await getHistory(id),
    });
  } catch (error) {
    if (error instanceof LevelUpError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }
    console.error('XP grant error:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
