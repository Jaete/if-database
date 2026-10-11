import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/db';
import { getEvolutionTreeBySlug } from '@/services/evolutionTree.service';
import { getMonstersBySlugs } from '@/services/monster.service';
import { collectMonsterSlugs } from '@/components/EvolutionTreeView/layout';
import EvolutionTreeView from '@/components/EvolutionTreeView';

type Params = Promise<{ slug: string }>;

const loadTree = cache(async (slug: string) => {
  await connectDB();
  const result = await getEvolutionTreeBySlug(slug);
  return result.success ? result.data : null;
});

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const tree = await loadTree(slug);
  return {
    title: tree ? `${tree.name} · Árvore de evolução` : 'Árvore não encontrada',
  };
}

export default async function EmbedTreePage({ params }: { params: Params }) {
  const { slug } = await params;
  const rawTree = await loadTree(slug);
  if (!rawTree) notFound();

  const tree = JSON.parse(JSON.stringify(rawTree));
  const rawMonsters = await getMonstersBySlugs(collectMonsterSlugs(tree.nodes));
  const monsters = Object.fromEntries(
    JSON.parse(JSON.stringify(rawMonsters)).map((m: { slug: string }) => [
      m.slug,
      m,
    ])
  );

  // FORUM_ORIGIN desce como prop (igual à ficha): é o único destino aceito
  // pelo postMessage que abre o drawer do monstro na página do fórum.
  return (
    <main>
      <EvolutionTreeView
        nodes={tree.nodes}
        monsters={monsters}
        forumOrigin={process.env.FORUM_ORIGIN ?? ''}
      />
    </main>
  );
}
