'use client';

import CitizenGrid from '@/components/CitizenGrid';
import CitizensProvider from '@/app/context/CitizensContext';

export default function CitizensList() {
  return (
    <main>
      <CitizensProvider>
        <CitizenGrid />
      </CitizensProvider>
    </main>
  );
}
