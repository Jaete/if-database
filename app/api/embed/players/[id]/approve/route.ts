import { NextRequest } from 'next/server';
import { approveSheet } from '@/services/creation.service';
import { creationRoute } from '../_creation';

export const dynamic = 'force-dynamic';

// Só admin (o serviço confere): trava a ficha. Daí em diante, só subida de nível.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return creationRoute(request, params, { write: true }, (id, actor) =>
    approveSheet(id, actor)
  );
}
