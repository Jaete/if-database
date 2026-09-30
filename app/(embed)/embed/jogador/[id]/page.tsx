import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/db';
import { getPlayerById } from '@/services/player.service';
import PlayerSheet from '@/components/PlayerSheet';

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
    title: player
      ? `${player.name} · Ficha de personagem`
      : 'Ficha não encontrada',
  };
}

export default async function EmbedPlayerPage({ params }: { params: Params }) {
  const { id } = await params;
  const rawPlayer = await loadPlayer(id);
  if (!rawPlayer) notFound();

  const player = JSON.parse(JSON.stringify(rawPlayer));
  return (
    <main>
      <PlayerSheet player={player} />
    </main>
  );
}
