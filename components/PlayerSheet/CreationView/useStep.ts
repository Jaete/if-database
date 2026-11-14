'use client';

import { useCreation } from '../CreationContext';
import { derive } from './derive';

/** O que todo passo precisa: o rascunho, a ficha e os derivados ao vivo. */
export const useStep = () => {
  const creation = useCreation();
  const { data, player } = creation;
  // A casca só monta um passo com o rascunho carregado.
  const loaded = data!;
  const sheet = player!;
  return { creation, data: loaded, player: sheet, d: derive(loaded, sheet) };
};
