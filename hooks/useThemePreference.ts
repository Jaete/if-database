'use client';

import { useCallback, useState, useSyncExternalStore } from 'react';

export type ThemePreference = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'ifdb-theme';
const DARK_QUERY = '(prefers-color-scheme: dark)';

const readAttribute = (): ThemePreference => {
  const value = document.documentElement.dataset.theme;
  return value === 'light' || value === 'dark' ? value : 'system';
};

const applyPreference = (preference: ThemePreference) => {
  const root = document.documentElement;
  if (preference === 'system') root.removeAttribute('data-theme');
  else root.dataset.theme = preference;
};

// <html data-theme> is the source of truth: the inline script in the layout
// sets it before hydration, so the attribute is observed instead of mirrored.
const subscribePreference = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  // Other tabs: their write reaches this one as a `storage` event.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== STORAGE_KEY) return;
    const value = event.newValue;
    applyPreference(value === 'light' || value === 'dark' ? value : 'system');
  };
  window.addEventListener('storage', onStorage);

  return () => {
    observer.disconnect();
    window.removeEventListener('storage', onStorage);
  };
};

const subscribeSystem = (onChange: () => void) => {
  const query = window.matchMedia(DARK_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
};

const ANNOUNCEMENTS: Record<ThemePreference, string> = {
  system: 'Seguindo o tema do sistema',
  light: 'Tema claro aplicado',
  dark: 'Tema escuro aplicado',
};

export function useThemePreference() {
  const preference = useSyncExternalStore<ThemePreference>(
    subscribePreference,
    readAttribute,
    () => 'system'
  );
  const systemIsDark = useSyncExternalStore(
    subscribeSystem,
    () => window.matchMedia(DARK_QUERY).matches,
    () => true
  );
  const [announcement, setAnnouncement] = useState('');

  const setPreference = useCallback((next: ThemePreference) => {
    const root = document.documentElement;
    root.setAttribute('data-theme-switching', '');
    applyPreference(next);

    try {
      if (next === 'system') localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage unavailable (private mode, blocked): the choice lasts the session.
    }

    // Two frames: lets the new styles paint once with transitions disabled.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => root.removeAttribute('data-theme-switching'))
    );
    setAnnouncement(ANNOUNCEMENTS[next]);
  }, []);

  return { preference, systemIsDark, setPreference, announcement };
}
