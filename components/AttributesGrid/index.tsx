'use client';

import { useCssHandles } from '@/hooks/useCssHandles';
import AttributesGridHandles from './handles';
import '@/styles/components/attributesGrid.scss';

export interface IAttributeItem {
  key: string;
  label: React.ReactNode;
  value: React.ReactNode;
  valueId?: string;
  sub?: React.ReactNode;
}

interface IProps {
  items: IAttributeItem[];
}

const AttributesGrid = ({ items }: IProps) => {
  const handles = useCssHandles(AttributesGridHandles);

  return (
    <div className={handles.attributesGrid}>
      {items.map((item) => (
        <div key={item.key} className={handles.attrItem}>
          <span className={handles.attrLabel}>{item.label}</span>
          <span id={item.valueId} className={handles.attrValue}>
            {item.value}
          </span>
          {item.sub !== undefined && (
            <span className={handles.attrSub}>{item.sub}</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default AttributesGrid;
