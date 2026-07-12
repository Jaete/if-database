'use client';

import type ICitizen from '@/db/citizens/citizen.d';
import { useCssHandles, applyModifiers } from '@/hooks/useCssHandles';
import { useAuth } from '@/app/context/AuthContext';
import { useCitizenCard } from './useCitizenCard';
import ContextMenu, { type IContextMenuItem } from '../ContextMenu';
import {
  DotsVerticalIcon,
  ExternalLinkIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from '../Icons';

import CitizenCardHandles from './handles';
import '@/styles/components/citizenCard.scss';

interface IProps {
  citizen: ICitizen;
  onClick: (citizen: ICitizen) => void;
  onEdit?: (citizen: ICitizen) => void;
  onDelete?: (citizen: ICitizen) => void;
  onEditInNewTab?: (citizen: ICitizen) => void;
}

const CitizenCard = ({
  citizen,
  onClick,
  onEdit,
  onDelete,
  onEditInNewTab,
}: IProps) => {
  const handles = useCssHandles(CitizenCardHandles);
  const { canEdit } = useAuth();
  const {
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
  } = useCitizenCard({ citizen, onEdit, onDelete });

  const contextMenuItems: IContextMenuItem[] = [
    {
      label: 'Visualizar',
      icon: <EyeIcon />,
      onClick: () => {
        window.dispatchEvent(new CustomEvent('drawer:open', { bubbles: true }));
        onClick(citizen);
      },
    },
    {
      label: 'Editar',
      icon: <PencilIcon />,
      onClick: () => onEdit?.(citizen),
      disabled: !canEdit,
    },
    {
      label: 'Editar em nova aba',
      icon: <ExternalLinkIcon />,
      onClick: () => onEditInNewTab?.(citizen),
      disabled: !canEdit,
    },
  ];

  return (
    <div
      ref={cardRef}
      className={handles.ccCard}
      onClick={() => onClick(citizen)}
      onContextMenu={canEdit ? handleContextMenu : undefined}
    >
      <div
        className={`${handles.ccCardImage}${!hasImage ? ` ${applyModifiers(handles.ccCardImage, 'placeholder')}` : ''}`}
      >
        {hasImage ? (
          <img
            src={citizen.image!}
            alt={citizen.name}
            className={handles.ccCardImg}
            onError={() => setImageError(true)}
          />
        ) : null}
        <div className={handles.ccCardImageOverlay} />
      </div>
      <div className={handles.ccCardInfo}>
        <div className={handles.ccCardSubtitle}>{subtitle}</div>
        <h3 className={handles.ccCardName}>{citizen.name}</h3>
        <div className={handles.ccCardActions}>
          {canEdit && (
            <button
              className={handles.ccCardButton}
              onClick={(e) => handleEditClick(e, citizen)}
            >
              <PencilIcon className={handles.ccCardButtonIcon} />
              EDITAR
            </button>
          )}
          {canEdit && (
            <div
              ref={menuRef}
              className={handles.ccMenuButton}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={handles.ccMenuDots}
                onClick={handleMenuToggle}
                aria-label="Opções do cidadão"
                aria-expanded={menuOpen}
              >
                <DotsVerticalIcon />
              </button>
              {menuOpen && (
                <div className={handles.ccDropdown}>
                  <button
                    className={`${handles.ccDropdownItem} ${handles.ccDropdownItemDelete}`}
                    onClick={(e) => handleDeleteClick(e, citizen)}
                  >
                    <TrashIcon />
                    Excluir
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
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

export default CitizenCard;
