'use client';

import type ICreature from '@/db/creatures/creatures.d';
import { useCssHandles, applyModifiers } from '@/hooks/useCssHandles';
import { useCreatureCard } from './useCreatureCard';
import ContextMenu, { type IContextMenuItem } from '../ContextMenu';
import {
  DotsVerticalIcon,
  ExternalLinkIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from '../Icons';

import CreatureCardHandles from './handles';
import '@/styles/components/creatureCard.scss';

interface IProps {
  creature: ICreature;
  onClick: (creature: ICreature) => void;
  onEdit?: (creature: ICreature) => void;
  onDelete?: (creature: ICreature) => void;
  onEditInNewTab?: (creature: ICreature) => void;
}

const CreatureCard = ({
  creature,
  onClick,
  onEdit,
  onDelete,
  onEditInNewTab,
}: IProps) => {
  const handles = useCssHandles(CreatureCardHandles);
  const {
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
  } = useCreatureCard({ creature, onEdit, onDelete });

  const contextMenuItems: IContextMenuItem[] = [
    {
      label: 'Visualizar',
      icon: <EyeIcon />,
      onClick: () => {
        window.dispatchEvent(new CustomEvent('drawer:open', { bubbles: true }));
        onClick(creature);
      },
    },
    {
      label: 'Editar',
      icon: <PencilIcon />,
      onClick: () => onEdit?.(creature),
      disabled: !canEdit,
    },
    {
      label: 'Editar em nova aba',
      icon: <ExternalLinkIcon />,
      onClick: () => onEditInNewTab?.(creature),
      disabled: !canEdit,
    },
  ];

  return (
    <div
      ref={cardRef}
      className={handles.creatureCard}
      onClick={() => onClick(creature)}
      onContextMenu={canEdit ? handleContextMenu : undefined}
    >
      <div
        className={`${handles.creatureCardImage}${!hasImage ? ` ${applyModifiers(handles.creatureCardImage, 'placeholder')}` : ''}`}
      >
        {hasImage ? (
          <img
            src={creature.image!}
            alt={creature.name}
            className={handles.creatureCardImg}
            onError={() => setImageError(true)}
          />
        ) : null}
        <div className={handles.creatureCardImageOverlay} />
      </div>
      <div className={handles.creatureCardInfo}>
        {canEdit && (
          <div
            ref={menuRef}
            className={handles.creatureCardMenuButton}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={handles.creatureCardMenuDots}
              onClick={handleMenuToggle}
              aria-label="Opções da criatura"
              aria-expanded={menuOpen}
            >
              <DotsVerticalIcon />
            </button>
            {menuOpen && (
              <div className={handles.creatureCardDropdown}>
                <button
                  className={`${handles.creatureCardDropdownItem} ${handles.creatureCardDropdownItemDelete}`}
                  onClick={(e) => handleDeleteClick(e, creature)}
                >
                  <TrashIcon />
                  Excluir
                </button>
              </div>
            )}
          </div>
        )}
        <div className={handles.creatureCardRarity}>{creature.rarity}</div>
        <h3 className={handles.creatureCardName}>{creature.name}</h3>
        {canEdit && (
          <button
            className={handles.creatureCardButton}
            onClick={(e) => handleEditClick(e, creature)}
          >
            <PencilIcon className={handles.creatureCardButtonIcon} />
            EDITAR
          </button>
        )}
      </div>

      {contextMenuPos && (
        <ContextMenu
          items={contextMenuItems}
          position={contextMenuPos}
          onClose={() => setContextMenuPos(null)}
        />
      )}
    </div>
  );
};

export default CreatureCard;
