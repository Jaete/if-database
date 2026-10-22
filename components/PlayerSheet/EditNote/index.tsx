'use client';

import { useCssHandles } from '@/hooks/useCssHandles';
import { useEditing } from '../EditingContext';
import EditNoteHandles from './handles';

interface IProps {
  /** O que, neste bloco, continua somente-leitura. */
  children: string;
}

/**
 * Marca um bloco que continua somente-leitura dentro do modo de edição.
 *
 * Existe porque um bloco vazio é visualmente idêntico a um campo vazio
 * editável, e sem aviso a pessoa fica clicando num texto que nunca vira input.
 * Fora do modo de edição não renderiza nada.
 */
const EditNote = ({ children }: IProps) => {
  const handles = useCssHandles(EditNoteHandles);
  const { editable } = useEditing();

  if (!editable) return null;

  return <p className={handles.sheetEditNote}>{children}</p>;
};

export default EditNote;
