'use client';

import { useEffect, useRef } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import CreationReview from '../CreationReview';
import CreationRite from '../CreationRite';
import CreationView from '../CreationView';
import { useCreation } from '../CreationContext';
import LevelUpLayerHostHandles from '../LevelUpLayerHost/handles';

/**
 * Monta a tela da criação (cerimônia, assistente ou revisão da staff) por cima
 * da ficha, dentro da moldura e não num modal. Enquanto ela existe, o resto da
 * ficha fica inerte, como na subida de nível. Reaproveita a camada `luHost`.
 */
const CreationLayerHost = () => {
  const handles = useCssHandles(LevelUpLayerHostHandles);
  const { view, data } = useCreation();
  const rootRef = useRef<HTMLDivElement>(null);
  const open = view !== 'sheet' && !!data;

  useEffect(() => {
    if (!open) return;
    const root = rootRef.current;
    const opener = document.activeElement as HTMLElement | null;
    const inerted = Array.from(root?.parentElement?.children ?? []).filter(
      (el): el is HTMLElement => el !== root && el instanceof HTMLElement
    );
    for (const el of inerted) {
      el.inert = true;
      el.setAttribute('aria-hidden', 'true');
    }
    return () => {
      for (const el of inerted) {
        el.inert = false;
        el.removeAttribute('aria-hidden');
      }
      opener?.focus?.({ preventScroll: true });
    };
  }, [open]);

  if (!open) return null;
  return (
    // `data-inner-open`: o EmbedCloseBridge não fecha o modal do fórum com o Esc.
    <div ref={rootRef} className={handles.luHost} data-inner-open>
      {view === 'rite' && <CreationRite />}
      {view === 'wizard' && <CreationView />}
      {view === 'review' && <CreationReview />}
    </div>
  );
};

export default CreationLayerHost;
