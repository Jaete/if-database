'use client';

import { useState, useMemo, useEffect, useRef } from 'react';

import type ICreature from '@/db/creatures/creatures.d';
import { useCssHandles, applyModifiers } from '@/hooks/useCssHandles';
import CreatureCard from '../CreatureCard';
import CreatureDrawer from '../CreatureDrawer';
import CreatureData from '../CreatureData';
import Modal from '../Modal';
import CreatureEditForm from '../CreatureEditForm';
import ConfirmModal from '../ConfirmModal';
import CreatureGridHandles from './handles';
import '@/styles/components/creatureGrid.scss';
import DrawerController from '../CreatureDrawer/sections/DrawerController';
import DrawerHeader from '../CreatureDrawer/sections/DrawerHeader';
import DrawerContent from '../CreatureDrawer/sections/DrawerContent';
import { useMonsters } from '@/app/context/MonstersContext';
import { useAuth } from '@/app/context/AuthContext';
import EvolutionTreeModal from '../EvolutionTreeModal';

const CreatureGrid = () => {
  const { monsters, loading, erase } = useMonsters();
  const { canEdit } = useAuth();
  const handles = useCssHandles(CreatureGridHandles);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCreature, setSelectedCreature] = useState<ICreature | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ICreature | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isTreeModalOpen, setIsTreeModalOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const filteredCreatures = useMemo(() => {
    return monsters.filter((monster) =>
      monster.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [monsters, searchTerm]);

  useEffect(() => {
    const handleClose = () => {
      if (!isEditModalOpen) {
        setSelectedCreature(null);
      }
    };
    window.addEventListener('drawer:close', handleClose);

    return () => {
      window.removeEventListener('drawer:close', handleClose);
    };
  }, [isEditModalOpen]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const handleEditClick = (creature: ICreature) => {
    setSelectedCreature(creature);
    setIsEditModalOpen(true);
  };

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleTreeModalOpen = () => {
    setIsTreeModalOpen(true);
  };

  const handleViewClick = (creature: ICreature) => {
    setSelectedCreature(creature);
  };

  const handleDeleteClick = (creature: ICreature) => {
    setDeleteTarget(creature);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      await erase(deleteTarget);
    }
    setDeleteTarget(null);
  };

  return (
    <div
      className={`${handles.container}${!canEdit ? ` ${applyModifiers(handles.container, 'viewOnly')}` : ''}`}
    >
      <div ref={sentinelRef} className={handles.headerSentinel} />
      <header
        className={`${handles.header}${isSticky ? ` ${applyModifiers(handles.header, 'compact')}` : ''}`}
      >
        <h1 className={handles.title}>BESTIÁRIO DE TERRALÉM</h1>
        <p className={handles.subtitle}>Lista dos monstros disponíveis.</p>
        <div className={handles.navButtons}>
          {canEdit && (
            <button
              className={handles.navButton}
              onClick={handleCreateClick}
              aria-label="Criar nova criatura"
            >
              + CRIAR NOVA CRIATURA
            </button>
          )}
          {canEdit && (
            <button
              className={handles.navButton}
              onClick={handleTreeModalOpen}
              aria-label="Gerar arvore de criaturas"
            >
              GERAR ARVORE DE CRIATURAS
            </button>
          )}
        </div>

        <div className={handles.compactSearchBar}>
          <div className={handles.compactSearchInput}>
            <input
              type="text"
              className={handles.searchInput}
              placeholder="Buscar criatura pelo nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm.length > 0 && (
              <span className={handles.resultsCount}>
                {filteredCreatures.length} resultado
                {filteredCreatures.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          {canEdit && (
            <button
              className={handles.compactActionBtn}
              onClick={handleCreateClick}
              aria-label="Criar nova criatura"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          )}
          {canEdit && (
            <button
              className={handles.compactActionBtn}
              aria-label="Gerar árvore de criaturas"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="5" r="2" />
                <path d="M5 22l5-10" />
                <path d="M19 22l-5-10" />
                <circle cx="12" cy="19" r="2" />
                <circle cx="5" cy="19" r="2" />
                <circle cx="19" cy="19" r="2" />
              </svg>
            </button>
          )}
        </div>
      </header>

      <div
        className={`${handles.searchContainer}${isSticky ? ` ${applyModifiers(handles.searchContainer, 'hidden')}` : ''}`}
      >
        <input
          type="text"
          className={handles.searchInput}
          placeholder="Buscar criatura pelo nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm.length > 0 && (
          <span className={handles.resultsCount}>
            {filteredCreatures.length} resultado
            {filteredCreatures.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className={handles.grid}>
        {loading ? (
          <div className={handles.gridLoading}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={handles.gridSkeleton} />
            ))}
          </div>
        ) : (
          filteredCreatures.map((creature) => (
            <DrawerController key={creature.slug}>
              <CreatureCard
                key={creature.slug + '--card'}
                creature={creature}
                onClick={handleViewClick}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            </DrawerController>
          ))
        )}
        {!loading && filteredCreatures.length === 0 && (
          <div className={handles.emptyState}>Nenhuma criatura encontrada.</div>
        )}
      </div>

      <CreatureDrawer>
        <DrawerHeader />
        <DrawerContent>
          {selectedCreature && !isEditModalOpen && (
            <CreatureData creature={selectedCreature} />
          )}
        </DrawerContent>
      </CreatureDrawer>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCreature(null);
        }}
        title={
          selectedCreature
            ? `Editando: ${selectedCreature.name}`
            : 'Editar Criatura'
        }
      >
        {selectedCreature && (
          <CreatureEditForm
            creature={selectedCreature}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedCreature(null);
            }}
          />
        )}
      </Modal>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Criar Nova Criatura"
      >
        <CreatureEditForm
          creature={{} as ICreature}
          mode="create"
          onClose={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Excluir Criatura"
        message={
          deleteTarget
            ? `Tem certeza que deseja excluir ${deleteTarget.name}? Esta acao nao pode ser desfeita.`
            : 'Tem certeza que deseja excluir esta criatura?'
        }
        confirmLabel="Sim, Excluir"
        cancelLabel="Cancelar"
      />

      <EvolutionTreeModal
        isOpen={isTreeModalOpen}
        onClose={() => setIsTreeModalOpen(false)}
        monsters={monsters}
      />
    </div>
  );
};

export default CreatureGrid;
