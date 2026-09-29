'use client';

import CreatureGrid from '@/components/CreatureGrid';
import MonstersProvider from '@/app/context/MonstersContext';
import { TabProvider } from '@/app/context/TabContext';
import TabBar from '@/components/TabBar';
import type { IFormData } from '@/components/CreatureEditForm';
import IMonster from '@/db/monsters/monster';

export default function MonstersPageClient({
  initialMonsters,
  initialFull,
}: {
  initialMonsters: IMonster[];
  initialFull: IMonster[];
}) {
  return (
    <main>
      <MonstersProvider
        initialMonsters={initialMonsters}
        initialFull={initialFull}
      >
        <TabProvider<IFormData>>
          <CreatureGrid />
          <TabBar />
        </TabProvider>
      </MonstersProvider>
    </main>
  );
}
