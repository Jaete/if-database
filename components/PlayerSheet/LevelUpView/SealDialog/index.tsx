'use client';

import { useEffect, useRef } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import { WaxSealIcon } from '../../../Icons';
import LevelUpButton from '../../LevelUpButton';
import LevelUpViewHandles from '../handles';
import { useDialogFocus } from '../useDialogFocus';

interface IProps {
  level: number;
  items: { text: string; kind: string }[];
  hpFrom: number;
  hpTo: number;
  more: boolean;
  busy: boolean;
  error: string;
  /** Edição de um nível já selado: o texto muda, o aviso de trava não. */
  editing: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

/** A confirmação séria: depois dela as escolhas do nível ficam travadas. */
const SealDialog = ({
  level,
  items,
  hpFrom,
  hpTo,
  more,
  busy,
  error,
  editing,
  onCancel,
  onConfirm,
}: IProps) => {
  const handles = useCssHandles(LevelUpViewHandles);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  useDialogFocus(panelRef, confirmRef);

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
    <div className={handles.luVeil}>
      <div
        ref={panelRef}
        className={handles.luSealDlg}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="lu-seal-title"
        aria-describedby="lu-seal-desc"
      >
        <div className={handles.luWax}>
          <WaxSealIcon />
          <span>{level}</span>
        </div>
        <h3 id="lu-seal-title">
          {editing
            ? `Gravar a edição do nível ${level}?`
            : `Selar o nível ${level}?`}
        </h3>
        <p id="lu-seal-desc">
          {editing
            ? `As escolhas do nível ${level} serão trocadas e a edição entra no histórico.`
            : `Depois de confirmar, você não poderá alterar as escolhas do nível ${level}. Só um admin pode desfazer.`}
        </p>
        <ul>
          {items.map((it, i) => (
            <li key={i}>
              {it.text}
              <span>{it.kind}</span>
            </li>
          ))}
          <li>
            Vida {hpFrom} → {hpTo}
            <span>vida máxima</span>
          </li>
        </ul>
        {!editing && (
          <p data-small>
            Selar grava agora na ficha.{' '}
            {more ? `O nível ${level + 1} vem logo depois.` : ''}
          </p>
        )}
        {error && (
          <p role="alert" className={handles.luError}>
            {error}
          </p>
        )}
        <div className={handles.luDialogActs}>
          <LevelUpButton onClick={onCancel}>Revisar de novo</LevelUpButton>
          <LevelUpButton
            ref={confirmRef}
            variant="primary"
            size="lg"
            disabled={busy}
            onClick={onConfirm}
          >
            {editing ? 'Gravar edição' : `Selar nível ${level}`}
          </LevelUpButton>
        </div>
      </div>
    </div>
  );
};

export default SealDialog;
