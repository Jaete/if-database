import ClassDetailSkeleton from '@/components/ClassDetailSkeleton';

// Sem ele, o `../loading.tsx` (o esqueleto do seletor) envolveria o detalhe.
export default function ClassDetailLoading() {
  return (
    <main>
      <ClassDetailSkeleton />
    </main>
  );
}
