'use client';

import { useEffect, useRef } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import { ClassSigilIcon } from '../../Icons';
import LevelUpButton from '../LevelUpButton';
import LevelUpRiteHandles from '../LevelUpRite/handles';
import SoundButton from '../SoundButton';
import { useCreation } from '../CreationContext';
import '@/styles/components/levelUp.scss';

/**
 * A cerimônia de abrir a ficha em branco: o mesmo clarão e o mesmo anel da
 * subida de nível, com o sigilo no centro. Os sons dela tocam ao abrir
 * (`openRite`). Com movimento reduzido o conteúdo é o mesmo, sem raios nem
 * faíscas.
 */
const CreationRite = () => {
  const handles = useCssHandles(LevelUpRiteHandles);
  const { player, close, openWizard } = useCreation();
  const rootRef = useRef<HTMLDivElement>(null);

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
      aria-label="Começar a ficha"
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
          {player?.ownerUsername ?? 'Uma nova história'} começa
        </span>
        <div className={handles.luRiteRoll} aria-label="Nível 1">
          <span>Nível</span>
          <span className={handles.luRiteOdo} aria-hidden="true">
            <span>
              <b>0</b>
              <b>1</b>
            </span>
          </span>
        </div>
        <div className={handles.luRiteName}>Ficha em branco</div>
        <p className={handles.luRiteSub}>
          Dez passos, salvos no servidor. Dá para sair e voltar quando quiser.
        </p>
        <div className={handles.luRiteActs}>
          <LevelUpButton
            variant="primary"
            size="lg"
            onClick={() => openWizard('identidade')}
          >
            Abrir o primeiro passo
          </LevelUpButton>
          <LevelUpButton variant="ghost" onClick={close}>
            Depois
          </LevelUpButton>
        </div>
      </div>
    </div>
  );
};

export default CreationRite;
