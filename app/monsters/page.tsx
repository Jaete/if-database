import { connectDB } from '@/lib/db';
import { getMonsterIndex, getMonstersPage } from '@/services/monster.service';
import MonstersPageClient from './MonstersPageClient';
import IMonster from '@/db/monsters/monster';

export const dynamic = 'force-dynamic';

const PREFETCHED = 12;

export default async function MonstersPage() {
  let index: IMonster[] = [];
  let full: IMonster[] = [];
  try {
    await connectDB();
    const [indexRows, fullRows] = await Promise.all([
      getMonsterIndex(),
      getMonstersPage(PREFETCHED),
    ]);
    index = JSON.parse(JSON.stringify(indexRows));
    full = JSON.parse(JSON.stringify(fullRows));
  } catch (error) {
    console.error('Failed to load monsters:', error);
  }

  return <MonstersPageClient initialMonsters={index} initialFull={full} />;
}
