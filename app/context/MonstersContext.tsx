'use client';

import IMonster from '@/db/monsters/monster';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import * as api from './monstersUtils';

interface IProps {
  children: React.ReactNode;
}

interface IMonstersContext {
  monsters: IMonster[];
  update: (monster: IMonster) => Promise<void>;
  erase: (monster: IMonster) => Promise<void>;
  create: (monster: IMonster) => Promise<void>;
}

const initialMonsters: IMonster[] = [];

export const MonstersContext = createContext<IMonstersContext | null>(null);

export default function MonstersProvider({ children }: IProps) {
  const [monsters, setMonsters] = useState(initialMonsters);

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
    const loadMonsters = async () => {
      try {
        const data = await api.fetchMonsters();
        setMonsters(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadMonsters();
  }, []);

  return (
    <MonstersContext.Provider value={{ monsters, update, erase, create }}>
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
