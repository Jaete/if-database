import type { Metadata } from 'next';
import { connectDB } from '@/lib/db';
import { getAllTalents } from '@/services/talent.service';
import type ITalentDoc from '@/db/talents/talent.d';
import TalentGrid from '@/components/TalentGrid';
import EmbedCloseBridge from '@/components/EmbedCloseBridge';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Talentos',
};

export default async function EmbedTalentsPage() {
  let serialized: ITalentDoc[] = [];
  try {
    await connectDB();
    serialized = JSON.parse(JSON.stringify(await getAllTalents()));
  } catch (error) {
    console.error('Failed to load talents:', error);
  }

  return (
    <main>
      {/* FORUM_ORIGIN é server-only e desce como prop, igual às classes. */}
      <EmbedCloseBridge forumOrigin={process.env.FORUM_ORIGIN ?? ''} />
      <TalentGrid initialTalents={serialized} readOnly />
    </main>
  );
}
