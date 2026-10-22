'use client';

import { useEffect, useRef } from 'react';
import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import { useSectionRail } from './useSectionRail';
import SectionRailHandles from './handles';
import '@/styles/components/sectionRail.scss';

interface IProps {
  // O container de rolagem do modal, que é também onde as seções vivem.
  containerRef: React.RefObject<HTMLElement | null>;
  isEnabled: boolean;
}

const SectionRail = ({ containerRef, isEnabled }: IProps) => {
  const handles = useCssHandles(SectionRailHandles);
  const railRef = useRef<HTMLElement>(null);
  const { sections, activeId, scrollToSection } = useSectionRail(
    containerRef,
    isEnabled
  );

  // A aba ativa acompanha a rolagem do modal, mas só dentro da régua: um
  // scrollIntoView aqui arrastaria a página inteira junto.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail || !activeId) return;

    const tab = rail.querySelector<HTMLElement>('[aria-current="true"]');
    if (!tab) return;

    const tabTop = tab.offsetTop;
    const tabBottom = tabTop + tab.offsetHeight;
    const viewBottom = rail.scrollTop + rail.clientHeight;

    if (tabTop < rail.scrollTop) {
      rail.scrollTop = tabTop;
    } else if (tabBottom > viewBottom) {
      rail.scrollTop = tabBottom - rail.clientHeight;
    }
  }, [activeId]);

  if (sections.length === 0) return null;

  return (
    <nav
      ref={railRef}
      className={handles.sectionRail}
      aria-label="Seções do formulário"
    >
      {sections.map(({ id, label }) => {
        const isActive = id === activeId;

        return (
          <button
            // O <form> é irmão deste botão no DOM: sem type="button" o clique
            // submeteria o formulário.
            type="button"
            key={id}
            className={`${handles.sectionRailTab}${
              isActive
                ? ` ${applyModifiers(handles.sectionRailTab, 'active')}`
                : ''
            }`}
            aria-current={isActive ? 'true' : 'false'}
            onClick={() => scrollToSection(id)}
            title={label}
          >
            {label}
          </button>
        );
      })}
    </nav>
  );
};

export default SectionRail;
