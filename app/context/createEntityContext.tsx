'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { createEntityUtils } from './createEntityUtils';

/**
 * Provider de lista para uma entidade: estado, CRUD otimista por `slug` e o
 * recarregamento que cobre volta pelo histórico (bfcache) e aba que volta ao
 * foco com a lista vazia.
 *
 * Era o mesmo arquivo em `CitizensContext` e `MonstersContext`. O que só
 * monstros têm — o cache de documentos completos com `getFull`/`prefetch` —
 * fica por cima, no contexto da entidade.
 */

interface IEntityRef {
  slug: string;
}

export interface IEntityContextValue<T> {
  items: T[];
  loading: boolean;
  // Devolvem a entidade resultante para quem precise reagir a ela — monstros
  // usam isso para manter o cache de documentos completos em dia.
  create: (entity: T) => Promise<T | undefined>;
  update: (entity: T) => Promise<T | undefined>;
  erase: (entity: T) => Promise<void>;
  reload: () => Promise<void>;
}

interface IOptions<T> {
  basePath: string;
  label: string;
  // Só para a mensagem do erro de hook fora do provider.
  providerName: string;
  // Monstros carregam um índice enxuto no lugar da coleção inteira.
  fetchList?: () => Promise<T[]>;
  // Quando o server component já entregou a lista, buscar de novo na montagem
  // só dobra o trabalho para um resultado idêntico.
  skipInitialLoadWhenSeeded?: boolean;
}

export function createEntityContext<T extends IEntityRef>({
  basePath,
  label,
  providerName,
  fetchList,
  skipInitialLoadWhenSeeded = false,
}: IOptions<T>) {
  const api = createEntityUtils<T>({ basePath, label });
  const Context = createContext<IEntityContextValue<T> | null>(null);

  interface IProviderProps {
    children: React.ReactNode;
    initialItems?: T[];
  }

  function Provider({ children, initialItems }: IProviderProps) {
    const [items, setItems] = useState<T[]>(initialItems ?? []);
    const [loading, setLoading] = useState(!initialItems);

    // Espelhos para os listeners lerem o valor atual sem virarem dependência
    // do efeito — refazer os listeners a cada mudança de lista custaria caro.
    const itemsRef = useRef(items);
    const loadingRef = useRef(loading);

    useEffect(() => {
      itemsRef.current = items;
    }, [items]);

    useEffect(() => {
      loadingRef.current = loading;
    }, [loading]);

    const mountedRef = useRef(true);
    const seededRef = useRef(Boolean(initialItems));

    const reload = useCallback(async () => {
      setLoading(true);
      try {
        const data = await (fetchList ? fetchList() : api.fetchAll());
        if (mountedRef.current) setItems(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    }, []);

    const update = useCallback(async (entity: T) => {
      try {
        const { data } = await api.update(entity);
        if (data) {
          setItems((prev) =>
            prev.map((item) => (item.slug === data.slug ? data : item))
          );
        }
        return data;
      } catch (err) {
        console.error(err);
        return undefined;
      }
    }, []);

    const erase = useCallback(async (entity: T) => {
      try {
        await api.remove(entity.slug);
        setItems((prev) => prev.filter((item) => item.slug !== entity.slug));
      } catch (err) {
        console.error(err);
      }
    }, []);

    const create = useCallback(async (entity: T) => {
      try {
        const { data } = await api.create(entity);
        if (data) setItems((prev) => [...prev, data]);
        return data;
      } catch (err) {
        console.error(err);
        return undefined;
      }
    }, []);

    useEffect(() => {
      mountedRef.current = true;
      if (!(skipInitialLoadWhenSeeded && seededRef.current)) reload();

      // Voltar pelo histórico restaura a página do bfcache sem remontar, então
      // a lista ficaria congelada no que era antes de sair.
      const handlePageShow = (e: PageTransitionEvent) => {
        if (e.persisted) reload();
      };
      window.addEventListener('pageshow', handlePageShow);

      const handleVisibilityChange = () => {
        if (
          document.visibilityState === 'visible' &&
          itemsRef.current.length === 0 &&
          !loadingRef.current
        ) {
          reload();
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        mountedRef.current = false;
        window.removeEventListener('pageshow', handlePageShow);
        document.removeEventListener(
          'visibilitychange',
          handleVisibilityChange
        );
      };
    }, [reload]);

    return (
      <Context.Provider
        value={{ items, loading, create, update, erase, reload }}
      >
        {children}
      </Context.Provider>
    );
  }

  function useEntities(): IEntityContextValue<T> {
    const context = useContext(Context);
    if (!context) {
      throw new Error(`Hook usado fora de ${providerName}`);
    }
    return context;
  }

  return { Context, Provider, useEntities, api };
}
