'use client';

import { usePathname } from 'next/navigation';

import { useCssHandles } from '@/hooks/useCssHandles';
import { MenuIcon } from '../Icons';
import NavDrawerToggleHandles from './handles';
import '@/styles/components/navDrawerToggle.scss';

const NavDrawerToggle = () => {
  const handles = useCssHandles(NavDrawerToggleHandles);
  const pathname = usePathname();

  // The root screen is the MainMenu itself — it needs no extra nav affordance.
  if (pathname === '/') return null;

  const handleOpen = () => {
    window.dispatchEvent(new CustomEvent('nav-drawer:open', { bubbles: true }));
  };

  return (
    <button
      className={handles.navToggle}
      onClick={handleOpen}
      aria-label="Abrir menu"
      aria-controls="nav-drawer"
      type="button"
    >
      <MenuIcon className={handles.navToggleIcon} />
    </button>
  );
};

export default NavDrawerToggle;
