import type { ReactNode } from 'react';
import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import { CheckIcon, LockIcon } from '../Icons';
import ChoiceTagHandles from './handles';
import '@/styles/components/choiceTag.scss';

interface IProps {
  /**
   * `current`: o que a ficha tem hoje. `chosen`: o que está na bandeja, ainda
   * não salvo. `blocked`: não dá para escolher. `unique`: raça ou classe única.
   * `warn`: aviso que não bloqueia.
   */
  kind: 'current' | 'chosen' | 'blocked' | 'unique' | 'warn';
  children: ReactNode;
}

/** O selo pequeno dos catálogos em modo de escolha (Atual, Escolhida…). */
const ChoiceTag = ({ kind, children }: IProps) => {
  const handles = useCssHandles(ChoiceTagHandles);
  return (
    <span
      className={`${handles.choiceTag} ${applyModifiers(handles.choiceTag, kind)}`}
    >
      {kind === 'chosen' && <CheckIcon className={handles.choiceTagIcon} />}
      {kind === 'blocked' && <LockIcon className={handles.choiceTagIcon} />}
      {children}
    </span>
  );
};

export default ChoiceTag;
