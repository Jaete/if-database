// app/monsters/[slug]/page.tsx
import { connectDB } from '@/lib/db';
import { getMonsterBySlug } from '@/services/monster.service';
import { notFound } from 'next/navigation';
import DrawerController from '@/components/CreatureDrawer/sections/DrawerController';
import MonsterData from '@/components/MonsterData';

interface IProps {
  params: Promise<{ slug: string }>;
}

export default async function MonsterPage({ params }: IProps) {
  const { slug } = await params;

  await connectDB();

  const monster = await getMonsterBySlug(slug);

  if (!monster) {
    notFound();
  }

  return (
    <main>
      <h1>Bestiário - {monster.name}</h1>
      <DrawerController triggerLabel={`Ver ficha: ${monster.name}`}>
        <MonsterData monster={monster} />
      </DrawerController>
    </main>
  );
}
