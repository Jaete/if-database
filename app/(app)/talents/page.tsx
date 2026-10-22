import { connectDB } from '@/lib/db';
import { getAllTalents } from '@/services/talent.service';
import type ITalentDoc from '@/db/talents/talent.d';
import TalentGrid from '@/components/TalentGrid';

export const dynamic = 'force-dynamic';

export default async function TalentsPage() {
  let serialized: ITalentDoc[] = [];
  try {
    await connectDB();
    serialized = JSON.parse(JSON.stringify(await getAllTalents()));
  } catch (error) {
    console.error('Failed to load talents:', error);
  }

  return (
    <main>
      <TalentGrid initialTalents={serialized} />
    </main>
  );
}
