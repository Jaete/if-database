'use client';

import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import { LORE_FIELDS, paragraphs } from '../fields';
import type { IRaceView } from '../types';
import LoreHandles from './handles';

interface IProps {
  race: IRaceView;
}

/** A crônica da raça: história, comportamento e características físicas. */
const Lore = ({ race }: IProps) => {
  const handles = useCssHandles(LoreHandles);
  const blocks = LORE_FIELDS.filter(({ name }) => race[name]);

  if (blocks.length === 0) {
    return <p className={handles.raceLoreEmpty}>Sem crônica ainda.</p>;
  }

  return (
    <div className={handles.raceLore}>
      {blocks.map(({ name, label }, i) => (
        <div
          key={name}
          className={`${handles.raceLoreBlock}${
            i === 0 ? ` ${applyModifiers(handles.raceLoreBlock, 'first')}` : ''
          }`}
        >
          <h3>{label}</h3>
          {paragraphs(race[name] ?? '').map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Lore;
