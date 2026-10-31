import type { Metadata } from 'next';
import EmbedCloseBridge from '@/components/EmbedCloseBridge';
import EmbedEntry from '@/components/EmbedEntry';

export const metadata: Metadata = {
  title: 'Classes e Escolas Mágicas',
};

export default function EmbedClassOrSpellPage() {
  return (
    <main>
      {/* FORUM_ORIGIN é server-only e desce como prop, igual às classes. */}
      <EmbedCloseBridge forumOrigin={process.env.FORUM_ORIGIN ?? ''} />
      <EmbedEntry />
    </main>
  );
}
