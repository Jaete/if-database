import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getAuthorizedSession } from '@/services/auth.service';
import { ForumSheetError } from '@/services/forumSheet.service';
import { importRaceTopic } from '@/services/race.service';

/**
 * Importa um tópico de raça do fórum.
 *
 * `import` é segmento estático e tem precedência sobre `[slug]`.
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
        { error: 'Informe a URL do tópico da raça.' },
        { status: 400 }
      );
    }

    await connectDB();
    const result = await importRaceTopic(url, { dryRun: !!dryRun });
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    if (error instanceof ForumSheetError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('Race import error:', error);
    const message =
      error instanceof Error ? error.message : 'Erro ao importar raça';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
