'use client';

import type IPlayer from '@/db/players/player';
import { usePlayers } from '@/app/context/PlayersContext';
import EntityGrid from '../EntityGrid';
import PlayerCard from '../PlayerCard';
import PlayerData from '../PlayerData';
import CitizenEditForm, {
  citizenToFormData,
  emptyCitizen,
  type FormDataType,
} from '../CitizenEditForm';

const PlayerGrid = () => {
  const { players, loading, erase, create, update } = usePlayers();

  return (
    <EntityGrid<IPlayer, FormDataType>
      entities={players}
      loading={loading}
      erase={erase}
      toFormData={citizenToFormData}
      emptyForm={emptyCitizen}
      labels={{
        title: 'JOGADORES DE TERRALÉM',
        subtitle: 'Personagens conduzidos pelos jogadores.',
        createButton: '+ CRIAR NOVO PERSONAGEM',
        createTab: 'Novo Personagem',
        searchPlaceholder: 'Buscar personagem pelo nome...',
        emptyState: 'Nenhum personagem encontrado.',
        deleteTitle: 'Excluir Personagem',
        deleteMessage: (name) =>
          name
            ? `Tem certeza que deseja excluir ${name}? Esta ação não pode ser desfeita.`
            : 'Tem certeza que deseja excluir este personagem?',
      }}
      renderCard={({ entity, onClick, onEdit, onDelete, onEditInNewTab }) => (
        <PlayerCard
          key={entity.slug + '--card'}
          player={entity}
          onClick={onClick}
          onEdit={onEdit}
          onDelete={onDelete}
          onEditInNewTab={onEditInNewTab}
        />
      )}
      renderData={(player) => <PlayerData player={player} />}
      renderForm={({
        entity,
        mode,
        externalFormData,
        onFormDataChange,
        onClose,
      }) => (
        <CitizenEditForm
          citizen={entity}
          variant="player"
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

export default PlayerGrid;
