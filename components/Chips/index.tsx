'use client';

import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import ChipsHandles from './handles';
import '@/styles/components/chips.scss';

export type ChipTone = 'default' | 'vuln' | 'resist';

interface IProps {
  items: string[];
  tone?: ChipTone;
  emptyLabel?: string;
}

const Chips = ({ items, tone = 'default', emptyLabel = 'nenhuma' }: IProps) => {
  const handles = useCssHandles(ChipsHandles);

  if (items.length === 0) {
    return (
      <span className={`${handles.chip} ${handles.chipsEmpty}`}>
        {emptyLabel}
      </span>
    );
  }

  return (
    <ul className={handles.chips}>
      {items.map((item, index) => (
        <li
          key={`${item}-${index}`}
          className={`${handles.chip}${
            tone === 'default' ? '' : ` ${applyModifiers(handles.chip, tone)}`
          }`}
        >
          {item}
        </li>
      ))}
    </ul>
  );
};

export default Chips;
