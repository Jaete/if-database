'use client';

import { useState } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import { sheetSounds } from '@/lib/sheetSounds';
import LevelUpDetail from '../../LevelUpDetail';
import LevelUpPill from '../../LevelUpPill';
import LevelUpViewHandles from '../handles';
import type { IStepProps } from '../types';

const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];

/**
 * Magias novas: uma por espaço novo, de QUALQUER círculo até o mais alto que o
 * personagem conjura, respeitando o limite de espaços de cada círculo.
 */
const SpellStep = ({ plan, draft, patch }: IStepProps) => {
  const handles = useCssHandles(LevelUpViewHandles);
  const sp = plan.spells;
  const [hover, setHover] = useState<string | null>(null);
  const [circ, setCirc] = useState<number | null>(null);

  const circles = Array.from({ length: sp.maxCircle }, (_, i) => i + 1);
  const newCircles = sp.adds.map((a) => a.circle);
  const withOptions = circles.filter((c) =>
    sp.options.some((o) => o.circle === c)
  );
  const tab =
    circ ??
    [...newCircles].reverse().find((c) => withOptions.includes(c)) ??
    withOptions[withOptions.length - 1] ??
    sp.maxCircle;

  const pickedIn = (c: number) =>
    draft.spellIds.filter(
      (id) => sp.options.find((o) => o.id === id)?.circle === c
    ).length;
  const full = draft.spellIds.length >= sp.need;
  const slotsNew = sp.adds.reduce((sum, a) => sum + a.add, 0);
  const leftover = Math.max(0, slotsNew - sp.need);
  const list = sp.options.filter((o) => o.circle === tab);
  const focus =
    sp.options.find((o) => o.id === hover) ??
    sp.options.find(
      (o) => o.id === draft.spellIds[draft.spellIds.length - 1]
    ) ??
    list[0];

  const toggle = (id: string) => {
    const on = draft.spellIds.includes(id);
    patch({
      spellIds: on
        ? draft.spellIds.filter((x) => x !== id)
        : [...draft.spellIds, id],
    });
    setHover(id);
    sheetSounds.play(on ? 'unpick' : 'pick');
  };

  return (
    <div className={handles.luContent}>
      <div className={handles.luPane}>
        <div className={handles.luPaneHead}>
          <h3>Magias</h3>
          <p>
            {sp.adds.map((a, i) => (
              <span key={a.circle}>
                {i > 0 ? ' e ' : ''}
                <b>
                  +{a.add} {a.add === 1 ? 'espaço' : 'espaços'} no {a.circle}º
                  círculo
                </b>
              </span>
            ))}
            .{' '}
            {sp.need > 0 ? (
              <>
                Você já conhece as magias da classe até o {sp.maxCircle}º
                círculo. Prepare {sp.need}{' '}
                {sp.need === 1 ? 'magia a mais' : 'magias a mais'}, de{' '}
                <b>qualquer círculo até o {sp.maxCircle}º</b>: o limite de
                preparadas é o total de espaços.
              </>
            ) : null}
          </p>
        </div>
        <div className={handles.luFilterRow}>
          <div
            className={handles.luCircTabs}
            role="tablist"
            aria-label="Círculos"
          >
            {circles.map((c) => (
              <button
                key={c}
                type="button"
                role="tab"
                aria-selected={tab === c}
                data-new={newCircles.includes(c) || undefined}
                title={
                  newCircles.includes(c) ? 'Círculo com espaço novo' : undefined
                }
                onClick={() => {
                  setCirc(c);
                  setHover(null);
                  sheetSounds.play('pageTurn');
                }}
              >
                {c}º <small>{pickedIn(c)}</small>
                {newCircles.includes(c) && (
                  <LevelUpPill tone="novo">novo</LevelUpPill>
                )}
              </button>
            ))}
          </div>
          <span className={handles.luCounter}>
            Preparar{' '}
            <b>
              {draft.spellIds.length}/{sp.need}
            </b>
          </span>
        </div>
        {list.length ? (
          <div className={handles.luSpells}>
            {list.map((s) => {
              const on = draft.spellIds.includes(s.id);
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
                  <span className={handles.luSpellCircle}>
                    {ROMAN[s.circle]}
                  </span>
                  <b>{s.name}</b>
                  <small>
                    {on
                      ? 'preparar'
                      : full
                        ? 'limite deste nível atingido'
                        : s.school}
                  </small>
                </button>
              );
            })}
          </div>
        ) : (
          <div className={handles.luNote}>
            <b>Nenhuma magia de {tab}º círculo disponível no grimório.</b>{' '}
            Prepare uma de outro círculo.
          </div>
        )}
        {leftover > 0 && sp.need > 0 && (
          <div className={handles.luNote}>
            <b>
              {leftover} {leftover === 1 ? 'vaga' : 'vagas'} sem magia
              disponível para preparar.
            </b>{' '}
            Os espaços novos somam {slotsNew}, mas só {sp.need}{' '}
            {sp.need === 1 ? 'magia cabe' : 'magias cabem'} entre as preparadas
            e no grimório.
          </div>
        )}
        {sp.need === 0 && (
          <div className={handles.luNote}>
            Não há magia disponível para preparar neste nível. As vagas ficam
            abertas e o passo já conta como feito.
          </div>
        )}
      </div>
      {focus ? (
        <LevelUpDetail
          kind={`Magia · ${focus.circle}º círculo`}
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
              <dt>Duração</dt>
              <dd>{focus.duration || '—'}</dd>
            </dl>
          }
        />
      ) : (
        <LevelUpDetail kind="Magia" title="Sem magia para mostrar" body="" />
      )}
    </div>
  );
};

export default SpellStep;
