import type { ReactNode } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import LevelUpDetailHandles from './handles';

interface IProps {
  kind: string;
  title?: string;
  body?: string;
  meta?: ReactNode;
  children?: ReactNode;
}

/** O painel de detalhe ao lado da escolha: o texto inteiro do que está em foco. */
const LevelUpDetail = ({ kind, title, body, meta, children }: IProps) => {
  const handles = useCssHandles(LevelUpDetailHandles);
  return (
    <aside className={handles.luDetail} aria-live="polite">
      <span className={handles.luDetailKind}>{kind}</span>
      {title ? <h4>{title}</h4> : null}
      {meta}
      {body !== undefined ? (
        <p>{body || 'Sem descrição no catálogo.'}</p>
      ) : null}
      {children}
    </aside>
  );
};

export default LevelUpDetail;
