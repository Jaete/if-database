import { NextResponse } from 'next/server';
import { getAuthorizedSession } from '@/services/auth.service';
import {
  ForumSheetError,
  importForumSheet,
} from '@/services/forumSheet.service';

export async function POST(request: Request) {
  try {
    const session = await getAuthorizedSession();
    if (!session || session.role === 'viewer') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
    }

    const { url } = await request.json();
    if (typeof url !== 'string' || !url.trim()) {
      return NextResponse.json(
        { error: 'Informe a URL do tópico da ficha.' },
        { status: 400 }
      );
    }

    const data = await importForumSheet(url);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    // Erros de validação e de acesso ao fórum são do usuário, não do servidor.
    if (error instanceof ForumSheetError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('Forum sheet import error:', error);
    const message =
      error instanceof Error ? error.message : 'Erro ao importar ficha';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
