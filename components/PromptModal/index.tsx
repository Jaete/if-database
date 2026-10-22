'use client';

import { useEffect, useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import Modal from '../Modal';
import PromptModalHandles from './handles';
import '@/styles/components/promptModal.scss';

export interface IPromptField {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'multiline';
  placeholder?: string;
  initialValue?: string;
  /** Um campo obrigatório vazio mantém o botão de confirmar desabilitado. */
  required?: boolean;
  /**
   * Transforma o campo num `<select>`. Existe para os casos em que o valor
   * pertence a um conjunto conhecido e digitá-lo seria pedir erro — escolher a
   * qual arquétipo uma característica pertence, por exemplo.
   */
  options?: readonly { value: string; label: string }[];
  /**
   * Troca o input por um editor próprio, que continua falando a mesma língua
   * do formulário: recebe o valor como texto e devolve texto.
   *
   * Existe para o campo que é uma estrutura, e não uma linha — os espaços de
   * magia por círculo, por exemplo. Sem isto, ou o modal aprenderia domínios
   * que não são dele, ou cada caso desses viraria um formulário próprio fora
   * daqui.
   */
  render?: (value: string, onChange: (next: string) => void) => ReactNode;
}

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  /** Recebe os valores já aparados, indexados por `name`. */
  onSubmit: (values: Record<string, string>) => void;
  title: string;
  fields: IPromptField[];
  confirmLabel?: string;
  cancelLabel?: string;
  /**
   * Ação destrutiva opcional, à esquerda das outras. Existe para que editar e
   * apagar caibam no mesmo modal: sem ela, cada chamador teria de inventar a
   * própria afordância de remoção fora daqui.
   */
  onDelete?: () => void;
  deleteLabel?: string;
}

type FormProps = Omit<IProps, 'isOpen' | 'title'>;

// O formulário é montado só enquanto o modal está aberto, e é isso que faz os
// campos nascerem com os valores iniciais a cada abertura — sem um efeito de
// reset, que causaria um render em cascata. Reabrir para adicionar vários itens
// seguidos é o uso mais comum aqui, então esse detalhe importa.
const PromptForm = ({
  onClose,
  onSubmit,
  fields,
  confirmLabel = 'Adicionar',
  cancelLabel = 'Cancelar',
  onDelete,
  deleteLabel = 'Remover',
}: FormProps) => {
  const handles = useCssHandles(PromptModalHandles);
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.name, f.initialValue ?? '']))
  );
  const firstRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    firstRef.current?.select();
  }, []);

  const missing = fields.some(
    (f) => f.required !== false && !values[f.name]?.trim()
  );

  const submit = (event: FormEvent) => {
    event.preventDefault();
    // O modal é portalado para o body, mas o evento ainda sobe pela árvore do
    // React. Sem parar aqui, confirmar este formulário dispara o `onSubmit` do
    // formulário que abriu o modal — no editor de personagem, isso salvava a
    // ficha inteira e fechava tudo.
    event.stopPropagation();
    if (missing) return;
    onSubmit(
      Object.fromEntries(Object.entries(values).map(([k, v]) => [k, v.trim()]))
    );
    onClose();
  };

  return (
    <form className={handles.promptBody} onSubmit={submit}>
      {fields.map((field, i) => {
        const shared = {
          className: handles.promptInput,
          value: values[field.name] ?? '',
          placeholder: field.placeholder,
          onChange: (e: { target: { value: string } }) =>
            setValues((prev) => ({ ...prev, [field.name]: e.target.value })),
          // O Escape é do modal (useModal); aqui só evitamos que as teclas
          // escapem para a navegação por teclado da ficha atrás do modal.
          onKeyDown: (e: { stopPropagation: () => void }) =>
            e.stopPropagation(),
        };

        return (
          <label key={field.name} className={handles.promptLabel}>
            {field.label}
            {field.render ? (
              field.render(values[field.name] ?? '', (next) =>
                setValues((prev) => ({ ...prev, [field.name]: next }))
              )
            ) : field.options ? (
              <select {...shared}>
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : field.type === 'multiline' ? (
              <textarea
                ref={i === 0 ? (firstRef as never) : undefined}
                rows={8}
                {...shared}
                className={`${handles.promptInput} ${handles.promptArea}`}
              />
            ) : (
              <input
                ref={i === 0 ? (firstRef as never) : undefined}
                type={field.type ?? 'text'}
                {...shared}
              />
            )}
          </label>
        );
      })}
      <div className={handles.promptActions}>
        {onDelete && (
          <button
            type="button"
            className={handles.promptDelete}
            onClick={() => {
              onDelete();
              onClose();
            }}
          >
            {deleteLabel}
          </button>
        )}
        <span className={handles.promptSpacer} />
        <button
          type="button"
          className={handles.promptCancel}
          onClick={onClose}
        >
          {cancelLabel}
        </button>
        <button
          type="submit"
          className={handles.promptConfirm}
          disabled={missing}
        >
          {confirmLabel}
        </button>
      </div>
    </form>
  );
};

/**
 * Modal de formulário curto, para pedir um punhado de valores antes de agir.
 *
 * Completa a família Alert/Confirm com o caso "peça um dado antes de agir", que
 * até agora obrigava cada chamador a montar o próprio formulário.
 */
const PromptModal = ({ isOpen, onClose, title, ...rest }: IProps) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title}>
    {isOpen && <PromptForm onClose={onClose} {...rest} />}
  </Modal>
);

export default PromptModal;
