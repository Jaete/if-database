'use client';

import { useState } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import { sheetSounds } from '@/lib/sheetSounds';
import LevelUpChoice from '../../LevelUpChoice';
import LevelUpDetail from '../../LevelUpDetail';
import LevelUpPill from '../../LevelUpPill';
import LevelUpViewHandles from '../handles';
import type { IStepProps } from '../types';

/** Característica entre opções: é UMA ou a OUTRA, nunca as duas. */
const FeatureStep = ({ plan, draft, patch }: IStepProps) => {
  const handles = useCssHandles(LevelUpViewHandles);
  const [hover, setHover] = useState<string | null>(null);

  const all = plan.featureChoices.flatMap((g) => g.options);
  const focus =
    all.find((o) => o.name === hover) ??
    all.find((o) => draft.features.includes(o.name)) ??
    all[0];

  return (
    <div className={handles.luContent}>
      <div className={handles.luPane}>
        {plan.featureChoices.map((group, gi) => (
          <div key={gi} className={handles.luPane}>
            <div className={handles.luPaneHead}>
              <h3>Escolha uma característica</h3>
              <p>
                A tabela do nível {plan.level} diz{' '}
                <b>&ldquo;{group.raw}&rdquo;</b>. É uma opção ou a outra:
                destas, fica uma.
              </p>
            </div>
            <div
              className={handles.luChoices}
              role="radiogroup"
              aria-label={`Característica do nível ${plan.level}`}
            >
              {group.options.map((o) => (
                <LevelUpChoice
                  key={o.name}
                  name={o.name}
                  description={o.description}
                  selected={draft.features[gi] === o.name}
                  tags={
                    o.requiresPrerequisite ? (
                      <LevelUpPill tone="muted">tem requisito</LevelUpPill>
                    ) : undefined
                  }
                  onHover={() => setHover(o.name)}
                  onSelect={() => {
                    const next = [...draft.features];
                    next[gi] = o.name;
                    patch({ features: next });
                    setHover(o.name);
                    sheetSounds.play('pick');
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      {focus && (
        <LevelUpDetail
          kind={`Característica · nível ${plan.level}`}
          title={focus.name}
          body={focus.description}
        />
      )}
    </div>
  );
};

export default FeatureStep;
