'use client';

import { useState, useRef, useEffect } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';

interface IUseEntityCardMenuParams<T> {
  hasSource: boolean;
  onEdit?: (entity: T) => void;
  onDelete?: (entity: T) => void;
}

/**
 * Shared card-menu logic for entity cards (CreatureCard, CitizenCard, ...):
 * image-error/hasImage state, the open/close context-menu system (outside
 * click + Escape to close), the right-click context-menu position, and the
 * edit/delete click handlers. Generic over the entity type `T` so each card
 * can call it with its own domain type. `hasSource` is the caller's own
 * `!!entity.image` check — the hook itself doesn't know the entity shape.
 */
export const useEntityCardMenu = <T>({
  hasSource,
  onEdit,
  onDelete,
}: IUseEntityCardMenuParams<T>) => {
  const [imageError, setImageError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [contextMenuPos, setContextMenuPos] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const hasImage = hasSource && !imageError;

  const handleEditClick = (e: ReactMouseEvent, entity: T) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(false);
    if (onEdit) {
      onEdit(entity);
    }
  };

  const handleDeleteClick = (e: ReactMouseEvent, entity: T) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(false);
    if (onDelete) {
      onDelete(entity);
    }
  };

  const handleMenuToggle = (e: ReactMouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [menuOpen]);

  const handleContextMenu = (e: ReactMouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
  };

  return {
    imageError,
    setImageError,
    hasImage,
    menuOpen,
    menuRef,
    handleMenuToggle,
    cardRef,
    contextMenuPos,
    setContextMenuPos,
    handleContextMenu,
    handleEditClick,
    handleDeleteClick,
  };
};
