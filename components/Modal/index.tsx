import { useEffect } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
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

  if (!isOpen) return null;

  return (
    <div className={handles.overlay} onClick={onClose}>
      <div className={handles.modal} onClick={(e) => e.stopPropagation()}>
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
