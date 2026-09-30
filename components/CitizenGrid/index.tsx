'use client';

import type ICitizen from '@/db/citizens/citizen.d';
import { useCitizens } from '@/app/context/CitizensContext';
import EntityGrid from '../EntityGrid';
import CitizenCard from '../CitizenCard';
import CitizenData from '../CitizenData';
import CitizenEditForm, {
  citizenToFormData,
  emptyCitizen,
  type FormDataType,
} from '../CitizenEditForm';

// Toda a mecânica de listagem vive em EntityGrid; aqui ficam só os rótulos e
// as peças específicas de cidadão.
const CitizenGrid = () => {
  const { citizens, loading, erase, create, update } = useCitizens();

  return (
    <EntityGrid<ICitizen, FormDataType>
      entities={citizens}
      loading={loading}
      erase={erase}
      toFormData={citizenToFormData}
      emptyForm={emptyCitizen}
      labels={{
        title: 'CIDADÃOS DE TERRALÉM',
        subtitle: 'Lista dos cidadãos, heróis e figuras do mundo.',
        createButton: '+ CRIAR NOVO CIDADÃO',
        createTab: 'Novo Cidadão',
        searchPlaceholder: 'Buscar cidadão pelo nome...',
        emptyState: 'Nenhum cidadão encontrado.',
        deleteTitle: 'Excluir Cidadão',
        deleteMessage: (name) =>
          name
            ? `Tem certeza que deseja excluir ${name}? Esta ação não pode ser desfeita.`
            : 'Tem certeza que deseja excluir este cidadão?',
      }}
      renderCard={({ entity, onClick, onEdit, onDelete, onEditInNewTab }) => (
        <CitizenCard
          key={entity.slug + '--card'}
          citizen={entity}
          onClick={onClick}
          onEdit={onEdit}
          onDelete={onDelete}
          onEditInNewTab={onEditInNewTab}
        />
      )}
      renderData={(citizen) => <CitizenData citizen={citizen} />}
      renderForm={({
        entity,
        mode,
        externalFormData,
        onFormDataChange,
        onClose,
      }) => (
        <CitizenEditForm
          citizen={entity}
          mode={mode}
          externalFormData={externalFormData}
          onFormDataChange={onFormDataChange}
          onClose={onClose}
          persist={{ create, update }}
        />
      )}
    />
  );
};

export default CitizenGrid;
