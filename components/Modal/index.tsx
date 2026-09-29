'use client';

import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { useCssHandles, applyModifiers } from '@/hooks/useCssHandles';
import { useModal } from './useModal';
import SectionRail from '@/components/SectionRail';
import ModalHandles from './handles';
import '@/styles/components/modal.scss';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  // Mostra uma régua de atalhos para as seções do conteúdo, descobertas a
  // partir dos `.section` renderizados aqui dentro.
  sectionRail?: boolean;
}

const Modal = ({ isOpen, onClose, title, children, sectionRail }: IProps) => {
  const handles = useCssHandles(ModalHandles);
  const contentRef = useRef<HTMLDivElement>(null);
  useModal(isOpen, onClose);

  const overlayClass = isOpen
    ? `${handles.overlay} ${applyModifiers(handles.overlay, 'visible')}`
    : handles.overlay;

  // Portal to body so fixed-position is relative to viewport
  const modalContent = (
    <div className={overlayClass}>
      {/* A casca não tem overflow nem transform: serve de sistema de
          coordenadas para a régua, que o `overflow: hidden` do modal cortaria. */}
      <div
        className={`${handles.modalShell}${
          sectionRail ? ` ${applyModifiers(handles.modalShell, 'railed')}` : ''
        }`}
      >
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
          <div className={handles.content} ref={contentRef}>
            {children}
          </div>
        </div>

        {sectionRail && (
          <SectionRail containerRef={contentRef} isEnabled={isOpen} />
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;
