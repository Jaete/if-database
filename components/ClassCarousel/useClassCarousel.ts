'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
} from 'react';

/**
 * O trilho do seletor: qual card está no centro, e como levar outro até lá.
 *
 * O foco é derivado da rolagem (o card mais próximo do centro, recalculado a
 * cada frame de scroll), não guardado como verdade própria: o scroll-snap e o
 * arrasto do dedo movem o trilho sem passar por aqui.
 */
export function useClassCarousel(count: number) {
  const trackRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);
  // Verdadeiro entre o toque/clique e o fim dele: o foco que vem do ponteiro
  // não deve recentralizar (o clique já decide o que fazer).
  const pointerRef = useRef(false);
  const skipFocusRef = useRef(false);
  // O destino de uma rolagem disparada por aqui (seta, teclado, clique). Até
  // ele chegar ao centro, o foco não passa pelos cards do caminho — senão cada
  // um cresceria e encolheria de novo, e o texto dançaria na travessia.
  const targetRef = useRef<number | null>(null);
  const [raw, setFocused] = useState(0);

  // A lista pode encolher por baixo do índice (a busca remonta, mas a
  // recarga após salvar não).
  const focused = Math.min(raw, Math.max(count - 1, 0));

  const cards = useCallback(
    () => Array.from(trackRef.current?.children ?? []) as HTMLElement[],
    []
  );

  const center = useCallback(
    (index: number) => {
      const track = trackRef.current;
      const card = cards()[index];
      if (!track || !card) return;
      const reduced = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;
      targetRef.current = index;
      track.scrollTo({
        left: card.offsetLeft + card.offsetWidth / 2 - track.clientWidth / 2,
        behavior: reduced ? 'auto' : 'smooth',
      });
      setFocused(index);
    },
    [cards]
  );

  const update = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const middle = track.scrollLeft + track.clientWidth / 2;
    let best = 0;
    let distance = Infinity;
    cards().forEach((card, index) => {
      const gap = Math.abs(card.offsetLeft + card.offsetWidth / 2 - middle);
      if (gap < distance) {
        distance = gap;
        best = index;
      }
    });
    if (targetRef.current !== null) {
      if (best !== targetRef.current) return;
      targetRef.current = null;
    }
    setFocused(best);
  }, [cards]);

  // Rede de segurança: se a rolagem parar antes do destino (outra rolagem do
  // usuário por cima), o foco volta a seguir o centro.
  const onScrollEnd = useCallback(() => {
    targetRef.current = null;
    update();
  }, [update]);

  const onScroll = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(update);
  }, [update]);

  useEffect(() => {
    const onResize = () => {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(update);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(frameRef.current);
    };
  }, [update]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const target: Record<string, number> = {
      ArrowLeft: focused - 1,
      ArrowRight: focused + 1,
      Home: 0,
      End: count - 1,
    };
    if (!(event.key in target)) return;
    event.preventDefault();
    const index = Math.max(0, Math.min(count - 1, target[event.key]));
    center(index);
    // O foco acompanha o card, para quem navega só pelo teclado.
    skipFocusRef.current = true;
    cards()[index]?.querySelector('a')?.focus({ preventScroll: true });
    skipFocusRef.current = false;
  };

  // Tab para um card fora do centro o centraliza — senão o foco cairia num
  // card meio cortado pela máscara.
  const onFocus = (event: FocusEvent<HTMLDivElement>) => {
    if (pointerRef.current || skipFocusRef.current) return;
    const index = cards().findIndex((card) =>
      card.contains(event.target as Node)
    );
    if (index >= 0 && index !== focused) center(index);
  };

  return {
    trackRef,
    focused,
    center,
    onScroll,
    onScrollEnd,
    onKeyDown,
    onFocus,
    onPointerDown: () => {
      pointerRef.current = true;
      // Arrastar assume o comando: o destino anterior deixa de valer.
      targetRef.current = null;
    },
    onPointerEnd: () => {
      pointerRef.current = false;
    },
  };
}
