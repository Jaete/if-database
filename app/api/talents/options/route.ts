import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getTalentOptions } from '@/services/talent.service';

/**
 * O que um personagem pode escolher: os talentos gerais mais os da classe
 * ligada, numa lista só. Leitura aberta, como o resto do códice.
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const classId = request.nextUrl.searchParams.get('classId') ?? undefined;
    return NextResponse.json(await getTalentOptions(classId));
  } catch (error) {
    console.error('Talent options error:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
