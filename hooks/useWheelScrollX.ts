'use client';

import { useCallback } from 'react';

// deltaMode 1 = linhas, 2 = páginas. A maioria dos mouses manda pixels, mas o
// Firefox no Linux manda linhas.
const LINE_PX = 16;

/**
 * Faz a roda do mouse rolar na horizontal uma faixa que só rola de lado.
 *
 * Sem isto, a faixa só anda com shift + roda ou arrastando no touchpad. Só age
 * quando o gesto é vertical (o horizontal do touchpad já funciona sozinho) e
 * quando ainda há para onde rolar: nas pontas, o evento segue adiante.
 *
 * Devolve um ref callback. O listener é nativo porque o `onWheel` do React é
 * passivo e não deixa cancelar a rolagem vertical.
 */
export function useWheelScrollX<T extends HTMLElement>() {
  return useCallback((el: T | null) => {
    if (!el) return;

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey) return; // zoom
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;

      const unit =
        event.deltaMode === 1
          ? LINE_PX
          : event.deltaMode === 2
            ? el.clientWidth
            : 1;
      const delta = event.deltaY * unit;
      const atEdge =
        (delta < 0 && el.scrollLeft <= 0) ||
        (delta > 0 && el.scrollLeft >= max - 1);
      if (atEdge) return;

      event.preventDefault();
      el.scrollLeft += delta;
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);
}
