'use client';

import { useCssHandles } from '@/hooks/useCssHandles';
import EntityTitleHandles from './handles';
import '@/styles/components/entityTitle.scss';

interface IProps {
  children: React.ReactNode;
}

const EntityTitle = ({ children }: IProps) => {
  const handles = useCssHandles(EntityTitleHandles);

  return (
    <div className={handles.entityHeader}>
      <h2 className={handles.entityTitle}>{children}</h2>
    </div>
  );
};

export default EntityTitle;
