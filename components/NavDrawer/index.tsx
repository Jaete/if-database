'use client';

import Link from 'next/link';

import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import { NAV_ITEMS, useNavDrawer } from './useNavDrawer';
import Drawer from '../Drawer';
import { ChevronRightIcon, CloseIcon, LogOutIcon, UserIcon } from '../Icons';
import NavDrawerHandles from './handles';
import '@/styles/components/navDrawer.scss';

const NavDrawer = () => {
  const handles = useCssHandles(NavDrawerHandles);
  const { user, isActive, closeDrawer, handleLogout, isLoggingOut } =
    useNavDrawer();

  // The shared DrawerHeader/DrawerContent pair is skipped on purpose: this drawer
  // needs edge-to-edge rows and a footer pinned to the bottom, which their own
  // padding works against.
  return (
    <Drawer side="left" eventKey="nav-drawer" id="nav-drawer">
      <div className={handles.navDrawerHeader}>
        <span className={handles.navDrawerBrand}>Isekai Fantasy</span>
        <button
          type="button"
          className={handles.navDrawerClose}
          onClick={closeDrawer}
          aria-label="Fechar menu"
        >
          <CloseIcon />
        </button>
      </div>

      <nav className={handles.navDrawerNav}>
        {NAV_ITEMS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            prefetch={false}
            onClick={closeDrawer}
            aria-current={isActive(href) ? 'page' : undefined}
            className={`${handles.navItem}${
              isActive(href)
                ? ` ${applyModifiers(handles.navItem, 'active')}`
                : ''
            }`}
          >
            <span className={handles.navItemLabel}>{label}</span>
            <ChevronRightIcon className={handles.navItemChevron} />
          </Link>
        ))}
      </nav>

      <div className={handles.navDrawerFooter}>
        <div className={handles.navAccount}>
          {user?.avatarUrl ? (
            // Hospedado no CDN do fórum, fora do next/image por ser um host
            // externo que não vale configurar em remotePatterns para um ícone.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatarUrl}
              alt=""
              className={handles.navAccountAvatar}
              loading="lazy"
            />
          ) : (
            <UserIcon className={handles.navAccountIcon} />
          )}
          <span className={handles.navAccountText}>
            <span className={handles.navAccountName}>
              {user?.username ?? '—'}
            </span>
            <span className={handles.navAccountMeta}>
              {[user?.role, user?.provider].filter(Boolean).join(' · ')}
            </span>
          </span>
        </div>

        <button
          type="button"
          className={handles.navLogout}
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOutIcon className={handles.navLogoutIcon} />
          {isLoggingOut ? 'Saindo...' : 'Sair'}
        </button>
      </div>
    </Drawer>
  );
};

export default NavDrawer;
