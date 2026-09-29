'use client';

import { useState, useMemo, useEffect, useRef } from 'react';

import type ICreature from '@/db/creatures/creatures.d';
import { emptyMonster, type IFormData } from '../CreatureEditForm';
import { useMonsters } from '@/app/context/MonstersContext';
import { useAuth } from '@/app/context/AuthContext';
import { useTabs } from '@/app/context/TabContext';

const PAGE_SIZE = 12;

export const useCreatureGrid = () => {
  const { monsters, loading, erase, getFull, prefetch } = useMonsters();
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
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [countedTerm, setCountedTerm] = useState(searchTerm);

  // A new search starts a new list, so go back to a single page of results.
  if (countedTerm !== searchTerm) {
    setCountedTerm(searchTerm);
    setVisibleCount(PAGE_SIZE);
  }

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

  const visibleCreatures = useMemo(
    () => filteredCreatures.slice(0, visibleCount),
    [filteredCreatures, visibleCount]
  );

  const hasMore = visibleCount < filteredCreatures.length;

  // Warm the full documents for what is on screen, so opening the drawer or
  // the edit form does not wait on a request.
  useEffect(() => {
    prefetch(visibleCreatures.map((creature) => creature.slug));
  }, [visibleCreatures, prefetch]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((count) => count + PAGE_SIZE);
        }
      },
      { rootMargin: '400px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore]);

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

  const handleEditClick = async (creature: ICreature) => {
    const complete = (await getFull(creature.slug)) ?? creature;
    setDirectEditCreature(complete);
    setIsDirectModalOpen(true);
  };

  const handleEditInNewTabClick = async (creature: ICreature) => {
    const complete = (await getFull(creature.slug)) ?? creature;
    openTabSilently({
      mode: 'edit',
      slug: complete.slug,
      label: `Editando: ${complete.name}`,
      formData: complete as IFormData,
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

  const handleViewClick = async (creature: ICreature) => {
    setSelectedCreature((await getFull(creature.slug)) ?? creature);
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
  };
};
