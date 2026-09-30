'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { useAuth } from '@/app/context/AuthContext';
import { useTabs } from '@/app/context/TabContext';

/**
 * Toda a orquestração de uma tela de listagem: busca, seleção para o drawer,
 * edição direta, edição por aba, exclusão e o sentinela de cabeçalho grudado.
 *
 * Era o mesmo hook em `useCitizenGrid`, e agora serve cidadãos e jogadores.
 * `CreatureGrid` fica de fora de propósito — tem paginação e árvore de
 * evolução, e forçá-lo aqui distorceria os dois.
 */

export interface IGridEntity {
  slug: string;
  name: string;
}

interface IOptions<T extends IGridEntity, F> {
  entities: T[];
  loading: boolean;
  erase: (entity: T) => Promise<void>;
  toFormData: (entity: T) => F;
  emptyForm: F;
  // Rótulo da aba de criação, ex.: 'Novo Cidadão'.
  createTabLabel: string;
}

export const useEntityGrid = <T extends IGridEntity, F>({
  entities,
  loading,
  erase,
  toFormData,
  emptyForm,
  createTabLabel,
}: IOptions<T, F>) => {
  const { canEdit } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<T | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { activeTab, openTab, openTabSilently, closeTab, updateTabFormData } =
    useTabs<F>();
  const [directEdit, setDirectEdit] = useState<T | null>(null);
  const [isDirectModalOpen, setIsDirectModalOpen] = useState(false);

  const filtered = useMemo(
    () =>
      entities.filter((entity) =>
        entity.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [entities, searchTerm]
  );

  useEffect(() => {
    const handleClose = () => {
      if (!activeTab) setSelected(null);
    };
    window.addEventListener('drawer:close', handleClose);
    return () => window.removeEventListener('drawer:close', handleClose);
  }, [activeTab]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsSticky(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return {
    loading,
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

    handleEditClick: (entity: T) => {
      setDirectEdit(entity);
      setIsDirectModalOpen(true);
    },
    handleEditInNewTabClick: (entity: T) => {
      openTabSilently({
        mode: 'edit',
        slug: entity.slug,
        label: `Editando: ${entity.name}`,
        formData: toFormData(entity),
      });
    },
    handleCreateClick: (formData: F = emptyForm) => {
      openTab({ mode: 'create', label: createTabLabel, formData });
    },
    handleViewClick: (entity: T) => setSelected(entity),
    handleDeleteClick: (entity: T) => {
      setDeleteTarget(entity);
      setIsDeleteModalOpen(true);
    },
    handleConfirmDelete: async () => {
      if (deleteTarget) await erase(deleteTarget);
      setDeleteTarget(null);
    },
    handleDirectModalClose: () => {
      setIsDirectModalOpen(false);
      setDirectEdit(null);
    },
    handleTabModalClose: () => {
      if (activeTab) closeTab(activeTab.id);
    },
    handleTabFormDataChange: (data: F) => {
      if (activeTab) updateTabFormData(activeTab.id, data);
    },
    handleDeleteModalClose: () => {
      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
    },
  };
};
