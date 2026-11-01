'use client';

import { useEffect } from 'react';

interface IProps {
  forumOrigin: string;
}

/**
 * Ponte entre o embed e o modal do fórum que o hospeda: leva o Esc até ele e
 * avisa quando um modal do embed está aberto (ver `modal:inner` abaixo).
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
      // Edição pendente (a ficha marca `data-unsaved`): fechar perderia tudo.
      if (document.querySelector('[data-unsaved]')) return;
      window.parent.postMessage(
        { source: 'ifdb-embed', type: 'modal:close' },
        forumOrigin
      );
    };
    document.addEventListener('keydown', onKeyDown);

    // Avisa o fórum quando um modal do próprio embed (Progressão, Talentos…)
    // abre ou fecha: no celular ele ocupa o iframe inteiro e o X do modal do
    // fórum, sobre o mesmo canto, fica escondido enquanto isso. Só manda
    // mensagem quando o estado muda.
    let innerOpen = false;
    const syncInner = () => {
      const open = Boolean(document.querySelector('.modal--open'));
      if (open === innerOpen) return;
      innerOpen = open;
      window.parent.postMessage(
        { source: 'ifdb-embed', type: 'modal:inner', open },
        forumOrigin
      );
    };
    const observer = new MutationObserver(syncInner);
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['class'],
    });
    syncInner();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      observer.disconnect();
    };
  }, [forumOrigin]);

  return null;
};

export default EmbedCloseBridge;
