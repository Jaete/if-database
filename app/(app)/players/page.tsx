import { connectDB } from '@/lib/db';
import { getAllPlayers } from '@/services/player.service';
import PlayersPageClient from './PlayersPageClient';
import IPlayer from '@/db/players/player';

export const dynamic = 'force-dynamic';

export default async function PlayersPage() {
  let serialized: IPlayer[] = [];
  try {
    await connectDB();
    const players = await getAllPlayers();
    serialized = JSON.parse(JSON.stringify(players));
  } catch (error) {
    console.error('Failed to load players:', error);
  }
  return <PlayersPageClient initialPlayers={serialized} />;
}
