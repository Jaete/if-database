'use client';

import { useState, useMemo, useEffect, useRef } from 'react';

import type ICreature from '@/db/creatures/creatures.d';
import { useCssHandles, applyModifiers } from '@/hooks/useCssHandles';
import CreatureCard from '../CreatureCard';
import CreatureDrawer from '../CreatureDrawer';
import CreatureData from '../CreatureData';
import Modal from '../Modal';
import CreatureEditForm, {
  emptyMonster,
  type IFormData,
} from '../CreatureEditForm';
import ConfirmModal from '../ConfirmModal';
import CreatureGridHandles from './handles';
import '@/styles/components/creatureGrid.scss';
import DrawerController from '../CreatureDrawer/sections/DrawerController';
import DrawerHeader from '../CreatureDrawer/sections/DrawerHeader';
import DrawerContent from '../CreatureDrawer/sections/DrawerContent';
import { useMonsters } from '@/app/context/MonstersContext';
import { useAuth } from '@/app/context/AuthContext';
import { useTabs } from '@/app/context/TabContext';
import EvolutionTreeModal from '../EvolutionTreeModal';

const CreatureGrid = () => {
  const { monsters, loading, erase } = useMonsters();
  const { canEdit } = useAuth();
  const handles = useCssHandles(CreatureGridHandles);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCreature, setSelectedCreature] = useState<ICreature | null>(
    null
  );
  const [deleteTarget, setDeleteTarget] = useState<ICreature | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isTreeModalOpen, setIsTreeModalOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { activeTab, openTab, openTabSilently, closeTab, updateTabFormData } =
    useTabs<IFormData>();
  const [directEditCreature, setDirectEditCreature] =
    useState<ICreature | null>(null);
  const [isDirectModalOpen, setIsDirectModalOpen] = useState(false);

  const filteredCreatures = useMemo(() => {
    return monsters.filter((monster) =>
      monster.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [monsters, searchTerm]);

  useEffect(() => {
    const handleClose = () => {
      if (!activeTab) {
        setSelectedCreature(null);
      }
    };
    window.addEventListener('drawer:close', handleClose);

    return () => {
      window.removeEventListener('drawer:close', handleClose);
    };
  }, [activeTab]);

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
    setDirectEditCreature(creature);
    setIsDirectModalOpen(true);
  };

  const handleEditInNewTabClick = (creature: ICreature) => {
    openTabSilently({
      mode: 'edit',
      slug: creature.slug,
      label: `Editando: ${creature.name}`,
      formData: creature as IFormData,
    });
  };

  const handleCreateClick = () => {
    openTab({
      mode: 'create',
      label: 'Nova Criatura',
      formData: emptyMonster,
    });
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
      className={`${handles.mgContainer}${!canEdit ? ` ${applyModifiers(handles.mgContainer, 'viewOnly')}` : ''}`}
    >
      <div ref={sentinelRef} className={handles.mgHeaderSentinel} />
      <header
        className={`${handles.mgHeader}${isSticky ? ` ${applyModifiers(handles.mgHeader, 'compact')}` : ''}`}
      >
        <h1 className={handles.mgTitle}>BESTIÁRIO DE TERRALÉM</h1>
        <p className={handles.mgSubtitle}>Lista dos monstros disponíveis.</p>
        <div className={handles.mgNavButtons}>
          {canEdit && (
            <button
              className={handles.mgNavButton}
              onClick={handleCreateClick}
              aria-label="Criar nova criatura"
            >
              + CRIAR NOVA CRIATURA
            </button>
          )}
          {canEdit && (
            <button
              className={handles.mgNavButton}
              onClick={handleTreeModalOpen}
              aria-label="Gerar arvore de criaturas"
            >
              GERAR ARVORE DE CRIATURAS
            </button>
          )}
        </div>

        <div className={handles.mgCompactSearchBar}>
          <div className={handles.mgCompactSearchInput}>
            <input
              type="text"
              className={handles.mgSearchInput}
              placeholder="Buscar criatura pelo nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm.length > 0 && (
              <span className={handles.mgResultsCount}>
                {filteredCreatures.length} resultado
                {filteredCreatures.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          {canEdit && (
            <button
              className={handles.mgCompactActionBtn}
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
              className={handles.mgCompactActionBtn}
              onClick={handleTreeModalOpen}
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
        className={`${handles.mgSearchContainer}${isSticky ? ` ${applyModifiers(handles.mgSearchContainer, 'hidden')}` : ''}`}
      >
        <input
          type="text"
          className={handles.mgSearchInput}
          placeholder="Buscar criatura pelo nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm.length > 0 && (
          <span className={handles.mgResultsCount}>
            {filteredCreatures.length} resultado
            {filteredCreatures.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className={handles.mgGrid}>
        {loading ? (
          <div className={handles.mgGridLoading}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={handles.mgGridSkeleton} />
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
                onEditInNewTab={handleEditInNewTabClick}
              />
            </DrawerController>
          ))
        )}
        {!loading && filteredCreatures.length === 0 && (
          <div className={handles.mgEmptyState}>
            Nenhuma criatura encontrada.
          </div>
        )}
      </div>

      <CreatureDrawer>
        <DrawerHeader />
        <DrawerContent>
          {selectedCreature && !activeTab && !directEditCreature && (
            <CreatureData creature={selectedCreature} />
          )}
        </DrawerContent>
      </CreatureDrawer>

      {/* Direct edit modal (left-click edit, no tab) */}
      <Modal
        isOpen={isDirectModalOpen && !!directEditCreature}
        onClose={() => {
          setIsDirectModalOpen(false);
          setDirectEditCreature(null);
        }}
        title={`Editando: ${directEditCreature?.name || ''}`}
      >
        {directEditCreature && (
          <CreatureEditForm
            creature={directEditCreature}
            mode="edit"
            onClose={() => {
              setIsDirectModalOpen(false);
              setDirectEditCreature(null);
            }}
          />
        )}
      </Modal>

      {/* Tab-based edit modal */}
      <Modal
        isOpen={!!activeTab}
        onClose={() => {
          if (activeTab) closeTab(activeTab.id);
        }}
        title={activeTab?.label || 'Formulário'}
      >
        {activeTab && (
          <CreatureEditForm
            creature={{} as ICreature}
            mode={activeTab.mode}
            externalFormData={activeTab.formData}
            onFormDataChange={(data) => updateTabFormData(activeTab.id, data)}
            onClose={() => closeTab(activeTab.id)}
          />
        )}
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
