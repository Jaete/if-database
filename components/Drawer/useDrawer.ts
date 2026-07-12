'use client';

import { useEffect, useState } from 'react';

export const useDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    window.addEventListener('drawer:open', handleOpen);
    window.addEventListener('drawer:close', handleClose);

    return () => {
      window.removeEventListener('drawer:open', handleOpen);
      window.removeEventListener('drawer:close', handleClose);
    };
  }, []);

  const handleClose = () => setIsOpen(false);

  return { isOpen, handleClose };
};
