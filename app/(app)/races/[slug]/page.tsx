import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/db';
import { getRaceBySlug } from '@/services/race.service';
import RaceData from '@/components/RaceData';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const result = await getRaceBySlug(slug);
  if (!result.success || !result.data) return { title: 'Raça não encontrada' };
  return { title: `${result.data.name} · Raças` };
}

export default async function RacePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sub?: string | string[] }>;
}) {
  const { slug } = await params;
  const { sub } = await searchParams;
  await connectDB();
  const result = await getRaceBySlug(slug);
  if (!result.success || !result.data) notFound();

  const serialized = JSON.parse(JSON.stringify(result.data));
  return (
    <main>
      <RaceData
        race={serialized}
        initialSub={typeof sub === 'string' ? sub : undefined}
      />
    </main>
  );
}
