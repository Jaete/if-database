import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getAuthorizedSession } from '@/services/auth.service';
import { ForumSheetError } from '@/services/forumSheet.service';
import { importClassTopic } from '@/services/class.service';

/**
 * Importa um tópico de classe do fórum.
 *
 * `import`, `options` e `link-spells` são segmentos estáticos e têm
 * precedência sobre `[slug]` — nenhum é slug plausível de classe.
 */
export async function POST(request: Request) {
  try {
    const session = await getAuthorizedSession();
    if (!session || session.role === 'viewer') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
    }

    const { url, dryRun } = await request.json();
    if (typeof url !== 'string' || !url.trim()) {
      return NextResponse.json(
        { error: 'Informe a URL do tópico da classe.' },
        { status: 400 }
      );
    }

    await connectDB();
    const result = await importClassTopic(url, { dryRun: !!dryRun });
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    if (error instanceof ForumSheetError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('Class import error:', error);
    const message =
      error instanceof Error ? error.message : 'Erro ao importar classe';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
