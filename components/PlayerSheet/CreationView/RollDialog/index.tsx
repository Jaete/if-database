'use client';

import { useEffect, useRef, useState } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import { droppedIndex } from '@/lib/creation';
import { D10Icon, LockIcon } from '../../../Icons';
import LevelUpButton from '../../LevelUpButton';
import LevelUpViewHandles from '../../LevelUpView/handles';
import { useDialogFocus } from '../../LevelUpView/useDialogFocus';
import CreationViewHandles from '../handles';

interface IAskProps {
  onCancel: () => void;
  onRoll: () => void;
  busy: boolean;
}

/**
 * O aviso antes de rolar os atributos: é o mesmo da rolagem de vida. Lista o
 * que muda, e o botão só liga com o "Entendi" marcado.
 */
export const AttributeRollAsk = ({ onCancel, onRoll, busy }: IAskProps) => {
  const lu = useCssHandles(LevelUpViewHandles);
  const [ack, setAck] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  useDialogFocus(panelRef);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        onCancel();
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [onCancel]);

  return (
    <div className={lu.luVeil}>
      <div
        ref={panelRef}
        tabIndex={-1}
        className={lu.luSealDlg}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="cr-roll-title"
      >
        <div className={lu.luWax} data-roll>
          <D10Icon />
        </div>
        <h3 id="cr-roll-title">Rolar os atributos?</h3>
        <p>
          Seis linhas de 4d6, descartando o menor dado de cada. Você distribui
          os seis totais entre os atributos.
        </p>
        <ul className={lu.luWarnList}>
          <li>
            <b>Não dá para voltar.</b> Não há segunda rolagem, e a compra de
            pontos e o arranjo padrão ficam bloqueados.
          </li>
          <li>
            <b>Os 24 dados ficam gravados no banco:</b> valores, data, hora e
            quem rolou. A staff vê isso na revisão.
          </li>
        </ul>
        <label className={lu.luCheck}>
          <input
            type="checkbox"
            checked={ack}
            onChange={(e) => setAck(e.target.checked)}
          />
          Entendi que o resultado é definitivo
        </label>
        <div className={lu.luDialogActs}>
          <LevelUpButton onClick={onCancel}>Cancelar</LevelUpButton>
          <LevelUpButton
            variant="primary"
            size="lg"
            disabled={!ack || busy}
            onClick={onRoll}
          >
            Rolar 6 × 4d6
          </LevelUpButton>
        </div>
      </div>
    </div>
  );
};

interface IStageProps {
  phase: 'tumble' | 'settled';
  sets?: number[][];
  sums?: number[];
  at?: string;
  rollId?: string;
  onContinue: () => void;
}

/**
 * Os dados rolando. O resultado já foi sorteado e gravado pelo servidor antes
 * desta tela abrir: aqui só se anima a revelação. Com movimento reduzido (CSS)
 * os seis resultados aparecem de uma vez.
 */
export const AttributeRollStage = ({
  phase,
  sets,
  sums,
  at,
  rollId,
  onContinue,
}: IStageProps) => {
  const lu = useCssHandles(LevelUpViewHandles);
  const handles = useCssHandles(CreationViewHandles);
  const [faces, setFaces] = useState<number[]>(() => Array(24).fill(1));
  const rootRef = useRef<HTMLDivElement>(null);
  const continueRef = useRef<HTMLButtonElement>(null);
  useDialogFocus(rootRef);

  useEffect(() => {
    if (phase === 'settled') continueRef.current?.focus();
  }, [phase]);
  useEffect(() => {
    if (phase !== 'tumble') return;
    const timer = window.setInterval(
      () =>
        setFaces(
          Array.from({ length: 24 }, () => 1 + Math.floor(Math.random() * 6))
        ),
      80
    );
    return () => window.clearInterval(timer);
  }, [phase]);

  if (phase === 'tumble') {
    return (
      <div
        ref={rootRef}
        tabIndex={-1}
        className={`${lu.luRollStage} ${lu.luRollStage}--tumble`}
        role="dialog"
        aria-modal="true"
        aria-label="Rolando os atributos"
      >
        <div className={handles.crDiceSheet} aria-hidden="true">
          {Array.from({ length: 6 }, (_, row) => (
            <div key={row} className={handles.crDiceRow}>
              {faces.slice(row * 4, row * 4 + 4).map((f, i) => (
                <span key={i} className={handles.crDie}>
                  {f}
                </span>
              ))}
            </div>
          ))}
        </div>
        <p className={lu.luRollCap} role="status" aria-live="polite">
          Rolando 24 dados…
        </p>
      </div>
    );
  }

  return (
    <div
      className={`${lu.luRollStage} ${lu.luRollStage}--settled`}
      role="dialog"
      aria-label="Resultado da rolagem de atributos"
    >
      <div className={handles.crDiceSheet}>
        {(sets ?? []).map((row, r) => {
          const gone = droppedIndex(row);
          return (
            <div key={r} className={handles.crDiceRow}>
              {row.map((v, i) => (
                <span
                  key={i}
                  className={handles.crDie}
                  data-dropped={i === gone || undefined}
                >
                  {v}
                </span>
              ))}
              <b className={handles.crDiceSum}>{sums?.[r]}</b>
            </div>
          );
        })}
      </div>
      <p className={lu.luRollCap}>
        Os seis totais: <b>{(sums ?? []).join(' · ')}</b>
      </p>
      {at && (
        <span className={lu.luAudit}>
          <LockIcon width={11} height={11} />
          Rolado em{' '}
          {new Date(at).toLocaleString('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'short',
          })}{' '}
          · auditável <small>{rollId}</small>
        </span>
      )}
      <div className={lu.luDialogActs}>
        <LevelUpButton
          ref={continueRef}
          variant="primary"
          size="lg"
          onClick={onContinue}
        >
          Distribuir os valores
        </LevelUpButton>
      </div>
    </div>
  );
};
