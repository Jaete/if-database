import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getEmbedSession } from '@/services/embedAuth.service';
import { pickWritablePlayerFields } from '@/db/players/publicFields';
import { updatePlayerById, getPlayerById } from '@/services/player.service';
import { attributeKeyOf, modifierOf, spellSaveDC } from '@/lib/stats';

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
// `total` e `modifier` de cada atributo são derivados de base + bônus. Recalcular
// aqui em vez de aceitar o que o cliente mandou evita que a ficha guarde um
// modificador que não corresponde aos valores exibidos ao lado dele.
function normalizeStats(data: Record<string, unknown>) {
  const stats = data.playerStats;
  if (!stats || typeof stats !== 'object') return;

  for (const detail of Object.values(stats as Record<string, unknown>)) {
    if (!detail || typeof detail !== 'object') continue;
    const attr = detail as Record<string, unknown>;
    const base = Number(attr.base);
    if (!Number.isFinite(base)) continue;

    const total =
      base + (Number(attr.raceBonus) || 0) + (Number(attr.classBonus) || 0);
    attr.total = total;
    attr.modifier = modifierOf(total);
  }
}

/**
 * O CD de resistência é 8 + modificador do atributo de conjuração + bônus de
 * proficiência. Recalcular aqui mantém o número gravado coerente mesmo quando
 * o que mudou foi o atributo ou a proficiência, e não a tela de magias.
 *
 * `stored` é a ficha como está hoje: o cliente manda só as subárvores que
 * tocou, então cada parcela da conta pode vir do corpo ou do documento.
 */
function normalizeSpellDC(
  data: Record<string, unknown>,
  stored: Record<string, unknown> | null
) {
  const casting = (data.playerSpellcasting ?? stored?.playerSpellcasting) as
    Record<string, unknown> | undefined;
  if (!casting || typeof casting !== 'object') return;

  const key = attributeKeyOf(String(casting.ability ?? ''));
  if (!key) return;

  const playerStats = (data.playerStats ?? stored?.playerStats) as
    Record<string, { modifier?: number } | undefined> | undefined;
  const flat = (data.stats ?? stored?.stats) as
    Record<string, number | undefined> | undefined;

  const modifier =
    typeof playerStats?.[key]?.modifier === 'number'
      ? (playerStats[key] as { modifier: number }).modifier
      : typeof flat?.[key] === 'number'
        ? modifierOf(flat[key])
        : undefined;
  if (modifier === undefined) return;

  const proficiency =
    Number(data.proficiencyBonus ?? stored?.proficiencyBonus) || 0;

  // Quando a conjuração não veio no corpo, ela entra agora: o CD mudou por
  // causa de outro campo e precisa ser gravado junto com ele.
  data.playerSpellcasting = {
    ...casting,
    saveDC: spellSaveDC(modifier, proficiency),
  };
}

function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  try {
    return new URL(origin).origin === request.nextUrl.origin;
  } catch {
    return false;
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isSameOrigin(request)) {
      return NextResponse.json({ error: 'Origem inválida' }, { status: 403 });
    }

    const session = await getEmbedSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const data = pickWritablePlayerFields(body?.fields);

    normalizeStats(data);

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

    const updated = await updatePlayerById(id, data);
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
