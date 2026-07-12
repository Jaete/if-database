'use client';

import { useCssHandles } from '@/hooks/useCssHandles';
import ArrayItemWrapperHandles from './handles';

interface IProps {
  onRemove: () => void;
  children: React.ReactNode;
}

const ArrayItemWrapper = ({ onRemove, children }: IProps) => {
  const handles = useCssHandles(ArrayItemWrapperHandles);

  return (
    <div className={handles.arrayItem}>
      <button type="button" className={handles.removeButton} onClick={onRemove}>
        &times;
      </button>
      {children}
    </div>
  );
};

export default ArrayItemWrapper;
