'use client';

import type ICreature from '@/db/creatures/creatures.d';
import { useAuth } from '@/app/context/AuthContext';
import { useEntityCardMenu } from '../useEntityCardMenu';

interface IUseCreatureCardParams {
  creature: ICreature;
  onEdit?: (creature: ICreature) => void;
  onDelete?: (creature: ICreature) => void;
}

export const useCreatureCard = ({
  creature,
  onEdit,
  onDelete,
}: IUseCreatureCardParams) => {
  const { canEdit } = useAuth();
  const {
    hasImage,
    setImageError,
    menuOpen,
    menuRef,
    cardRef,
    contextMenuPos,
    setContextMenuPos,
    handleEditClick,
    handleDeleteClick,
    handleMenuToggle,
    handleContextMenu,
  } = useEntityCardMenu<ICreature>({
    hasSource: !!creature.image,
    onEdit,
    onDelete,
  });

  return {
    canEdit,
    hasImage,
    setImageError,
    menuOpen,
    menuRef,
    cardRef,
    contextMenuPos,
    setContextMenuPos,
    handleEditClick,
    handleDeleteClick,
    handleMenuToggle,
    handleContextMenu,
  };
};
