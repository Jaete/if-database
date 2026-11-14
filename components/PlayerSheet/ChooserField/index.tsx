'use client';

import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import { PencilIcon } from '../../Icons';
import ChooserFieldHandles from './handles';

interface IProps {
  /** "Classe", "Raça": para o leitor de tela. */
  label: string;
  /** O que o campo mostra agora (rascunho incluído). */
  value: string;
  /** O que estava gravado, quando a escolha pendente mudou o campo. */
  previous?: string;
  /** Há uma escolha ainda não salva neste campo. */
  pending: boolean;
  /** Texto de aviso curto ao lado ("incompleta"). */
  warn?: string;
  onOpen: () => void;
}

/**
 * O campo de classe ou raça no topo da ficha, em edição: um botão que abre a
 * camada de escolha. Com algo pendente, ganha borda tracejada, o selo "não
 * salvo" e o valor antigo riscado.
 */
const ChooserField = ({
  label,
  value,
  previous,
  pending,
  warn,
  onOpen,
}: IProps) => {
  const handles = useCssHandles(ChooserFieldHandles);
  return (
    <span className={handles.sheetChooser}>
      <button
        type="button"
        className={`${handles.sheetChooserBtn}${
          pending
            ? ` ${applyModifiers(handles.sheetChooserBtn, 'pending')}`
            : ''
        }`}
        onClick={onOpen}
        aria-label={`${label}: ${value || 'nenhuma'}. Escolher no códice`}
      >
        {pending && previous && previous !== value && (
          <s className={handles.sheetChooserOld}>{previous}</s>
        )}
        <span className={handles.sheetChooserLabel}>
          {value || `Escolher ${label.toLowerCase()}`}
        </span>
        {warn && <span className={handles.sheetChooserTag}>{warn}</span>}
        {pending && <span className={handles.sheetChooserTag}>não salvo</span>}
        <PencilIcon aria-hidden="true" />
      </button>
    </span>
  );
};

export default ChooserField;
