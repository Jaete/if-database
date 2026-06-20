'use client';

import CreatureGrid from '@/components/CreatureGrid';
import MonstersProvider from '@/app/context/MonstersContext';
import IMonster from '@/db/monsters/monster';

export default function MonstersPageClient({
  initialMonsters,
}: {
  initialMonsters: IMonster[];
}) {
  return (
    <main>
      <MonstersProvider initialMonsters={initialMonsters}>
        <CreatureGrid />
      </MonstersProvider>
    </main>
  );
}
