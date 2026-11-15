import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { isSameOrigin } from '@/lib/embedRequest';
import { getAccess } from '@/services/levelUp.service';
import { OWN_SHEET_EDIT_MESSAGE } from '@/lib/sheetAccess';
import { getEmbedSession } from '@/services/embedAuth.service';
import { SheetEditError, staffEditSheet } from '@/services/sheetEdit';

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
    const updated = await staffEditSheet(id, body, {
      username: session!.username,
      forumUserId: session!.forumUserId,
      role: session!.role,
      isOwner: access.isOwner,
      isStaff: access.isStaff,
    });
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof SheetEditError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }
    console.error('Embed player update error:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
