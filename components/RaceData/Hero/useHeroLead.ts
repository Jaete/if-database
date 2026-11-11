'use client';

import { useLayoutEffect, useRef, useState } from 'react';

/**
 * O "Ver mais" do resumo do topo.
 *
 * Recolhido, o CSS limita a altura a algumas linhas (`.raceHeroLead`). Para
 * abrir com transição, a altura máxima vira a altura real do texto em px —
 * `max-height` não anima até `none`. O botão só aparece quando o texto
 * passa do limite; um `ResizeObserver` refaz a conta quando a largura muda
 * (tela girada, janela redimensionada) ou quando o resumo é editado.
 */
export function useHeroLead(text: string) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const [fullHeight, setFullHeight] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      setFullHeight(el.scrollHeight);
      // Recolhido, `clientHeight` é o limite do CSS; aberto, vale a altura
      // inteira — então guardamos se já passou do limite uma vez.
      const collapsed = parseFloat(getComputedStyle(el).lineHeight) * LINES;
      setOverflows(el.scrollHeight > collapsed + 1);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [text]);

  return {
    leadRef: ref,
    expanded: expanded && overflows,
    overflows,
    toggle: () => setExpanded((open) => !open),
    style: expanded && overflows ? { maxHeight: `${fullHeight}px` } : undefined,
  };
}

/** Linhas visíveis com o resumo recolhido — o mesmo número do SCSS. */
export const LINES = 4;
