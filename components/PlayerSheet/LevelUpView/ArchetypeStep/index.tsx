'use client';

import { useState } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import { sheetSounds } from '@/lib/sheetSounds';
import LevelUpChoice from '../../LevelUpChoice';
import LevelUpDetail from '../../LevelUpDetail';
import LevelUpViewHandles from '../handles';
import type { IStepProps } from '../types';

/** O arquétipo no nível em que a classe manda escolher, e as habilidades dele. */
const ArchetypeStep = ({ plan, draft, patch }: IStepProps) => {
  const handles = useCssHandles(LevelUpViewHandles);
  const [hover, setHover] = useState<string | null>(null);
  const a = plan.archetype!;
  const slug = a.pickSlug ? draft.archetypeSlug : a.currentSlug;
  const chosen = a.archetypes.find((x) => x.slug === slug);
  const pool = (chosen?.features ?? []).filter(
    (f) => !a.taken.includes(f.name)
  );
  const want = Math.min(a.featureSlots, pool.length);

  const focusFeature = pool.find((f) => f.name === hover);
  const focusArch = a.archetypes.find((x) => x.slug === hover) ?? chosen;

  return (
    <div className={handles.luContent}>
      <div className={handles.luPane}>
        {a.pickSlug && (
          <>
            <div className={handles.luPaneHead}>
              <h3>Escolha o arquétipo</h3>
              <p>
                É a especialização da classe, e define as habilidades que vêm
                depois.
              </p>
            </div>
            <div
              className={handles.luChoices}
              role="radiogroup"
              aria-label="Arquétipo"
            >
              {a.archetypes.map((x) => (
                <LevelUpChoice
                  key={x.slug}
                  name={x.name}
                  description={x.description}
                  selected={draft.archetypeSlug === x.slug}
                  onHover={() => setHover(x.slug)}
                  onSelect={() => {
                    patch({ archetypeSlug: x.slug, archetypeFeatures: [] });
                    setHover(x.slug);
                    sheetSounds.play('pick');
                  }}
                />
              ))}
            </div>
          </>
        )}
        {want > 0 && (
          <>
            <div className={handles.luPaneHead}>
              <h3>Habilidade de arquétipo</h3>
              <p>
                {chosen ? (
                  <>
                    {chosen.name}: escolha <b>{want}</b>{' '}
                    {want === 1 ? 'habilidade' : 'habilidades'}.
                  </>
                ) : (
                  'Escolha o arquétipo primeiro.'
                )}
              </p>
            </div>
            <div className={handles.luFilterRow}>
              <span className={handles.luCounter}>
                Escolhidas{' '}
                <b>
                  {draft.archetypeFeatures.length}/{want}
                </b>
              </span>
            </div>
            <div
              className={handles.luChoices}
              role="group"
              aria-label="Habilidades do arquétipo"
            >
              {pool.map((f) => {
                const on = draft.archetypeFeatures.includes(f.name);
                const full = !on && draft.archetypeFeatures.length >= want;
                return (
                  <LevelUpChoice
                    key={f.name}
                    name={f.name}
                    description={f.description}
                    selected={on}
                    locked={full}
                    onHover={() => setHover(f.name)}
                    onSelect={() => {
                      patch({
                        archetypeFeatures: on
                          ? draft.archetypeFeatures.filter((n) => n !== f.name)
                          : [...draft.archetypeFeatures, f.name],
                      });
                      sheetSounds.play(on ? 'unpick' : 'pick');
                    }}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
      {focusFeature ? (
        <LevelUpDetail
          kind="Habilidade de arquétipo"
          title={focusFeature.name}
          body={focusFeature.description}
        />
      ) : focusArch ? (
        <LevelUpDetail
          kind="Arquétipo"
          title={focusArch.name}
          body={focusArch.description}
        />
      ) : (
        <LevelUpDetail kind="Arquétipo" title="Escolha um arquétipo" body="" />
      )}
    </div>
  );
};

export default ArchetypeStep;
