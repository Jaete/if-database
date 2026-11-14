'use client';

import { useState } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import type IPlayer from '@/db/players/player';
import { useAuth } from '@/app/context/AuthContext';
import { usePlayers } from '@/app/context/PlayersContext';
import BlankSheetModal from '../BlankSheetModal';
import EntityGrid from '../EntityGrid';
import EntityGridHandles from '../EntityGrid/handles';
import PlayerCard from '../PlayerCard';
import PlayerData from '../PlayerData';
import CitizenEditForm, {
  citizenToFormData,
  emptyCitizen,
  type FormDataType,
} from '../CitizenEditForm';

const PlayerGrid = () => {
  const { players, loading, erase, create, update } = usePlayers();
  const { user } = useAuth();
  const grid = useCssHandles(EntityGridHandles);
  const isMine = (p: IPlayer) =>
    typeof user?.forumUserId === 'number' &&
    p.ownerForumUserId === user.forumUserId;
  const [blankOpen, setBlankOpen] = useState(false);

  return (
    <>
      <EntityGrid<IPlayer, FormDataType>
        renderCreateAction={(start) => (
          <>
            <button
              className={grid.cgNavButton}
              onClick={() => start()}
              aria-label="+ CRIAR NOVO PERSONAGEM"
            >
              + CRIAR NOVO PERSONAGEM
            </button>
            <button
              className={grid.cgNavButton}
              onClick={() => setBlankOpen(true)}
            >
              Criar ficha vazia
            </button>
          </>
        )}
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
            // Na própria ficha não há editar nem excluir: outro membro da staff o faz.
            onEdit={isMine(entity) ? undefined : onEdit}
            onDelete={isMine(entity) ? undefined : onDelete}
            onEditInNewTab={isMine(entity) ? undefined : onEditInNewTab}
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
      <BlankSheetModal
        isOpen={blankOpen}
        onClose={(created) => {
          setBlankOpen(false);
          // A lista vem do servidor: com uma ficha nova, recarrega.
          if (created) window.location.reload();
        }}
      />
    </>
  );
};

export default PlayerGrid;
