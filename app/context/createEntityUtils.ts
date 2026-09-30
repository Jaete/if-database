'use client';

/**
 * Wrappers de fetch para as rotas REST de uma entidade. Era o mesmo arquivo em
 * `citizensUtils.ts`, `monstersUtils.ts` e `evolutionTreesUtils.ts`, mudando só
 * o caminho base e o substantivo das mensagens de erro.
 */

export interface IApiResult<T> {
  success: boolean;
  data?: T;
}

interface IEntityRef {
  slug: string;
}

interface IOptions {
  // Ex.: '/api/citizens'
  basePath: string;
  // Aparece nas mensagens de erro: "Erro ao serializar dados do cidadão".
  label: string;
}

export function createEntityUtils<T extends IEntityRef>({
  basePath,
  label,
}: IOptions) {
  // O JSON.stringify fica dentro de try/catch porque um formulário com
  // referência circular falharia aqui de um jeito difícil de rastrear.
  const serialize = (entity: T, operation: string): string => {
    try {
      return JSON.stringify(entity);
    } catch (err) {
      console.error(`JSON.stringify error in ${operation}:`, err, entity);
      throw new Error(
        `Erro ao serializar dados do ${label}: ${
          err instanceof Error ? err.message : 'Erro desconhecido'
        }`
      );
    }
  };

  return {
    async fetchAll(): Promise<T[]> {
      const res = await fetch(basePath);
      if (!res.ok) throw new Error(`Failed to fetch ${basePath}`);
      return res.json();
    },

    async create(entity: T): Promise<IApiResult<T>> {
      const res = await fetch(basePath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: serialize(entity, 'create'),
      });
      if (!res.ok) throw new Error(`Failed to create ${label}`);
      return { success: true, data: await res.json() };
    },

    async update(entity: T): Promise<IApiResult<T>> {
      const res = await fetch(`${basePath}/${entity.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: serialize(entity, 'update'),
      });
      if (!res.ok) throw new Error(`Failed to update ${label}`);
      return { success: true, data: await res.json() };
    },

    async remove(slug: string): Promise<IApiResult<null>> {
      const res = await fetch(`${basePath}/${slug}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Failed to delete ${label}`);
      return { success: true };
    },
  };
}
