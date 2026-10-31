import ClassGridSkeleton from '@/components/ClassGridSkeleton';
import EmbedCloseBridge from '@/components/EmbedCloseBridge';

// Cobre só a lista: `[slug]/loading.tsx` tem o seu, e é ele que vale no detalhe.
export default function EmbedClassesLoading() {
  return (
    <main>
      {/* O Esc fecha o modal do fórum também durante o carregamento. */}
      <EmbedCloseBridge forumOrigin={process.env.FORUM_ORIGIN ?? ''} />
      <ClassGridSkeleton compact readOnly />
    </main>
  );
}
