'use client';

import { useEffect, useRef, useState } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import { formatModifier } from '@/lib/stats';
import { D10Icon } from '../../../Icons';
import LevelUpButton from '../../LevelUpButton';
import LevelUpViewHandles from '../handles';
import { useDialogFocus } from '../useDialogFocus';

interface IProps {
  level: number;
  die: number;
  conMod: number;
  fixed: number;
  onFixed: () => void;
  onCancel: () => void;
  onRoll: () => void;
}

/**
 * O aviso antes de rolar: não há volta nem segunda rolagem, e o resultado fica
 * gravado no banco para auditoria. O botão só liga depois do "Entendi".
 */
const RollAskDialog = ({
  level,
  die,
  conMod,
  fixed,
  onFixed,
  onCancel,
  onRoll,
}: IProps) => {
  const handles = useCssHandles(LevelUpViewHandles);
  const [ack, setAck] = useState(false);
  const low = Math.max(1, 1 + conMod);
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
    <div className={handles.luVeil}>
      <div
        ref={panelRef}
        tabIndex={-1}
        className={handles.luSealDlg}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="lu-roll-title"
        aria-describedby="lu-roll-desc"
      >
        <div className={handles.luWax} data-roll>
          <D10Icon />
        </div>
        <h3 id="lu-roll-title">Rolar o dado de vida?</h3>
        <p id="lu-roll-desc">
          Você rola 1d{die} e soma CON {formatModifier(conMod)}. O resultado
          vale para a vida do nível {level}.
        </p>
        <ul className={handles.luWarnList}>
          <li>
            <b>Não dá para voltar.</b> Se sair 1, o nível {level} dá só +{low}{' '}
            de vida. Não há segunda rolagem nem troca para o valor fixo depois.
          </li>
          <li>
            <b>A rolagem fica gravada no banco:</b> valor, data, hora e quem
            rolou. Um admin pode auditar quando precisar.
          </li>
        </ul>
        <label className={handles.luCheck}>
          <input
            type="checkbox"
            checked={ack}
            onChange={(e) => setAck(e.target.checked)}
          />
          Entendi que o resultado é definitivo
        </label>
        <div className={handles.luDialogActs}>
          <LevelUpButton onClick={onFixed}>
            Usar o valor fixo (+{Math.max(1, fixed + conMod)})
          </LevelUpButton>
          <LevelUpButton
            variant="primary"
            size="lg"
            disabled={!ack}
            onClick={onRoll}
          >
            Rolar 1d{die}
          </LevelUpButton>
        </div>
        <LevelUpButton variant="ghost" onClick={onCancel}>
          Cancelar
        </LevelUpButton>
      </div>
    </div>
  );
};

export default RollAskDialog;
