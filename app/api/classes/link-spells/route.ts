import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getAuthorizedSession } from '@/services/auth.service';
import { ForumSheetError } from '@/services/forumSheet.service';
import { linkSpellsToClasses } from '@/services/classLink.service';

export async function POST(request: Request) {
  try {
    const session = await getAuthorizedSession();
    if (!session || session.role === 'viewer') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
    }

    const { dryRun } = await request.json().catch(() => ({}));
    await connectDB();
    const report = await linkSpellsToClasses({ dryRun: !!dryRun });
    return NextResponse.json({ success: true, ...report });
  } catch (error) {
    if (error instanceof ForumSheetError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('Spell-class link error:', error);
    return NextResponse.json({ error: 'Erro ao vincular' }, { status: 500 });
  }
}
