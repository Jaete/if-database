import type { ReactNode } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import LevelUpChoiceHandles from './handles';

interface IProps {
  name: string;
  description?: string;
  selected: boolean;
  /** Bloqueada: segue legível e abre o detalhe, mas não se escolhe. */
  locked?: boolean;
  tags?: ReactNode;
  requirement?: string;
  onSelect: () => void;
  onHover: () => void;
}

/** A carta de escolha de uma opção: glifo, nome, resumo e marca de escolhida. */
const LevelUpChoice = ({
  name,
  description,
  selected,
  locked,
  tags,
  requirement,
  onSelect,
  onHover,
}: IProps) => {
  const handles = useCssHandles(LevelUpChoiceHandles);
  return (
    <button
      type="button"
      role="radio"
      className={handles.luChoice}
      aria-checked={selected}
      aria-disabled={locked || undefined}
      onClick={locked ? onHover : onSelect}
      onMouseEnter={onHover}
      onFocus={onHover}
    >
      <span className={handles.luChoiceGlyph} aria-hidden="true">
        {name.charAt(0)}
      </span>
      <span className={handles.luChoiceName}>{name}</span>
      <span className={handles.luChoiceDesc}>
        {description || 'Sem descrição no catálogo.'}
      </span>
      {tags && <span className={handles.luChoiceTags}>{tags}</span>}
      {requirement && (
        <span className={handles.luChoiceReq}>Requer {requirement}</span>
      )}
      <span className={handles.luChoiceTick} aria-hidden="true" />
    </button>
  );
};

export default LevelUpChoice;
