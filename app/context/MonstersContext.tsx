'use client';

import IMonster from '@/db/monsters/monster';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import * as api from './monstersUtils';

interface IProps {
  children: React.ReactNode;
  initialMonsters?: IMonster[];
  initialFull?: IMonster[];
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

export const MonstersContext = createContext<IMonstersContext | null>(null);

export default function MonstersProvider({
  children,
  initialMonsters,
  initialFull,
}: IProps) {
  const [monsters, setMonsters] = useState(initialMonsters ?? []);
  const [loading, setLoading] = useState(!initialMonsters);

  const fullRef = useRef(
    new Map<string, IMonster>(
      (initialFull ?? []).map((m) => [m.slug, m] as const)
    )
  );
  const inFlightRef = useRef(new Map<string, Promise<void>>());
  const monstersRef = useRef(monsters);
  const loadingRef = useRef(loading);

  useEffect(() => {
    monstersRef.current = monsters;
  }, [monsters]);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  const hydrate = useCallback(async (slugs: string[]) => {
    const missing = slugs.filter(
      (s) => !fullRef.current.has(s) && !inFlightRef.current.has(s)
    );
    if (missing.length === 0) return;

    const request = api
      .fetchMonstersBySlugs(missing)
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

  const update = useCallback(async (monster: IMonster) => {
    try {
      const { data } = await api.updateMonster(monster);
      if (data) {
        fullRef.current.set(data.slug, data);
        setMonsters((prev) =>
          prev.map((m) => (m.slug === data.slug ? data : m))
        );
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const erase = useCallback(async (monster: IMonster) => {
    try {
      await api.deleteMonster(monster.slug);
      fullRef.current.delete(monster.slug);
      setMonsters((prev) => prev.filter((m) => m.slug !== monster.slug));
    } catch (err) {
      console.error(err);
    }
  }, []);

  const create = useCallback(async (monster: IMonster) => {
    try {
      const { data } = await api.createMonster(monster);
      if (data) {
        fullRef.current.set(data.slug, data);
        setMonsters((prev) => [...prev, data]);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadIndex = async () => {
      setLoading(true);
      try {
        const data = await api.fetchMonsterIndex();
        if (mounted) setMonsters(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    // The server component already handed us the index; re-fetching it on
    // mount only doubles the work for an identical result.
    if (!initialMonsters) loadIndex();

    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) loadIndex();
    };
    window.addEventListener('pageshow', handlePageShow);

    const handleVisibilityChange = () => {
      if (
        document.visibilityState === 'visible' &&
        monstersRef.current.length === 0 &&
        !loadingRef.current
      ) {
        loadIndex();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      mounted = false;
      window.removeEventListener('pageshow', handlePageShow);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [initialMonsters]);

  return (
    <MonstersContext.Provider
      value={{ monsters, loading, getFull, prefetch, update, erase, create }}
    >
      {children}
    </MonstersContext.Provider>
  );
}

export function useMonsters(): IMonstersContext {
  const context = useContext(MonstersContext);
  if (!context) {
    throw new Error('useMonsters must be used within a MonstersProvider');
  }
  return context;
}
