'use client';

import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

/**
 * Distribui o estado de edição pelos painéis da ficha.
 *
 * É contexto, e não props, porque os sete painéis recebem apenas `player` hoje;
 * passar editabilidade por props obrigaria a tocar em todos eles e em cada
 * nível intermediário sem ganho nenhum.
 *
 * Local ao organismo de propósito — não tem relação com o AuthProvider do app,
 * e app/(embed)/layout.tsx continua sem provider nenhum.
 */

interface IEditingContext {
  editable: boolean;
  value: (path: string) => string | number | undefined;
  /** Lista de string num caminho — as listas de chips (idiomas, defesas…). */
  list: (path: string) => string[];
  /** Lista de objetos — perícias e testes de resistência. */
  objects: <T>(path: string) => T[];
  /**
   * O que há num caminho, seja o que for — para os blocos que são um objeto
   * inteiro (a escolha de raça), que os leitores acima não devolvem.
   */
  read: <T = unknown>(path: string) => T | undefined;
  setField: (path: string, value: unknown) => void;
  isFieldDirty: (path: string) => boolean;
  /** Algo em `path` ou dentro dele está no rascunho. */
  isDirtyUnder: (path: string) => boolean;
  /** Devolve `path` (e o que há dentro) ao valor gravado. */
  revertField: (path: string) => void;
}

// O padrão é o modo somente-leitura, então um painel renderizado fora do
// provider (um teste, um Storybook) se comporta como a ficha pública.
const EditingContext = createContext<IEditingContext>({
  editable: false,
  value: () => undefined,
  list: () => [],
  objects: () => [],
  read: () => undefined,
  setField: () => {},
  isFieldDirty: () => false,
  isDirtyUnder: () => false,
  revertField: () => {},
});

export const useEditing = () => useContext(EditingContext);

export const EditingProvider = ({
  children,
  ...rest
}: IEditingContext & { children: ReactNode }) => (
  <EditingContext.Provider value={rest}>{children}</EditingContext.Provider>
);
