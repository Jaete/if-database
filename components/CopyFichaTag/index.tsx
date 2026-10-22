'use client';

import { useState } from 'react';
import { useCssHandles, applyModifiers } from '@/hooks/useCssHandles';
import { fichaTag } from '@/lib/forumTag';
import { CopyIcon } from '../Icons';
import CopyFichaTagHandles from './handles';
import '@/styles/components/copyFichaTag.scss';

interface IProps {
  /** `_id` do jogador: é ele que a etiqueta do fórum carrega. */
  playerId: string;
}

/**
 * Copia a etiqueta `[ficha=<id>]` para colar num post do fórum.
 *
 * O estado de "copiado" é o único retorno que a ação tem — a área de
 * transferência não dá sinal nenhum na tela —, e por isso ele é do botão, não
 * um alerta: some sozinho e não interrompe o que a pessoa está fazendo.
 */
const CopyFichaTag = ({ playerId }: IProps) => {
  const handles = useCssHandles(CopyFichaTagHandles);
  const [state, setState] = useState<'idle' | 'done' | 'fail'>('idle');

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(fichaTag(playerId));
      setState('done');
    } catch {
      // Sem permissão, ou fora de contexto seguro: a etiqueta continua
      // visível no botão para ser copiada à mão.
      setState('fail');
    }
    window.setTimeout(() => setState('idle'), 2000);
  };

  const label =
    state === 'done'
      ? 'Copiado!'
      : state === 'fail'
        ? 'Copie à mão:'
        : 'Copiar BBCode';

  return (
    <button
      type="button"
      className={`${handles.copyFicha}${
        state === 'idle' ? '' : ` ${applyModifiers(handles.copyFicha, state)}`
      }`}
      onClick={copy}
      title="Copiar a etiqueta para colar no fórum"
    >
      <CopyIcon className={handles.copyFichaIcon} />
      <span>{label}</span>
      <code>{fichaTag(playerId)}</code>
    </button>
  );
};

export default CopyFichaTag;
