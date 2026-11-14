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

// Apaga o cookie com as MESMAS opções com que foi criado (path, partitioned,
// sameSite none, secure): é o que faz o navegador removê-lo de fato.
function clearedCookie(response: NextResponse) {
  response.cookies.set(EMBED_COOKIE, '', {
    ...embedCookieOptions(),
    maxAge: 0,
  });
  return response;
}

// GET — a sessão guardada ainda é DE QUEM está logado no fórum agora?
//
// O cookie sozinho não prova isso: ele sobrevive a o usuário trocar de conta no
// fórum, e a ficha daria os poderes da conta ANTIGA à nova. Por isso o cliente
// diz quem o fórum afirma estar logado (`expect`, vindo do `host:hello`) e a
// sessão só vale se for a mesma conta. Sem `expect`, ou com outra conta,
// responde 204: a sessão não é reaproveitada, e no caso de outra conta o cookie
// é apagado.
export async function GET(request: NextRequest) {
  const session = await getEmbedSession();
  if (!session) return new NextResponse(null, { status: 204 });

  const expect = Number(request.nextUrl.searchParams.get('expect'));
  if (!Number.isInteger(expect) || expect !== session.forumUserId) {
    return Number.isInteger(expect) && expect !== 0
      ? clearedCookie(new NextResponse(null, { status: 204 }))
      : new NextResponse(null, { status: 204 });
  }

  const response = NextResponse.json({
    username: session.username,
    role: session.role,
    forumUserId: session.forumUserId,
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

// DELETE — o fórum diz que ninguém está logado: a sessão do embed é encerrada.
export async function DELETE() {
  return clearedCookie(new NextResponse(null, { status: 204 }));
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
