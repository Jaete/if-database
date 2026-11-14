import { NextRequest } from 'next/server';
import { getCreation, saveDraft } from '@/services/creation.service';
import { creationRoute } from '../_creation';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

// GET   → o rascunho como a dona (ou a staff) o vê: ficha, estado, contexto,
//         rolagens gravadas e o que falta.
// PATCH → salva um passo. Recusa se a ficha foi aprovada e quem pede não é
//         admin.
export async function GET(request: NextRequest, { params }: Ctx) {
  return creationRoute(request, params, { write: false }, (id, actor) =>
    getCreation(id, actor)
  );
}

export async function PATCH(request: NextRequest, { params }: Ctx) {
  return creationRoute(request, params, { write: true }, async (id, actor) =>
    saveDraft(id, await request.json().catch(() => ({})), actor)
  );
}
