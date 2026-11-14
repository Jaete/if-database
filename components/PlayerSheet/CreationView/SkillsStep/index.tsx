'use client';

import { useId } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import { sheetSounds } from '@/lib/sheetSounds';
import { SKILL_ATTR } from '@/lib/creation';
import LevelUpDetail from '../../LevelUpDetail';
import LevelUpPill from '../../LevelUpPill';
import LevelUpViewHandles from '../../LevelUpView/handles';
import CreationViewHandles from '../handles';
import { useStep } from '../useStep';

const COMMON_LANGUAGES = [
  'Comum',
  'Anão',
  'Élfico',
  'Gigante',
  'Gnômico',
  'Goblin',
  'Halfling',
  'Orc',
  'Abissal',
  'Celestial',
  'Dracônico',
  'Infernal',
  'Primordial',
  'Silvestre',
  'Subcomum',
];

/**
 * Perícias vêm só da classe (a lista e o número, lidos do tópico). Idiomas: os
 * da raça entram travados, e UM extra à escolha é recomendado.
 */
const SkillsStep = () => {
  const lu = useCssHandles(LevelUpViewHandles);
  const handles = useCssHandles(CreationViewHandles);
  const { creation, data, d } = useStep();
  const listId = useId();
  const k = d.klass;

  if (!k) {
    return (
      <div className={`${lu.luContent} ${lu.luContent}--single`}>
        <div className={lu.luPane}>
          <div className={lu.luNote}>Escolha a classe primeiro.</div>
        </div>
      </div>
    );
  }
  const chosen = d.classSkills;
  const g = d.grants;
  const racialSkills = [
    ...g.skills,
    ...g.versatile
      .filter((v) => v.kind === 'skill' && v.value)
      .map((v) => v.value),
  ];
  const list =
    k.skills.list.length > 0 ? k.skills.list : Object.keys(SKILL_ATTR);
  const n = k.skills.n;
  const full = n !== null && chosen.length >= n;

  const toggle = (name: string) => {
    if (!creation.canEdit) return;
    const on = chosen.includes(name);
    if (!on && full) return;
    creation.patch({
      skills: on ? chosen.filter((c) => c !== name) : [...chosen, name],
    });
    sheetSounds.play(on ? 'unpick' : 'pick');
  };

  return (
    <div className={lu.luContent}>
      <div className={lu.luPane}>
        <div className={lu.luPaneHead}>
          <h3>Perícias</h3>
          <p>
            {k.name}: escolha <b>{n ?? 'as'}</b> perícia{n === 1 ? '' : 's'}
            {k.skills.list.length > 0 ? ' desta lista' : ''}. A raça não dá
            perícia.
          </p>
        </div>
        <div className={lu.luCounter}>
          <b>{chosen.length}</b> de {n ?? 'livre'} escolhidas
        </div>
        <div className={handles.crSkills} role="group" aria-label="Perícias">
          {list.map((name) => {
            const on = chosen.includes(name);
            return (
              <button
                key={name}
                type="button"
                className={handles.crSkill}
                aria-pressed={on}
                disabled={(!on && full) || racialSkills.includes(name)}
                onClick={() => toggle(name)}
              >
                {name}
              </button>
            );
          })}
        </div>
        {d.grantTotals.skills > 0 && (
          <>
            <div className={lu.luPaneHead}>
              <h3>Perícias da raça</h3>
              <p>
                {d.grantEntries
                  .filter((e) => e.kind === 'skills')
                  .map((e) => `+${e.n} · ${e.label ?? 'raça'}`)
                  .join(' · ')}
                . Qualquer das 18 perícias, sem repetir as da classe.
              </p>
            </div>
            <div className={lu.luCounter}>
              <b>{g.skills.length}</b> de {d.grantTotals.skills}
            </div>
            <div
              className={handles.crSkills}
              role="group"
              aria-label="Perícias da raça"
            >
              {Object.keys(SKILL_ATTR).map((name) => {
                const on = g.skills.includes(name);
                const blocked =
                  (!on && g.skills.length >= d.grantTotals.skills) ||
                  chosen.includes(name) ||
                  (racialSkills.includes(name) && !on);
                return (
                  <button
                    key={name}
                    type="button"
                    className={handles.crSkill}
                    aria-pressed={on}
                    disabled={!creation.canEdit || blocked}
                    onClick={() => {
                      creation.patch({
                        grants: {
                          skills: on
                            ? g.skills.filter((c) => c !== name)
                            : [...g.skills, name],
                        },
                      });
                      sheetSounds.play(on ? 'unpick' : 'pick');
                    }}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </>
        )}
        {d.grantTotals.versatile > 0 &&
          Array.from({ length: d.grantTotals.versatile }, (_, i) => {
            const pick = g.versatile[i] ?? {
              kind: 'skill' as const,
              value: '',
            };
            const label = d.grantEntries.find(
              (e) => e.kind === 'versatile'
            )?.label;
            const write = (next: { kind: typeof pick.kind; value: string }) => {
              const all = Array.from(
                { length: d.grantTotals.versatile },
                (_, j) =>
                  j === i
                    ? next
                    : (g.versatile[j] ?? { kind: 'skill' as const, value: '' })
              );
              creation.patch({ grants: { versatile: all } });
            };
            return (
              <div key={i} className={handles.crPickRow}>
                <span>
                  Escolha versátil {i + 1} · {label ?? 'raça'}: perícia, kit de
                  ferramenta, instrumento musical ou idioma
                </span>
                <div role="radiogroup" aria-label="Tipo da escolha versátil">
                  {(
                    [
                      ['skill', 'Perícia'],
                      ['tool', 'Ferramenta'],
                      ['instrument', 'Instrumento'],
                      ['language', 'Idioma'],
                    ] as const
                  ).map(([kind, text]) => (
                    <button
                      key={kind}
                      type="button"
                      role="radio"
                      className={handles.crPickBtn}
                      aria-checked={pick.kind === kind}
                      disabled={!creation.canEdit}
                      onClick={() => write({ kind, value: '' })}
                    >
                      {text}
                    </button>
                  ))}
                </div>
                {pick.kind === 'skill' ? (
                  <div
                    className={handles.crSkills}
                    role="group"
                    aria-label="Perícia versátil"
                  >
                    {Object.keys(SKILL_ATTR).map((name) => (
                      <button
                        key={name}
                        type="button"
                        className={handles.crSkill}
                        aria-pressed={pick.value === name}
                        disabled={
                          !creation.canEdit ||
                          chosen.includes(name) ||
                          (racialSkills.includes(name) && pick.value !== name)
                        }
                        onClick={() => write({ kind: 'skill', value: name })}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                ) : (
                  <input
                    className={handles.crInput}
                    key={pick.kind}
                    list={pick.kind === 'language' ? listId : undefined}
                    defaultValue={pick.value}
                    maxLength={60}
                    placeholder={
                      pick.kind === 'tool'
                        ? 'Kit de ferramenta'
                        : pick.kind === 'instrument'
                          ? 'Instrumento musical'
                          : 'Idioma (ou outro…)'
                    }
                    disabled={!creation.canEdit}
                    onChange={(e) =>
                      write({ kind: pick.kind, value: e.target.value })
                    }
                  />
                )}
              </div>
            );
          })}
        {Array.from({ length: d.grantTotals.languages }, (_, i) => (
          <label key={`lang${i}`} className={handles.crField}>
            <span>
              Idioma da raça {i + 1}
              {d.grantEntries.find((e) => e.kind === 'languages')?.label
                ? ` · ${d.grantEntries.find((e) => e.kind === 'languages')?.label}`
                : ''}
            </span>
            <input
              className={handles.crInput}
              list={listId}
              defaultValue={g.languages[i] ?? ''}
              maxLength={40}
              disabled={!creation.canEdit}
              onChange={(e) => {
                const all = Array.from(
                  { length: d.grantTotals.languages },
                  (_, j) => (j === i ? e.target.value : (g.languages[j] ?? ''))
                );
                creation.patch({ grants: { languages: all } });
              }}
            />
          </label>
        ))}
        <div className={lu.luPaneHead}>
          <h3>Idiomas</h3>
          <p>
            Os da raça já estão na ficha. Um idioma extra é <b>recomendado</b>,
            não obrigatório.
          </p>
        </div>
        <div className={handles.crLangs}>
          {d.locked.map((l) => (
            <LevelUpPill key={l} tone="muted">
              {l} · da raça
            </LevelUpPill>
          ))}
        </div>
        <label className={handles.crField}>
          <span>Idioma extra</span>
          <input
            className={handles.crInput}
            list={listId}
            defaultValue={data.creation.extraLanguage ?? ''}
            maxLength={40}
            disabled={!creation.canEdit}
            onChange={(e) =>
              creation.patch({ creation: { extraLanguage: e.target.value } })
            }
          />
          <datalist id={listId}>
            {COMMON_LANGUAGES.filter((l) => !d.locked.includes(l)).map((l) => (
              <option key={l} value={l} />
            ))}
          </datalist>
        </label>
      </div>
      <LevelUpDetail
        kind="Perícias"
        title={k.name}
        body={
          k.skills.list.length > 0
            ? `Lista da classe: ${k.skills.list.join(', ')}.`
            : 'A classe não traz lista: escolha à vontade.'
        }
      />
    </div>
  );
};

export default SkillsStep;
