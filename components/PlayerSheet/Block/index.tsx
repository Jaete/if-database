'use client';

import { useId } from 'react';
import type { ReactNode } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import BlockHandles from './handles';

interface IProps {
  title: string;
  children: ReactNode;
}

const Block = ({ title, children }: IProps) => {
  const handles = useCssHandles(BlockHandles);
  const headingId = useId();

  return (
    <section className={handles.sheetBlock} aria-labelledby={headingId}>
      <h3 className={handles.sheetBlockTitle} id={headingId}>
        {title}
      </h3>
      {children}
    </section>
  );
};

export default Block;
