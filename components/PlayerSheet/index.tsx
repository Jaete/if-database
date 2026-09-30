'use client';

import type { IPublicPlayer } from '@/db/players/publicFields';
import { useCssHandles } from '@/hooks/useCssHandles';
import { usePlayerSheet } from './usePlayerSheet';
import Header from './Header';
import CommandMenu from './CommandMenu';
import Hints from './Hints';
import Screen from './Screen';
import StatusPanel from './StatusPanel';
import SkillsPanel from './SkillsPanel';
import AbilitiesPanel from './AbilitiesPanel';
import SpellsPanel from './SpellsPanel';
import EquipmentPanel from './EquipmentPanel';
import ProfessionsPanel from './ProfessionsPanel';
import ChroniclePanel from './ChroniclePanel';
import PlayerSheetHandles from './handles';
import { formatModifier } from '@/lib/stats';
import {
  countEquipped,
  EQUIPMENT_SLOTS,
  readProfessions,
  tabId,
} from './sheetData';
import type { ScreenId } from './sheetData';
import '@/styles/components/playerSheet.scss';

interface IProps {
  player: IPublicPlayer;
}

const PlayerSheet = ({ player }: IProps) => {
  const handles = useCssHandles(PlayerSheetHandles);
  const {
    uid,
    menu,
    active,
    cursorAt,
    view,
    transition,
    screenSeq,
    message,
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
  } = usePlayerSheet(player);

  const panelId = `${uid}-panel`;
  const current = menu[active];

  const preparedSpells = (player.playerSpellcasting?.spellLevels ?? [])
    .filter((l) => l.level > 0)
    .flatMap((l) => l.spells ?? [])
    .filter((spell) => spell.prepared).length;

  const renderScreen = (id: ScreenId) => {
    switch (id) {
      case 'status':
        return {
          title: 'Status',
          sub: [
            player.level !== undefined && `Nível ${player.level}`,
            player.subtitle,
          ]
            .filter(Boolean)
            .join(' · '),
          body: <StatusPanel player={player} />,
        };
      case 'pericias':
        return {
          title: 'Perícias',
          sub: `${
            player.proficiencyBonus !== undefined
              ? `Bônus de Proficiência ${formatModifier(player.proficiencyBonus)} · `
              : ''
          }ponto dourado = proficiente`,
          body: <SkillsPanel player={player} />,
        };
      case 'habilidades':
        return {
          title: 'Habilidades',
          sub: 'Selecione para ler a descrição',
          body: <AbilitiesPanel player={player} />,
        };
      case 'magias':
        return {
          title: 'Magias',
          sub: `${preparedSpells} preparadas · losango cheio = espaço livre`,
          body: <SpellsPanel player={player} />,
        };
      case 'equipamento':
        return {
          title: 'Equipamento',
          sub: `${countEquipped(player)} de ${EQUIPMENT_SLOTS.length} espaços ocupados`,
          body: <EquipmentPanel player={player} />,
        };
      case 'profissoes':
        return {
          title: 'Profissões',
          sub: `${readProfessions(player).length} ofícios`,
          body: <ProfessionsPanel player={player} />,
        };
      case 'cronica':
        return {
          title: 'Crônica',
          sub: undefined,
          body: <ChroniclePanel player={player} />,
        };
    }
  };

  const screen = renderScreen(current.id);

  return (
    <div className={handles.playerSheetStage}>
      <article
        ref={sheetRef}
        className={handles.playerSheet}
        data-view={view}
        aria-label={`Ficha de ${player.name}`}
      >
        <Header player={player} />
        <div className={handles.playerSheetBody}>
          <CommandMenu
            player={player}
            uid={uid}
            panelId={panelId}
            items={menu}
            active={active}
            cursorAt={cursorAt}
            menuRef={menuRef}
            cursorRef={cursorRef}
            registerItem={registerItem}
            onClick={handleMenuClick}
            onHover={handleMenuHover}
            onKeyDown={handleMenuKeyDown}
          />
          <div
            ref={panelRef}
            className={handles.playerSheetPanel}
            onKeyDown={handlePanelKeyDown}
          >
            {transition !== 'none' && (
              <div
                key={`wipe-${screenSeq}`}
                className={handles.playerSheetWipe}
                aria-hidden="true"
              />
            )}
            <Screen
              key={screenSeq}
              id={panelId}
              labelledBy={tabId(uid, current.id)}
              title={screen.title}
              sub={screen.sub}
              transition={transition}
              onBack={backToMenu}
            >
              {screen.body}
            </Screen>
          </div>
        </div>
        <Hints message={message} />
      </article>
    </div>
  );
};

export default PlayerSheet;
