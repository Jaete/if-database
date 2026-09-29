'use client';

import { useEffect, useState } from 'react';

export const useDrawer = (eventKey: string = 'drawer') => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    window.addEventListener(`${eventKey}:open`, handleOpen);
    window.addEventListener(`${eventKey}:close`, handleClose);

    return () => {
      window.removeEventListener(`${eventKey}:open`, handleOpen);
      window.removeEventListener(`${eventKey}:close`, handleClose);
    };
  }, [eventKey]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleClose = () => setIsOpen(false);

  return { isOpen, handleClose };
};
