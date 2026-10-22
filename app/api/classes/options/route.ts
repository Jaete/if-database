import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getClassOptions } from '@/services/class.service';

/**
 * Projeção magra para a listagem e o seletor da ficha.
 *
 * `holder` é o personagem sendo editado: é ele que decide se uma classe única
 * já tomada aparece (quando é ele quem a tem) ou some da lista.
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const holder = request.nextUrl.searchParams.get('holder') ?? undefined;
    return NextResponse.json(await getClassOptions(holder));
  } catch (error) {
    console.error('Class options error:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
