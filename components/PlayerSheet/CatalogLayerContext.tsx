'use client';

import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { CatalogRequest } from './CatalogLayer/types';

/**
 * Quem abre a camada de escolha: o campo de raça e de classe do topo, a placa
 * de linhagem, os painéis de arquétipo, talentos e magias. Um provedor só
 * guarda o pedido; a camada em si é montada pela ficha, dentro da moldura
 * (`CatalogLayerHost`), e não num modal.
 *
 * Local ao organismo de propósito, como o EditingContext.
 */
interface ICatalogLayerContext {
  request: CatalogRequest | null;
  open: (request: CatalogRequest) => void;
  close: () => void;
}

const CatalogLayerContext = createContext<ICatalogLayerContext>({
  request: null,
  open: () => {},
  close: () => {},
});

export const useCatalogRequest = () => useContext(CatalogLayerContext);

export const CatalogLayerProvider = ({ children }: { children: ReactNode }) => {
  const [request, setRequest] = useState<CatalogRequest | null>(null);
  return (
    <CatalogLayerContext.Provider
      value={{
        request,
        open: setRequest,
        close: () => setRequest(null),
      }}
    >
      {children}
    </CatalogLayerContext.Provider>
  );
};
