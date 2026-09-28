'use client';

import { useCssHandles, applyModifiers } from '@/hooks/useCssHandles';
import { useCitizenGrid } from './useCitizenGrid';
import CitizenCard from '../CitizenCard';
import Drawer from '../Drawer';
import DrawerController from '../DrawerController';
import DrawerHeader from '../DrawerHeader';
import DrawerContent from '../DrawerContent';
import Modal from '../Modal';
import CitizenEditForm from '../CitizenEditForm';
import ConfirmModal from '../ConfirmModal';
import CitizenData from '../CitizenData';
import { PlusIcon } from '../Icons';
import CitizenGridHandles from './handles';
import '@/styles/components/citizenGrid.scss';

const CitizenGrid = () => {
  const handles = useCssHandles(CitizenGridHandles);
  const {
    loading,
    canEdit,
    searchTerm,
    setSearchTerm,
    selectedCitizen,
    deleteTarget,
    isDeleteModalOpen,
    isSticky,
    sentinelRef,
    activeTab,
    directEditCitizen,
    isDirectModalOpen,
    filteredCitizens,
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
  } = useCitizenGrid();

  return (
    <div
      className={`${handles.cgContainer}${!canEdit ? ` ${applyModifiers(handles.cgContainer, 'viewOnly')}` : ''}`}
    >
      <div ref={sentinelRef} className={handles.cgHeaderSentinel} />
      <header
        className={`${handles.cgHeader}${isSticky ? ` ${applyModifiers(handles.cgHeader, 'compact')}` : ''}`}
      >
        <h1 className={handles.cgTitle}>CIDADÃOS DE TERRALÉM</h1>
        <p className={handles.cgSubtitle}>
          Lista dos cidadãos, heróis e figuras do mundo.
        </p>
        <div className={handles.cgNavButtons}>
          {canEdit && (
            <button
              className={handles.cgNavButton}
              onClick={handleCreateClick}
              aria-label="Criar novo cidadão"
            >
              + CRIAR NOVO CIDADÃO
            </button>
          )}
        </div>

        <div className={handles.cgCompactSearchBar}>
          <div className={handles.cgCompactSearchInput}>
            <input
              type="text"
              className={handles.cgSearchInput}
              placeholder="Buscar cidadão pelo nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm.length > 0 && (
              <span className={handles.cgResultsCount}>
                {filteredCitizens.length} resultado
                {filteredCitizens.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          {canEdit && (
            <button
              className={handles.cgCompactActionBtn}
              onClick={handleCreateClick}
              aria-label="Criar novo cidadão"
            >
              <PlusIcon />
            </button>
          )}
        </div>
      </header>

      <div
        className={`${handles.cgSearchContainer}${isSticky ? ` ${applyModifiers(handles.cgSearchContainer, 'hidden')}` : ''}`}
      >
        <input
          type="text"
          className={handles.cgSearchInput}
          placeholder="Buscar cidadão pelo nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm.length > 0 && (
          <span className={handles.cgResultsCount}>
            {filteredCitizens.length} resultado
            {filteredCitizens.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className={handles.cgGrid}>
        {loading ? (
          <div className={handles.cgGridLoading}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={handles.cgGridSkeleton} />
            ))}
          </div>
        ) : (
          filteredCitizens.map((citizen) => (
            <DrawerController key={citizen.slug}>
              <CitizenCard
                key={citizen.slug + '--card'}
                citizen={citizen}
                onClick={handleViewClick}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                onEditInNewTab={handleEditInNewTabClick}
              />
            </DrawerController>
          ))
        )}
        {!loading && filteredCitizens.length === 0 && (
          <div className={handles.cgEmptyState}>Nenhum cidadão encontrado.</div>
        )}
      </div>

      <Drawer>
        <DrawerHeader />
        <DrawerContent>
          {selectedCitizen && !activeTab && !directEditCitizen && (
            <CitizenData citizen={selectedCitizen} />
          )}
        </DrawerContent>
      </Drawer>

      {/* Direct edit modal (left-click edit, no tab) */}
      <Modal
        isOpen={isDirectModalOpen && !!directEditCitizen}
        onClose={handleDirectModalClose}
        title={`Editando: ${directEditCitizen?.name || ''}`}
      >
        {directEditCitizen && (
          <CitizenEditForm
            citizen={directEditCitizen}
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
      >
        {activeTab && (
          <CitizenEditForm
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
        title="Excluir Cidadão"
        message={
          deleteTarget
            ? `Tem certeza que deseja excluir ${deleteTarget.name}? Esta ação não pode ser desfeita.`
            : 'Tem certeza que deseja excluir este cidadão?'
        }
        confirmLabel="Sim, Excluir"
        cancelLabel="Cancelar"
      />
    </div>
  );
};

export default CitizenGrid;
