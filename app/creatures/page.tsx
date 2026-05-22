import { connectDB } from '@/lib/db';
import { getAllCreatures } from '@/services/creature.service';
import { notFound } from 'next/navigation';
import CreatureGrid from '@/components/CreatureGrid';

export default async function CreaturesList() {
  const conn = await connectDB();

  if (!conn) {
    notFound();
  }

  const creatures = await getAllCreatures();

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
