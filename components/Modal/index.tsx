import { useEffect } from 'react';
import { useCssHandles, applyModifiers } from '@/hooks/useCssHandles';
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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const overlayClass = isOpen
    ? `${handles.overlay} ${applyModifiers(handles.overlay, 'visible')}`
    : handles.overlay;

  return (
    <div className={overlayClass} onClick={onClose}>
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
};

export default Modal;
