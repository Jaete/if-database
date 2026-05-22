import { connectDB } from '@/lib/db';
import { getCreatureBySlug } from '@/services/creature.service';
import { notFound } from 'next/navigation';
import DrawerController from '@/components/CreatureDrawer/sections/DrawerController';
import CreatureData from '@/components/CreatureData';
import CreatureDrawer from '@/components/CreatureDrawer';
import DrawerContent from '@/components/CreatureDrawer/sections/DrawerContent';
import DrawerHeader from '@/components/CreatureDrawer/sections/DrawerHeader';

interface IProps {
  params: Promise<{ slug: string }>;
}

export default async function CreaturePage({ params }: IProps) {
  const { slug } = await params;

  await connectDB();

  const creature = await getCreatureBySlug(slug);

  if (!creature) {
    notFound();
  }

  return (
    <main>
      <h1>Bestiário - {creature.name}</h1>
      <DrawerController>
        <button>Ver ficha de {creature.name}</button>
      </DrawerController>

      <CreatureDrawer>
        <DrawerHeader />
        <DrawerContent>
          <CreatureData creature={creature} />
        </DrawerContent>
      </CreatureDrawer>
    </main>
  );
}
