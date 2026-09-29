'use client';

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
  const { sections, activeId, scrollToSection } = useSectionRail(
    containerRef,
    isEnabled
  );

  if (sections.length === 0) return null;

  return (
    <nav className={handles.sectionRail} aria-label="Seções do formulário">
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
