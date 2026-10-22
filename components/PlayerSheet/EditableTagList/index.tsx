'use client';

import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import PromptModal from '@/components/PromptModal';
import TagList from '../TagList';
import { useEditing } from '../EditingContext';
import EditableTagListHandles from './handles';

interface IProps {
  /** Caminho da lista no jogador, ex.: "defenses.resistances". */
  path: string;
  /** Rótulo em pt-BR, usado no modal e nos rótulos acessíveis. */
  label: string;
  emptyLabel?: string;
}

/**
 * Lista de string editável como chips.
 *
 * Fora do modo de edição delega ao TagList, então a ficha pública continua com
 * o mesmo DOM de sempre.
 */
const EditableTagList = ({ path, label, emptyLabel }: IProps) => {
  const handles = useCssHandles(EditableTagListHandles);
  const { editable, list, setField } = useEditing();
  const [editingAt, setEditingAt] = useState<number | null>(null);
  const [buffer, setBuffer] = useState('');
  const [adding, setAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingAt !== null) inputRef.current?.select();
  }, [editingAt]);

  const items = list(path);

  if (!editable) {
    return <TagList items={items} emptyLabel={emptyLabel} />;
  }

  const replace = (next: string[]) => setField(path, next);

  const commit = () => {
    if (editingAt === null) return;
    const trimmed = buffer.trim();
    // Esvaziar o texto de um chip é a forma natural de apagá-lo.
    replace(
      trimmed
        ? items.map((item, i) => (i === editingAt ? trimmed : item))
        : items.filter((_, i) => i !== editingAt)
    );
    setEditingAt(null);
  };

  // As setas e o Escape pertencem ao input enquanto ele está aberto; sem isto
  // a navegação por teclado da ficha os consumiria.
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation();
    if (event.key === 'Escape') {
      event.preventDefault();
      setEditingAt(null);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      commit();
    }
  };

  return (
    <>
      <div className={handles.sheetChips}>
        {items.map((item, i) =>
          editingAt === i ? (
            <input
              key={`edit-${i}`}
              ref={inputRef}
              className={handles.sheetChipInput}
              value={buffer}
              aria-label={`${label}: editar ${item}`}
              onChange={(e) => setBuffer(e.target.value)}
              onBlur={commit}
              onKeyDown={onKeyDown}
            />
          ) : (
            <span key={`${item}-${i}`} className={handles.sheetChip}>
              <button
                type="button"
                className={handles.sheetChipText}
                onClick={() => {
                  setBuffer(item);
                  setEditingAt(i);
                }}
                aria-label={`${label}: editar ${item}`}
              >
                {item}
              </button>
              <button
                type="button"
                className={handles.sheetChipRemove}
                onClick={() => replace(items.filter((_, at) => at !== i))}
                aria-label={`${label}: remover ${item}`}
              >
                &times;
              </button>
            </span>
          )
        )}
        <button
          type="button"
          className={handles.sheetChipAdd}
          onClick={() => setAdding(true)}
          aria-label={`${label}: adicionar`}
        >
          + Adicionar
        </button>
      </div>

      <PromptModal
        isOpen={adding}
        onClose={() => setAdding(false)}
        onSubmit={(values) => replace([...items, values.item])}
        title={label}
        fields={[
          {
            name: 'item',
            label: `Novo item em ${label.toLowerCase()}`,
            placeholder: 'Digite e confirme',
          },
        ]}
      />
    </>
  );
};

export default EditableTagList;
