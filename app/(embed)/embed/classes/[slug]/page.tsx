import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/db';
import { getClassBySlug } from '@/services/class.service';
import ClassData from '@/components/ClassData';
import EmbedCloseBridge from '@/components/EmbedCloseBridge';

export const dynamic = 'force-dynamic';

type Params = Promise<{ slug: string }>;

const loadClass = cache(async (slug: string) => {
  await connectDB();
  const result = await getClassBySlug(slug);
  return result.success && result.data ? result.data : null;
});

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const klass = await loadClass(slug);
  return { title: klass ? klass.name : 'Classe não encontrada' };
}

export default async function EmbedClassPage({ params }: { params: Params }) {
  const { slug } = await params;
  const klass = await loadClass(slug);
  if (!klass) notFound();

  const serialized = JSON.parse(JSON.stringify(klass));
  return (
    <main>
      {/* FORUM_ORIGIN é server-only e desce como prop, igual à árvore. */}
      <EmbedCloseBridge forumOrigin={process.env.FORUM_ORIGIN ?? ''} />
      <ClassData
        characterClass={serialized}
        basePath="/embed/classes"
        compact
        readOnly
      />
    </main>
  );
}
