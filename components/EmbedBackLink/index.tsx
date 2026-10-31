'use client';

import Link from 'next/link';
import { useCssHandles } from '@/hooks/useCssHandles';
import { ArrowLeftIcon } from '../Icons';
import EmbedBackLinkHandles from './handles';
import '@/styles/components/embedBackLink.scss';

interface IProps {
  /** A tela de seleção de origem; outras telas do tipo virão. */
  href?: string;
}

/** Volta à entrada do embed. Vai antes do título do cabeçalho compacto. */
const EmbedBackLink = ({ href = '/embed/class-or-spell' }: IProps) => {
  const handles = useCssHandles(EmbedBackLinkHandles);
  return (
    <>
      <Link
        href={href}
        className={handles.embedBack}
        aria-label="Voltar para Classes e Escolas Mágicas"
        title="Voltar para Classes e Escolas Mágicas"
      >
        <ArrowLeftIcon />
        <span className={handles.embedBackLabel}>Início</span>
      </Link>
      <span className={handles.embedBackDivider} aria-hidden="true" />
    </>
  );
};

export default EmbedBackLink;
