'use client';

import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import type { ITrayInfo } from '../types';
import TrayHandles from './handles';

interface IProps {
  tray: ITrayInfo;
  /** O jogador pediu para voltar com algo na bandeja. */
  leaving: boolean;
  onUndo: () => void;
  onApply: () => void;
  onConfirmRemoval: () => void;
  onKeep: () => void;
  onDiscardAndLeave: () => void;
}

/**
 * A bandeja: o antes e o depois da escolha, o que a ficha ganha e perde, os
 * avisos e as ações. "Aplicar à ficha" só muda o rascunho; quem salva é a
 * SaveBar.
 */
const Tray = ({
  tray,
  leaving,
  onUndo,
  onApply,
  onConfirmRemoval,
  onKeep,
  onDiscardAndLeave,
}: IProps) => {
  const handles = useCssHandles(TrayHandles);

  const button = (
    label: string,
    onClick: () => void,
    variant: 'primary' | 'ghost' | 'danger',
    disabled?: boolean
  ) => (
    <button
      type="button"
      className={`${handles.sheetCodexTrayBtn} ${applyModifiers(handles.sheetCodexTrayBtn, variant)}`}
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  );

  return (
    <section
      className={handles.sheetCodexTray}
      aria-label="Escolha em andamento"
    >
      <div className={handles.sheetCodexTrayMain}>
        {leaving ? (
          <p className={handles.sheetCodexTrayChange}>
            Há uma escolha que ainda não foi aplicada. Voltar agora a descarta.
          </p>
        ) : tray.changed ? (
          <p className={handles.sheetCodexTrayChange}>
            {tray.before || '—'} <span aria-hidden="true">→</span>{' '}
            <b>{tray.after || '—'}</b>
          </p>
        ) : (
          <p className={handles.sheetCodexTrayChange}>
            Nada escolhido ainda.{' '}
            {tray.before && (
              <>
                Hoje: <b>{tray.before}</b>.
              </>
            )}
          </p>
        )}

        {tray.changed && tray.gains.length > 0 && (
          <div className={handles.sheetCodexGains}>
            <span className={handles.sheetCodexGainsTitle}>A ficha ganha</span>
            <ul>
              {tray.gains.map((line) => (
                <li key={line.text + (line.hint ?? '')}>
                  <span className={handles.sheetCodexGain}>{line.text}</span>
                  {line.hint && <small> · {line.hint}</small>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {tray.changed && tray.removes.length > 0 && (
          <div className={handles.sheetCodexGains}>
            <span className={handles.sheetCodexGainsTitle}>Sai da ficha</span>
            <ul>
              {tray.removes.map((line) => (
                <li key={line.text + (line.hint ?? '')}>
                  <span className={handles.sheetCodexRemove}>{line.text}</span>
                  {line.hint && <small> · {line.hint}</small>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {tray.warnings.length > 0 && (
          <ul className={handles.sheetCodexTrayWarn} aria-live="polite">
            {tray.warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        )}
      </div>

      <div className={handles.sheetCodexTrayActs}>
        {leaving ? (
          <>
            {button('Continuar escolhendo', onKeep, 'ghost')}
            {button('Descartar e voltar', onDiscardAndLeave, 'danger')}
          </>
        ) : (
          <>
            {button('Desfazer', onUndo, 'ghost', !tray.changed)}
            {tray.confirmRemoval
              ? button(
                  'Confirmar a troca e o que sai',
                  onConfirmRemoval,
                  'danger'
                )
              : button(tray.applyLabel, onApply, 'primary', !tray.canApply)}
          </>
        )}
      </div>
    </section>
  );
};

export default Tray;
