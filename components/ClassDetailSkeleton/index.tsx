'use client';

import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import Skeleton, { SkeletonStatus } from '../Skeleton';
import ClassDetailSkeletonHandles from './handles';
import '@/styles/components/classDetailSkeleton.scss';

interface IProps {
  /** Embed no fórum: sem a altura mínima de página inteira. */
  compact?: boolean;
}

/**
 * O detalhe da classe enquanto carrega: só o título e duas linhas de texto
 * fantasma, no lugar do hero. Leve de propósito — o detalhe tem 20 níveis,
 * arquétipos e uma roda, e nada disso cabe num esboço fiel.
 */
const ClassDetailSkeleton = ({ compact = false }: IProps) => {
  const handles = useCssHandles(ClassDetailSkeletonHandles);
  return (
    <div
      className={`${handles.classLoading}${
        compact ? ` ${applyModifiers(handles.classLoading, 'compact')}` : ''
      }`}
      aria-busy="true"
    >
      <SkeletonStatus>Carregando classe…</SkeletonStatus>
      <div className={handles.classLoadingHero}>
        <h1 className={handles.classLoadingTitle}>
          <Skeleton>Necromante</Skeleton>
        </h1>
        <p className={handles.classLoadingLine}>
          <Skeleton>
            Especialista em combate à distância, usa o arco para eliminar alvos
            com precisão e eficiência.
          </Skeleton>
        </p>
      </div>
    </div>
  );
};

export default ClassDetailSkeleton;
