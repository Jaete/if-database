'use client';

import CitizenGrid from '@/components/CitizenGrid';
import CitizensProvider from '@/app/context/CitizensContext';
import { TabProvider } from '@/app/context/TabContext';
import TabBar from '@/components/TabBar';
import type { FormDataType } from '@/components/CitizenEditForm';
import ICitizen from '@/db/citizens/citizen.d';

export default function CitizensPageClient({
  initialCitizens,
}: {
  initialCitizens: ICitizen[];
}) {
  return (
    <main>
      <CitizensProvider initialCitizens={initialCitizens}>
        <TabProvider<FormDataType>>
          <CitizenGrid />
          <TabBar />
        </TabProvider>
      </CitizensProvider>
    </main>
  );
}
