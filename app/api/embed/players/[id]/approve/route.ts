import { NextRequest } from 'next/server';
import { approveSheet } from '@/services/creation.service';
import { creationRoute } from '../_creation';

export const dynamic = 'force-dynamic';

// Só admin (o serviço confere): trava a ficha. Daí em diante, só subida de nível.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Corpo `{ fields, updatedAt }` = aprovação com ajustes (o narrador edita e
  // aprova numa escrita só); sem `fields`, a aprovação simples.
  return creationRoute(request, params, { write: true }, async (id, actor) => {
    const body = await request.json().catch(() => ({}));
    return approveSheet(
      id,
      actor,
      body && typeof body === 'object' && 'fields' in body
        ? { fields: body.fields, updatedAt: body.updatedAt }
        : undefined
    );
  });
}
