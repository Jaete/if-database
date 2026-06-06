'use client';

import CreatureGrid from '@/components/CreatureGrid';
import MonstersProvider from '@/app/context/MonstersContext';

export default function MonstersList() {
  return (
    <main>
      <MonstersProvider>
        <CreatureGrid />
      </MonstersProvider>
    </main>
  );
}
