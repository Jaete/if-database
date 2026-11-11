'use client';

import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import { TrashIcon } from '../Icons';
import Modal from '../Modal';
import RaceButton from '../RaceButton';
import RaceModalHandles from './handles';
import '@/styles/components/raceForm.scss';

interface IProps {
  title: string;
  onClose: () => void;
  /** Devolve `true` quando gravou: só então o modal fecha. */
  onSave?: () => boolean | Promise<boolean>;
  saveLabel?: string;
  saveKind?: 'primary' | 'danger';
  saveDisabled?: boolean;
  /** Ação destrutiva, sozinha à esquerda. */
  onDelete?: () => void;
  deleteLabel?: string;
  /** Folha larga (formulários com várias colunas, editor de imagem). */
  wide?: boolean;
  error?: string | null;
  eyebrow?: string;
  children: ReactNode;
}

/**
 * A moldura de todo editor das Raças: título, corpo e a barra
 * Excluir / Cancelar / Salvar. Monte-a só enquanto o editor está aberto: o
 * estado do formulário nasce a cada abertura.
 */
const RaceModal = ({
  title,
  onClose,
  onSave,
  saveLabel = 'Salvar',
  saveKind = 'primary',
  saveDisabled,
  onDelete,
  deleteLabel = 'Excluir',
  wide,
  error,
  eyebrow,
  children,
}: IProps) => {
  const handles = useCssHandles(RaceModalHandles);
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    // O modal é portalado, mas o evento sobe pela árvore do React.
    event.stopPropagation();
    if (!onSave || busy) return;
    setBusy(true);
    try {
      if (await onSave()) onClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={title}
      eyebrow={eyebrow}
      variant={wide ? 'sheet' : 'default'}
      className={handles.raceModalShell}
    >
      <form className={handles.raceModalBody} onSubmit={submit} noValidate>
        {children}
        {error && (
          <p className={handles.raceModalError} role="alert">
            {error}
          </p>
        )}
        <footer className={handles.raceModalFoot}>
          {onDelete && (
            <RaceButton
              variant="danger"
              icon={<TrashIcon />}
              onClick={onDelete}
            >
              {deleteLabel}
            </RaceButton>
          )}
          <span className={handles.raceModalSpacer} />
          <RaceButton variant="ghost" onClick={onClose}>
            Cancelar
          </RaceButton>
          {onSave && (
            <RaceButton
              type="submit"
              variant={saveKind}
              disabled={busy || saveDisabled}
            >
              {busy ? 'Salvando…' : saveLabel}
            </RaceButton>
          )}
        </footer>
      </form>
    </Modal>
  );
};

export default RaceModal;
