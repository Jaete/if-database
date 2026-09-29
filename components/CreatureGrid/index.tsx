'use client';

import type ICreature from '@/db/creatures/creatures.d';
import { useCssHandles, applyModifiers } from '@/hooks/useCssHandles';
import { useCreatureGrid } from './useCreatureGrid';
import CreatureCard from '../CreatureCard';
import Drawer from '../Drawer';
import DrawerController from '../DrawerController';
import DrawerHeader from '../DrawerHeader';
import DrawerContent from '../DrawerContent';
import CreatureData from '../CreatureData';
import Modal from '../Modal';
import CreatureEditForm from '../CreatureEditForm';
import ConfirmModal from '../ConfirmModal';
import EvolutionTreeModal from '../EvolutionTreeModal';
import { PlusIcon, TreeIcon } from '../Icons';
import CreatureGridHandles from './handles';
import '@/styles/components/creatureGrid.scss';

const CreatureGrid = () => {
  const handles = useCssHandles(CreatureGridHandles);
  const {
    monsters,
    loading,
    canEdit,
    searchTerm,
    setSearchTerm,
    selectedCreature,
    deleteTarget,
    isDeleteModalOpen,
    isSticky,
    isTreeModalOpen,
    activeTab,
    directEditCreature,
    isDirectModalOpen,
    filteredCreatures,
    visibleCreatures,
    hasMore,
    sentinelRef,
    handleEditClick,
    handleEditInNewTabClick,
    handleCreateClick,
    handleTreeModalOpen,
    handleTreeModalClose,
    handleViewClick,
    handleDeleteClick,
    handleConfirmDelete,
    handleDirectModalClose,
    handleTabModalClose,
    handleTabFormDataChange,
    handleDeleteModalClose,
  } = useCreatureGrid();

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
          visibleCreatures.map((creature) => (
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
        {!loading && hasMore && (
          <div ref={sentinelRef} className={handles.crgSentinel} />
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
        onClose={handleDirectModalClose}
        title={`Editando: ${directEditCreature?.name || ''}`}
        sectionRail
      >
        {directEditCreature && (
          <CreatureEditForm
            creature={directEditCreature}
            mode="edit"
            onClose={handleDirectModalClose}
          />
        )}
      </Modal>

      {/* Tab-based edit modal */}
      <Modal
        isOpen={!!activeTab}
        onClose={handleTabModalClose}
        title={activeTab?.label || 'Formulário'}
        sectionRail
      >
        {activeTab && (
          <CreatureEditForm
            creature={{} as ICreature}
            mode={activeTab.mode}
            externalFormData={activeTab.formData}
            onFormDataChange={handleTabFormDataChange}
            onClose={handleTabModalClose}
          />
        )}
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
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
        onClose={handleTreeModalClose}
        monsters={monsters}
      />
    </div>
  );
};

export default CreatureGrid;
