'use client';

import Link from 'next/link';
import { useCssHandles } from '@/hooks/useCssHandles';
import { ArrowLeftIcon, PencilIcon } from '../../Icons';
import TopBarHandles from './handles';

interface IProps {
  basePath: string;
  /** Aberta por cima do seletor: o botão fecha o overlay em vez de navegar. */
  onBack?: () => void;
  /** Presente só para quem edita. */
  onEdit?: () => void;
}

/** A barra de topo, a mesma do detalhe de magia. */
const TopBar = ({ basePath, onBack, onEdit }: IProps) => {
  const handles = useCssHandles(TopBarHandles);

  const back = (
    <>
      <ArrowLeftIcon />
      <span className={handles.clsBarLabel}>Classes</span>
    </>
  );

  return (
    <div className={handles.clsBar}>
      {onBack ? (
        <button
          type="button"
          className={handles.clsBack}
          onClick={onBack}
          aria-label="Voltar para as classes"
        >
          {back}
        </button>
      ) : (
        <Link
          href={basePath}
          className={handles.clsBack}
          prefetch={false}
          aria-label="Voltar para as classes"
        >
          {back}
        </Link>
      )}
      {onEdit && (
        <button
          type="button"
          className={handles.clsEditBtn}
          onClick={onEdit}
          aria-label="Editar classe"
        >
          <PencilIcon />
          <span className={handles.clsBarLabel}>Editar classe</span>
        </button>
      )}
    </div>
  );
};

export default TopBar;
