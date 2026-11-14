import type { NextRequest } from 'next/server';

// `Origin` é obrigatório em requisição com efeito colateral e não pode ser
// forjado por página; compará-lo com a origem desta requisição barra o CSRF
// numa rota autenticada por cookie ambiente. É a regra de todas as rotas de
// escrita do embed.
export function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  try {
    return new URL(origin).origin === request.nextUrl.origin;
  } catch {
    return false;
  }
}
