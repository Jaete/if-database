'use client';

import { useCssHandles } from '@/hooks/useCssHandles';
import { useThemePreference } from '@/hooks/useThemePreference';
import { ThemeDarkIcon, ThemeLightIcon } from '../Icons';
import EmbedThemeToggleHandles from './handles';
import '@/styles/components/embedThemeToggle.scss';

/**
 * Discreet light/dark toggle for the embeds.
 *
 * Starts following the OS; a click pins the opposite of what is showing. Only
 * two states (no "Sistema" option) because it lives in a corner of an iframe,
 * not in a menu. The choice is stored under the same key as the app's switch,
 * but inside the forum the iframe's storage is partitioned, so it only applies
 * to the embeds on that forum.
 */
const EmbedThemeToggle = () => {
  const handles = useCssHandles(EmbedThemeToggleHandles);
  const { preference, systemIsDark, setPreference, announcement } =
    useThemePreference();

  const isDark = preference === 'system' ? systemIsDark : preference === 'dark';
  const next = isDark ? 'light' : 'dark';
  const label = isDark ? 'Mudar para o tema claro' : 'Mudar para o tema escuro';
  const Icon = isDark ? ThemeLightIcon : ThemeDarkIcon;

  return (
    <>
      <button
        type="button"
        className={handles.embedThemeToggle}
        onClick={() => setPreference(next)}
        aria-label={label}
        title={label}
      >
        <Icon className={handles.embedThemeToggleIcon} />
      </button>
      <span className={handles.embedThemeToggleLive} role="status">
        {announcement}
      </span>
    </>
  );
};

export default EmbedThemeToggle;
