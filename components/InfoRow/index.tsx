'use client';

import { useCssHandles } from '@/hooks/useCssHandles';
import InfoRowHandles from './handles';
import '@/styles/components/infoRow.scss';

interface IProps {
  label: React.ReactNode;
  children: React.ReactNode;
  valueId?: string;
  pre?: boolean;
}

const InfoRow = ({ label, children, valueId, pre }: IProps) => {
  const handles = useCssHandles(InfoRowHandles);

  return (
    <div className={handles.infoRow}>
      <span className={handles.infoLabel}>{label}</span>
      <span
        id={valueId}
        className={`${handles.infoValue}${pre ? ` ${handles.infoValuePre}` : ''}`}
      >
        {children}
      </span>
    </div>
  );
};

export default InfoRow;
