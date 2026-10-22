import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getAuthorizedSession } from '@/services/auth.service';
import { ForumSheetError } from '@/services/forumSheet.service';
import { importTalentTopic } from '@/services/talent.service';

/**
 * Importa o tópico de talentos gerais do fórum.
 *
 * Os talentos DE CLASSE não passam por aqui: eles vêm junto da classe, pela
 * importação do tópico dela, e continuam morando no documento da classe.
 *
 * `/api/talents/import` é segmento estático e tem precedência sobre
 * `/api/talents/[slug]` — "import" não é nome plausível de talento.
 */
export async function POST(request: Request) {
  try {
    const session = await getAuthorizedSession();
    if (!session || session.role === 'viewer') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
    }

    const { url } = await request.json();
    if (typeof url !== 'string' || !url.trim()) {
      return NextResponse.json(
        { error: 'Informe a URL do tópico de talentos.' },
        { status: 400 }
      );
    }

    await connectDB();
    const result = await importTalentTopic(url);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    // Erros de validação e de acesso ao fórum são do usuário, não do servidor.
    if (error instanceof ForumSheetError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('Talent import error:', error);
    const message =
      error instanceof Error ? error.message : 'Erro ao importar talentos';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
