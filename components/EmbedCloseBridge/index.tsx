'use client';

import { useEffect } from 'react';

interface IProps {
  forumOrigin: string;
}

/**
 * Leva o Esc do iframe até o modal do fórum que o hospeda.
 *
 * Com o foco dentro do iframe, a tecla nunca chega ao documento do fórum, e o
 * Esc só fecharia o modal até o primeiro clique no conteúdo. Um modal do
 * próprio embed aberto fica com o Esc: ele fecha primeiro, o do fórum depois.
 *
 * Não desenha nada. Sem `forumOrigin` (acesso direto ao embed) fica inerte.
 */
const EmbedCloseBridge = ({ forumOrigin }: IProps) => {
  useEffect(() => {
    if (!forumOrigin || window.parent === window) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      // Já consumido por algo do embed (a classe aberta sobre o seletor).
      if (event.defaultPrevented) return;
      if (document.querySelector('.modal--open')) return;
      window.parent.postMessage(
        { source: 'ifdb-embed', type: 'modal:close' },
        forumOrigin
      );
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [forumOrigin]);

  return null;
};

export default EmbedCloseBridge;
