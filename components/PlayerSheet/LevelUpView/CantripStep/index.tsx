'use client';

import { useState } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import { sheetSounds } from '@/lib/sheetSounds';
import LevelUpDetail from '../../LevelUpDetail';
import LevelUpViewHandles from '../handles';
import type { IStepProps } from '../types';

/** Truques novos: o limite de truques da classe cresceu neste nível. */
const CantripStep = ({ plan, draft, patch }: IStepProps) => {
  const handles = useCssHandles(LevelUpViewHandles);
  const [hover, setHover] = useState<string | null>(null);
  const { need, options } = plan.cantrips;
  const full = draft.cantripIds.length >= need;
  const focus =
    options.find((o) => o.id === hover) ??
    options.find(
      (o) => o.id === draft.cantripIds[draft.cantripIds.length - 1]
    ) ??
    options[0];

  const toggle = (id: string) => {
    const on = draft.cantripIds.includes(id);
    patch({
      cantripIds: on
        ? draft.cantripIds.filter((x) => x !== id)
        : [...draft.cantripIds, id],
    });
    setHover(id);
    sheetSounds.play(on ? 'unpick' : 'pick');
  };

  return (
    <div className={handles.luContent}>
      <div className={handles.luPane}>
        <div className={handles.luPaneHead}>
          <h3>Truques</h3>
          <p>
            A classe passa a conhecer mais truques neste nível. Aprenda{' '}
            <b>
              {need} {need === 1 ? 'truque novo' : 'truques novos'}
            </b>
            .
          </p>
        </div>
        <div className={handles.luFilterRow}>
          <span className={handles.luCounter}>
            Aprender{' '}
            <b>
              {draft.cantripIds.length}/{need}
            </b>
          </span>
        </div>
        <div className={handles.luSpells}>
          {options.map((s) => {
            const on = draft.cantripIds.includes(s.id);
            const blocked = !on && full;
            return (
              <button
                key={s.id}
                type="button"
                className={`${handles.luSpell}${on ? ` ${handles.luSpell}--pick` : ''}${
                  blocked ? ` ${handles.luSpell}--lock` : ''
                }`}
                aria-pressed={on}
                onClick={() => (blocked ? setHover(s.id) : toggle(s.id))}
                onMouseEnter={() => setHover(s.id)}
                onFocus={() => setHover(s.id)}
              >
                <span className={handles.luSpellCircle}>T</span>
                <b>{s.name}</b>
                <small>
                  {on
                    ? 'aprender'
                    : blocked
                      ? 'limite deste nível atingido'
                      : s.school}
                </small>
              </button>
            );
          })}
        </div>
      </div>
      {focus ? (
        <LevelUpDetail
          kind="Truque"
          title={focus.name}
          body={focus.description}
          meta={
            <dl>
              <dt>Escola</dt>
              <dd>{focus.school || '—'}</dd>
              <dt>Conjuração</dt>
              <dd>{focus.castingTime || '—'}</dd>
              <dt>Alcance</dt>
              <dd>{focus.range || '—'}</dd>
            </dl>
          }
        />
      ) : (
        <LevelUpDetail kind="Truque" title="Sem truque para mostrar" body="" />
      )}
    </div>
  );
};

export default CantripStep;
