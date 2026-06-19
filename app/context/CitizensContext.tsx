'use client';

import ICitizen from '@/db/citizens/citizen.d';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import * as api from './citizensUtils';

interface IProps {
  children: React.ReactNode;
}

interface ICitizensContext {
  citizens: ICitizen[];
  loading: boolean;
  update: (citizen: ICitizen) => Promise<void>;
  erase: (citizen: ICitizen) => Promise<void>;
  create: (citizen: ICitizen) => Promise<void>;
}

const initialCitizens: ICitizen[] = [];

export const CitizensContext = createContext<ICitizensContext | null>(null);

export default function CitizensProvider({ children }: IProps) {
  const [citizens, setCitizens] = useState(initialCitizens);
  const [loading, setLoading] = useState(true);

  const update = useCallback(async (citizen: ICitizen) => {
    try {
      const { data } = await api.updateCitizen(citizen);
      if (data) {
        setCitizens((prev) =>
          prev.map((c) => (c.slug === data.slug ? data : c))
        );
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const erase = useCallback(async (citizen: ICitizen) => {
    try {
      await api.deleteCitizen(citizen.slug);
      setCitizens((prev) => prev.filter((c) => c.slug !== citizen.slug));
    } catch (err) {
      console.error(err);
    }
  }, []);

  const create = useCallback(async (citizen: ICitizen) => {
    try {
      const { data } = await api.createCitizen(citizen);
      if (data) {
        setCitizens((prev) => [...prev, data]);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    const loadCitizens = async () => {
      try {
        const data = await api.fetchCitizens();
        setCitizens(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadCitizens();
  }, []);

  return (
    <CitizensContext.Provider
      value={{ citizens, loading, update, erase, create }}
    >
      {children}
    </CitizensContext.Provider>
  );
}

export function useCitizens(): ICitizensContext {
  const context = useContext(CitizensContext);

  if (!context) {
    throw new Error('useCitizens must be used within a CitizensProvider');
  }

  return context;
}
