'use client';

import { useEffect, useSyncExternalStore } from 'react';
import type { RefObject } from 'react';
import {
  armSounds,
  getServerSoundSettings,
  getSoundSettings,
  setSoundGroup,
  subscribeSoundSettings,
} from '@/lib/sheetSounds';

/**
 * Libera o som no primeiro gesto DENTRO da ficha. Só liga um ouvinte: o
 * AudioContext nem existe até o primeiro som tocar, então a ficha lida num post
 * do fórum não faz trabalho de áudio nenhum.
 */
export const useSheetSounds = (ref: RefObject<HTMLElement | null>) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const arm = () => armSounds();
    el.addEventListener('pointerdown', arm, { capture: true });
    el.addEventListener('keydown', arm, { capture: true });
    return () => {
      el.removeEventListener('pointerdown', arm, { capture: true });
      el.removeEventListener('keydown', arm, { capture: true });
    };
  }, [ref]);
};

/** As duas chaves de som da pessoa e como mudá-las. */
export const useSoundSettings = () => {
  const settings = useSyncExternalStore(
    subscribeSoundSettings,
    getSoundSettings,
    getServerSoundSettings
  );
  return { ...settings, setGroup: setSoundGroup };
};
