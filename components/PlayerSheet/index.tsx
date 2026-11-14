'use client';

import { useEffect } from 'react';
import type { IPublicPlayer } from '@/db/players/publicFields';
import { useCssHandles, applyModifiers } from '@/hooks/useCssHandles';
import { usePlayerSheet } from './usePlayerSheet';
import { useSheetEditing } from './useSheetEditing';
import { EditingProvider } from './EditingContext';
import { CatalogLayerProvider } from './CatalogLayerContext';
import { LevelUpProvider } from './LevelUpContext';
import { CreationProvider } from './CreationContext';
import { useCreationState } from './useCreationState';
import { useLevelUpState } from './useLevelUpState';
import { useSheetSounds } from './useSheetSounds';
import { useSheetSoundEvents } from './useSheetSoundEvents';
import LevelUpLayerHost from './LevelUpLayerHost';
import CreationLayerHost from './CreationLayerHost';
import CreationFrame from './CreationFrame';
import CreationBar from './CreationBar';
import type { IEventView } from '@/services/levelUp.service';
import CatalogLayerHost from './CatalogLayerHost';
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
import TalentsPanel from './TalentsPanel';
import SpellsPanel from './SpellsPanel';
import EquipmentPanel from './EquipmentPanel';
import ProfessionsPanel from './ProfessionsPanel';
import ChroniclePanel from './ChroniclePanel';
import PlayerSheetHandles from './handles';
import { formatModifier } from '@/lib/stats';
import {
  countEquipped,
  summarizeChanges,
  EQUIPMENT_SLOTS,
  readArchetype,
  readProfessions,
  tabId,
  talentProgress,
} from './sheetData';
import type { ScreenId } from './sheetData';
import '@/styles/components/playerSheet.scss';

interface IProps {
  player: IPublicPlayer;
  /** Origem do fórum autorizada a falar com este iframe. Vazia = sem edição. */
  forumOrigin: string;
  /** O histórico da ficha (XP, selos, reaberturas), lido no servidor. */
  history?: IEventView[];
}

const initialSpellRefs = (player: IPublicPlayer) =>
  player.playerSpellcasting?.spellRefs ?? [];

const PlayerSheet = ({
  player: initialPlayer,
  forumOrigin,
  history = [],
}: IProps) => {
  const handles = useCssHandles(PlayerSheetHandles);
  const {
    player,
    replacePlayer,
    identified,
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
    read,
    setField,
    isFieldDirty,
    isDirtyUnder,
    revertField,
    dirtyPaths,
    save,
    cancel,
  } = useSheetEditing(initialPlayer, forumOrigin);

  const levelUp = useLevelUpState({
    player,
    identified,
    initialHistory: history,
    onPlayer: replacePlayer,
  });
  // Editar livre = papel de staff E não ser a dona (o dono vence o papel): na
  // própria ficha a pessoa vê a experiência de jogadora. O servidor confere de
  // novo a cada escrita.
  const canEdit = permission === 'granted' && levelUp.access.isStaff;
  const creation = useCreationState({
    player,
    identified,
    access: levelUp.access,
    forumOrigin,
  });
  // Em criação e ainda não enviada, a página só mandou o dono e o estado: o
  // que a ficha mostra é a moldura "Ficha em criação" (ver CreationFrame).
  const unsent = player.status === 'blank' || player.status === 'draft';

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
    openScreen,
    backToMenu,
    handleMenuClick,
    handleMenuHover,
    handleMenuKeyDown,
    handlePanelKeyDown,
  } = usePlayerSheet(player, canEdit && isEditing);

  const panelId = `${uid}-panel`;
  const current = menu[active];

  // Abrir uma seção com novidades as marca como vistas (só vale para o dono).
  const { markSeen } = levelUp;
  const currentId = current.id;
  useEffect(() => {
    markSeen(currentId);
  }, [currentId, markSeen]);

  useSheetSounds(sheetRef);
  const sounds = useSheetSoundEvents({
    isEditing,
    isDirty,
    status,
    saveError,
    screenId: current.id,
    setField,
    read,
    cancel,
  });

  const preparedSpells = (player.playerSpellcasting?.spellLevels ?? [])
    .filter((l) => l.level > 0)
    .flatMap((l) => l.spells ?? [])
    .filter((spell) => spell.prepared).length;

  const savedSpellIds = (
    initialSpellRefs(player) as { spellId?: unknown }[]
  ).map((r) => String(r.spellId));
  const draftSpellIds = objects<{ spellId?: unknown }>(
    'playerSpellcasting.spellRefs'
  ).map((r) => String(r.spellId));
  const summary = summarizeChanges(dirtyPaths, savedSpellIds, draftSpellIds);

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
          body: <StatusPanel player={player} onOpenScreen={openScreen} />,
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
      case 'talentos': {
        const progress = talentProgress(
          player.talentSlots,
          player.talents ?? [],
          player.level ?? 0,
          player.talentMilestones ?? []
        );
        return {
          title: 'Talentos',
          sub: `${progress.taken} ${
            progress.taken === 1 ? 'escolhido' : 'escolhidos'
          } · ${progress.reached} ${
            progress.reached === 1 ? 'marco alcançado' : 'marcos alcançados'
          }`,
          body: <TalentsPanel />,
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
      read={read}
      setField={sounds.setField}
      isFieldDirty={isFieldDirty}
      isDirtyUnder={isDirtyUnder}
      revertField={revertField}
    >
      <LevelUpProvider value={levelUp}>
        <CatalogLayerProvider>
          <CreationProvider value={creation}>
            {unsent ? (
              <div className={handles.playerSheetStage}>
                <article
                  className={handles.playerSheet}
                  aria-label="Ficha em criação"
                >
                  <CreationFrame />
                  <CatalogLayerHost />
                  <CreationLayerHost />
                </article>
              </div>
            ) : (
              <div className={handles.playerSheetStage}>
                <article
                  ref={sheetRef}
                  className={handles.playerSheet}
                  data-view={view}
                  // Lido pelo EmbedCloseBridge: com alteração não salva, o Esc não
                  // fecha o modal do fórum e não joga a edição fora.
                  data-unsaved={isDirty || undefined}
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
                      onClick={() =>
                        isEditing ? sounds.discard() : setIsEditing(true)
                      }
                      aria-pressed={isEditing}
                    >
                      {isEditing ? 'Concluir edição' : 'Editar ficha'}
                    </button>
                  )}
                  <CreationBar />
                  <Header player={player} onOpenScreen={openScreen} />
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
                  <CatalogLayerHost />
                  <LevelUpLayerHost />
                  <CreationLayerHost />
                  <SaveBar
                    visible={isDirty}
                    summary={summary}
                    count={dirtyCount}
                    isSaving={isSaving}
                    error={saveError}
                    onSave={save}
                    onDiscard={sounds.discard}
                  />
                </article>
              </div>
            )}
          </CreationProvider>
        </CatalogLayerProvider>
      </LevelUpProvider>
    </EditingProvider>
  );
};

export default PlayerSheet;
