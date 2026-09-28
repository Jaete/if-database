'use client';

import ICitizen from '@/db/citizens/citizen.d';

interface ApiResult<T> {
  success: boolean;
  data?: T;
}

export async function fetchCitizens(): Promise<ICitizen[]> {
  const res = await fetch('/api/citizens');
  if (!res.ok) throw new Error('Failed to fetch citizens');
  return res.json();
}

export async function createCitizen(
  citizen: ICitizen
): Promise<ApiResult<ICitizen>> {
  let body: string;
  try {
    body = JSON.stringify(citizen);
  } catch (err) {
    console.error('JSON.stringify error in createCitizen:', err, citizen);
    throw new Error(
      `Erro ao serializar dados do cidadão: ${err instanceof Error ? err.message : 'Erro desconhecido'}`
    );
  }
  const res = await fetch('/api/citizens', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
  if (!res.ok) throw new Error('Failed to create citizen');
  const data = await res.json();
  return { success: true, data };
}

export async function updateCitizen(
  citizen: ICitizen
): Promise<ApiResult<ICitizen>> {
  let body: string;
  try {
    body = JSON.stringify(citizen);
  } catch (err) {
    console.error('JSON.stringify error in updateCitizen:', err, citizen);
    throw new Error(
      `Erro ao serializar dados do cidadão: ${err instanceof Error ? err.message : 'Erro desconhecido'}`
    );
  }
  const res = await fetch(`/api/citizens/${citizen.slug}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
  if (!res.ok) throw new Error('Failed to update citizen');
  const data = await res.json();
  return { success: true, data };
}

export async function deleteCitizen(slug: string): Promise<ApiResult<null>> {
  const res = await fetch(`/api/citizens/${slug}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete citizen');
  return { success: true };
}
