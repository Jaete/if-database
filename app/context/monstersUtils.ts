'use client';

import IMonster from '@/db/monsters/monster';
import { createEntityUtils } from './createEntityUtils';

const api = createEntityUtils<IMonster>({
  basePath: '/api/monsters',
  label: 'monstro',
});

export const fetchMonsters = api.fetchAll;
export const createMonster = api.create;
export const updateMonster = api.update;
export const deleteMonster = api.remove;

// ===== Só monstros =====

/** Light records: enough to render every card, 34 KB instead of 1.6 MB. */
export async function fetchMonsterIndex(): Promise<IMonster[]> {
  const res = await fetch('/api/monsters?view=index');
  if (!res.ok) throw new Error('Failed to fetch monster index');
  return res.json();
}

export async function fetchMonstersBySlugs(
  slugs: string[]
): Promise<IMonster[]> {
  if (slugs.length === 0) return [];
  const res = await fetch('/api/monsters/batch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slugs }),
  });
  if (!res.ok) throw new Error('Failed to fetch monsters');
  return res.json();
}
