'use client';

import { useEffect, useRef } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import GrantXpLayer from '../GrantXpLayer';
import LevelUpRite from '../LevelUpRite';
import LevelUpView from '../LevelUpView';
import SealedCelebration from '../SealedCelebration';
import { useLevelUp } from '../LevelUpContext';
import LevelUpLayerHostHandles from './handles';

/**
 * Monta a tela aberta (conceder XP, cerimônia, subida ou carimbo) por cima da
 * ficha, dentro da moldura e não num modal. Enquanto ela existe, o resto da
 * ficha fica inerte, como na camada de escolha do códice.
 */
const LevelUpLayerHost = () => {
  const handles = useCssHandles(LevelUpLayerHostHandles);
  const { view } = useLevelUp();
  const rootRef = useRef<HTMLDivElement>(null);
  const open = view !== 'sheet';

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
      {view === 'grant' && <GrantXpLayer />}
      {view === 'rite' && <LevelUpRite />}
      {view === 'level' && <LevelUpView />}
      {view === 'sealed' && <SealedCelebration />}
    </div>
  );
};

export default LevelUpLayerHost;
