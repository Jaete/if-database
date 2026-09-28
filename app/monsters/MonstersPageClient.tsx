'use client';

import CreatureGrid from '@/components/CreatureGrid';
import MonstersProvider from '@/app/context/MonstersContext';
import { TabProvider } from '@/app/context/TabContext';
import TabBar from '@/components/TabBar';
import type { IFormData } from '@/components/CreatureEditForm';
import IMonster from '@/db/monsters/monster';

export default function MonstersPageClient({
  initialMonsters,
}: {
  initialMonsters: IMonster[];
}) {
  return (
    <main>
      <MonstersProvider initialMonsters={initialMonsters}>
        <TabProvider<IFormData>>
          <CreatureGrid />
          <TabBar />
        </TabProvider>
      </MonstersProvider>
    </main>
  );
}
