'use client';

import { useState } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import { formatModifier, modifierOf } from '@/lib/stats';
import { sheetSounds } from '@/lib/sheetSounds';
import { ATTRIBUTE_CAP, ATTRIBUTE_KEYS, ATTRIBUTE_LABELS } from '@/lib/levelUp';
import LevelUpChoice from '../../LevelUpChoice';
import LevelUpDetail from '../../LevelUpDetail';
import LevelUpPill from '../../LevelUpPill';
import LevelUpViewHandles from '../handles';
import type { IStepProps } from '../types';
import { pointsSum } from '../useLevelDraft';

/** O marco: +2 em um atributo, +1 em dois, ou um talento no lugar. */
const AttributeStep = ({ plan, draft, patch }: IStepProps) => {
  const handles = useCssHandles(LevelUpViewHandles);
  const [hover, setHover] = useState<string | null>(null);
  const used = pointsSum(draft);
  const mode = draft.milestoneUse;

  const modeSwitch = (
    <>
      <div className={handles.luPaneHead}>
        <h3>Marco do nível {plan.level}</h3>
        <p>
          &ldquo;{plan.milestone?.text}&rdquo;. O que você fizer aqui fica
          gravado no marco.
        </p>
      </div>
      <div
        className={handles.luModeSeg}
        role="radiogroup"
        aria-label="Uso do marco"
      >
        {(
          [
            ['attribute', 'Atributos', '+2 em um, ou +1 em dois'],
            ['talent', 'Um talento', 'Geral ou da classe'],
          ] as const
        ).map(([key, title, sub]) => (
          <button
            key={key}
            type="button"
            role="radio"
            aria-checked={mode === key}
            onClick={() => {
              patch({ milestoneUse: key });
              setHover(null);
              sheetSounds.play('pick');
            }}
          >
            <b>{title}</b>
            <small>{sub}</small>
          </button>
        ))}
      </div>
    </>
  );

  if (mode === 'talent') {
    const list = plan.talentOptions
      .filter((t) => !draft.classTalentKeys.includes(t.key))
      .sort((a, b) => Number(b.ok) - Number(a.ok));
    const focus =
      list.find((t) => t.key === hover) ??
      list.find((t) => t.key === draft.milestoneTalent) ??
      list[0];
    return (
      <div className={handles.luContent}>
        <div className={handles.luPane}>
          {modeSwitch}
          <div className={handles.luFilterRow}>
            <span className={handles.luCounter}>
              <b>{list.filter((t) => t.ok).length}</b> disponíveis ·{' '}
              {list.filter((t) => !t.ok).length} com requisito pendente
            </span>
          </div>
          <div
            className={handles.luChoices}
            role="radiogroup"
            aria-label="Talento do marco"
          >
            {list.map((t) => (
              <LevelUpChoice
                key={t.key}
                name={t.name}
                description={t.description}
                selected={draft.milestoneTalent === t.key}
                locked={!t.ok}
                tags={
                  <LevelUpPill tone={t.scope === 'general' ? 'muted' : 'gold'}>
                    {t.scope === 'general'
                      ? 'geral'
                      : plan.className.toLowerCase()}
                  </LevelUpPill>
                }
                requirement={t.ok ? undefined : t.missing.join(', ')}
                onHover={() => setHover(t.key)}
                onSelect={() => {
                  patch({ milestoneTalent: t.key });
                  sheetSounds.play('pick');
                }}
              />
            ))}
          </div>
        </div>
        {focus && (
          <LevelUpDetail
            kind={
              focus.scope === 'general'
                ? 'Talento geral'
                : `Talento de ${plan.className}`
            }
            title={focus.name}
            body={focus.description}
            meta={
              <dl>
                <dt>Requisito</dt>
                <dd>{focus.prerequisites || 'Nenhum'}</dd>
              </dl>
            }
          />
        )}
      </div>
    );
  }

  const change = (key: (typeof ATTRIBUTE_KEYS)[number], delta: number) => {
    const next = Math.max(0, (draft.points[key] ?? 0) + delta);
    patch({ points: { ...draft.points, [key]: next } });
    sheetSounds.play(delta > 0 ? 'pick' : 'unpick');
  };

  const changed = ATTRIBUTE_KEYS.filter(
    (k) =>
      modifierOf(plan.attributes[k].total + (draft.points[k] ?? 0)) !==
      modifierOf(plan.attributes[k].total)
  );

  return (
    <div className={handles.luContent}>
      <div className={handles.luPane}>
        {modeSwitch}
        <div className={handles.luPaneHead}>
          <h3>Distribua 2 pontos</h3>
          <p>
            Os 2 no mesmo atributo são o <b>+2 em um</b>. Um em cada são o{' '}
            <b>+1 em dois</b>. O teto é {ATTRIBUTE_CAP}.
          </p>
        </div>
        <div className={handles.luPool}>
          <span className={handles.luPips}>
            {[0, 1].map((i) => (
              <i key={i} data-on={i < used || undefined} />
            ))}
          </span>
          <span>
            {2 - used} {2 - used === 1 ? 'ponto' : 'pontos'} para gastar
          </span>
        </div>
        <div className={handles.luAlloc}>
          {ATTRIBUTE_KEYS.map((key) => {
            const add = draft.points[key] ?? 0;
            const v0 = plan.attributes[key].total;
            const v1 = v0 + add;
            const [abbr, label] = ATTRIBUTE_LABELS[key];
            return (
              <div
                key={key}
                className={`${handles.luAllocRow}${add ? ` ${handles.luAllocRow}--up` : ''}`}
              >
                <span data-ab>{abbr}</span>
                <span data-name>{label}</span>
                <span data-step>
                  <button
                    type="button"
                    disabled={add <= 0}
                    aria-label={`Tirar ponto de ${label}`}
                    onClick={() => change(key, -1)}
                  >
                    −
                  </button>
                  <output>{add ? `+${add}` : 0}</output>
                  <button
                    type="button"
                    disabled={used >= 2 || v1 >= ATTRIBUTE_CAP}
                    aria-label={`Pôr ponto em ${label}`}
                    onClick={() => change(key, 1)}
                  >
                    +
                  </button>
                </span>
                <span data-value>
                  {add ? <s>{v0}</s> : null}
                  {v1}
                  <span
                    data-mod={
                      modifierOf(v1) !== modifierOf(v0) ? 'chg' : undefined
                    }
                  >
                    {formatModifier(modifierOf(v1))}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <LevelUpDetail
        kind="Prévia"
        title={
          changed.length
            ? 'Modificadores que mudam'
            : used
              ? 'Nenhum modificador muda'
              : 'Ponha os pontos'
        }
      >
        {changed.length ? (
          changed.map((k) => (
            <p key={k}>
              <b>{ATTRIBUTE_LABELS[k][1]}</b>{' '}
              {formatModifier(modifierOf(plan.attributes[k].total))} →{' '}
              <b>
                {formatModifier(
                  modifierOf(plan.attributes[k].total + (draft.points[k] ?? 0))
                )}
              </b>
              {k === 'con'
                ? '. A vida deste nível já soma o modificador novo. Os níveis anteriores não mudam.'
                : '.'}
            </p>
          ))
        ) : (
          <p>
            {used
              ? 'O valor sobe, mas o modificador só muda no próximo número par. Pode valer para um requisito.'
              : 'Os valores à direita mostram como fica.'}
          </p>
        )}
      </LevelUpDetail>
    </div>
  );
};

export default AttributeStep;
