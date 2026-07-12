'use client';

import type { ReactNode } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import { useDrawer } from './useDrawer';
import DrawerHandles from './handles';
import '@/styles/components/drawer.scss';

interface IProps {
  children: ReactNode;
}

const Drawer = ({ children }: IProps) => {
  const handles = useCssHandles(DrawerHandles);
  const { isOpen, handleClose } = useDrawer();

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

export default Drawer;
