'use client';

import { useEffect, useRef } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import { WaxSealIcon } from '../../../Icons';
import LevelUpButton from '../../LevelUpButton';
import LevelUpViewHandles from '../../LevelUpView/handles';
import { useDialogFocus } from '../../LevelUpView/useDialogFocus';

interface IProps {
  busy: boolean;
  error: string;
  onCancel: () => void;
  onConfirm: () => void;
}

/** Confirmação do envio: depois dele a ficha aparece para todos no fórum. */
const SubmitDialog = ({ busy, error, onCancel, onConfirm }: IProps) => {
  const lu = useCssHandles(LevelUpViewHandles);
  const panelRef = useRef<HTMLDivElement>(null);
  useDialogFocus(panelRef);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        if (!busy) onCancel();
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [onCancel, busy]);

  return (
    <div className={lu.luVeil}>
      <div
        ref={panelRef}
        tabIndex={-1}
        className={lu.luSealDlg}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="cr-submit-title"
      >
        <div className={lu.luWax}>
          <WaxSealIcon />
        </div>
        <h3 id="cr-submit-title">Enviar a ficha para aprovação?</h3>
        <ul className={lu.luWarnList}>
          <li>
            <b>A ficha passa a aparecer para todos</b> no post, sob a faixa
            &ldquo;Rascunho · aguardando aprovação&rdquo;.
          </li>
          <li>
            Você continua podendo editar até a staff aprovar. Depois da
            aprovação, só a subida de nível.
          </li>
        </ul>
        {error && (
          <p role="alert" className={lu.luError}>
            {error}
          </p>
        )}
        <div className={lu.luDialogActs}>
          <LevelUpButton onClick={onCancel} disabled={busy}>
            Voltar
          </LevelUpButton>
          <LevelUpButton
            variant="primary"
            size="lg"
            disabled={busy}
            onClick={onConfirm}
          >
            Enviar
          </LevelUpButton>
        </div>
      </div>
    </div>
  );
};

export default SubmitDialog;
