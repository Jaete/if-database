'use client';

import { useEffect, useState } from 'react';
import type { ICitizenTalent, ITalentSlots } from '@/db/citizens/citizen.d';
import type { ITalentOption } from '@/services/talentCatalog';
import { loadTalentOptions } from './catalogs';
import { useEditing } from './EditingContext';
import { talentProgress } from './sheetData';

/** Um talento na lista: o mesmo talento pego várias vezes vira uma linha só. */
export interface ITalentGroup {
  key: string;
  talent: ICitizenTalent;
  /** Cada vez que foi pego: posição na lista gravada e nível. */
  picks: { at: number; level: number }[];
}

const PATH = 'talents';

/**
 * Os talentos de uma ficha e os marcos da classe.
 *
 * Os marcos e a descrição dos talentos já vêm resolvidos na leitura; o
 * catálogo para escolher (os 300 e tantos gerais mais os da classe) só é
 * baixado em edição, e é o mesmo padrão de `useArchetype`. Cada escolha grava
 * a entrada inteira no rascunho — o servidor guarda só `key`, `level` e
 * `name`, mas a tela precisa do resto antes do save.
 */
export const useTalents = () => {
  const { editable, value, read, objects, setField } = useEditing();
  const classId = String(value('classId') ?? '');
  const level = Number(value('level')) || 0;
  const talents = objects<ICitizenTalent>(PATH).filter((t) => t?.key);
  const slots = read<ITalentSlots>('talentSlots');

  const [loaded, setLoaded] = useState<{
    classId: string;
    options: ITalentOption[];
  } | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!editable || loaded?.classId === classId) return;
    let active = true;
    loadTalentOptions(classId)
      .then((options) => {
        if (active) setLoaded({ classId, options });
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, [editable, classId, loaded]);

  const options = loaded?.classId === classId ? loaded.options : null;
  const progress = talentProgress(slots, talents, level);

  const groups: ITalentGroup[] = [];
  talents.forEach((talent, at) => {
    const group = groups.find((g) => g.key === talent.key);
    if (group) group.picks.push({ at, level: talent.level });
    else
      groups.push({
        key: talent.key,
        talent,
        picks: [{ at, level: talent.level }],
      });
  });
  for (const group of groups) group.picks.sort((a, b) => a.level - b.level);
  groups.sort((a, b) => a.picks[0].level - b.picks[0].level);

  const countOf = (key: string) => talents.filter((t) => t.key === key).length;

  const add = (option: ITalentOption, at: number) =>
    setField(PATH, [
      ...talents,
      {
        key: option.key,
        level: at,
        name: option.name,
        scope: option.scope,
        category: option.category,
        prerequisites: option.prerequisites,
        description: option.description,
        group: option.group,
        stackable: option.stackable,
      } satisfies ICitizenTalent,
    ]);

  const remove = (at: number) =>
    setField(
      PATH,
      talents.filter((_, i) => i !== at)
    );

  const setLevel = (at: number, next: number) =>
    setField(
      PATH,
      talents.map((t, i) => (i === at ? { ...t, level: next } : t))
    );

  return {
    classId,
    level,
    className: slots?.className ?? '',
    slots,
    talents,
    groups,
    progress,
    options,
    failed,
    countOf,
    add,
    remove,
    setLevel,
  };
};
