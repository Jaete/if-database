import { connectDB } from '@/lib/db';
import { getAllMonsters } from '@/services/monster.service';
import { notFound } from 'next/navigation';
import CreatureGrid from '@/components/CreatureGrid';

export default async function MonstersList() {
  const conn = await connectDB();

  if (!conn) {
    notFound();
  }

  const creatures = await getAllMonsters();

  if (!creatures) {
    notFound();
  }

  // Convert Mongoose documents to plain objects for the client component
  const creaturesData = JSON.parse(JSON.stringify(creatures));

  return (
    <main>
      <CreatureGrid creatures={creaturesData} />
    </main>
  );
}
