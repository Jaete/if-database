'use client';

import { useEffect, useRef } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import { ClassSigilIcon } from '../../Icons';
import LevelUpButton from '../LevelUpButton';
import { useLevelUp } from '../LevelUpContext';
import SoundButton from '../SoundButton';
import LevelUpRiteHandles from './handles';
import '@/styles/components/levelUp.scss';

/**
 * A cerimônia: clarão, o sigilo da classe e o número rolando do nível selado
 * para o próximo. Os sons dela são disparados ao abrir (`openRite`). Com
 * movimento reduzido o conteúdo é o mesmo, sem raios, faíscas nem rolagem.
 */
const LevelUpRite = () => {
  const handles = useCssHandles(LevelUpRiteHandles);
  const { player, progress, startLevel, close, busy, error } = useLevelUp();
  const rootRef = useRef<HTMLDivElement>(null);
  const level = progress.level + 1;
  const pending = progress.pending;

  useEffect(() => {
    rootRef.current?.focus({ preventScroll: true });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !event.defaultPrevented) {
        event.preventDefault();
        close();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [close]);

  const motes = Array.from({ length: 26 }, (_, i) => (
    <i
      key={i}
      style={
        {
          left: `${(i * 37) % 100}%`,
          '--s': `${(2 + (i % 3)) / 16}rem`,
          '--d': `${3.5 + (i % 5) * 0.6}s`,
          '--dl': `${(i % 9) * 0.35}s`,
          '--dx': `${((i % 7) - 3) * 14}px`,
        } as React.CSSProperties
      }
    />
  ));

  return (
    <div
      ref={rootRef}
      tabIndex={-1}
      className={handles.luRite}
      role="dialog"
      aria-label={`Subida para o nível ${level}`}
    >
      <span className={handles.luRiteSound}>
        <SoundButton place="down" />
      </span>
      <div className={handles.luRiteRays} />
      <div className={handles.luRiteMotes}>{motes}</div>
      <div className={handles.luRiteFlash} />
      <div className={handles.luRiteRing} />
      <div className={`${handles.luRiteRing} ${handles.luRiteRing}--second`} />
      <div className={handles.luRiteIn}>
        <ClassSigilIcon className={handles.luRiteSigil} />
        <span className={handles.luRiteKick}>
          {String(player.name)} desperta
        </span>
        <div className={handles.luRiteRoll} aria-label={`Nível ${level}`}>
          <span>Nível</span>
          <span className={handles.luRiteOdo} aria-hidden="true">
            <span>
              <b>{level - 1}</b>
              <b>{level}</b>
            </span>
          </span>
        </div>
        <div className={handles.luRiteName}>
          {String(player.class ?? '')} de {level}º nível
        </div>
        <p className={handles.luRiteSub}>
          {pending > 1
            ? `Este é o primeiro de ${pending} níveis. Escolha o que o nível ${level} traz; depois vem o ${level + 1}.`
            : `Escolha o que o nível ${level} traz.`}
        </p>
        {pending > 1 && (
          <div className={handles.luRiteQueue}>
            {Array.from({ length: pending }, (_, i) => (
              <i key={i} data-cur={i === 0 || undefined} />
            ))}
            <span>
              nível {level} de {progress.earned}
            </span>
          </div>
        )}
        {error && <p role="alert">{error}</p>}
        <div className={handles.luRiteActs}>
          <LevelUpButton
            variant="primary"
            size="lg"
            disabled={busy}
            onClick={() => void startLevel()}
          >
            Ver o que o nível {level} traz
          </LevelUpButton>
          <LevelUpButton variant="ghost" onClick={close}>
            Depois
          </LevelUpButton>
        </div>
      </div>
    </div>
  );
};

export default LevelUpRite;
