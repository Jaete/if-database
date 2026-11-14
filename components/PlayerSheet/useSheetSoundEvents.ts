'use client';

import { useCallback, useEffect, useRef } from 'react';
import { armSounds, sheetSounds } from '@/lib/sheetSounds';
import type { ScreenId } from './sheetData';

interface IArgs {
  isEditing: boolean;
  isDirty: boolean;
  status: string;
  saveError: string;
  screenId: ScreenId;
  setField: (path: string, value: unknown) => void;
  read: <T = unknown>(path: string) => T | undefined;
  cancel: () => void;
}

const SAVED = 'Alterações salvas.';
const countOf = (v: unknown) => (Array.isArray(v) ? v.length : 0);
const preparedOf = (v: unknown) =>
  Array.isArray(v) ? v.filter((r) => r?.prepared).length : 0;
const WEAPON_OR_ARMOR = new Set(['hand', 'offhand', 'head', 'torso']);

/**
 * Os sons da ficha fora da subida de nível. Em vez de espalhar chamadas por cada
 * painel, ficam aqui duas coisas: efeitos que olham o que MUDOU (seção, modo de
 * edição, salvar) e um `setField` que reconhece o campo gravado no rascunho
 * (gil, Chi, vida máxima, equipamento, magias, talentos).
 *
 * Nada toca antes de um gesto dentro da ficha: quem decide é `sheetSounds`.
 */
export const useSheetSoundEvents = ({
  isEditing,
  isDirty,
  status,
  saveError,
  screenId,
  setField,
  read,
  cancel,
}: IArgs) => {
  const first = useRef(true);
  const prev = useRef({ isEditing, status, saveError, screenId });

  useEffect(() => {
    const before = prev.current;
    if (first.current) {
      first.current = false;
    } else {
      if (screenId !== before.screenId) sheetSounds.play('pageTurn');
      if (isEditing && !before.isEditing) sheetSounds.play('quillDip');
      if (status === SAVED && before.status !== SAVED)
        sheetSounds.play('saveSeal');
      if (saveError && saveError !== before.saveError)
        sheetSounds.play('knock');
    }
    prev.current = { isEditing, status, saveError, screenId };
  }, [isEditing, status, saveError, screenId]);

  // O botão de tema fica fora da moldura da ficha: o clique nele é o gesto que
  // libera o som.
  useEffect(() => {
    const onToggle = () => {
      armSounds();
      sheetSounds.play('candle');
    };
    window.addEventListener('ifdb:theme-toggle', onToggle);
    return () => window.removeEventListener('ifdb:theme-toggle', onToggle);
  }, []);

  const soundedSetField = useCallback(
    (path: string, next: unknown) => {
      const before = read(path);
      if (path === 'equipment.gil') sheetSounds.play('coinsUi');
      else if (path === 'chi.current' || path === 'chi.max')
        sheetSounds.play('wind');
      else if (path === 'combat.hp.value') sheetSounds.play('heartbeat');
      else if (path === 'talents') {
        sheetSounds.play(
          countOf(next) >= countOf(before) ? 'luteNote' : 'luteLow'
        );
      } else if (path.startsWith('equipment.')) {
        const slot = path.split('.')[1];
        if (slot !== 'gil' && slot !== 'backpack' && next) {
          sheetSounds.play(WEAPON_OR_ARMOR.has(slot) ? 'metal' : 'cloth');
        }
      } else if (path.endsWith('.slotsUsed')) {
        sheetSounds.play(
          Number(next) >= Number(before) ? 'spark' : 'smallBell'
        );
      } else if (path === 'playerSpellcasting.spellRefs') {
        sheetSounds.play(
          preparedOf(next) >= preparedOf(before) ? 'arcaneUp' : 'arcaneDown'
        );
      }
      setField(path, next);
    },
    [read, setField]
  );

  const discard = useCallback(() => {
    if (isDirty) sheetSounds.play('crumple');
    cancel();
  }, [isDirty, cancel]);

  return { setField: soundedSetField, discard };
};
