import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getArchetypeCatalog } from '@/services/classArchetypes.service';

/**
 * Os arquétipos de uma classe, com as habilidades de cada um e a progressão
 * que diz quando se escolhe e quantas cabem.
 *
 * Fica fora da leitura da ficha de propósito: a Invocadora de Espectros tem 32
 * habilidades descritas, e carregá-las em toda visita à ficha pagaria o
 * catálogo inteiro para mostrar as duas que o personagem escolheu. Aqui só o
 * seletor pede, e só quando abre.
 *
 * Leitura aberta, como o resto do códice.
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const classId = request.nextUrl.searchParams.get('classId') ?? undefined;
    return NextResponse.json(await getArchetypeCatalog(classId));
  } catch (error) {
    console.error('Archetype options error:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
