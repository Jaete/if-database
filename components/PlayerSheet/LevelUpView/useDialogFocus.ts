'use client';

import { useEffect } from 'react';
import type { RefObject } from 'react';

/**
 * Foco de diálogo: entra no elemento ao abrir e volta para quem o tinha antes
 * ao fechar. `target` é o que recebe o foco (o painel, ou um botão dentro).
 */
export const useDialogFocus = (
  root: RefObject<HTMLElement | null>,
  target?: RefObject<HTMLElement | null>
) => {
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    (target?.current ?? root.current)?.focus({ preventScroll: true });
    return () => {
      if (opener && opener.isConnected) opener.focus({ preventScroll: true });
    };
    // Só ao abrir e ao fechar.
  }, [root, target]);
};
