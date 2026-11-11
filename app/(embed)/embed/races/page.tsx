import type { Metadata } from 'next';
import { connectDB } from '@/lib/db';
import { pickRandomCoverSlug } from '@/lib/raceCover';
import { getRaceOptions } from '@/services/race.service';
import RaceGrid from '@/components/RaceGrid';
import EmbedCloseBridge from '@/components/EmbedCloseBridge';
import type { IRaceOption } from '@/components/RaceGrid/useRaceGrid';

// Dinâmica de propósito: a capa do topo é sorteada a cada visita.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Raças',
};

export default async function EmbedRacesPage() {
  let races: IRaceOption[] = [];
  try {
    await connectDB();
    races = JSON.parse(JSON.stringify(await getRaceOptions()));
  } catch (error) {
    console.error('Failed to load races:', error);
  }

  return (
    <main>
      {/* FORUM_ORIGIN é server-only e desce como prop, igual às classes. */}
      <EmbedCloseBridge forumOrigin={process.env.FORUM_ORIGIN ?? ''} />
      <RaceGrid
        races={races}
        initialCover={pickRandomCoverSlug(races)}
        basePath="/embed/races"
        readOnly
      />
    </main>
  );
}
