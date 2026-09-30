'use client';

import type { ReactNode } from 'react';

import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import type { IGridEntity } from './useEntityGrid';
import { useEntityGrid } from './useEntityGrid';
import Drawer from '../Drawer';
import DrawerController from '../DrawerController';
import DrawerHeader from '../DrawerHeader';
import DrawerContent from '../DrawerContent';
import Modal from '../Modal';
import ConfirmModal from '../ConfirmModal';
import { PlusIcon } from '../Icons';
import EntityGridHandles from './handles';
import '@/styles/components/citizenGrid.scss';

export interface IEntityCardProps<T> {
  entity: T;
  onClick: (entity: T) => void;
  onEdit?: (entity: T) => void;
  onDelete?: (entity: T) => void;
  onEditInNewTab?: (entity: T) => void;
}

export interface IEntityFormProps<T, F> {
  entity?: T;
  mode: 'create' | 'edit';
  externalFormData?: F;
  onFormDataChange?: (data: F) => void;
  onClose: () => void;
}

interface ILabels {
  title: string;
  subtitle: string;
  createButton: string;
  createTab: string;
  searchPlaceholder: string;
  emptyState: string;
  deleteTitle: string;
  deleteMessage: (name: string) => string;
}

interface IProps<T extends IGridEntity, F> {
  entities: T[];
  loading: boolean;
  erase: (entity: T) => Promise<void>;
  toFormData: (entity: T) => F;
  emptyForm: F;
  labels: ILabels;
  renderCard: (props: IEntityCardProps<T>) => ReactNode;
  renderData: (entity: T) => ReactNode;
  renderForm: (props: IEntityFormProps<T, F>) => ReactNode;
  // Permite à tela de jogadores trocar o botão de criar por uma escolha entre
  // começar do zero e importar do fórum.
  renderCreateAction?: (start: (formData?: F) => void) => ReactNode;
}

const EntityGrid = <T extends IGridEntity, F>({
  entities,
  loading,
  erase,
  toFormData,
  emptyForm,
  labels,
  renderCard,
  renderData,
  renderForm,
  renderCreateAction,
}: IProps<T, F>) => {
  const handles = useCssHandles(EntityGridHandles);
  const {
    canEdit,
    searchTerm,
    setSearchTerm,
    selected,
    deleteTarget,
    isDeleteModalOpen,
    isSticky,
    sentinelRef,
    activeTab,
    directEdit,
    isDirectModalOpen,
    filtered,
    handleEditClick,
    handleEditInNewTabClick,
    handleCreateClick,
    handleViewClick,
    handleDeleteClick,
    handleConfirmDelete,
    handleDirectModalClose,
    handleTabModalClose,
    handleTabFormDataChange,
    handleDeleteModalClose,
  } = useEntityGrid<T, F>({
    entities,
    loading,
    erase,
    toFormData,
    emptyForm,
    createTabLabel: labels.createTab,
  });

  const createButton = (compact: boolean) =>
    renderCreateAction ? (
      renderCreateAction(handleCreateClick)
    ) : (
      <button
        className={compact ? handles.cgCompactActionBtn : handles.cgNavButton}
        onClick={() => handleCreateClick()}
        aria-label={labels.createButton}
      >
        {compact ? <PlusIcon /> : labels.createButton}
      </button>
    );

  const resultsCount = searchTerm.length > 0 && (
    <span className={handles.cgResultsCount}>
      {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
    </span>
  );

  return (
    <div
      className={`${handles.cgContainer}${!canEdit ? ` ${applyModifiers(handles.cgContainer, 'viewOnly')}` : ''}`}
    >
      <div ref={sentinelRef} className={handles.cgHeaderSentinel} />
      <header
        className={`${handles.cgHeader}${isSticky ? ` ${applyModifiers(handles.cgHeader, 'compact')}` : ''}`}
      >
        <h1 className={handles.cgTitle}>{labels.title}</h1>
        <p className={handles.cgSubtitle}>{labels.subtitle}</p>
        <div className={handles.cgNavButtons}>
          {canEdit && createButton(false)}
        </div>

        <div className={handles.cgCompactSearchBar}>
          <div className={handles.cgCompactSearchInput}>
            <input
              type="text"
              className={handles.cgSearchInput}
              placeholder={labels.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {resultsCount}
          </div>
          {canEdit && createButton(true)}
        </div>
      </header>

      <div
        className={`${handles.cgSearchContainer}${isSticky ? ` ${applyModifiers(handles.cgSearchContainer, 'hidden')}` : ''}`}
      >
        <input
          type="text"
          className={handles.cgSearchInput}
          placeholder={labels.searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {resultsCount}
      </div>

      <div className={handles.cgGrid}>
        {loading ? (
          <div className={handles.cgGridLoading}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={handles.cgGridSkeleton} />
            ))}
          </div>
        ) : (
          filtered.map((entity) => (
            <DrawerController key={entity.slug}>
              {renderCard({
                entity,
                onClick: handleViewClick,
                onEdit: handleEditClick,
                onDelete: handleDeleteClick,
                onEditInNewTab: handleEditInNewTabClick,
              })}
            </DrawerController>
          ))
        )}
        {!loading && filtered.length === 0 && (
          <div className={handles.cgEmptyState}>{labels.emptyState}</div>
        )}
      </div>

      <Drawer>
        <DrawerHeader />
        <DrawerContent>
          {selected && !activeTab && !directEdit && renderData(selected)}
        </DrawerContent>
      </Drawer>

      {/* Edição direta (clique em editar, sem abrir aba) */}
      <Modal
        isOpen={isDirectModalOpen && !!directEdit}
        onClose={handleDirectModalClose}
        title={`Editando: ${directEdit?.name || ''}`}
        sectionRail
      >
        {directEdit &&
          renderForm({
            entity: directEdit,
            mode: 'edit',
            onClose: handleDirectModalClose,
          })}
      </Modal>

      {/* Edição por aba */}
      <Modal
        isOpen={!!activeTab}
        onClose={handleTabModalClose}
        title={activeTab?.label || 'Formulário'}
        sectionRail
      >
        {activeTab &&
          renderForm({
            mode: activeTab.mode,
            externalFormData: activeTab.formData,
            onFormDataChange: handleTabFormDataChange,
            onClose: handleTabModalClose,
          })}
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleConfirmDelete}
        title={labels.deleteTitle}
        message={labels.deleteMessage(deleteTarget?.name ?? '')}
        confirmLabel="Sim, Excluir"
        cancelLabel="Cancelar"
      />
    </div>
  );
};

export default EntityGrid;
