import { connectDB } from '@/lib/db';
import { getMonsterBySlug } from '@/services/monster.service';
import DrawerController from '@/components/CreatureDrawer/sections/DrawerController';
import MonsterData from '@/components/MonsterData';
import CreatureDrawer from '@/components/CreatureDrawer';
import DrawerContent from '@/components/CreatureDrawer/sections/DrawerContent';
import DrawerHeader from '@/components/CreatureDrawer/sections/DrawerHeader';

interface IProps {
  params: Promise<{ slug: string }>;
}

export default async function MonsterPage({ params }: IProps) {
  const { slug } = await params;

  await connectDB();

  const result = await getMonsterBySlug(slug);

  if (!result.success || !result.data) {
    return (
      <main>
        <h1>Error</h1>
        <p>{result.error}</p>
      </main>
    );
  }

  const monster = result.data;

  return (
    <main>
      <h1>Bestiário - {monster.name}</h1>
      <DrawerController>
        <button>Ver ficha de {monster.name}</button>
      </DrawerController>

      <CreatureDrawer>
        <DrawerHeader />
        <DrawerContent>
          <MonsterData monster={monster} />
        </DrawerContent>
      </CreatureDrawer>
    </main>
  );
}
