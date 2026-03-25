import { connectDB } from '@/lib/db';
import { getAllMonsters } from '@/services/monster.service';
import { notFound } from 'next/navigation';
export default async function MonstersList() {
  await connectDB();
  const monsters = await getAllMonsters();

  if (!monsters) {
    notFound();
  }

  return <></>;
}
