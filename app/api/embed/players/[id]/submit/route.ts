import { NextRequest } from 'next/server';
import { submitSheet } from '@/services/creation.service';
import { creationRoute } from '../_creation';

export const dynamic = 'force-dynamic';

// Valida o obrigatório no servidor, com as mesmas regras puras da tela.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return creationRoute(request, params, { write: true }, (id, actor) =>
    submitSheet(id, actor)
  );
}
