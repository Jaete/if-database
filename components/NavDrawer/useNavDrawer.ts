'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

import { useAuth } from '@/app/context/AuthContext';

export const NAV_ITEMS = [
  { href: '/', label: 'Início' },
  { href: '/monsters', label: 'Bestiário' },
  { href: '/citizens', label: 'Cidadãos' },
  { href: '/players', label: 'Jogadores' },
] as const;

export const useNavDrawer = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const closeDrawer = () => {
    window.dispatchEvent(
      new CustomEvent('nav-drawer:close', { bubbles: true })
    );
  };

  const isActive = (href: string) => pathname === href;

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await logout();
      closeDrawer();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return { user, isActive, closeDrawer, handleLogout, isLoggingOut };
};
