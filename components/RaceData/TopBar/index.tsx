'use client';

import Link from 'next/link';
import type { MouseEvent } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import { ArrowLeftIcon } from '../../Icons';
import { useActiveSection } from './useTopBar';
import TopBarHandles from './handles';

interface IProps {
  sections: { id: string; label: string }[];
  /** Para onde o "Raças" volta. */
  basePath: string;
}

/** A barra fixa do detalhe: voltar para as raças e o sumário das seções. */
const TopBar = ({ sections, basePath }: IProps) => {
  const handles = useCssHandles(TopBarHandles);
  const active = useActiveSection(sections.map((s) => s.id));

  const go = (event: MouseEvent, id: string) => {
    event.preventDefault();
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: still ? 'auto' : 'smooth' });
  };

  return (
    <div className={handles.raceBar}>
      <div className={handles.raceBarIn}>
        <Link
          href={basePath}
          prefetch={false}
          className={handles.raceBack}
          aria-label="Voltar para as raças"
        >
          <ArrowLeftIcon />
          <span>Raças</span>
        </Link>
        <nav className={handles.raceToc} aria-label="Seções da raça">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              aria-current={active === section.id}
              onClick={(e) => go(e, section.id)}
            >
              {section.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default TopBar;
