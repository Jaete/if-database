'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * "Ver tudo": o card em foco mostra o botão quando algum texto foi truncado.
 *
 * A medição é de verdade (`scrollHeight > clientHeight`), e não uma contagem de
 * caracteres: quantas linhas cabem depende da largura do card, do modo embed e
 * da altura do iframe.
 */
export function useClassCard(focused: boolean) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [overflowing, setOverflowing] = useState(false);

  // Perder o foco fecha: o card volta ao tamanho dos vizinhos.
  if (!focused && open) setOpen(false);

  useEffect(() => {
    const body = bodyRef.current;
    // Aberto, nada está truncado — medir agora esconderia o botão que
    // fecha. O observador é refeito quando `open` muda.
    if (!body || open) return;

    const measure = () => {
      const texts = body.querySelectorAll('p, dd');
      setOverflowing(
        Array.from(texts).some(
          (node) => node.scrollHeight > node.clientHeight + 1
        )
      );
    };
    const observer = new ResizeObserver(measure);
    observer.observe(body);
    return () => observer.disconnect();
  }, [open]);

  return {
    bodyRef,
    open: open && focused,
    overflowing,
    toggle: () => setOpen((value) => !value),
  };
}
