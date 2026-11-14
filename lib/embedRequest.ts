// `Origin` é obrigatório em requisição com efeito colateral e não pode ser
// forjado por página; compará-lo com a origem desta requisição barra o CSRF
// numa rota autenticada por cookie ambiente. É a regra de todas as rotas de
// escrita do embed (e da ficha vazia e das imagens).

const first = (value: string | null) => value?.split(',')[0]?.trim() || '';

/**
 * As origens pelas quais este app é alcançado nesta requisição.
 *
 * Atrás do proxy do Render, `request.url` é o endereço INTERNO do servidor
 * (`http://localhost:10000`), não o público — compará-lo com o `Origin` do
 * navegador recusava toda escrita em produção. O endereço público vem nos
 * cabeçalhos do proxy (`x-forwarded-host`/`host` e `x-forwarded-proto`), que
 * uma página de outro site não consegue forjar numa requisição do navegador.
 */
function originsOf(request: Request): Set<string> {
  const origins = new Set<string>();
  try {
    origins.add(new URL(request.url).origin);
  } catch {
    // URL relativa ou inválida: os cabeçalhos abaixo bastam.
  }
  const host =
    first(request.headers.get('x-forwarded-host')) ||
    first(request.headers.get('host'));
  if (host) {
    const proto =
      first(request.headers.get('x-forwarded-proto')) ||
      (() => {
        try {
          return new URL(request.url).protocol.replace(':', '');
        } catch {
          return 'https';
        }
      })();
    origins.add(`${proto}://${host}`);
  }
  return origins;
}

export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  try {
    return originsOf(request).has(new URL(origin).origin);
  } catch {
    return false;
  }
}
