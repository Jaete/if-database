'use client';

import { useEffect, useState } from 'react';

export interface IOwnerOption {
  username: string;
  forumUserId?: number;
  avatarUrl?: string;
}

/**
 * Carrega as contas para o seletor de dono. São os membros do fórum que o
 * `collect.js` vem cadastrando passivamente, mais as contas locais.
 */
export const useOwnerOptions = () => {
  const [owners, setOwners] = useState<IOwnerOption[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    fetch('/api/users')
      .then((res) => {
        if (!res.ok) throw new Error('Não foi possível carregar os jogadores.');
        return res.json();
      })
      .then((data: IOwnerOption[]) => {
        if (mounted) setOwners(data);
      })
      .catch((err: Error) => {
        if (mounted) setError(err.message);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { owners, error };
};
