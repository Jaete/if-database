'use client';

import type { KeyboardEvent, ReactNode } from 'react';
import { plural } from '@/lib/plural';
import { useCssHandles } from '@/hooks/useCssHandles';
import RaceArt from '../../RaceArt';
import RaceGhostAdd from '../../RaceGhostAdd';
import SubracePanel from '../SubracePanel';
import { borrowHue, ownTraitCount } from '../fields';
import type { IRaceActions, IRaceView } from '../types';
import RaceDataHandles from '../handles';
import LineageHandles from './handles';

interface IProps {
  race: IRaceView;
  /** A sub-raça em foco. */
  selectedSlug?: string;
  onSelect: (slug: string) => void;
  actions: IRaceActions;
}

/** As sub-raças: o trilho lateral com grupos e o painel da escolhida. */
const Lineage = ({ race, selectedSlug, onSelect, actions }: IProps) => {
  const handles = useCssHandles(LineageHandles);
  const root = useCssHandles(RaceDataHandles);
  const subs = race.subraces;
  const selected = subs.find((s) => s.slug === selectedSlug) ?? subs[0];
  const groups = [...new Set(subs.map((s) => s.group ?? ''))];
  const grouped = groups.length > 1 || Boolean(groups[0]);

  const onKey = (event: KeyboardEvent, index: number) => {
    let next: number | null = null;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      next = (index + 1) % subs.length;
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      next = (index - 1 + subs.length) % subs.length;
    } else if (event.key === 'Home') {
      next = 0;
    } else if (event.key === 'End') {
      next = subs.length - 1;
    }
    if (next === null) return;
    event.preventDefault();
    onSelect(subs[next].slug);
    document.getElementById(`race-tab-${subs[next].slug}`)?.focus();
  };

  return (
    <section
      className={handles.raceLineage}
      id="sub-racas"
      aria-labelledby="race-h-subs"
    >
      <div className={handles.raceLineageIn}>
        <div className={root.raceSecHead}>
          <h2 id="race-h-subs">Sub-raças</h2>
          <small>
            {subs.length > 0
              ? `${plural(subs.length, 'sub-raça', 'sub-raças')} · cada uma herda os traços da raça e muda parte deles`
              : 'nenhuma ainda'}
          </small>
        </div>
        {selected ? (
          <div className={handles.raceLineageGrid}>
            <div className={handles.raceRailCol}>
              <div
                className={handles.raceRail}
                role="tablist"
                aria-label={`Sub-raças de ${race.name}`}
                aria-orientation="vertical"
              >
                {groups.map((group) => (
                  <GroupBlock
                    key={group || 'none'}
                    show={grouped}
                    title={group || 'Sem grupo'}
                    count={subs.filter((s) => (s.group ?? '') === group).length}
                  >
                    {subs.map((s, index) =>
                      (s.group ?? '') !== group ? null : (
                        <button
                          key={s.slug}
                          id={`race-tab-${s.slug}`}
                          type="button"
                          role="tab"
                          className={handles.raceRailTab}
                          aria-selected={s.slug === selected.slug}
                          aria-controls="race-subpanel"
                          tabIndex={s.slug === selected.slug ? 0 : -1}
                          onClick={() => onSelect(s.slug)}
                          onKeyDown={(e) => onKey(e, index)}
                        >
                          <span className={handles.raceRailThumb}>
                            <RaceArt
                              image={s.image ?? race.images[0]}
                              label={s.name}
                              borrowed={!s.image && Boolean(race.images[0])}
                              hue={borrowHue(index)}
                            />
                          </span>
                          <span className={handles.raceRailText}>
                            <b>{s.name}</b>
                            <small>
                              {plural(
                                s.traits.length,
                                'habilidade',
                                'habilidades'
                              )}
                              {' · '}
                              {ownTraitCount(s) > 0
                                ? plural(
                                    ownTraitCount(s),
                                    'traço próprio',
                                    'traços próprios'
                                  )
                                : 'herda os traços'}
                            </small>
                          </span>
                        </button>
                      )
                    )}
                  </GroupBlock>
                ))}
              </div>
              {actions.canEdit && (
                <RaceGhostAdd label="Sub-raça" onClick={actions.addSub} />
              )}
            </div>
            <SubracePanel
              race={race}
              sub={selected}
              onSelect={onSelect}
              actions={actions}
            />
          </div>
        ) : (
          <div className={handles.raceLineageEmpty}>
            <p>Sem sub-raças, esta seção não aparece para quem visita.</p>
            <RaceGhostAdd label="Sub-raça" onClick={actions.addSub} />
          </div>
        )}
      </div>
    </section>
  );
};

interface IGroupProps {
  show: boolean;
  title: string;
  count: number;
  children: ReactNode;
}

/** O cabeçalho de um grupo de sub-raças (só quando a raça tem grupos). */
const GroupBlock = ({ show, title, count, children }: IGroupProps) => {
  const handles = useCssHandles(LineageHandles);
  return (
    <>
      {show && (
        <div className={handles.raceRailGroup} role="presentation">
          <b>{title}</b>
          <i />
          <small>{count}</small>
        </div>
      )}
      {children}
    </>
  );
};

export default Lineage;
