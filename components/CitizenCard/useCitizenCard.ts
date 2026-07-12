'use client';

import type ICitizen from '@/db/citizens/citizen.d';
import { useEntityCardMenu } from '../useEntityCardMenu';

interface IUseCitizenCardParams {
  citizen: ICitizen;
  onEdit?: (citizen: ICitizen) => void;
  onDelete?: (citizen: ICitizen) => void;
}

export const useCitizenCard = ({
  citizen,
  onEdit,
  onDelete,
}: IUseCitizenCardParams) => {
  const {
    imageError,
    setImageError,
    menuOpen,
    menuRef,
    cardRef,
    hasImage,
    contextMenuPos,
    setContextMenuPos,
    handleEditClick,
    handleDeleteClick,
    handleMenuToggle,
    handleContextMenu,
  } = useEntityCardMenu<ICitizen>({
    hasSource: !!citizen.image,
    onEdit,
    onDelete,
  });

  const subtitle = [citizen.race, citizen.class].filter(Boolean).join(' · ');

  return {
    imageError,
    setImageError,
    menuOpen,
    hasImage,
    menuRef,
    cardRef,
    contextMenuPos,
    setContextMenuPos,
    handleEditClick,
    handleDeleteClick,
    handleMenuToggle,
    handleContextMenu,
    subtitle,
  };
};
