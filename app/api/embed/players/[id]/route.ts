import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { isSameOrigin } from '@/lib/embedRequest';
import { getAccess } from '@/services/levelUp.service';
import { OWN_SHEET_EDIT_MESSAGE } from '@/lib/sheetAccess';
import { getEmbedSession } from '@/services/embedAuth.service';
import { pickWritablePlayerFields } from '@/db/players/publicFields';
import { updatePlayerById, getPlayerById } from '@/services/player.service';
import { PlayerSheetError } from '@/services/playerSheetLinks.service';
import {
  normalizeSkills,
  normalizeSpellDC,
  normalizeStats,
} from '@/services/sheetEdit';

/**
 * Escrita da ficha embutida, chaveada por `_id` — é o que a tag [ficha] do
 * fórum carrega, enquanto /api/players/[slug] é chaveado por slug.
 *
 * Não reusa os handlers de app/api/_entity porque aqueles autenticam pelo
 * cookie de sessão do app, que é `SameSite=Lax` e nunca chega num iframe
 * cross-site.
 */

export const dynamic = 'force-dynamic';

// A autenticação aqui é por cookie ambiente, então o navegador anexaria o
// cookie também num fetch disparado por um site qualquer. `Origin` é enviado
// obrigatoriamente em requisições com efeito colateral e não pode ser forjado
// por página, então comparar contra a origem desta própria requisição barra o
// CSRF sem depender de token adicional.
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isSameOrigin(request)) {
      return NextResponse.json({ error: 'Origem inválida' }, { status: 403 });
    }

    const session = await getEmbedSession();
    const { id } = await params;
    await connectDB();
    // Poder de staff (admin ou editor) NESTA ficha: o dono vence o papel, então
    // quem é dono da própria ficha não a edita livremente (lib/sheetAccess.ts).
    const access = await getAccess(id, session);
    if (!access.isStaff) {
      return NextResponse.json(
        {
          error:
            access.isOwner && access.hasStaffRole
              ? OWN_SHEET_EDIT_MESSAGE
              : 'Não autorizado',
        },
        { status: 403 }
      );
    }
    const body = await request.json();
    const data = pickWritablePlayerFields(body?.fields);

    normalizeStats(data);
    normalizeSkills(data);

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'Nada para salvar' }, { status: 400 });
    }

    await connectDB();

    const current = await getPlayerById(id);
    if (!current) {
      return NextResponse.json(
        { error: 'Ficha não encontrada' },
        { status: 404 }
      );
    }

    // Em criação a edição livre não existe (o assistente e a revisão a
    // substituem); ela é para ficha aprovada ou antiga.
    if (current.status && current.status !== 'approved') {
      return NextResponse.json(
        {
          error:
            'A ficha ainda está em criação: use o assistente ou a revisão.',
        },
        { status: 409 }
      );
    }

    // Edição concorrente: dois admins com a mesma ficha aberta. O cliente manda
    // o `updatedAt` que carregou; se o documento já mudou desde então, recusa em
    // vez de sobrescrever em silêncio.
    if (body?.updatedAt) {
      const storedAt = current.updatedAt
        ? new Date(current.updatedAt).getTime()
        : 0;
      if (storedAt && storedAt !== new Date(body.updatedAt).getTime()) {
        return NextResponse.json(
          { error: 'Esta ficha foi alterada em outro lugar.' },
          { status: 409 }
        );
      }
    }

    normalizeSpellDC(data, current as unknown as Record<string, unknown>);

    // Raça e talentos recusados com a mensagem de quem os conferiu (400), e não
    // como falha interna: é o cliente que mandou uma escolha inválida.
    let updated;
    try {
      updated = await updatePlayerById(id, data);
    } catch (error) {
      if (error instanceof PlayerSheetError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.name === 'UniqueConflictError' ? 409 : 400 }
        );
      }
      throw error;
    }
    if (!updated) {
      return NextResponse.json(
        { error: 'Ficha não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Embed player update error:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
