import { useState, useRef, useEffect } from 'react';

import type ICreature from '@/db/creatures/creatures.d';
import { useCssHandles, applyModifiers } from '@/hooks/useCssHandles';
import { useAuth } from '@/app/context/AuthContext';
import ContextMenu, { type IContextMenuItem } from '../ContextMenu';

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
  const { canEdit } = useAuth();
  const [imageError, setImageError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const hasImage = !!creature.image && !imageError;
  const menuRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [contextMenuPos, setContextMenuPos] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const handleEditClick = (e: React.MouseEvent, creature: ICreature) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(false);
    if (onEdit) {
      onEdit(creature);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, creature: ICreature) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(false);
    if (onDelete) {
      onDelete(creature);
    }
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
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

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
  };

  const contextMenuItems: IContextMenuItem[] = [
    {
      label: 'Visualizar',
      icon: (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
      onClick: () => {
        window.dispatchEvent(new CustomEvent('drawer:open', { bubbles: true }));
        onClick(creature);
      },
    },
    {
      label: 'Editar',
      icon: (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      ),
      onClick: () => onEdit?.(creature),
      disabled: !canEdit,
    },
    {
      label: 'Editar em nova aba',
      icon: (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      ),
      onClick: () => onEditInNewTab?.(creature),
      disabled: !canEdit,
    },
  ];

  return (
    <div
      ref={cardRef}
      className={handles.mcCard}
      onClick={() => onClick(creature)}
      onContextMenu={canEdit ? handleContextMenu : undefined}
    >
      <div
        className={`${handles.mcCardImage}${!hasImage ? ` ${applyModifiers(handles.mcCardImage, 'placeholder')}` : ''}`}
      >
        {hasImage ? (
          <img
            src={creature.image!}
            alt={creature.name}
            style={{
              display: 'block',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            onError={() => setImageError(true)}
          />
        ) : null}
        <div className={handles.mcCardImageOverlay} />
      </div>
      <div className={handles.mcCardInfo}>
        {canEdit && (
          <div
            ref={menuRef}
            className={handles.mcMenuButton}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={handles.mcMenuDots}
              onClick={handleMenuToggle}
              aria-label="Opções da criatura"
              aria-expanded={menuOpen}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <circle cx="12" cy="5" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="12" cy="19" r="2" />
              </svg>
            </button>
            {menuOpen && (
              <div className={handles.mcDropdown}>
                <button
                  className={`${handles.mcDropdownItem} ${handles.mcDropdownItemDelete}`}
                  onClick={(e) => handleDeleteClick(e, creature)}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                  Excluir
                </button>
              </div>
            )}
          </div>
        )}
        <div className={handles.mcCardRarity}>{creature.rarity}</div>
        <h3 className={handles.mcCardName}>{creature.name}</h3>
        {canEdit && (
          <button
            className={handles.mcCardButton}
            onClick={(e) => handleEditClick(e, creature)}
          >
            <svg
              className={handles.mcCardButtonIcon}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
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
