'use client';

import type { KeyboardEvent, MouseEvent, Ref } from 'react';
import type { IPublicPlayer } from '@/db/players/publicFields';
import { CoinIcon } from '../../Icons';
import { useCssHandles } from '@/hooks/useCssHandles';
import { useEditing } from '../EditingContext';
import { DASH, formatNumber, tabId } from '../sheetData';
import type { IMenuItem } from '../sheetData';
import { noveltyActive } from '@/lib/levelUp';
import { useLevelUp } from '../LevelUpContext';
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

/** Os campos do rascunho que cada tela da ficha mostra. */
const SCREEN_PATHS: Partial<Record<string, string[]>> = {
  status: ['raceId', 'raceChoice', 'classId', 'class', 'stats', 'playerStats'],
  habilidades: ['abilities', 'raceId', 'raceChoice'],
  arquetipo: ['archetype'],
  talentos: ['talents', 'talentMilestones'],
  magias: ['playerSpellcasting'],
};

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
  const { isDirtyUnder } = useEditing();
  const { access } = useLevelUp();
  // O losango de novidade é do dono: some ao abrir a seção ou em 7 dias.
  const hasNovelty = (section: string) =>
    access.isOwner &&
    (player.novelties ?? []).some(
      (n) => n.section === section && noveltyActive(n)
    );
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
            <span className={handles.sheetMenuLabel}>
              {item.label}
              {hasNovelty(item.id) && (
                <i
                  className={handles.sheetMenuNovelty}
                  role="img"
                  aria-label="novidade"
                  title="Novidade"
                />
              )}
              {(SCREEN_PATHS[item.id] ?? []).some((path) =>
                isDirtyUnder(path)
              ) && (
                <i
                  className={handles.sheetMenuDot}
                  role="img"
                  aria-label="alteração não salva"
                  title="Alteração não salva"
                />
              )}
            </span>
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
