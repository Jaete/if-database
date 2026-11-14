import type { ReactNode } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import LevelUpPillHandles from './handles';

interface IProps {
  tone?: 'gold' | 'muted' | 'dash' | 'warn' | 'ok' | 'novo';
  children: ReactNode;
}

/** A etiqueta pequena: "novo", "pendente", "XP negativa", "geral". */
const LevelUpPill = ({ tone = 'gold', children }: IProps) => {
  const handles = useCssHandles(LevelUpPillHandles);
  return (
    <span className={`${handles.luPill} ${handles.luPill}--${tone}`}>
      {children}
    </span>
  );
};

export default LevelUpPill;
