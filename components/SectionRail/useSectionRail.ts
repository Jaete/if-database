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
 *
 * A varredura se repete a cada mudança na árvore, e não só no primeiro quadro:
 * há seção que decide se existe depois de uma busca — o Arquétipo só se mostra
 * quando o catálogo da classe diz que a ficha já escolhe um — e chega tarde
 * demais para a primeira passada. Pior: os ids são posicionais, então uma
 * seção que entra no meio desloca todas as abas seguintes em relação ao que
 * elas rotulam.
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
    let frame = 0;
    // A assinatura evita refazer tudo a cada mexida no formulário: só a
    // entrada ou saída de uma seção — ou a troca de um título — muda a régua.
    let signature = '';

    const scan = () => {
      const nodes = Array.from(
        container.querySelectorAll<HTMLElement>(SECTION_SELECTOR)
      );

      const found = nodes.map((node, index) => {
        const id = `${ID_PREFIX}${index}`;
        node.id = id;

        const title = node.querySelector(TITLE_SELECTOR)?.textContent?.trim();
        return { id, label: title || `Seção ${index + 1}` };
      });

      const next = found.map((entry) => entry.label).join('|');
      if (next === signature) return;
      signature = next;

      setSections(found);
      // A seção ativa é preservada quando sobrevive à nova varredura: perder o
      // lugar porque uma seção apareceu lá em cima seria pior que não
      // atualizar.
      setActiveId((prev) =>
        found.some((entry) => entry.id === prev) ? prev : (found[0]?.id ?? null)
      );
      ratiosRef.current = new Map();

      observer?.disconnect();
      observer = null;
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
    };

    // As seções começam em `opacity: 0` e só aparecem pela animação slideUp
    // (_editFormBase.scss), então a varredura espera o primeiro quadro.
    frame = requestAnimationFrame(scan);

    // Só `childList`: a varredura escreve `node.id`, e observar atributos
    // faria ela se disparar sozinha em laço.
    const mutations = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(scan);
    });
    mutations.observe(container, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(frame);
      mutations.disconnect();
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
