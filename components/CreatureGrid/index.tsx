'use client';

import { useState, useMemo, useEffect, useRef } from 'react';

import type ICreature from '@/db/creatures/creatures.d';
import { useCssHandles, applyModifiers } from '@/hooks/useCssHandles';
import CreatureCard from '../CreatureCard';
import Drawer from '../Drawer';
import DrawerController from '../DrawerController';
import DrawerHeader from '../DrawerHeader';
import DrawerContent from '../DrawerContent';
import CreatureData from '../CreatureData';
import Modal from '../Modal';
import CreatureEditForm, {
  emptyMonster,
  type IFormData,
} from '../CreatureEditForm';
import ConfirmModal from '../ConfirmModal';
import CreatureGridHandles from './handles';
import '@/styles/components/creatureGrid.scss';
import { PlusIcon, TreeIcon } from '../Icons';
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
  const lastScrollYRef = useRef(0);

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
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 0) {
        setIsSticky(false);
      } else if (currentScrollY > lastScrollYRef.current) {
        setIsSticky(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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
      className={`${handles.crgContainer}${!canEdit ? ` ${applyModifiers(handles.crgContainer, 'viewOnly')}` : ''}`}
    >
      <header
        className={`${handles.crgHeader}${isSticky ? ` ${applyModifiers(handles.crgHeader, 'compact')}` : ''}`}
      >
        <h1 className={handles.crgTitle}>BESTIÁRIO DE TERRALÉM</h1>
        <p className={handles.crgSubtitle}>Lista dos monstros disponíveis.</p>
        <div className={handles.crgNavButtons}>
          {canEdit && (
            <button
              className={handles.crgNavButton}
              onClick={handleCreateClick}
              aria-label="Criar nova criatura"
            >
              + CRIAR NOVA CRIATURA
            </button>
          )}
          {canEdit && (
            <button
              className={handles.crgNavButton}
              onClick={handleTreeModalOpen}
              aria-label="Gerar arvore de criaturas"
            >
              GERAR ARVORE DE CRIATURAS
            </button>
          )}
        </div>

        <div className={handles.crgCompactSearchBar}>
          <div className={handles.crgCompactSearchInput}>
            <input
              type="text"
              className={handles.crgSearchInput}
              placeholder="Buscar criatura pelo nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm.length > 0 && (
              <span className={handles.crgResultsCount}>
                {filteredCreatures.length} resultado
                {filteredCreatures.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          {canEdit && (
            <button
              className={handles.crgCompactActionBtn}
              onClick={handleCreateClick}
              aria-label="Criar nova criatura"
            >
              <PlusIcon />
            </button>
          )}
          {canEdit && (
            <button
              className={handles.crgCompactActionBtn}
              onClick={handleTreeModalOpen}
              aria-label="Gerar árvore de criaturas"
            >
              <TreeIcon />
            </button>
          )}
        </div>
      </header>

      <div
        className={`${handles.crgSearchContainer}${isSticky ? ` ${applyModifiers(handles.crgSearchContainer, 'hidden')}` : ''}`}
      >
        <input
          type="text"
          className={handles.crgSearchInput}
          placeholder="Buscar criatura pelo nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm.length > 0 && (
          <span className={handles.crgResultsCount}>
            {filteredCreatures.length} resultado
            {filteredCreatures.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className={handles.crgGrid}>
        {loading ? (
          <div className={handles.crgGridLoading}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={handles.crgGridSkeleton} />
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
          <div className={handles.crgEmptyState}>
            Nenhuma criatura encontrada.
          </div>
        )}
      </div>

      <Drawer>
        <DrawerHeader />
        <DrawerContent>
          {selectedCreature && !activeTab && !directEditCreature && (
            <CreatureData creature={selectedCreature} />
          )}
        </DrawerContent>
      </Drawer>

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
