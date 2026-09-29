'use client';

import type { ReactNode } from 'react';
import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import { useDrawer } from './useDrawer';
import DrawerHandles from './handles';
import '@/styles/components/drawer.scss';

interface IProps {
  children: ReactNode;
  side?: 'right' | 'left';
  eventKey?: string;
  id?: string;
}

const Drawer = ({
  children,
  side = 'right',
  eventKey = 'drawer',
  id = 'creature-drawer',
}: IProps) => {
  const handles = useCssHandles(DrawerHandles);
  const { isOpen, handleClose } = useDrawer(eventKey);

  const drawerClassName = [
    handles.drawer,
    side === 'left' ? applyModifiers(handles.drawer, 'left') : '',
    isOpen ? applyModifiers(handles.drawer, 'open') : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <div className={drawerClassName} id={id} aria-hidden={!isOpen}>
        {children}
      </div>

      <div
        className={`${handles.drawerOverlay}${isOpen ? ` ${applyModifiers(handles.drawerOverlay, 'visible')}` : ''}`}
        onClick={handleClose}
        aria-hidden="true"
      />
    </>
  );
};

export default Drawer;
