'use client';

import type { ReactNode } from 'react';
import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import SkeletonHandles from './handles';
import '@/styles/components/skeleton.scss';

interface IProps {
  /**
   * Texto representativo do conteúdo que virá. Fica transparente, com o brilho
   * por trás: a caixa de linha é a da fonte real, então a troca pelo conteúdo
   * não desloca nada. Sem `children`, preenche o pai (arte).
   */
  children?: ReactNode;
}

/** Barra fantasma de carregamento. Decorativa: o aviso fica no `SkeletonStatus`. */
const Skeleton = ({ children }: IProps) => {
  const handles = useCssHandles(SkeletonHandles);
  return (
    // aria-hidden: o texto representativo é falso ("Necromante", "000
    // magias") e não pode ser anunciado; o aviso real é o SkeletonStatus.
    <span
      aria-hidden="true"
      className={`${handles.skeleton}${
        children === undefined
          ? ` ${applyModifiers(handles.skeleton, 'block')}`
          : ''
      }`}
    >
      {children}
    </span>
  );
};

interface IStatusProps {
  children: ReactNode;
}

/** Anúncio só para leitor de tela ("Carregando classes…"). */
export const SkeletonStatus = ({ children }: IStatusProps) => {
  const handles = useCssHandles(SkeletonHandles);
  return (
    <p role="status" className={handles.skeletonStatus}>
      {children}
    </p>
  );
};

export default Skeleton;
