import { NextRequest } from 'next/server';
import { rollStartingGil } from '@/services/creation.service';
import { creationRoute } from '../../_creation';

export const dynamic = 'force-dynamic';

// Rola o gil inicial da classe no servidor, uma vez só.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return creationRoute(request, params, { write: true }, (id, actor) =>
    rollStartingGil(id, actor)
  );
}
