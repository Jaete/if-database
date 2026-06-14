'use client';

import IEvolutionTree from '@/db/evolutionTrees/evolutionTree';

interface ApiResult<T> {
  success: boolean;
  data?: T;
}

export async function fetchEvolutionTrees(): Promise<IEvolutionTree[]> {
  const res = await fetch('/api/evolution-trees');
  if (!res.ok) throw new Error('Failed to fetch evolution trees');
  return res.json();
}

export async function createEvolutionTree(
  tree: IEvolutionTree
): Promise<ApiResult<IEvolutionTree>> {
  const res = await fetch('/api/evolution-trees', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tree),
  });
  if (!res.ok) throw new Error('Failed to create evolution tree');
  const data = await res.json();
  return { success: true, data };
}

export async function updateEvolutionTree(
  slug: string,
  tree: Partial<IEvolutionTree>
): Promise<ApiResult<IEvolutionTree>> {
  const res = await fetch(`/api/evolution-trees/${slug}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tree),
  });
  if (!res.ok) throw new Error('Failed to update evolution tree');
  const data = await res.json();
  return { success: true, data };
}

export async function deleteEvolutionTree(
  slug: string
): Promise<ApiResult<null>> {
  const res = await fetch(`/api/evolution-trees/${slug}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete evolution tree');
  return { success: true };
}
