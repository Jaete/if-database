'use client';

import { useId, useState } from 'react';

/**
 * Leitura de uma entrada de lista, no leitor ao lado ou no modal.
 *
 * Em painel largo a lista ganha um `DetailCard` ao lado, e clicar, passar o
 * mouse ou focar uma linha troca o item mostrado ali. Em painel estreito esse
 * leitor está escondido por CSS (`display: none`) e a leitura continua sendo o
 * olho da linha, que abre o modal. Quem decide é a geometria real, não um
 * breakpoint repetido em JS: o leitor está visível ou não.
 */
export const useSideReader = <T>() => {
  const detailId = useId();
  // Chave da linha mostrada no leitor. A entrada é resolvida a cada render a
  // partir da lista, para o leitor acompanhar o rascunho em edição.
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [reading, setReading] = useState<T | null>(null);

  // `offsetParent` é null para o que está em `display: none`.
  const isVisible = () => {
    const element = document.getElementById(detailId);
    return element !== null && element.offsetParent !== null;
  };

  /** Ação explícita (o olho): leitor ao lado se existir, senão o modal. */
  const open = (key: string, item: T) => {
    if (isVisible()) setSelectedKey(key);
    else setReading(item);
  };

  /** Hover, foco ou clique na linha: só vale onde há leitor ao lado. */
  const preview = (key: string) => {
    if (isVisible()) setSelectedKey(key);
  };

  return { detailId, selectedKey, reading, setReading, open, preview };
};
