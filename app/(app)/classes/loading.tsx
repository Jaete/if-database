import ClassGridSkeleton from '@/components/ClassGridSkeleton';

// Cobre só a lista: `[slug]/loading.tsx` tem o seu, e é ele que vale no detalhe.
export default function ClassesLoading() {
  return (
    <main>
      <ClassGridSkeleton />
    </main>
  );
}
