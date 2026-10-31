'use client';

import { useState } from 'react';
import Link from 'next/link';
import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import { ChevronRightIcon } from '../Icons';
import Emblem from './Emblem';
import { ENTRY_IMAGES } from './images';
import EmbedEntryHandles from './handles';
import '@/styles/components/embedEntry.scss';

type PanelKey = keyof typeof ENTRY_IMAGES;

const PANELS: {
  key: PanelKey;
  href: string;
  title: string;
  subtitle: string;
  cta: string;
}[] = [
  {
    key: 'classes',
    href: '/embed/classes',
    title: 'Classes',
    subtitle: 'O que cada classe adquire a cada nível.',
    cta: 'Ver classes',
  },
  {
    key: 'spells',
    href: '/embed/spells',
    title: 'Magias',
    subtitle: 'O grimório de Terralém, círculo a círculo.',
    cta: 'Abrir o grimório',
  },
];

/**
 * A entrada do embed: dois painéis, Classes e Magias, que acendem ao hover ou
 * foco e recuam o vizinho. Sem imagem (ou se ela falhar), cai no ornamento.
 */
const EmbedEntry = () => {
  const handles = useCssHandles(EmbedEntryHandles);
  const [failed, setFailed] = useState<Partial<Record<PanelKey, boolean>>>({});

  return (
    <div className={handles.embedEntry}>
      <h1 className={handles.embedEntryHeading}>Classes e Escolas Mágicas</h1>
      {PANELS.map((panel) => {
        const src = ENTRY_IMAGES[panel.key];
        const hasImage = !!src && !failed[panel.key];
        return (
          <Link
            key={panel.key}
            href={panel.href}
            className={`${handles.embedEntryPanel}${
              hasImage
                ? ''
                : ` ${applyModifiers(handles.embedEntryPanel, 'plain')}`
            }`}
          >
            {hasImage ? (
              // eslint-disable-next-line @next/next/no-img-element -- decorativa, com fallback por onError
              <img
                className={handles.embedEntryArt}
                src={src}
                alt=""
                decoding="async"
                onError={() =>
                  setFailed((current) => ({ ...current, [panel.key]: true }))
                }
              />
            ) : (
              <Emblem kind={panel.key} />
            )}
            <span className={handles.embedEntryShade} aria-hidden="true" />
            <span className={handles.embedEntryBody}>
              <span className={handles.embedEntryMark} aria-hidden="true">
                ◆
              </span>
              <h2 className={handles.embedEntryTitle}>{panel.title}</h2>
              <p className={handles.embedEntrySub}>{panel.subtitle}</p>
              <span className={handles.embedEntryCta}>
                {panel.cta}
                <ChevronRightIcon aria-hidden="true" />
              </span>
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default EmbedEntry;
