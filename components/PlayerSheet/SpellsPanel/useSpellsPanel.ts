'use client';

import { useMemo, useState } from 'react';
import type {
  IPlayerSpell,
  IPlayerSpellLevel,
  IPlayerSpellRef,
} from '@/db/citizens/citizen';
import { useEditing } from '../EditingContext';
import type { ISpellOption } from './SpellPicker';

const SC = 'playerSpellcasting';
export const LEVELS_PATH = `${SC}.spellLevels`;
export const REFS_PATH = `${SC}.spellRefs`;

/** Uma magia preparada, pronta para a linha da lista. */
export interface IPreparedSpell {
  spellId: string;
  circle: number;
  spell: IPlayerSpell;
}

/**
 * A conjuração de uma ficha ligada a uma classe.
 *
 * A regra do sistema é que o personagem conhece TODAS as magias da classe até
 * o maior círculo que conjura, e prepara tantas quantos forem os espaços
 * somados. Então a ficha não guarda o que ele conhece — guarda a escolha das
 * preparadas, em `spellRefs`, e é essa lista que esta tela edita.
 *
 * A lista exibida é montada a partir das referências, e não dos círculos
 * resolvidos pelo servidor: uma magia escolhida agora ainda não passou por uma
 * leitura, e sem isto só apareceria na ficha depois de salvar.
 */
export const useSpellsPanel = () => {
  const { value, objects, setField } = useEditing();

  // A ficha da magia escolhida nesta sessão, por id. O seletor já tem o nome e
  // a escola; o resto chega na próxima leitura, resolvido do grimório.
  const [picked, setPicked] = useState<Record<string, ISpellOption>>({});

  const refs = objects<IPlayerSpellRef>(REFS_PATH);
  const levels = objects<IPlayerSpellLevel>(LEVELS_PATH);

  const preparedLimit = Number(value(`${SC}.preparedLimit`));
  const maxCircle = Number(value(`${SC}.maxCircle`));
  const cantripsKnown = Number(value(`${SC}.cantripsKnown`)) || 0;
  const classId = String(value('classId') ?? '');

  // Só uma ficha com classe ligada tem círculos derivados da tabela; sem isso
  // a tela continua sendo a de antes, com a magia digitada à mão.
  const linked =
    Boolean(classId) && Number.isFinite(maxCircle) && maxCircle > 0;

  /** Onde cada magia resolvida mora, pelo círculo em que o servidor a pôs. */
  const resolved = useMemo(() => {
    const index = new Map<string, { circle: number; spell: IPlayerSpell }>();
    for (const level of levels) {
      for (const spell of level.spells ?? []) {
        if (spell.spellId) {
          index.set(String(spell.spellId), { circle: level.level, spell });
        }
      }
    }
    return index;
  }, [levels]);

  const prepared: IPreparedSpell[] = useMemo(
    () =>
      refs.map((ref) => {
        const known = resolved.get(ref.spellId);
        if (known) {
          return { spellId: ref.spellId, ...known };
        }
        // Escolhida agora: o que se tem é o que o seletor mostrou.
        const option = picked[ref.spellId];
        return {
          spellId: ref.spellId,
          circle: option?.circle ?? 0,
          spell: {
            spellId: ref.spellId,
            name: option?.name ?? 'Magia do grimório',
            prepared: true,
            school: option?.school,
            classes: option?.classes,
          },
        };
      }),
    [refs, resolved, picked]
  );

  const inCircle = (circle: number) =>
    prepared.filter((p) => p.circle === circle);

  // Truque não ocupa espaço de magia: tem limite próprio, o da tabela.
  const cantripCount = prepared.filter((p) => p.circle === 0).length;
  const spellCount = prepared.filter((p) => p.circle > 0).length;

  const limitOf = (circle: number) =>
    circle === 0 ? cantripsKnown : preparedLimit || 0;
  const countOf = (circle: number) =>
    circle === 0 ? cantripCount : spellCount;
  const remainingOf = (circle: number) =>
    Math.max(0, limitOf(circle) - countOf(circle));

  const takenIds = useMemo(
    () => new Set(refs.map((ref) => ref.spellId)),
    [refs]
  );

  const prepare = (option: ISpellOption) => {
    const spellId = String(option._id);
    if (takenIds.has(spellId)) return;
    setPicked((prev) => ({ ...prev, [spellId]: option }));
    setField(REFS_PATH, [...refs, { spellId, prepared: true }]);
  };

  const unprepare = (spellId: string) =>
    setField(
      REFS_PATH,
      refs.filter((ref) => ref.spellId !== spellId)
    );

  return {
    linked,
    classId,
    maxCircle,
    cantripsKnown,
    preparedLimit: preparedLimit || 0,
    spellCount,
    cantripCount,
    inCircle,
    remainingOf,
    limitOf,
    countOf,
    takenIds,
    prepare,
    unprepare,
  };
};
