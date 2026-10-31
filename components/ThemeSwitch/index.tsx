'use client';

import type { KeyboardEvent } from 'react';
import { useRef } from 'react';

import { useCssHandles } from '@/hooks/useCssHandles';
import {
  type ThemePreference,
  useThemePreference,
} from '@/hooks/useThemePreference';
import { ThemeDarkIcon, ThemeLightIcon, ThemeSystemIcon } from '../Icons';
import ThemeSwitchHandles from './handles';
import '@/styles/components/themeSwitch.scss';

const OPTIONS = [
  { value: 'system', label: 'Sistema', Icon: ThemeSystemIcon },
  { value: 'light', label: 'Claro', Icon: ThemeLightIcon },
  { value: 'dark', label: 'Escuro', Icon: ThemeDarkIcon },
] as const satisfies readonly {
  value: ThemePreference;
  label: string;
  Icon: typeof ThemeSystemIcon;
}[];

const ThemeSwitch = () => {
  const handles = useCssHandles(ThemeSwitchHandles);
  const { preference, systemIsDark, setPreference, announcement } =
    useThemePreference();
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (index: number) => {
    const next = (index + OPTIONS.length) % OPTIONS.length;
    setPreference(OPTIONS[next].value);
    optionRefs.current[next]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent, index: number) => {
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        select(index + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        select(index - 1);
        break;
      case 'Home':
        event.preventDefault();
        select(0);
        break;
      case 'End':
        event.preventDefault();
        select(OPTIONS.length - 1);
        break;
    }
  };

  return (
    <div className={handles.themeSwitch}>
      <div
        className={handles.themeSwitchRail}
        role="radiogroup"
        aria-label="Tema"
      >
        {OPTIONS.map(({ value, label, Icon }, index) => {
          const checked = preference === value;
          return (
            <button
              key={value}
              ref={(node) => {
                optionRefs.current[index] = node;
              }}
              type="button"
              role="radio"
              aria-checked={checked}
              tabIndex={checked ? 0 : -1}
              className={`${handles.themeSwitchOption}${
                checked ? ` ${handles.themeSwitchOption}--active` : ''
              }`}
              onClick={() => setPreference(value)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              <Icon className={handles.themeSwitchIcon} />
              <span className={handles.themeSwitchLabel}>{label}</span>
            </button>
          );
        })}
      </div>

      {preference === 'system' && (
        <span className={handles.themeSwitchHint}>
          Seguindo o sistema: {systemIsDark ? 'escuro' : 'claro'}
        </span>
      )}

      <span
        className={handles.themeSwitchLive}
        role="status"
        aria-live="polite"
      >
        {announcement}
      </span>
    </div>
  );
};

export default ThemeSwitch;
