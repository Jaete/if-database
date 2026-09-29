'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface ISectionEntry {
  id: string;
  label: string;
}

// Os handles do projeto são identidade (hooks/useCssHandles.ts), então estes são
// nomes de classe globais reais — os mesmos que os dois formulários de edição
// usam em cada `<div className={handles.section}>`.
const SECTION_SELECTOR = '.section';
const TITLE_SELECTOR = '.sectionTitle';
const ID_PREFIX = 'section-rail-';

/**
 * Descobre as seções do formulário varrendo o DOM em vez de manter uma lista.
 * Isso acompanha sozinho as seções condicionais (Drops e Níveis de Evolução só
 * existem para monstro, Detalhes do Cidadão só para cidadão), serve aos dois
 * formulários e dá uma aba de graça a qualquer seção nova.
 */
export const useSectionRail = (
  containerRef: React.RefObject<HTMLElement | null>,
  isEnabled: boolean
) => {
  const [sections, setSections] = useState<ISectionEntry[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Mantido fora do estado: só serve para decidir quem está mais visível a cada
  // callback do observer, e não precisa provocar render por si só.
  const ratiosRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const container = containerRef.current;
    if (!isEnabled || !container) {
      setSections([]);
      setActiveId(null);
      return;
    }

    let observer: IntersectionObserver | null = null;

    // As seções começam em `opacity: 0` e só aparecem pela animação slideUp
    // (_editFormBase.scss), então a varredura espera o primeiro quadro.
    const frame = requestAnimationFrame(() => {
      const nodes = Array.from(
        container.querySelectorAll<HTMLElement>(SECTION_SELECTOR)
      );

      const found = nodes.map((node, index) => {
        const id = `${ID_PREFIX}${index}`;
        node.id = id;

        const title = node.querySelector(TITLE_SELECTOR)?.textContent?.trim();
        return { id, label: title || `Seção ${index + 1}` };
      });

      setSections(found);
      setActiveId(found[0]?.id ?? null);
      ratiosRef.current = new Map();

      if (found.length === 0) return;

      // O root precisa ser o container de rolagem do modal: contra a viewport o
      // observer nunca dispararia, porque o modal inteiro está sempre visível.
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            ratiosRef.current.set(
              entry.target.id,
              entry.isIntersecting ? entry.intersectionRatio : 0
            );
          }

          let bestId: string | null = null;
          let bestRatio = 0;
          for (const [id, ratio] of ratiosRef.current) {
            if (ratio > bestRatio) {
              bestRatio = ratio;
              bestId = id;
            }
          }

          if (bestId) setActiveId(bestId);
        },
        { root: container, threshold: [0, 0.25, 0.5, 0.75, 1] }
      );

      nodes.forEach((node) => observer?.observe(node));
    });

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [containerRef, isEnabled]);

  const scrollToSection = useCallback((id: string) => {
    const target = document.getElementById(id);
    if (!target) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    target.scrollIntoView({
      behavior: prefersReduced ? 'auto' : 'smooth',
      block: 'start',
    });
    setActiveId(id);
  }, []);

  return { sections, activeId, scrollToSection };
};
