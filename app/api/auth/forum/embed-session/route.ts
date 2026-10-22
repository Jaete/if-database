import { NextRequest, NextResponse } from 'next/server';
import {
  verifyVerifyTicket,
  readForumProfile,
  resolveVerifiedForumUser,
  signEmbedToken,
} from '@/services/forumAuth.service';
import {
  EMBED_COOKIE,
  embedCookieOptions,
  getEmbedSession,
} from '@/services/embedAuth.service';

/**
 * Sessão da ficha embutida. Chamada de DENTRO do iframe, que roda na origem do
 * app — logo é same-origin e não leva cabeçalho de CORS nenhum.
 *
 * É o irmão de verify-callback: mesma prova por nonce, mas devolvendo JSON e um
 * cookie próprio em vez de redirecionar com o cookie de sessão do app, que
 * nunca chegaria aqui por ser `SameSite=Lax`.
 */

// Nunca cacheado: a resposta depende do cookie de quem chamou.
export const dynamic = 'force-dynamic';

// GET — quem sou eu agora? É o que faz o caminho comum não tocar no fórum.
export async function GET() {
  const session = await getEmbedSession();
  if (!session) return new NextResponse(null, { status: 204 });

  const response = NextResponse.json({
    username: session.username,
    role: session.role,
  });

  // Renovação deslizante, como /api/auth/verify já faz: quem usa o fórum com
  // frequência nunca volta a escrever o nonce no próprio perfil.
  response.cookies.set(
    EMBED_COOKIE,
    signEmbedToken({
      forumUserId: session.forumUserId,
      username: session.username,
    }),
    embedCookieOptions()
  );

  return response;
}

// POST — troca o ticket de verify (cujo nonce já foi escrito no perfil pelo
// sso.js) por uma sessão de embed.
export async function POST(request: NextRequest) {
  try {
    const { ticket } = await request.json();

    const claim = verifyVerifyTicket(ticket ?? '');
    if (!claim) {
      return NextResponse.json({ error: 'ticket_invalido' }, { status: 400 });
    }

    const profile = await readForumProfile(claim.userId);
    if (!profile) {
      return NextResponse.json({ error: 'erro_interno' }, { status: 500 });
    }

    // A prova: só o dono da conta consegue escrever no próprio perfil, então um
    // user_id forjado apontando para um admin não passa daqui.
    if (profile.fieldValue !== claim.nonce) {
      return NextResponse.json({ error: 'prova_falhou' }, { status: 403 });
    }

    const result = await resolveVerifiedForumUser(
      claim.userId,
      profile.username,
      profile.avatarUrl
    );
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    // Viewer também recebe cookie: assim o embed sabe quem é sem reverificar, e
    // apenas não mostra a afordância de edição. A recusa de verdade fica na
    // rota de escrita, que relê a role do banco.
    const response = NextResponse.json({
      username: result.user.username,
      role: result.user.role,
    });

    response.cookies.set(
      EMBED_COOKIE,
      signEmbedToken({
        forumUserId: claim.userId,
        username: result.user.username,
      }),
      embedCookieOptions()
    );

    return response;
  } catch (error) {
    console.error('Embed session error:', error);
    return NextResponse.json({ error: 'erro_interno' }, { status: 500 });
  }
}
