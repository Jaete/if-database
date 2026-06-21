'use client';

import { useEffect, useRef, useMemo, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { useCssHandles, applyModifiers } from '@/hooks/useCssHandles';
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

const ITEM_HEIGHT = 36;
const MENU_PADDING = 8;
const MIN_WIDTH = 180;
const MAX_WIDTH = 260;
const EDGE_MARGIN = 8;

function clampPosition(
  pos: { x: number; y: number },
  itemCount: number
): { x: number; y: number } {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const estWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, vw * 0.2));
  const estHeight = itemCount * ITEM_HEIGHT + MENU_PADDING * 2;

  let { x, y } = pos;
  if (x + estWidth > vw) x = vw - estWidth - EDGE_MARGIN;
  if (y + estHeight > vh) y = vh - estHeight - EDGE_MARGIN;
  if (x < 0) x = EDGE_MARGIN;
  if (y < 0) y = EDGE_MARGIN;
  return { x, y };
}

const ContextMenu = ({ items, position, onClose }: IProps) => {
  const handles = useCssHandles(ContextMenuHandles);
  const menuRef = useRef<HTMLDivElement>(null);

  const adjustedPos = useMemo(
    () => clampPosition(position, items.length),
    [position, items.length]
  );

  // Close on click outside / Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

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
