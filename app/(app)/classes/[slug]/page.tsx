import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/db';
import { getClassBySlug } from '@/services/class.service';
import ClassData from '@/components/ClassData';

export const dynamic = 'force-dynamic';

export default async function ClassPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await connectDB();
  const result = await getClassBySlug(slug);
  if (!result.success || !result.data) notFound();

  const serialized = JSON.parse(JSON.stringify(result.data));
  return (
    <main>
      <ClassData characterClass={serialized} />
    </main>
  );
}
