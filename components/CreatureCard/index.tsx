import { useState, useRef, useEffect } from 'react';

import type ICreature from '@/db/creatures/creatures.d';
import { useCssHandles, applyModifiers } from '@/hooks/useCssHandles';
import { useAuth } from '@/app/context/AuthContext';

import CreatureCardHandles from './handles';
import '@/styles/components/creatureCard.scss';

interface IProps {
  creature: ICreature;
  onClick: (creature: ICreature) => void;
  onEdit?: (creature: ICreature) => void;
  onDelete?: (creature: ICreature) => void;
}

const CreatureCard = ({ creature, onClick, onEdit, onDelete }: IProps) => {
  const handles = useCssHandles(CreatureCardHandles);
  const { canEdit } = useAuth();
  const [imageError, setImageError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const hasImage = !!creature.image && !imageError;
  const menuRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className={handles.card} onClick={() => onClick(creature)}>
      <div
        className={`${handles.cardImage}${!hasImage ? ` ${applyModifiers(handles.cardImage, 'placeholder')}` : ''}`}
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
        <div className={handles.cardImageOverlay} />
      </div>
      <div className={handles.cardInfo}>
        {canEdit && (
          <div
            ref={menuRef}
            className={handles.menuButton}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={handles.menuDots}
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
              <div className={handles.dropdown}>
                <button
                  className={`${handles.dropdownItem} ${handles.dropdownItemDelete}`}
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
        <div className={handles.cardRarity}>{creature.rarity}</div>
        <h3 className={handles.cardName}>{creature.name}</h3>
        {canEdit && (
          <button
            className={handles.cardButton}
            onClick={(e) => handleEditClick(e, creature)}
          >
            <svg
              className={handles.cardButtonIcon}
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
    </div>
  );
};

export default CreatureCard;
