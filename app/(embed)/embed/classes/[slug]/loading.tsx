import ClassDetailSkeleton from '@/components/ClassDetailSkeleton';
import EmbedCloseBridge from '@/components/EmbedCloseBridge';

// Sem ele, o `../loading.tsx` (o esqueleto do seletor) envolveria o detalhe.
export default function EmbedClassDetailLoading() {
  return (
    <main>
      <EmbedCloseBridge forumOrigin={process.env.FORUM_ORIGIN ?? ''} />
      <ClassDetailSkeleton compact />
    </main>
  );
}
