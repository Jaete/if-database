'use client';

import { ReactNode } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import DrawerContentHandles from './handles';

interface IProps {
  children: ReactNode;
}

const DrawerContent = ({ children }: IProps) => {
  const handles = useCssHandles(DrawerContentHandles);

  return <div className={handles.drawerContent}>{children}</div>;
};

export default DrawerContent;
