import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getRaceCatalog } from '@/services/race.service';

/**
 * As raças com as habilidades, para o seletor da ficha escolher e mostrar o
 * resultado na hora. Fica fora da leitura da ficha pelo mesmo motivo do
 * catálogo de arquétipos: quem só lê a ficha recebe a linhagem já resolvida.
 * Leitura aberta, como o resto do códice.
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    return NextResponse.json(
      await getRaceCatalog(
        {},
        {
          withHolders: true,
          forPlayer: request.nextUrl.searchParams.get('for') ?? undefined,
        }
      )
    );
  } catch (error) {
    console.error('Race catalog error:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
