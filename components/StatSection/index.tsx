'use client';

import { useCssHandles } from '@/hooks/useCssHandles';
import StatSectionHandles from './handles';
import '@/styles/components/statSection.scss';

interface IProps {
  title: React.ReactNode;
  children: React.ReactNode;
}

const StatSection = ({ title, children }: IProps) => {
  const handles = useCssHandles(StatSectionHandles);

  return (
    <section className={handles.statSection}>
      <h3>{title}</h3>
      {children}
    </section>
  );
};

export default StatSection;
