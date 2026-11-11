import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/db';
import { getRaceBySlug } from '@/services/race.service';
import RaceData from '@/components/RaceData';
import EmbedCloseBridge from '@/components/EmbedCloseBridge';

export const dynamic = 'force-dynamic';

type Params = Promise<{ slug: string }>;

const loadRace = cache(async (slug: string) => {
  await connectDB();
  const result = await getRaceBySlug(slug);
  return result.success && result.data ? result.data : null;
});

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const race = await loadRace(slug);
  return { title: race ? race.name : 'Raça não encontrada' };
}

export default async function EmbedRacePage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<{ sub?: string | string[] }>;
}) {
  const { slug } = await params;
  const { sub } = await searchParams;
  const race = await loadRace(slug);
  if (!race) notFound();

  const serialized = JSON.parse(JSON.stringify(race));
  return (
    <main>
      {/* FORUM_ORIGIN é server-only e desce como prop, igual às classes. */}
      <EmbedCloseBridge forumOrigin={process.env.FORUM_ORIGIN ?? ''} />
      <RaceData
        race={serialized}
        initialSub={typeof sub === 'string' ? sub : undefined}
        basePath="/embed/races"
        readOnly
      />
    </main>
  );
}
