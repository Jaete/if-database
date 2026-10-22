import { cookies } from 'next/headers';
import { connectDB } from '@/lib/db';
import User from '@/db/users/users';
import { verifyEmbedToken, EMBED_EXPIRY } from './forumAuth.service';

/**
 * Sessão da ficha embutida no fórum.
 *
 * Deliberadamente separada do cookie de sessão do app (auth.service.ts). Aquele
 * é `SameSite=Lax` e first-party; este precisa valer dentro de um iframe cujo
 * site de topo é o fórum. Afrouxar o cookie principal para isso o exporia a
 * CSRF sem necessidade, então são dois cookies com dois escopos.
 */

export const EMBED_COOKIE = 'embed_session';

/**
 * `SameSite` é avaliado contra o SITE DE TOPO, não contra a origem imediata.
 * Mesmo o fetch do iframe para a API sendo same-origin, para o navegador é
 * contexto cross-site — daí `sameSite: 'none'` (que obriga `secure`) mais
 * `partitioned` (CHIPS), sem o qual o cookie não sobrevive ao particionamento
 * de armazenamento do Chrome.
 *
 * `partitioned` é vantagem, não custo: prende o cookie ao par (esta origem,
 * fórum como topo), de modo que ele não se mistura com a sessão first-party.
 *
 * O Safari bloqueia cookie de terceiro de todo jeito; lá o cookie não persiste
 * e o handshake por nonce roda de novo a cada carga. Funciona, só mais lento.
 */
export function embedCookieOptions() {
  return {
    httpOnly: true,
    // Sempre `true`, mesmo em desenvolvimento: `sameSite: 'none'` sem `secure`
    // é recusado pelo navegador. É por isso que o teste local exige
    // `npm run dev:https`.
    secure: true,
    sameSite: 'none' as const,
    partitioned: true,
    maxAge: EMBED_EXPIRY,
    path: '/',
  };
}

// Mesma separação de getAuthorizedSession: o token prova QUEM é (sem ir ao
// banco), e a role — o que a pessoa PODE — é sempre lida fresca do banco.
export async function getEmbedSession(): Promise<{
  username: string;
  role: string;
  forumUserId: number;
} | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(EMBED_COOKIE)?.value;
  if (!token) return null;

  const claim = verifyEmbedToken(token);
  if (!claim) return null;

  await connectDB();
  const user = await User.findOne({ forumUserId: claim.forumUserId })
    .select('username role')
    .lean<{ username: string; role: string } | null>();
  if (!user) return null;

  return {
    username: user.username,
    role: user.role,
    forumUserId: claim.forumUserId,
  };
}
