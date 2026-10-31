import type { Metadata } from 'next';
import { connectDB } from '@/lib/db';
import { getClassOptions } from '@/services/class.service';
import ClassGrid from '@/components/ClassGrid';
import EmbedCloseBridge from '@/components/EmbedCloseBridge';
import type { IClassOption } from '@/components/ClassGrid/useClassGrid';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Classes',
};

export default async function EmbedClassesPage() {
  let serialized: IClassOption[] = [];
  try {
    await connectDB();
    serialized = JSON.parse(JSON.stringify(await getClassOptions()));
  } catch (error) {
    console.error('Failed to load classes:', error);
  }

  return (
    <main>
      {/* FORUM_ORIGIN é server-only e desce como prop, igual à árvore. */}
      <EmbedCloseBridge forumOrigin={process.env.FORUM_ORIGIN ?? ''} />
      <ClassGrid
        initialClasses={serialized}
        basePath="/embed/classes"
        compact
        readOnly
      />
    </main>
  );
}
