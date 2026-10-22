'use client';

import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import { applyModifiers } from '@/hooks/useCssHandles';
import { useEditing } from '../EditingContext';
import EditableTextHandles from './handles';

interface IProps {
  /** Caminho pontilhado no jogador, ex.: "combat.ac.value". */
  path: string;
  /** Rótulo em pt-BR para leitores de tela — o campo em si costuma ser só o valor. */
  label: string;
  as?: 'text' | 'number' | 'multiline';
  /** Texto exibido quando o campo está vazio, no modo de edição. */
  placeholder?: string;
  /**
   * Grava no lugar do `setField(path, ...)` padrão, para quando o valor mora
   * dentro de um array e o caminho sozinho não basta para criar a entrada —
   * é o caso dos espaços de magia, cujo círculo pode nem existir ainda.
   */
  onWrite?: (value: string | number | undefined) => void;
  /**
   * Transforma o campo num `<select>`. Existe para os valores que só podem ser
   * um de uma lista fechada — o atributo de conjuração, por exemplo, que o
   * resto da ficha precisa reconhecer para calcular o CD.
   */
  options?: readonly { value: string; label: string }[];
  /** A renderização somente-leitura de hoje. */
  children?: ReactNode;
}

const EditableText = ({
  path,
  label,
  as = 'text',
  placeholder = 'Vazio',
  onWrite,
  options,
  children,
}: IProps) => {
  const handles = useCssHandles(EditableTextHandles);
  const { editable, value, setField, isFieldDirty } = useEditing();
  const [open, setOpen] = useState(false);
  const [buffer, setBuffer] = useState('');
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Fora do modo de edição nada é envolvido: a ficha pública renderiza
  // exatamente o mesmo DOM de antes. É o que garante que nem o SCSS existente
  // nem a navegação por [data-opt]/[data-listnav] regridem.
  if (!editable) return <>{children}</>;

  const current = value(path);
  const display = current === undefined || current === '' ? null : current;

  const start = () => {
    setBuffer(current === undefined ? '' : String(current));
    setOpen(true);
  };

  const write = (next: string | number | undefined) => {
    if (onWrite) onWrite(next);
    else setField(path, next);
  };

  // O select dispensa o passo de "clicar para virar campo": ele já abre a
  // própria lista no clique, e um botão antes dele seria um clique a mais sem
  // nenhuma informação a mais.
  if (options) {
    return (
      <select
        className={`${handles.sheetEditableInput} ${handles.sheetEditableSelect}`}
        value={current === undefined ? '' : String(current)}
        aria-label={label}
        onKeyDown={(event) => event.stopPropagation()}
        onChange={(event) => write(event.target.value || undefined)}
      >
        <option value="">{placeholder}</option>
        {/* Um valor gravado fora da lista (outra grafia, outro idioma) vira
            opção própria em vez de sumir do select — um valor que o campo não
            reconhece ainda é um valor que a pessoa escreveu. */}
        {current !== undefined &&
          current !== '' &&
          !options.some((option) => option.value === current) && (
            <option value={String(current)}>{String(current)}</option>
          )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  const commit = () => {
    const trimmed = buffer.trim();
    const next =
      as === 'number'
        ? trimmed === '' || Number.isNaN(Number(trimmed))
          ? undefined
          : Number(trimmed)
        : trimmed === ''
          ? undefined
          : trimmed;
    write(next);
    setOpen(false);
  };

  // usePlayerSheet intercepta Escape e as quatro setas no painel; um input
  // aberto precisa das setas para o cursor e do Escape para cancelar. Parar a
  // propagação aqui resolve sem acoplar os dois hooks de volta.
  const onKeyDown = (
    event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    event.stopPropagation();
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      return;
    }
    if (event.key === 'Enter' && as !== 'multiline') {
      event.preventDefault();
      commit();
    }
  };

  if (open) {
    const shared = {
      ref: inputRef as never,
      value: buffer,
      onChange: (e: { target: { value: string } }) => setBuffer(e.target.value),
      onBlur: commit,
      onKeyDown,
      'aria-label': label,
    };

    return as === 'multiline' ? (
      <textarea className={handles.sheetEditableArea} rows={6} {...shared} />
    ) : (
      <input
        className={handles.sheetEditableInput}
        type={as === 'number' ? 'number' : 'text'}
        onWheel={(e) => (e.target as HTMLInputElement).blur()}
        {...shared}
      />
    );
  }

  return (
    <button
      type="button"
      // applyModifiers sempre acrescenta "--", então passar modificador vazio
      // produziria "sheetEditableButton--" e a classe base ficaria de fora.
      className={`${handles.sheetEditableButton}${
        isFieldDirty(path)
          ? ` ${applyModifiers(handles.sheetEditableButton, 'dirty')}`
          : ''
      }`}
      onClick={start}
      aria-label={`${label}: editar`}
    >
      {display ?? (
        <span className={handles.sheetEditablePlaceholder}>{placeholder}</span>
      )}
    </button>
  );
};

export default EditableText;
