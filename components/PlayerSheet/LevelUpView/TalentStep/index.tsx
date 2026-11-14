'use client';

import { useState } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import { sheetSounds } from '@/lib/sheetSounds';
import LevelUpChoice from '../../LevelUpChoice';
import LevelUpDetail from '../../LevelUpDetail';
import LevelUpPill from '../../LevelUpPill';
import LevelUpViewHandles from '../handles';
import type { IStepProps } from '../types';

/** Talento só da classe, na vaga que a classe concede neste nível. */
const TalentStep = ({ plan, draft, patch }: IStepProps) => {
  const handles = useCssHandles(LevelUpViewHandles);
  const [hover, setHover] = useState<string | null>(null);
  const slots = plan.classTalentSlots;
  const list = plan.talentOptions
    .filter((t) => t.scope === 'class')
    .sort((a, b) => Number(b.ok) - Number(a.ok));
  const focus =
    list.find((t) => t.key === hover) ??
    list.find((t) => draft.classTalentKeys.includes(t.key)) ??
    list[0];

  return (
    <div className={handles.luContent}>
      <div className={handles.luPane}>
        <div className={handles.luPaneHead}>
          <h3>Talento de {plan.className}</h3>
          <p>
            A classe concede {slots === 1 ? 'um talento' : `${slots} talentos`}{' '}
            neste nível. Os requisitos são conferidos contra a ficha no nível{' '}
            {plan.level}.
          </p>
        </div>
        <div className={handles.luFilterRow}>
          <span className={handles.luCounter}>
            <b>{list.filter((t) => t.ok).length}</b> disponíveis ·{' '}
            {list.filter((t) => !t.ok).length} com requisito pendente
          </span>
          <span className={handles.luCounter}>
            Escolhidos{' '}
            <b>
              {draft.classTalentKeys.length}/{slots}
            </b>
          </span>
        </div>
        <div
          className={handles.luChoices}
          role="group"
          aria-label="Talentos da classe"
        >
          {list.map((t) => {
            const on = draft.classTalentKeys.includes(t.key);
            const full = !on && draft.classTalentKeys.length >= slots;
            return (
              <LevelUpChoice
                key={t.key}
                name={t.name}
                description={t.description}
                selected={on}
                locked={!t.ok || full}
                tags={<LevelUpPill>{plan.className.toLowerCase()}</LevelUpPill>}
                requirement={t.ok ? undefined : t.missing.join(', ')}
                onHover={() => setHover(t.key)}
                onSelect={() => {
                  patch({
                    classTalentKeys: on
                      ? draft.classTalentKeys.filter((k) => k !== t.key)
                      : [...draft.classTalentKeys, t.key],
                  });
                  sheetSounds.play(on ? 'unpick' : 'pick');
                }}
              />
            );
          })}
        </div>
      </div>
      {focus && (
        <LevelUpDetail
          kind={`Talento de ${plan.className}`}
          title={focus.name}
          body={focus.description}
          meta={
            <dl>
              <dt>Requisito</dt>
              <dd>{focus.prerequisites || 'Nenhum'}</dd>
              <dt>Situação</dt>
              <dd>
                {focus.ok ? 'Disponível' : `Falta: ${focus.missing.join(', ')}`}
              </dd>
            </dl>
          }
        />
      )}
    </div>
  );
};

export default TalentStep;
