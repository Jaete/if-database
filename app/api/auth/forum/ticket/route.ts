import { NextRequest } from 'next/server';
import { forumCorsResponse, forumCorsOptions } from '@/lib/cors';
import { signForumTicket } from '@/services/forumAuth.service';

export async function OPTIONS(request: NextRequest) {
  return forumCorsOptions(request.headers.get('origin'));
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');

  try {
    const { username, forumUserId } = await request.json();

    if (typeof username !== 'string' || username.trim().length < 1) {
      return forumCorsResponse({ error: 'Usuário inválido' }, origin, 400);
    }

    const id = Number(forumUserId);
    if (!Number.isInteger(id) || id <= 0) {
      return forumCorsResponse({ error: 'ID inválido' }, origin, 400);
    }

    const ticket = signForumTicket({
      username: username.trim(),
      forumUserId: id,
    });

    return forumCorsResponse({ ticket }, origin);
  } catch (error) {
    console.error('Forum ticket error:', error);
    return forumCorsResponse(
      { error: 'Erro interno do servidor' },
      origin,
      500
    );
  }
}
