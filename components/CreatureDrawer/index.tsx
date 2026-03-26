'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import CreatureDrawerHandles from './handles';
import '@/styles/components/creatureDrawer.scss';

interface IProps {
  children: ReactNode;
}

const CreatureDrawer = ({ children }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const handles = useCssHandles(CreatureDrawerHandles);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    window.addEventListener('drawer:open', handleOpen);
    window.addEventListener('drawer:close', handleClose);

    return () => {
      window.removeEventListener('drawer:open', handleOpen);
      window.removeEventListener('drawer:close', handleClose);
    };
  }, []);

  const handleClose = () => setIsOpen(false);

  return (
    <>
      <div
        id="creature-drawer"
        className={`${handles.drawer}${isOpen ? ` ${handles.drawer}--open` : ''}`}
        aria-hidden={!isOpen}
      >
        {children}
      </div>

      <div
        className={`${handles.drawerOverlay}${isOpen ? ` ${handles.drawerOverlay}--visible` : ''}`}
        onClick={handleClose}
        aria-hidden="true"
      />
    </>
  );
};

export default CreatureDrawer;
