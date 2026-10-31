'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useCssHandles } from '@/hooks/useCssHandles';
import { useSpellPeek } from './useSpellPeek';
import SpellDetail from '../../SpellDetail';
import SpellPeekHandles from './handles';

interface IProps {
  slug: string;
  onClose: () => void;
}

/**
 * Uma magia do grimório lida por cima da lista da classe.
 *
 * Abrir o grimório em outra página perdia a lista e o ponto em que se estava;
 * aqui o detalhe é o mesmo do grimório, e fechar devolve à lista intacta.
 */
const SpellPeek = ({ slug, onClose }: IProps) => {
  const handles = useCssHandles(SpellPeekHandles);
  const { spell, classNames, loading, error } = useSpellPeek(slug);

  // O Esc fecha só a magia. Na captura da janela e sem propagar: o modal das
  // seções, que escuta no documento, fecharia junto.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.stopPropagation();
      onClose();
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [onClose]);

  if (spell) {
    return (
      <SpellDetail
        key={spell.slug}
        spell={spell}
        classNames={classNames}
        canEdit={false}
        overlay
        backLabel="Voltar à lista"
        onClose={onClose}
        onEdit={() => {}}
      />
    );
  }

  return (
    <div className={handles.clsPeekStatus} role="status">
      {loading ? (
        <p className={handles.clsPeekText}>Abrindo a magia…</p>
      ) : (
        error && (
          <>
            <p className={handles.clsPeekText}>
              Não consegui abrir essa magia.
            </p>
            <Link
              href={`/spells?magia=${encodeURIComponent(slug)}`}
              className={handles.clsPeekLink}
              prefetch={false}
            >
              Procurar no grimório
            </Link>
            <button
              type="button"
              className={handles.clsPeekLink}
              onClick={onClose}
            >
              Voltar à lista
            </button>
          </>
        )
      )}
    </div>
  );
};

export default SpellPeek;
