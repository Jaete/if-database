import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getAuthorizedSession } from '@/services/auth.service';
import { listOwnersWithSheets } from '@/services/creation.service';

export const dynamic = 'force-dynamic';

// As contas do fórum e as fichas de cada uma, para o seletor de "Criar ficha
// vazia". Restrita à staff: é a lista de membros.
export async function GET() {
  try {
    const session = await getAuthorizedSession();
    if (!session || session.role === 'viewer') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
    }
    await connectDB();
    return NextResponse.json(await listOwnersWithSheets());
  } catch (error) {
    console.error('Owners list error:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
