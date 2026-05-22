import { connectDB } from '@/lib/db';
import { getAllMonsters } from '@/services/monster.service';
import MonsterGrid from '@/components/MonsterGrid';

export default async function MonstersList() {
  await connectDB();
  const result = await getAllMonsters();

  if (!result.success || !result.data) {
    return (
      <main>
        <p>Error: {result.error}</p>
      </main>
    );
  }

  return (
    <main>
      <MonsterGrid monsters={result.data} />
    </main>
  );
}
