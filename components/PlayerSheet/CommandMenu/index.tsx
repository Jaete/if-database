'use client';

import type { KeyboardEvent, MouseEvent, Ref } from 'react';
import type { IPublicPlayer } from '@/db/players/publicFields';
import { CoinIcon } from '../../Icons';
import { useCssHandles } from '@/hooks/useCssHandles';
import { DASH, formatNumber, tabId } from '../sheetData';
import type { IMenuItem } from '../sheetData';
import CommandMenuHandles from './handles';

interface IProps {
  player: IPublicPlayer;
  uid: string;
  panelId: string;
  items: IMenuItem[];
  active: number;
  cursorAt: number;
  menuRef: Ref<HTMLDivElement>;
  cursorRef: Ref<HTMLDivElement>;
  registerItem: (index: number) => (el: HTMLButtonElement | null) => void;
  onClick: (e: MouseEvent<HTMLDivElement>) => void;
  onHover: (e: MouseEvent<HTMLDivElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void;
}

const CommandMenu = ({
  player,
  uid,
  panelId,
  items,
  active,
  cursorAt,
  menuRef,
  cursorRef,
  registerItem,
  onClick,
  onHover,
  onKeyDown,
}: IProps) => {
  const handles = useCssHandles(CommandMenuHandles);
  const gil = player.equipment?.gil;
  const deity = player.deity?.split(',')[0]?.trim();

  return (
    <nav className={handles.sheetRail} aria-label="Seções da ficha">
      <div
        ref={menuRef}
        className={handles.sheetMenu}
        role="tablist"
        aria-orientation="vertical"
        onClick={onClick}
        onMouseOver={onHover}
        onKeyDown={onKeyDown}
      >
        {items.map((item, i) => (
          <button
            key={item.id}
            ref={registerItem(i)}
            type="button"
            role="tab"
            id={tabId(uid, item.id)}
            data-i={i}
            className={`${handles.sheetMenuItem}${
              i === cursorAt ? ` ${handles.sheetMenuItem}--cursor` : ''
            }`}
            aria-selected={i === active}
            aria-controls={panelId}
            aria-disabled={item.disabled || undefined}
            tabIndex={i === cursorAt ? 0 : -1}
          >
            <span className={handles.sheetMenuLabel}>{item.label}</span>
            <span className={handles.sheetMenuMeta}>{item.meta}</span>
            <span className={handles.sheetMenuDesc}>{item.desc}</span>
          </button>
        ))}
      </div>
      <div ref={cursorRef} className={handles.sheetCursor} aria-hidden="true">
        <span>◆</span>
      </div>
      <div className={handles.sheetRailFoot}>
        <div>
          <div className={handles.sheetRailKey}>Gil</div>
          <div
            className={`${handles.sheetRailValue} ${handles.sheetRailValue}--gil`}
          >
            <CoinIcon />
            {gil !== undefined ? formatNumber(gil) : DASH}
          </div>
        </div>
        <div>
          <div className={handles.sheetRailKey}>Adoração</div>
          <div
            className={`${handles.sheetRailValue} ${handles.sheetRailValue}--text`}
          >
            {deity || DASH}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default CommandMenu;
