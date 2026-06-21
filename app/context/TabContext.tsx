'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from 'react';

export interface ITab<T = unknown> {
  id: string;
  mode: 'create' | 'edit';
  slug?: string;
  label: string;
  formData: T;
}

interface ITabContextValue<T = unknown> {
  tabs: ITab<T>[];
  activeTabId: string | null;
  activeTab: ITab<T> | null;
  openTab: (tab: Omit<ITab<T>, 'id'>) => void;
  openTabSilently: (tab: Omit<ITab<T>, 'id'>) => void;
  closeTab: (id: string) => void;
  setActiveTabId: (id: string | null) => void;
  updateTabFormData: (id: string, data: T) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TabContext = createContext<ITabContextValue<any> | null>(null);

interface ITabProviderProps {
  children: React.ReactNode;
}

export function TabProvider<T = unknown>({ children }: ITabProviderProps) {
  const [tabs, setTabs] = useState<ITab<T>[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const counterRef = useRef(0);

  const openTab = useCallback((tab: Omit<ITab<T>, 'id'>) => {
    // Deduplicate edit tabs by slug
    if (tab.mode === 'edit' && tab.slug) {
      setTabs((prev) => {
        const existing = prev.find(
          (t) => t.mode === 'edit' && t.slug === tab.slug
        );
        if (existing) {
          setActiveTabId(existing.id);
          return prev;
        }
        const newId = `edit-${tab.slug}`;
        const newTab: ITab<T> = { ...tab, id: newId };
        setActiveTabId(newId);
        return [...prev, newTab];
      });
    } else {
      // Create tabs get a unique counter-based ID
      counterRef.current += 1;
      const newId = `new-${counterRef.current}`;
      const newTab: ITab<T> = { ...tab, id: newId };
      setTabs((prev) => [...prev, newTab]);
      setActiveTabId(newId);
    }
  }, []);

  const openTabSilently = useCallback((tab: Omit<ITab<T>, 'id'>) => {
    if (tab.mode === 'edit' && tab.slug) {
      setTabs((prev) => {
        const existing = prev.find(
          (t) => t.mode === 'edit' && t.slug === tab.slug
        );
        if (existing) return prev;
        const newId = `edit-${tab.slug}`;
        return [...prev, { ...tab, id: newId } as ITab<T>];
      });
    } else {
      counterRef.current += 1;
      const newId = `new-${counterRef.current}`;
      setTabs((prev) => [...prev, { ...tab, id: newId } as ITab<T>]);
    }
  }, []);

  const closeTab = useCallback(
    (id: string) => {
      setTabs((prev) => {
        const index = prev.findIndex((t) => t.id === id);
        const next = prev.filter((t) => t.id !== id);

        // If closing the active tab, activate the nearest tab
        if (id === activeTabId) {
          if (next.length === 0) {
            setActiveTabId(null);
          } else {
            const newIndex = Math.min(index, next.length - 1);
            setActiveTabId(next[newIndex].id);
          }
        }

        return next;
      });
    },
    [activeTabId]
  );

  const updateTabFormData = useCallback((id: string, data: T) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === id ? { ...t, formData: data } : t))
    );
  }, []);

  const activeTab = tabs.find((t) => t.id === activeTabId) || null;

  return (
    <TabContext.Provider
      value={{
        tabs,
        activeTabId,
        activeTab,
        openTab,
        openTabSilently,
        closeTab,
        setActiveTabId,
        updateTabFormData,
      }}
    >
      {children}
    </TabContext.Provider>
  );
}

export function useTabs<T = unknown>(): ITabContextValue<T> {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error('useTabs must be used within a TabProvider');
  }
  return context as ITabContextValue<T>;
}
