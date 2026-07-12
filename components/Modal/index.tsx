'use client';

import { createPortal } from 'react-dom';
import { useCssHandles, applyModifiers } from '@/hooks/useCssHandles';
import { useModal } from './useModal';
import ModalHandles from './handles';
import '@/styles/components/modal.scss';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: IProps) => {
  const handles = useCssHandles(ModalHandles);
  useModal(isOpen, onClose);

  const overlayClass = isOpen
    ? `${handles.overlay} ${applyModifiers(handles.overlay, 'visible')}`
    : handles.overlay;

  // Portal to body so fixed-position is relative to viewport
  const modalContent = (
    <div className={overlayClass}>
      <div
        className={`${handles.modal}${isOpen ? ` ${applyModifiers(handles.modal, 'open')}` : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className={handles.header}>
          {title && <h2 className={handles.title}>{title}</h2>}
          <button
            className={handles.closeButton}
            onClick={onClose}
            aria-label="Fechar"
          >
            &times;
          </button>
        </header>
        <div className={handles.content}>{children}</div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;
