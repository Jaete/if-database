import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/db';
import { getPlayerById } from '@/services/player.service';
import { getHistory } from '@/services/levelUp.service';
import PlayerSheet from '@/components/PlayerSheet';
import EmbedCloseBridge from '@/components/EmbedCloseBridge';

type Params = Promise<{ id: string }>;

const loadPlayer = cache(async (id: string) => {
  await connectDB();
  return getPlayerById(id);
});

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  const player = await loadPlayer(id);
  return {
    title: !player
      ? 'Ficha não encontrada'
      : isUnsent(player.status)
        ? 'Ficha em criação'
        : `${player.name} · Ficha de personagem`,
  };
}

// Em criação e ainda não enviada, a ficha não é de ninguém além da dona e da
// staff: o servidor nem manda os campos (a dona e a staff os recebem pela rota
// de rascunho, que confere a permissão).
const isUnsent = (status?: string) => status === 'blank' || status === 'draft';

export default async function EmbedPlayerPage({ params }: { params: Params }) {
  const { id } = await params;
  const rawPlayer = await loadPlayer(id);
  if (!rawPlayer) notFound();

  const unsent = isUnsent(rawPlayer.status);
  const player = unsent
    ? {
        _id: String(rawPlayer._id),
        status: rawPlayer.status,
        ownerUsername: rawPlayer.ownerUsername,
        name: '',
        level: 1,
      }
    : JSON.parse(JSON.stringify(rawPlayer));
  const history = unsent
    ? []
    : JSON.parse(JSON.stringify(await getHistory(id)));

  // Nada é lido de searchParams de propósito: quem visualiza é descoberto pelo
  // handshake em postMessage com a página do fórum, não por um parâmetro na URL
  // — que seria forjável e obrigaria a republicar o bbcodeparser no fórum.
  //
  // FORUM_ORIGIN é server-only, então desce como prop em vez de virar um
  // NEXT_PUBLIC_*, mantendo uma fonte de verdade só. Vazio significa que a
  // ficha nunca entra em edição, que é o padrão certo para acesso direto.
  return (
    <main>
      <PlayerSheet
        player={player}
        forumOrigin={process.env.FORUM_ORIGIN ?? ''}
        history={history}
      />
      {/* Na visualização ampliada, o Esc dado com o foco na ficha fecha o
          modal do fórum. No post, a mensagem é ignorada lá do outro lado. */}
      <EmbedCloseBridge forumOrigin={process.env.FORUM_ORIGIN ?? ''} />
    </main>
  );
}
