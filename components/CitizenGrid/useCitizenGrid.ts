'use client';

import { useState, useMemo, useEffect, useRef } from 'react';

import type ICitizen from '@/db/citizens/citizen.d';
import {
  citizenToFormData,
  emptyCitizen,
  type FormDataType,
} from '../CitizenEditForm';
import { useCitizens } from '@/app/context/CitizensContext';
import { useAuth } from '@/app/context/AuthContext';
import { useTabs } from '@/app/context/TabContext';

export const useCitizenGrid = () => {
  const { citizens, loading, erase } = useCitizens();
  const { canEdit } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCitizen, setSelectedCitizen] = useState<ICitizen | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ICitizen | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { activeTab, openTab, openTabSilently, closeTab, updateTabFormData } =
    useTabs<FormDataType>();
  const [directEditCitizen, setDirectEditCitizen] = useState<ICitizen | null>(
    null
  );
  const [isDirectModalOpen, setIsDirectModalOpen] = useState(false);

  const filteredCitizens = useMemo(() => {
    return citizens.filter((citizen) =>
      citizen.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [citizens, searchTerm]);

  useEffect(() => {
    const handleClose = () => {
      if (!activeTab) {
        setSelectedCitizen(null);
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

  const handleEditClick = (citizen: ICitizen) => {
    setDirectEditCitizen(citizen);
    setIsDirectModalOpen(true);
  };

  const handleEditInNewTabClick = (citizen: ICitizen) => {
    openTabSilently({
      mode: 'edit',
      slug: citizen.slug,
      label: `Editando: ${citizen.name}`,
      formData: citizenToFormData(citizen),
    });
  };

  const handleCreateClick = () => {
    openTab({
      mode: 'create',
      label: 'Novo Cidadão',
      formData: emptyCitizen,
    });
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

  const handleDirectModalClose = () => {
    setIsDirectModalOpen(false);
    setDirectEditCitizen(null);
  };

  const handleTabModalClose = () => {
    if (activeTab) closeTab(activeTab.id);
  };

  const handleTabFormDataChange = (data: FormDataType) => {
    if (activeTab) updateTabFormData(activeTab.id, data);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  return {
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
  };
};
