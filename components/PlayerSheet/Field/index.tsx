import type { ReactNode } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import FieldHandles from './handles';

interface IProps {
  label: string;
  children: ReactNode;
}

const Field = ({ label, children }: IProps) => {
  const handles = useCssHandles(FieldHandles);

  return (
    <div className={handles.sheetField}>
      <span className={handles.sheetCaption}>{label}</span>
      {children}
    </div>
  );
};

export default Field;
