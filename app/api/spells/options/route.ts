import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getSpellOptions } from '@/services/spell.service';

/**
 * O catálogo que o seletor da ficha mostra, já filtrado por classe e círculo.
 *
 * Leitura é aberta, como no resto do grimório: a ficha embutida é pública, e o
 * que está aqui é o mesmo que a página de magias já mostra a qualquer um.
 */
export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const num = (key: string) => {
      const raw = params.get(key);
      if (raw === null || raw.trim() === '') return undefined;
      const value = Number(raw);
      return Number.isFinite(value) ? value : undefined;
    };

    await connectDB();
    return NextResponse.json(
      await getSpellOptions({
        classId: params.get('classId') ?? undefined,
        circle: num('circle'),
        maxCircle: num('maxCircle'),
      })
    );
  } catch (error) {
    console.error('Spell options error:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
