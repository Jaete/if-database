import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getAuthorizedSession } from '@/services/auth.service';
import { ForumSheetError } from '@/services/forumSheet.service';
import { importSpellTopic } from '@/services/spell.service';

/**
 * Importa um tópico de magias do fórum para o grimório.
 *
 * `/api/spells/import` é um segmento estático, então tem precedência sobre
 * `/api/spells/[slug]` — uma magia cujo slug fosse "import" ficaria inacessível
 * por essa rota, o que não é um nome plausível de magia.
 */
export async function POST(request: Request) {
  try {
    const session = await getAuthorizedSession();
    if (!session || session.role === 'viewer') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
    }

    const { url, circle } = await request.json();
    if (typeof url !== 'string' || !url.trim()) {
      return NextResponse.json(
        { error: 'Informe a URL do tópico de magias.' },
        { status: 400 }
      );
    }

    await connectDB();
    const result = await importSpellTopic(url, Number(circle));
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    // Erros de validação e de acesso ao fórum são do usuário, não do servidor.
    if (error instanceof ForumSheetError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('Spell import error:', error);
    const message =
      error instanceof Error ? error.message : 'Erro ao importar magias';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
