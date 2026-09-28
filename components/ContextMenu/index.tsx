'use client';

import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { useCssHandles, applyModifiers } from '@/hooks/useCssHandles';
import { useContextMenu } from './useContextMenu';
import ContextMenuHandles from './handles';
import '@/styles/components/contextMenu.scss';

export interface IContextMenuItem {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

interface IProps {
  items: IContextMenuItem[];
  position: { x: number; y: number };
  onClose: () => void;
}

const ContextMenu = ({ items, position, onClose }: IProps) => {
  const handles = useCssHandles(ContextMenuHandles);
  const { menuRef, adjustedPos } = useContextMenu(
    position,
    items.length,
    onClose
  );

  return createPortal(
    <div
      ref={menuRef}
      className={handles.contextMenu}
      style={{
        left: adjustedPos.x,
        top: adjustedPos.y,
      }}
      role="menu"
    >
      {items.map((item, index) => (
        <button
          key={index}
          type="button"
          className={
            item.disabled
              ? `${handles.contextMenuItem} ${applyModifiers(handles.contextMenuItem, 'disabled')}`
              : handles.contextMenuItem
          }
          disabled={item.disabled}
          onClick={(e) => {
            e.stopPropagation();
            if (!item.disabled) {
              item.onClick();
              onClose();
            }
          }}
          role="menuitem"
        >
          {item.icon && (
            <span className={handles.contextMenuItemIcon}>{item.icon}</span>
          )}
          <span className={handles.contextMenuItemLabel}>{item.label}</span>
        </button>
      ))}
    </div>,
    document.body
  );
};

export default ContextMenu;
