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
}

interface IMonstersContext {
  monsters: IMonster[];
  loading: boolean;
  update: (monster: IMonster) => Promise<void>;
  erase: (monster: IMonster) => Promise<void>;
  create: (monster: IMonster) => Promise<void>;
}

export const MonstersContext = createContext<IMonstersContext | null>(null);

export default function MonstersProvider({
  children,
  initialMonsters,
}: IProps) {
  const [monsters, setMonsters] = useState(initialMonsters ?? []);
  const [loading, setLoading] = useState(!initialMonsters);
  const monstersRef = useRef(monsters);
  const loadingRef = useRef(loading);

  useEffect(() => {
    monstersRef.current = monsters;
  }, [monsters]);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);
  const update = useCallback(async (monster: IMonster) => {
    try {
      const { data } = await api.updateMonster(monster);
      if (data) {
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
      setMonsters((prev) => prev.filter((m) => m.slug !== monster.slug));
    } catch (err) {
      console.error(err);
    }
  }, []);

  const create = useCallback(async (monster: IMonster) => {
    try {
      const { data } = await api.createMonster(monster);
      if (data) {
        setMonsters((prev) => [...prev, data]);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadMonsters = async () => {
      setLoading(true);
      try {
        const data = await api.fetchMonsters();
        if (mounted) {
          setMonsters(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadMonsters();

    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        loadMonsters();
      }
    };
    window.addEventListener('pageshow', handlePageShow);

    const handleVisibilityChange = () => {
      if (
        document.visibilityState === 'visible' &&
        monstersRef.current.length === 0 &&
        !loadingRef.current
      ) {
        loadMonsters();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      mounted = false;
      window.removeEventListener('pageshow', handlePageShow);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <MonstersContext.Provider
      value={{ monsters, loading, update, erase, create }}
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
