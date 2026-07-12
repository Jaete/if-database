'use client';

import { useState, useMemo, useEffect, useRef } from 'react';

import type ICreature from '@/db/creatures/creatures.d';
import { emptyMonster, type IFormData } from '../CreatureEditForm';
import { useMonsters } from '@/app/context/MonstersContext';
import { useAuth } from '@/app/context/AuthContext';
import { useTabs } from '@/app/context/TabContext';

export const useCreatureGrid = () => {
  const { monsters, loading, erase } = useMonsters();
  const { canEdit } = useAuth();
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

  const handleTreeModalClose = () => {
    setIsTreeModalOpen(false);
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

  const handleDirectModalClose = () => {
    setIsDirectModalOpen(false);
    setDirectEditCreature(null);
  };

  const handleTabModalClose = () => {
    if (activeTab) closeTab(activeTab.id);
  };

  const handleTabFormDataChange = (data: IFormData) => {
    if (activeTab) updateTabFormData(activeTab.id, data);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  return {
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
  };
};
