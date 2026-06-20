'use client';

import { useState, useMemo, useEffect, useRef } from 'react';

import type ICitizen from '@/db/citizens/citizen.d';
import { useCssHandles, applyModifiers } from '@/hooks/useCssHandles';
import CitizenCard from '../CitizenCard';
import CreatureDrawer from '../CreatureDrawer';
import Modal from '../Modal';
import CitizenEditForm from '../CitizenEditForm';
import ConfirmModal from '../ConfirmModal';
import CitizenGridHandles from './handles';
import '@/styles/components/citizenGrid.scss';
import DrawerController from '../CreatureDrawer/sections/DrawerController';
import DrawerHeader from '../CreatureDrawer/sections/DrawerHeader';
import DrawerContent from '../CreatureDrawer/sections/DrawerContent';
import CitizenData from '../CitizenDrawer/CitizenData';
import { useCitizens } from '@/app/context/CitizensContext';
import { useAuth } from '@/app/context/AuthContext';

const CitizenGrid = () => {
  const { citizens, loading, erase } = useCitizens();
  const { canEdit } = useAuth();
  const handles = useCssHandles(CitizenGridHandles);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCitizen, setSelectedCitizen] = useState<ICitizen | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ICitizen | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const filteredCitizens = useMemo(() => {
    return citizens.filter((citizen) =>
      citizen.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [citizens, searchTerm]);

  useEffect(() => {
    const handleClose = () => {
      if (!isEditModalOpen) {
        setSelectedCitizen(null);
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

  const handleEditClick = (citizen: ICitizen) => {
    setSelectedCitizen(citizen);
    setIsEditModalOpen(true);
  };

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleViewClick = (citizen: ICitizen) => {
    setSelectedCitizen(citizen);
  };

  const handleDeleteClick = (citizen: ICitizen) => {
    setDeleteTarget(citizen);
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
              />
            </DrawerController>
          ))
        )}
        {!loading && filteredCitizens.length === 0 && (
          <div className={handles.cgEmptyState}>Nenhum cidadão encontrado.</div>
        )}
      </div>

      <CreatureDrawer>
        <DrawerHeader />
        <DrawerContent>
          {selectedCitizen && !isEditModalOpen && (
            <CitizenData citizen={selectedCitizen} />
          )}
        </DrawerContent>
      </CreatureDrawer>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCitizen(null);
        }}
        title={
          selectedCitizen
            ? `Editando: ${selectedCitizen.name}`
            : 'Editar Cidadão'
        }
      >
        {selectedCitizen && (
          <CitizenEditForm
            citizen={selectedCitizen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedCitizen(null);
            }}
          />
        )}
      </Modal>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Criar Novo Cidadão"
      >
        <CitizenEditForm
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
