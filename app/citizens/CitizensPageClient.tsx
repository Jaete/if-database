'use client';

import CitizenGrid from '@/components/CitizenGrid';
import CitizensProvider from '@/app/context/CitizensContext';
import ICitizen from '@/db/citizens/citizen.d';

export default function CitizensPageClient({
  initialCitizens,
}: {
  initialCitizens: ICitizen[];
}) {
  return (
    <main>
      <CitizensProvider initialCitizens={initialCitizens}>
        <CitizenGrid />
      </CitizensProvider>
    </main>
  );
}
