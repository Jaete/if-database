'use client';

import { useId, useState } from 'react';
import type { IPublicPlayer } from '@/db/players/publicFields';
import { useCssHandles } from '@/hooks/useCssHandles';
import DetailCard from '../DetailCard';
import AbilitiesPanelHandles from './handles';

interface IProps {
  player: IPublicPlayer;
}

interface IEntry {
  name: string;
  description?: string;
  group: string;
}

const AbilitiesPanel = ({ player }: IProps) => {
  const handles = useCssHandles(AbilitiesPanelHandles);
  const detailId = useId();
  const [selected, setSelected] = useState(0);

  const sources: [string, { name?: string; description?: string }[]][] = [
    [
      'Características',
      [...(player.abilities ?? []), ...(player.traits ?? [])],
    ],
    ['Ações', player.actions ?? []],
    ['Ações bônus', player.bonusActions ?? []],
    ['Reações', player.reactions ?? []],
    ['Ações lendárias', player.legendaryActions ?? []],
  ];

  const groups = sources
    .map(([group, list]) => ({
      group,
      entries: list
        .filter((a) => a?.name)
        .map((a): IEntry => ({
          name: a.name as string,
          description: a.description,
          group,
        })),
    }))
    .filter((g) => g.entries.length > 0);

  const flat = groups.flatMap((g) => g.entries);
  const current = flat[selected] ?? flat[0];

  if (!current) {
    return <p className={handles.sheetEmpty}>Nenhuma habilidade registrada.</p>;
  }

  let index = 0;

  return (
    <div className={handles.sheetMaster}>
      <div className={handles.sheetMasterList} data-listnav>
        {groups.map(({ group, entries }) => (
          <div
            key={group}
            className={handles.sheetMasterGroup}
            role="group"
            aria-label={group}
          >
            <span className={handles.sheetCaption}>{group}</span>
            {entries.map((entry) => {
              const i = index++;
              return (
                <button
                  key={`${group}:${i}`}
                  type="button"
                  className={handles.sheetMasterOption}
                  data-opt
                  aria-pressed={i === selected}
                  aria-controls={detailId}
                  onFocus={() => setSelected(i)}
                  onMouseEnter={() => setSelected(i)}
                  onClick={() => setSelected(i)}
                >
                  {entry.name}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <DetailCard
        id={detailId}
        kicker={current.group}
        title={current.name}
        text={current.description}
      />
    </div>
  );
};

export default AbilitiesPanel;
