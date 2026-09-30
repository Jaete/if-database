'use client';

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import type { IPublicPlayer } from '@/db/players/publicFields';
import { buildMenu } from './sheetData';

export type SheetView = 'menu' | 'screen';
export type Transition = 'none' | 'enter' | 'enterBack';

// Keep in sync with the compact container breakpoint in playerSheet.scss.
const COMPACT_MAX_WIDTH = 560;

export const usePlayerSheet = (player: IPublicPlayer) => {
  const uid = useId();
  const menu = buildMenu(player);
  const count = menu.length;

  const [active, setActive] = useState(0);
  const [cursorAt, setCursorAt] = useState(0);
  const [view, setView] = useState<SheetView>('menu');
  const [transition, setTransition] = useState<Transition>('none');
  const [screenSeq, setScreenSeq] = useState(0);
  const [focusSeq, setFocusSeq] = useState(0);
  const [message, setMessage] = useState('');
  const [isCompact, setIsCompact] = useState(false);

  const sheetRef = useRef<HTMLElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const focusTarget = useRef<'none' | 'menu' | 'panel'>('none');

  const registerItem = useCallback(
    (index: number) => (el: HTMLButtonElement | null) => {
      itemRefs.current[index] = el;
    },
    []
  );

  // The sheet switches to the drill-down list by its own width, not the
  // viewport's: inside a 700px iframe the viewport is always "mobile".
  useEffect(() => {
    const el = sheetRef.current;
    if (!el) return;
    let last: boolean | null = null;
    const observer = new ResizeObserver(() => {
      const compact = el.clientWidth < COMPACT_MAX_WIDTH;
      if (compact === last) return;
      last = compact;
      setIsCompact(compact);
      setView('menu');
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // The ◆ cursor is positioned from the real item geometry.
  useLayoutEffect(() => {
    const place = () => {
      const item = itemRefs.current[cursorAt];
      const cursor = cursorRef.current;
      const list = menuRef.current;
      if (!item || !cursor || !list) return;
      cursor.style.height = `${item.offsetHeight}px`;
      cursor.style.transform = `translateY(${item.offsetTop + list.offsetTop}px)`;
    };
    place();
    window.addEventListener('resize', place);
    document.fonts?.ready.then(place);
    return () => window.removeEventListener('resize', place);
  }, [cursorAt, isCompact, view]);

  // Focus moves only after the DOM it targets is on screen.
  useEffect(() => {
    const target = focusTarget.current;
    focusTarget.current = 'none';
    if (target === 'menu') {
      itemRefs.current[cursorAt]?.focus();
    } else if (target === 'panel') {
      const panel = panelRef.current;
      const back = panel?.querySelector<HTMLElement>('[data-back]');
      const screen = panel?.querySelector<HTMLElement>('[role="tabpanel"]');
      (isCompact && back ? back : screen)?.focus({ preventScroll: true });
    }
  }, [focusSeq, cursorAt, isCompact]);

  const moveCursor = useCallback((index: number, focus = true) => {
    setCursorAt(index);
    if (focus) itemRefs.current[index]?.focus();
  }, []);

  const open = useCallback(
    (index: number, focusPanel = false) => {
      const item = menu[index];
      if (item.disabled) {
        setMessage(`${player.name.split(' ')[0]} não conjura magias.`);
        return;
      }
      setTransition(index >= active ? 'enter' : 'enterBack');
      setActive(index);
      setScreenSeq((n) => n + 1);
      setView('screen');
      setMessage('');
      if (focusPanel || isCompact) {
        focusTarget.current = 'panel';
        setFocusSeq((n) => n + 1);
      }
    },
    [menu, active, isCompact, player.name]
  );

  const backToMenu = useCallback(() => {
    setCursorAt(active);
    setView('menu');
    focusTarget.current = 'menu';
    setFocusSeq((n) => n + 1);
  }, [active]);

  const handleMenuClick = (e: MouseEvent<HTMLDivElement>) => {
    const button = (e.target as HTMLElement).closest<HTMLElement>('[data-i]');
    if (!button) return;
    const index = Number(button.dataset.i);
    setCursorAt(index);
    open(index);
  };

  const handleMenuHover = (e: MouseEvent<HTMLDivElement>) => {
    if (isCompact) return;
    const button = (e.target as HTMLElement).closest<HTMLElement>('[data-i]');
    if (!button) return;
    const index = Number(button.dataset.i);
    if (index !== cursorAt) setCursorAt(index);
  };

  const handleMenuKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        moveCursor((cursorAt + 1) % count);
        break;
      case 'ArrowUp':
        e.preventDefault();
        moveCursor((cursorAt - 1 + count) % count);
        break;
      case 'Home':
        e.preventDefault();
        moveCursor(0);
        break;
      case 'End':
        e.preventDefault();
        moveCursor(count - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        open(cursorAt);
        break;
      case 'ArrowRight':
        e.preventDefault();
        open(cursorAt, true);
        break;
    }
  };

  const handlePanelKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const list = target.closest<HTMLElement>('[data-listnav]');

    if (e.key === 'Escape' || (e.key === 'ArrowLeft' && !list)) {
      e.preventDefault();
      backToMenu();
      return;
    }

    if (
      list &&
      ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(e.key)
    ) {
      const options = [...list.querySelectorAll<HTMLElement>('[data-opt]')];
      const at = options.indexOf(target);
      if (at < 0) return;
      e.preventDefault();
      const step = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1;
      options[(at + step + options.length) % options.length].focus();
    }
  };

  return {
    uid,
    menu,
    active,
    cursorAt,
    view,
    transition,
    screenSeq,
    message,
    isCompact,
    sheetRef,
    menuRef,
    cursorRef,
    panelRef,
    registerItem,
    backToMenu,
    handleMenuClick,
    handleMenuHover,
    handleMenuKeyDown,
    handlePanelKeyDown,
  };
};
