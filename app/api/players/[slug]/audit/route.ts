import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import PlayerModel from '@/db/players/players';
import { getEmbedSession } from '@/services/embedAuth.service';
import { getAuthorizedSession } from '@/services/auth.service';
import { getAccess } from '@/services/levelUp.service';
import { listAudit } from '@/services/sheetAudit';
import { isSheetStaff, isStaffRole } from '@/lib/sheetAccess';

export const dynamic = 'force-dynamic';

/**
 * GET /api/players/<id>/audit?before=<cursor> — a auditoria da ficha, 50 por
 * página, pública. (O segmento se chama `slug` só porque a pasta irmã já usa
 * esse nome; vale o `_id` da ficha, e o slug também é aceito.)
 *
 * Quem lê é reconhecido pela sessão do embed (dona e staff da ficha) ou pela do
 * app. As regras de visibilidade (rascunho antes do envio, observações da
 * revisão) são aplicadas em `listAudit`, no servidor.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await connectDB();
    const sheet = /^[0-9a-f]{24}$/i.test(slug)
      ? { _id: slug }
      : await PlayerModel.findOne({ slug })
          .select('_id ownerForumUserId')
          .lean<{ _id: unknown }>();
    if (!sheet) return NextResponse.json({ entries: [], hasMore: false });
    const id = String(sheet._id);

    const embed = await getEmbedSession();
    const access = await getAccess(id, embed);
    let { isOwner, isStaff } = access;
    const app = await getAuthorizedSession();
    const forumUserId = app?.forumUserId ?? embed?.forumUserId;
    const owner = await PlayerModel.findById(id)
      .select('ownerForumUserId')
      .lean<{ ownerForumUserId?: number }>();
    // Ficha excluída: não há dona a comparar aqui (listAudit reconhece-a pela
    // entrada); a staff vale pelo papel.
    if (!owner) isStaff = isStaffRole(app?.role) || isStaffRole(embed?.role);
    if (owner && app && !isOwner && !isStaff) {
      const mine =
        typeof app.forumUserId === 'number' &&
        owner?.ownerForumUserId === app.forumUserId;
      isOwner = mine;
      isStaff = isSheetStaff(app.role, mine);
    }

    return NextResponse.json(
      await listAudit(
        id,
        { isOwner, isStaff, forumUserId },
        request.nextUrl.searchParams.get('before') ?? undefined
      )
    );
  } catch (error) {
    console.error('Audit read error:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
