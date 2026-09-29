import { NextRequest } from 'next/server';
import { forumCorsResponse, forumCorsOptions } from '@/lib/cors';
import { generateNonce, signVerifyTicket } from '@/services/forumAuth.service';

export async function OPTIONS(request: NextRequest) {
  return forumCorsOptions(request.headers.get('origin'));
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  try {
    const { forumUserId } = await request.json();
    const id = Number(forumUserId);
    if (!Number.isInteger(id) || id <= 0) {
      return forumCorsResponse({ error: 'ID inválido' }, origin, 400);
    }

    const nonce = generateNonce();
    const ticket = signVerifyTicket(id, nonce);

    // O cliente escreve `nonce` no próprio campo de perfil e volta pelo
    // callback com `ticket`. O ticket carrega userId+nonce assinados.
    return forumCorsResponse({ nonce, ticket }, origin);
  } catch (error) {
    console.error('Forum verify-init error:', error);
    return forumCorsResponse(
      { error: 'Erro interno do servidor' },
      origin,
      500
    );
  }
}
