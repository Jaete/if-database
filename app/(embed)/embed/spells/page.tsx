import type { Metadata } from 'next';
import { connectDB } from '@/lib/db';
import { getAllSpells } from '@/services/spell.service';
import type ISpell from '@/db/spells/spell.d';
import SpellGrid from '@/components/SpellGrid';
import EmbedCloseBridge from '@/components/EmbedCloseBridge';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Grimório',
};

export default async function EmbedSpellsPage() {
  let serialized: ISpell[] = [];
  try {
    await connectDB();
    serialized = JSON.parse(JSON.stringify(await getAllSpells()));
  } catch (error) {
    console.error('Failed to load spells:', error);
  }

  return (
    <main>
      {/* FORUM_ORIGIN é server-only e desce como prop, igual às classes. */}
      <EmbedCloseBridge forumOrigin={process.env.FORUM_ORIGIN ?? ''} />
      <SpellGrid initialSpells={serialized} compact readOnly />
    </main>
  );
}
