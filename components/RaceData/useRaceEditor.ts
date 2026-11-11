'use client';

import { useState } from 'react';
import { plural } from '@/lib/plural';
import type { IRaceActions, TraitScope } from './types';
import type { useRaceData } from './useRaceData';

export type Editing =
  | { kind: 'identity' }
  | { kind: 'traits' }
  | { kind: 'lore' }
  | { kind: 'notes' }
  | { kind: 'summary' }
  | { kind: 'trait'; scope: TraitScope; index: number | null }
  | { kind: 'rule'; index: number | null }
  | { kind: 'sub'; isNew: boolean }
  | { kind: 'subTraits' }
  | { kind: 'subLore' }
  | { kind: 'reimport' };

export interface IRemoval {
  title: string;
  message: string;
  confirmLabel?: string;
  confirm: () => void;
}

/**
 * O que está aberto para edição (um modal por vez) e o que espera
 * confirmação de exclusão, mais as ações que os componentes de apresentação
 * chamam. A gravação em si vive em `useRaceData`.
 */
export function useRaceEditor(
  data: ReturnType<typeof useRaceData>,
  canEdit: boolean
) {
  const { race } = data;
  const hasSubs = race.subraces.length > 0;
  const [editing, setEditing] = useState<Editing | null>(null);
  const [removing, setRemoving] = useState<IRemoval | null>(null);

  const open = (next: Editing) => {
    data.setError(null);
    setEditing(next);
  };
  const close = () => setEditing(null);

  const move = <T>(list: T[], from: number, step: -1 | 1) => {
    const to = from + step;
    if (to < 0 || to >= list.length) return null;
    const next = [...list];
    [next[from], next[to]] = [next[to], next[from]];
    return next;
  };

  const actions: IRaceActions = {
    canEdit,
    editIdentity: () => open({ kind: 'identity' }),
    editTraits: () => open({ kind: 'traits' }),
    editLore: () => open({ kind: 'lore' }),
    editNotes: () => open({ kind: 'notes' }),
    editSummary: () => open({ kind: 'summary' }),
    addTrait: (scope) => open({ kind: 'trait', scope, index: null }),
    editTrait: (scope, index) => open({ kind: 'trait', scope, index }),
    deleteTrait: (scope, index) =>
      setRemoving({
        title: 'Excluir habilidade',
        message: `Excluir ${data.traitsOf(scope)[index]?.name}? Não dá para desfazer.`,
        confirm: () =>
          data.saveTraits(
            scope,
            data.traitsOf(scope).filter((_, i) => i !== index),
            'Habilidade excluída.'
          ),
      }),
    moveTrait: (scope, index, step) => {
      const next = move(data.traitsOf(scope), index, step);
      if (next) data.saveTraits(scope, next, 'Ordem salva.');
    },
    addRule: () => open({ kind: 'rule', index: null }),
    editRule: (index) => open({ kind: 'rule', index }),
    deleteRule: (index) =>
      setRemoving({
        title: 'Excluir regra',
        message: `Excluir a regra ${race.choiceRules?.[index]?.name}?`,
        confirm: () =>
          data.saveRules(
            (race.choiceRules ?? []).filter((_, i) => i !== index),
            'Regra excluída.'
          ),
      }),
    addSub: () => open({ kind: 'sub', isNew: true }),
    editSubIdentity: () => open({ kind: 'sub', isNew: false }),
    editSubTraits: () => open({ kind: 'subTraits' }),
    editSubLore: () => open({ kind: 'subLore' }),
    moveSub: (step) => {
      data.moveSub(step);
    },
    reimport: () => open({ kind: 'reimport' }),
    deleteRace: () =>
      setRemoving({
        title: 'Excluir raça',
        message: `Excluir ${race.name}${
          hasSubs
            ? ` e ${plural(race.subraces.length, 'sub-raça', 'sub-raças')}`
            : ''
        }? Não dá para desfazer.`,
        confirmLabel: 'Excluir raça',
        confirm: () => data.remove(),
      }),
  };

  return { editing, close, removing, setRemoving, actions };
}
