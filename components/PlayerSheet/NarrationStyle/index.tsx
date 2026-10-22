'use client';

import { useState } from 'react';
import type { IPublicPlayer } from '@/db/players/publicFields';
import { useCssHandles } from '@/hooks/useCssHandles';
import Modal from '@/components/Modal';
import { useEditing } from '../EditingContext';
import { splitLines } from '../sheetData';
import NarrationStyleHandles from './handles';

interface IProps {
  player: IPublicPlayer;
}

const PATH = 'narrationStyle';

/** Prévia de uma linha na faixa; o texto inteiro mora no modal. */
const PREVIEW_LIMIT = 90;

/**
 * Faixa "Estilo de narração", acima do corpo da ficha.
 *
 * Fica fora do menu de telas de propósito: não é dado de personagem, é um
 * recado da pessoa para quem narra, e é longo demais para caber no corpo —
 * daí tanto a leitura quanto a edição acontecerem num modal.
 */
const NarrationStyle = ({ player }: IProps) => {
  const handles = useCssHandles(NarrationStyleHandles);
  const { editable, value, setField } = useEditing();
  const [open, setOpen] = useState(false);
  // Rascunho do próprio modal: só vai para o rascunho da ficha ao confirmar,
  // senão fechar no X equivaleria a salvar.
  const [buffer, setBuffer] = useState('');

  const current = value(PATH);
  const text =
    typeof current === 'string' ? current : (player.narrationStyle ?? '');

  // Sem texto e sem permissão de editar não há o que oferecer: a faixa some em
  // vez de virar um botão que abre um modal vazio.
  if (!text && !editable) return null;

  const start = () => {
    setBuffer(text);
    setOpen(true);
  };

  const confirm = () => {
    const trimmed = buffer.trim();
    setField(PATH, trimmed === '' ? undefined : trimmed);
    setOpen(false);
  };

  const preview = text.replace(/\s+/g, ' ').trim();

  return (
    <section className={handles.sheetNarration} aria-label="Estilo de narração">
      <span className={handles.sheetNarrationKey}>Estilo de narração</span>
      <span className={handles.sheetNarrationPreview}>
        {preview
          ? preview.length > PREVIEW_LIMIT
            ? `${preview.slice(0, PREVIEW_LIMIT)}…`
            : preview
          : 'Ainda não preenchido.'}
      </span>
      <button
        type="button"
        className={handles.sheetNarrationOpen}
        onClick={start}
      >
        {editable ? 'Editar' : 'Ler'}
      </button>

      {/* O conteúdo só é montado enquanto aberto: o Modal mantém o portal no
          DOM mesmo fechado, e uma textarea invisível continuaria na ordem de
          tabulação da ficha. */}
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Estilo de narração"
      >
        {!open ? null : editable ? (
          <div className={handles.sheetNarrationBody}>
            <div className={handles.sheetNarrationNote}>
              <strong className={handles.sheetNarrationNoteTitle}>
                O que escrever aqui
              </strong>
              <p>
                Este campo é um recado para quem narra. Descreva o tipo de
                narrativa que te agrada — mais mistério, mais ação, mais drama
                —, o ritmo que prefere e o quanto gosta de improviso.
              </p>
              <p>
                Vale separar em três partes: <b>o que você gosta</b>,{' '}
                <b>o que prefere evitar</b> e{' '}
                <b>o que não pode aparecer de jeito nenhum</b> na narrativa.
                Este último ponto é o mais importante: seja específico, porque
                ele será respeitado como limite, não como preferência.
              </p>
              <p>
                Pode escrever à vontade, sem limite de tamanho. O texto fica
                visível para quem abrir a ficha.
              </p>
            </div>
            <textarea
              className={handles.sheetNarrationArea}
              value={buffer}
              onChange={(e) => setBuffer(e.target.value)}
              // O painel da ficha intercepta setas e Escape; dentro da
              // textarea essas teclas são do cursor.
              onKeyDown={(e) => e.stopPropagation()}
              rows={14}
              aria-label="Estilo de narração"
              placeholder="Gosto de..., prefiro evitar..., não pode aparecer..."
            />
            <div className={handles.sheetNarrationActions}>
              <button
                type="button"
                className={handles.sheetNarrationCancel}
                onClick={() => setOpen(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className={handles.sheetNarrationSave}
                onClick={confirm}
              >
                Aplicar
              </button>
            </div>
          </div>
        ) : (
          <div className={handles.sheetNarrationBody}>
            {splitLines(text).length > 0 ? (
              <div className={handles.sheetNarrationText}>
                {splitLines(text).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            ) : (
              <p className={handles.sheetNarrationEmpty}>
                Nenhum estilo de narração registrado.
              </p>
            )}
          </div>
        )}
      </Modal>
    </section>
  );
};

export default NarrationStyle;
