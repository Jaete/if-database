'use client';

import ICitizen from '@/db/citizens/citizen.d';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import * as api from './citizensUtils';

interface IProps {
  children: React.ReactNode;
  initialCitizens?: ICitizen[];
}

interface ICitizensContext {
  citizens: ICitizen[];
  loading: boolean;
  update: (citizen: ICitizen) => Promise<void>;
  erase: (citizen: ICitizen) => Promise<void>;
  create: (citizen: ICitizen) => Promise<void>;
}

export const CitizensContext = createContext<ICitizensContext | null>(null);

export default function CitizensProvider({
  children,
  initialCitizens,
}: IProps) {
  const [citizens, setCitizens] = useState(initialCitizens ?? []);
  const [loading, setLoading] = useState(!initialCitizens);
  const citizensRef = useRef(citizens);
  const loadingRef = useRef(loading);

  useEffect(() => {
    citizensRef.current = citizens;
  }, [citizens]);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

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
    let mounted = true;

    const loadCitizens = async () => {
      setLoading(true);
      try {
        const data = await api.fetchCitizens();
        if (mounted) {
          setCitizens(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadCitizens();

    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        loadCitizens();
      }
    };
    window.addEventListener('pageshow', handlePageShow);

    const handleVisibilityChange = () => {
      if (
        document.visibilityState === 'visible' &&
        citizensRef.current.length === 0 &&
        !loadingRef.current
      ) {
        loadCitizens();
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
