'use client';

import CatalogLayer from './CatalogLayer';
import { useCatalogRequest } from './CatalogLayerContext';
import { useEditing } from './EditingContext';

/**
 * Monta a camada de escolha dentro da moldura da ficha quando alguém a pede.
 * Só existe em edição: fora dela, nenhum botão chega a pedir.
 */
const CatalogLayerHost = () => {
  const { request, close } = useCatalogRequest();
  const { editable } = useEditing();
  if (!request || !editable) return null;
  return <CatalogLayer request={request} onClose={close} />;
};

export default CatalogLayerHost;
