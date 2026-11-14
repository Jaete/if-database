'use client';

import { useEffect, useRef, useState } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import { D10Icon, LockIcon } from '../../../Icons';
import LevelUpButton from '../../LevelUpButton';
import LevelUpViewHandles from '../handles';
import { useDialogFocus } from '../useDialogFocus';

interface IProps {
  phase: 'tumble' | 'settled';
  die: number;
  result?: number;
  conMod: number;
  hpFrom: number;
  rolledAt?: string;
  rollId?: string;
  onContinue: () => void;
}

/**
 * O dado rolando na tela de subida. O número já foi sorteado e gravado pelo
 * servidor antes desta tela abrir: aqui só se anima a revelação. Com movimento
 * reduzido (CSS) o dado não rola e o resultado aparece em instantes.
 */
const RollStage = ({
  phase,
  die,
  result,
  conMod,
  hpFrom,
  rolledAt,
  rollId,
  onContinue,
}: IProps) => {
  const handles = useCssHandles(LevelUpViewHandles);
  const [face, setFace] = useState('?');
  const rootRef = useRef<HTMLDivElement>(null);
  const continueRef = useRef<HTMLButtonElement>(null);
  useDialogFocus(rootRef);
  // Terminada a rolagem, o foco vai para "Continuar".
  useEffect(() => {
    if (phase === 'settled') continueRef.current?.focus();
  }, [phase]);

  useEffect(() => {
    if (phase !== 'tumble') return;
    const timer = window.setInterval(
      () => setFace(String(1 + Math.floor(Math.random() * die))),
      70
    );
    return () => window.clearInterval(timer);
  }, [phase, die]);

  if (phase === 'tumble') {
    return (
      <div
        ref={rootRef}
        tabIndex={-1}
        className={`${handles.luRollStage} ${handles.luRollStage}--tumble`}
        role="dialog"
        aria-modal="true"
        aria-label="Rolando o dado de vida"
      >
        <div className={handles.luRollDie} aria-hidden="true">
          <div>
            <D10Icon />
            <b>{face}</b>
          </div>
        </div>
        <div className={handles.luRollShadow} aria-hidden="true" />
        <p className={handles.luRollCap} role="status" aria-live="polite">
          Rolando 1d{die}…
        </p>
      </div>
    );
  }

  const value = result ?? 0;
  const gain = Math.max(1, value + conMod);
  return (
    <div
      className={`${handles.luRollStage} ${handles.luRollStage}--settled`}
      role="dialog"
      aria-label={`Resultado: ${value}`}
    >
      <div className={handles.luRollRing} />
      <div className={handles.luRollDie}>
        <div>
          <D10Icon />
          <b>{value}</b>
        </div>
      </div>
      <div className={handles.luRollShadow} />
      <div className={handles.luRollGain}>+{gain} PV</div>
      <p className={handles.luRollCap}>
        <b>{value}</b> no dado + <b>{conMod}</b> de CON · vida {hpFrom} →{' '}
        <b>{hpFrom + gain}</b>
      </p>
      {rolledAt && (
        <span className={handles.luAudit}>
          <LockIcon width={11} height={11} />
          Rolado em{' '}
          {new Date(rolledAt).toLocaleString('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'short',
          })}{' '}
          · auditável <small>{rollId}</small>
        </span>
      )}
      <div className={handles.luDialogActs}>
        <LevelUpButton
          ref={continueRef}
          variant="primary"
          size="lg"
          onClick={onContinue}
        >
          Continuar
        </LevelUpButton>
      </div>
    </div>
  );
};

export default RollStage;
