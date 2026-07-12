'use client';

import { ReactNode } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import DrawerControllerHandles from './handles';

interface IProps {
  children: ReactNode;
}

const DrawerController = ({ children }: IProps) => {
  const handles = useCssHandles(DrawerControllerHandles);

  const handleOpenDrawer = () => {
    window.dispatchEvent(new CustomEvent('drawer:open', { bubbles: true }));
  };

  return (
    <div
      className={handles.drawerTrigger}
      onClick={handleOpenDrawer}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleOpenDrawer();
        }
      }}
    >
      {children}
    </div>
  );
};

export default DrawerController;
