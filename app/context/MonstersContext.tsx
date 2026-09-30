'use client';

import { createContext, useCallback, useContext, useRef } from 'react';

import IMonster from '@/db/monsters/monster';
import { createEntityContext } from './createEntityContext';
import { fetchMonsterIndex, fetchMonstersBySlugs } from './monstersUtils';

const entity = createEntityContext<IMonster>({
  basePath: '/api/monsters',
  label: 'monstro',
  providerName: 'MonstersProvider',
  // Monstros carregam só o índice: 34 KB contra 1,6 MB da coleção completa.
  fetchList: fetchMonsterIndex,
  skipInitialLoadWhenSeeded: true,
});

export const MonstersContext = entity.Context;

interface IProps {
  children: React.ReactNode;
  initialMonsters?: IMonster[];
  initialFull?: IMonster[];
}

// O cache de documentos completos vive num contexto próprio, por cima do
// genérico: só monstros separam índice de documento completo.
interface IFullCache {
  getFull: (slug: string) => Promise<IMonster | undefined>;
  prefetch: (slugs: string[]) => void;
  remember: (monster: IMonster) => void;
  forget: (slug: string) => void;
}

const FullCacheContext = createContext<IFullCache | null>(null);

function FullCacheProvider({
  children,
  initialFull,
}: {
  children: React.ReactNode;
  initialFull?: IMonster[];
}) {
  const fullRef = useRef(
    new Map<string, IMonster>(
      (initialFull ?? []).map((m) => [m.slug, m] as const)
    )
  );
  const inFlightRef = useRef(new Map<string, Promise<void>>());

  const hydrate = useCallback(async (slugs: string[]) => {
    const missing = slugs.filter(
      (s) => !fullRef.current.has(s) && !inFlightRef.current.has(s)
    );
    if (missing.length === 0) return;

    const request = fetchMonstersBySlugs(missing)
      .then((rows) => {
        for (const row of rows) fullRef.current.set(row.slug, row);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        for (const slug of missing) inFlightRef.current.delete(slug);
      });

    for (const slug of missing) inFlightRef.current.set(slug, request);
    await request;
  }, []);

  const prefetch = useCallback(
    (slugs: string[]) => {
      void hydrate(slugs);
    },
    [hydrate]
  );

  const getFull = useCallback(
    async (slug: string) => {
      const pending = inFlightRef.current.get(slug);
      if (pending) await pending;
      if (!fullRef.current.has(slug)) await hydrate([slug]);
      return fullRef.current.get(slug);
    },
    [hydrate]
  );

  const remember = useCallback((monster: IMonster) => {
    fullRef.current.set(monster.slug, monster);
  }, []);

  const forget = useCallback((slug: string) => {
    fullRef.current.delete(slug);
  }, []);

  return (
    <FullCacheContext.Provider value={{ getFull, prefetch, remember, forget }}>
      {children}
    </FullCacheContext.Provider>
  );
}

export default function MonstersProvider({
  children,
  initialMonsters,
  initialFull,
}: IProps) {
  return (
    <entity.Provider initialItems={initialMonsters}>
      <FullCacheProvider initialFull={initialFull}>
        {children}
      </FullCacheProvider>
    </entity.Provider>
  );
}

interface IMonstersContext {
  /** Light records for every monster — enough to render cards and search. */
  monsters: IMonster[];
  loading: boolean;
  /** Full document for a slug, fetching it if it has not been prefetched. */
  getFull: (slug: string) => Promise<IMonster | undefined>;
  /** Warms the cache for slugs about to come on screen. */
  prefetch: (slugs: string[]) => void;
  update: (monster: IMonster) => Promise<void>;
  erase: (monster: IMonster) => Promise<void>;
  create: (monster: IMonster) => Promise<void>;
}

export function useMonsters(): IMonstersContext {
  const base = entity.useEntities();
  const cache = useContext(FullCacheContext);
  if (!cache) throw new Error('Hook usado fora de MonstersProvider');

  // As mutações precisam manter o cache de documentos completos alinhado com a
  // lista; por isso envolvem as da fábrica em vez de usá-las direto.
  const update = async (monster: IMonster) => {
    const data = await base.update(monster);
    if (data) cache.remember(data);
  };

  const erase = async (monster: IMonster) => {
    await base.erase(monster);
    cache.forget(monster.slug);
  };

  const create = async (monster: IMonster) => {
    const data = await base.create(monster);
    if (data) cache.remember(data);
  };

  return {
    monsters: base.items,
    loading: base.loading,
    getFull: cache.getFull,
    prefetch: cache.prefetch,
    update,
    erase,
    create,
  };
}
