'use client';

import CatalogLayer from './CatalogLayer';
import { useCatalogRequest } from './CatalogLayerContext';
import { useCreation } from './CreationContext';
import { useEditing } from './EditingContext';

interface IProps {
  /** Montada pela tela de criação, dentro do rascunho dela. */
  inCreation?: boolean;
}

/**
 * Monta a camada de escolha dentro da moldura da ficha quando alguém a pede.
 * Só existe em edição: fora dela, nenhum botão chega a pedir. Com a tela de
 * criação aberta, só a instância dela monta (a da ficha ficaria por baixo,
 * lendo o rascunho errado).
 */
const CatalogLayerHost = ({ inCreation = false }: IProps) => {
  const { request, close } = useCatalogRequest();
  const { editable } = useEditing();
  const { view } = useCreation();
  if (!request || !editable) return null;
  if (!inCreation && view === 'wizard') return null;
  return <CatalogLayer request={request} onClose={close} />;
};

export default CatalogLayerHost;
