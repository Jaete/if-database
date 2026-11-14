import { connectDB } from '@/lib/db';
import { getAllPlayers } from '@/services/player.service';
import { getAuthorizedSession } from '@/services/auth.service';
import { redactPlayer } from '@/db/players/redact';
import PlayersPageClient from './PlayersPageClient';
import IPlayer from '@/db/players/player';

export const dynamic = 'force-dynamic';

export default async function PlayersPage() {
  let serialized: IPlayer[] = [];
  try {
    await connectDB();
    const players = await getAllPlayers();
    const session = await getAuthorizedSession();
    const staff = !!session && session.role !== 'viewer';
    // Rascunho e estado de criação só para a staff.
    serialized = JSON.parse(JSON.stringify(players)).map((p: IPlayer) =>
      redactPlayer(p, staff)
    );
  } catch (error) {
    console.error('Failed to load players:', error);
  }
  return <PlayersPageClient initialPlayers={serialized} />;
}
