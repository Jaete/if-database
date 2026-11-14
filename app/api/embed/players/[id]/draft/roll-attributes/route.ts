import { NextRequest } from 'next/server';
import { rollAttributes } from '@/services/creation.service';
import { creationRoute } from '../../_creation';

export const dynamic = 'force-dynamic';

// Rola 6×4d6 no servidor, uma vez só: recarregar devolve a mesma rolagem.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return creationRoute(request, params, { write: true }, (id, actor) =>
    rollAttributes(id, actor)
  );
}
