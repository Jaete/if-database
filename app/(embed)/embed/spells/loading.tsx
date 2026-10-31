import SpellGridSkeleton from '@/components/SpellGridSkeleton';
import EmbedCloseBridge from '@/components/EmbedCloseBridge';

export default function EmbedSpellsLoading() {
  return (
    <main>
      {/* O Esc fecha o modal do fórum também durante o carregamento. */}
      <EmbedCloseBridge forumOrigin={process.env.FORUM_ORIGIN ?? ''} />
      <SpellGridSkeleton compact readOnly />
    </main>
  );
}
