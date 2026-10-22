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
  setField: (path: string, value: unknown) => void;
  isFieldDirty: (path: string) => boolean;
}

// O padrão é o modo somente-leitura, então um painel renderizado fora do
// provider (um teste, um Storybook) se comporta como a ficha pública.
const EditingContext = createContext<IEditingContext>({
  editable: false,
  value: () => undefined,
  list: () => [],
  objects: () => [],
  setField: () => {},
  isFieldDirty: () => false,
});

export const useEditing = () => useContext(EditingContext);

export const EditingProvider = ({
  children,
  ...rest
}: IEditingContext & { children: ReactNode }) => (
  <EditingContext.Provider value={rest}>{children}</EditingContext.Provider>
);
