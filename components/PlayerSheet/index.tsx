'use client';

import type { IPublicPlayer } from '@/db/players/publicFields';
import { useCssHandles, applyModifiers } from '@/hooks/useCssHandles';
import { usePlayerSheet } from './usePlayerSheet';
import { useSheetEditing } from './useSheetEditing';
import { EditingProvider } from './EditingContext';
import SaveBar from './SaveBar';
import Header from './Header';
import NarrationStyle from './NarrationStyle';
import CommandMenu from './CommandMenu';
import Hints from './Hints';
import Screen from './Screen';
import StatusPanel from './StatusPanel';
import SkillsPanel from './SkillsPanel';
import AbilitiesPanel from './AbilitiesPanel';
import ArchetypePanel from './ArchetypePanel';
import SpellsPanel from './SpellsPanel';
import EquipmentPanel from './EquipmentPanel';
import ProfessionsPanel from './ProfessionsPanel';
import ChroniclePanel from './ChroniclePanel';
import PlayerSheetHandles from './handles';
import { formatModifier } from '@/lib/stats';
import {
  countEquipped,
  EQUIPMENT_SLOTS,
  readArchetype,
  readProfessions,
  tabId,
} from './sheetData';
import type { ScreenId } from './sheetData';
import '@/styles/components/playerSheet.scss';

interface IProps {
  player: IPublicPlayer;
  /** Origem do fórum autorizada a falar com este iframe. Vazia = sem edição. */
  forumOrigin: string;
}

const PlayerSheet = ({ player: initialPlayer, forumOrigin }: IProps) => {
  const handles = useCssHandles(PlayerSheetHandles);
  const {
    player,
    permission,
    isEditing,
    setIsEditing,
    isDirty,
    dirtyCount,
    isSaving,
    status,
    error: saveError,
    value,
    list,
    objects,
    setField,
    isFieldDirty,
    save,
    cancel,
  } = useSheetEditing(initialPlayer, forumOrigin);

  const canEdit = permission === 'granted';

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
  } = usePlayerSheet(player, canEdit && isEditing);

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
          body: <AbilitiesPanel />,
        };
      case 'arquetipo': {
        const archetype = readArchetype(player);
        return {
          title: 'Arquétipo',
          sub: archetype
            ? `${archetype.chosen} de ${archetype.slots} habilidades escolhidas`
            : undefined,
          body: <ArchetypePanel />,
        };
      }
      case 'magias':
        return {
          title: 'Magias',
          sub: `${preparedSpells} preparadas · losango cheio = espaço livre`,
          body: <SpellsPanel />,
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
    <EditingProvider
      editable={canEdit && isEditing}
      value={value}
      list={list}
      objects={objects}
      setField={setField}
      isFieldDirty={isFieldDirty}
    >
      <div className={handles.playerSheetStage}>
        <article
          ref={sheetRef}
          className={handles.playerSheet}
          data-view={view}
          aria-label={`Ficha de ${player.name}`}
        >
          {canEdit && (
            <button
              type="button"
              className={`${handles.sheetEditToggle}${
                isEditing
                  ? ` ${applyModifiers(handles.sheetEditToggle, 'editing')}`
                  : ''
              }`}
              onClick={() => (isEditing ? cancel() : setIsEditing(true))}
              aria-pressed={isEditing}
            >
              {isEditing ? 'Concluir edição' : 'Editar ficha'}
            </button>
          )}
          <Header player={player} />
          <NarrationStyle player={player} />
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
          <Hints message={status || message} />
          <SaveBar
            visible={isDirty}
            count={dirtyCount}
            isSaving={isSaving}
            error={saveError}
            onSave={save}
            onDiscard={cancel}
          />
        </article>
      </div>
    </EditingProvider>
  );
};

export default PlayerSheet;
