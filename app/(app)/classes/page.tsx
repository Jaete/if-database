import { connectDB } from '@/lib/db';
import { getClassOptions } from '@/services/class.service';
import ClassGrid from '@/components/ClassGrid';
import type { IClassOption } from '@/components/ClassGrid/useClassGrid';

export const dynamic = 'force-dynamic';

export default async function ClassesPage() {
  let serialized: IClassOption[] = [];
  try {
    await connectDB();
    // Projeção magra: a listagem não precisa dos 20 níveis de cada classe.
    serialized = JSON.parse(JSON.stringify(await getClassOptions()));
  } catch (error) {
    console.error('Failed to load classes:', error);
  }

  return (
    <main>
      <ClassGrid initialClasses={serialized} />
    </main>
  );
}
