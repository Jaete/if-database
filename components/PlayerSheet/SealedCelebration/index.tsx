'use client';

import { useEffect, useRef } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import { WaxSealIcon } from '../../Icons';
import LevelUpButton from '../LevelUpButton';
import LevelUpPill from '../LevelUpPill';
import { useLevelUp } from '../LevelUpContext';
import SealedCelebrationHandles from './handles';
import '@/styles/components/levelUp.scss';

/** O carimbo depois do selo: o que o nível trouxe e o caminho para o próximo. */
const SealedCelebration = () => {
  const handles = useCssHandles(SealedCelebrationHandles);
  const { sealedInfo, progress, openRite, close } = useLevelUp();
  const rootRef = useRef<HTMLDivElement>(null);
  const more = progress.pending;

  useEffect(() => {
    rootRef.current?.focus({ preventScroll: true });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [close]);

  if (!sealedInfo) return null;
  const { level, got } = sealedInfo;

  return (
    <div
      ref={rootRef}
      tabIndex={-1}
      className={handles.luSealed}
      role="dialog"
      aria-label={`Nível ${level} selado`}
    >
      <div className={handles.luSealedMotes}>
        {Array.from({ length: 18 }, (_, i) => (
          <i
            key={i}
            style={
              {
                left: `${(i * 53) % 100}%`,
                '--s': `${(2 + (i % 3)) / 16}rem`,
                '--d': `${3 + (i % 4) * 0.7}s`,
                '--dl': `${(i % 6) * 0.3}s`,
                '--dx': `${((i % 5) - 2) * 16}px`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
      <div className={handles.luSealedDust} />
      <div className={handles.luSealedIn}>
        <div className={handles.luSealedStamp}>
          <WaxSealIcon />
          <span>{level}</span>
        </div>
        <h2>Nível {level} selado</h2>
        <div className={handles.luSealedGot}>
          {got.map((n, i) => (
            <LevelUpPill key={i} tone="novo">
              {n}
            </LevelUpPill>
          ))}
        </div>
        <p className={handles.luSealedSub}>
          Gravado na ficha.{' '}
          {more > 0
            ? `Ainda há ${more === 1 ? 'um nível' : `${more} níveis`} esperando.`
            : 'As novidades estão marcadas na ficha.'}
        </p>
        <div className={handles.luSealedActs}>
          {more > 0 ? (
            <>
              <LevelUpButton variant="primary" size="lg" onClick={openRite}>
                Seguir para o nível {level + 1}
              </LevelUpButton>
              <LevelUpButton variant="ghost" onClick={close}>
                Fazer depois
              </LevelUpButton>
            </>
          ) : (
            <LevelUpButton variant="primary" size="lg" onClick={close}>
              Voltar à ficha
            </LevelUpButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default SealedCelebration;
