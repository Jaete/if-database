import { connectDB } from '@/lib/db';
import { getAllSpells } from '@/services/spell.service';
import type ISpell from '@/db/spells/spell.d';
import SpellGrid from '@/components/SpellGrid';

export const dynamic = 'force-dynamic';

export default async function SpellsPage() {
  let serialized: ISpell[] = [];
  try {
    await connectDB();
    serialized = JSON.parse(JSON.stringify(await getAllSpells()));
  } catch (error) {
    console.error('Failed to load spells:', error);
  }

  return (
    <main>
      <SpellGrid initialSpells={serialized} />
    </main>
  );
}
