import { connectDB } from '@/lib/db';
import { getAllCitizens } from '@/services/citizen.service';
import CitizensPageClient from './CitizensPageClient';
import ICitizen from '@/db/citizens/citizen.d';

export const dynamic = 'force-dynamic';

export default async function CitizensPage() {
  let serialized: ICitizen[] = [];
  try {
    await connectDB();
    const citizens = await getAllCitizens();
    serialized = JSON.parse(JSON.stringify(citizens));
  } catch (error) {
    console.error('Failed to load citizens:', error);
  }

  return <CitizensPageClient initialCitizens={serialized} />;
}
