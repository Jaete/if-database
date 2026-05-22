import { connectDB } from '@/lib/db';
import { getAllMonsters } from '@/services/monster.service';
import { notFound } from 'next/navigation';
import MonsterGrid from '@/components/MonsterGrid';

export default async function MonstersList() {
  const conn = await connectDB();

  if (!conn) {
    notFound();
  }

  const monsters = await getAllMonsters();

  if (!monsters) {
    notFound();
  }

  // Convert Mongoose documents to plain objects for the client component
  const monstersData = JSON.parse(JSON.stringify(monsters));

  return (
    <main>
      <MonsterGrid monsters={monstersData} />
    </main>
  );
}
