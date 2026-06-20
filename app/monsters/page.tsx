import { connectDB } from '@/lib/db';
import { getAllMonsters } from '@/services/monster.service';
import MonstersPageClient from './MonstersPageClient';
import IMonster from '@/db/monsters/monster';

export const dynamic = 'force-dynamic';

export default async function MonstersPage() {
  let serialized: IMonster[] = [];
  try {
    await connectDB();
    const monsters = await getAllMonsters();
    serialized = JSON.parse(JSON.stringify(monsters));
  } catch (error) {
    console.error('Failed to load monsters:', error);
  }

  return <MonstersPageClient initialMonsters={serialized} />;
}
