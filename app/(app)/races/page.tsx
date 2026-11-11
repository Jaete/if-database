import { connectDB } from '@/lib/db';
import { pickRandomCoverSlug } from '@/lib/raceCover';
import { getRaceOptions } from '@/services/race.service';
import RaceGrid from '@/components/RaceGrid';
import type { IRaceOption } from '@/components/RaceGrid/useRaceGrid';

// Dinâmica de propósito: a capa do topo é sorteada a cada visita.
export const dynamic = 'force-dynamic';

export default async function RacesPage() {
  let races: IRaceOption[] = [];
  try {
    await connectDB();
    races = JSON.parse(JSON.stringify(await getRaceOptions()));
  } catch (error) {
    console.error('Failed to load races:', error);
  }

  return (
    <main>
      {/* O sorteio é no servidor e a capa chega por prop: servidor e cliente
          renderizam a mesma, sem pulo na hidratação. */}
      <RaceGrid races={races} initialCover={pickRandomCoverSlug(races)} />
    </main>
  );
}
