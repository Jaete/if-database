import { NextRequest } from 'next/server';
import { returnSheet } from '@/services/creation.service';
import { creationRoute } from '../_creation';

export const dynamic = 'force-dynamic';

// Só admin: devolve com observações obrigatórias e passos marcados.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return creationRoute(request, params, { write: true }, async (id, actor) =>
    returnSheet(id, await request.json().catch(() => ({})), actor)
  );
}
