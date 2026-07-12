'use client';

import { useEffect, useMemo, useRef } from 'react';

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

export const useContextMenu = (
  position: { x: number; y: number },
  itemCount: number,
  onClose: () => void
) => {
  const menuRef = useRef<HTMLDivElement>(null);

  const adjustedPos = useMemo(
    () => clampPosition(position, itemCount),
    [position, itemCount]
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

  return { menuRef, adjustedPos };
};
