'use client';

import { useState, ReactNode } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import CreatureDrawerHandles from '../handles';
import '../CreatureDrawer.scss';

interface IProps {
  children: ReactNode;
  triggerLabel?: string;
}

const DrawerController = ({ children, triggerLabel = 'Ver ficha' }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const handles = useCssHandles(CreatureDrawerHandles);

  return (
    <>
      <button
        className={handles.drawerTrigger}
        onClick={() => setIsOpen(true)}
        aria-expanded={isOpen}
        aria-controls="creature-drawer"
      >
        {triggerLabel}
      </button>

      <div
        id="creature-drawer"
        className={`${handles.drawer}${isOpen ? ` ${handles.drawer}--open` : ''}`}
        aria-hidden={!isOpen}
      >
        <div className={handles.drawerHeaderBar}>
          <button
            className={handles.closeBtn}
            onClick={() => setIsOpen(false)}
            aria-label="Fechar"
          >
            ×
          </button>
        </div>
        <div className={handles.drawerContent}>{children}</div>
      </div>

      {isOpen && (
        <div
          className={handles.drawerOverlay}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default DrawerController;
