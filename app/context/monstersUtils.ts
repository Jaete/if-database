'use client';

import IMonster from '@/db/monsters/monster';

interface ApiResult<T> {
  success: boolean;
  data?: T;
}

export async function fetchMonsters(): Promise<IMonster[]> {
  const res = await fetch('/api/monsters');
  if (!res.ok) throw new Error('Failed to fetch monsters');
  return res.json();
}

export async function createMonster(
  monster: IMonster
): Promise<ApiResult<IMonster>> {
  const res = await fetch('/api/monsters', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(monster),
  });
  if (!res.ok) throw new Error('Failed to create monster');
  const data = await res.json();
  return { success: true, data };
}

export async function updateMonster(
  monster: IMonster
): Promise<ApiResult<IMonster>> {
  const res = await fetch(`/api/monsters/${monster.slug}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(monster),
  });
  if (!res.ok) throw new Error('Failed to update monster');
  const data = await res.json();
  return { success: true, data };
}

export async function deleteMonster(slug: string): Promise<ApiResult<null>> {
  const res = await fetch(`/api/monsters/${slug}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete monster');
  return { success: true };
}
