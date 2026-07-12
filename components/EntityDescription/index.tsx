'use client';

import { useCssHandles } from '@/hooks/useCssHandles';
import EntityDescriptionHandles from './handles';
import '@/styles/components/entityDescription.scss';

interface IProps {
  children: React.ReactNode;
}

const EntityDescription = ({ children }: IProps) => {
  const handles = useCssHandles(EntityDescriptionHandles);

  return <p className={handles.entityDescription}>{children}</p>;
};

export default EntityDescription;
