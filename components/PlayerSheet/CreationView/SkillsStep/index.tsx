'use client';

import { useId } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import { sheetSounds } from '@/lib/sheetSounds';
import { SKILL_ATTR, skillSources } from '@/lib/creation';
import {
  CAP_MESSAGE,
  proficiencyLevel,
  sourceCaption,
  sourcesOf,
} from '@/lib/skills';
import type { ISkill } from '@/db/creatures/creatures.d';
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
  const { creation, data, player, d } = useStep();
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
  // Quantas fontes já dão cada perícia: duas = especialização, o teto.
  const sourceMap = skillSources(chosen, d.grantEntries, g);
  const count = (name: string) => sourceMap.get(name)?.length ?? 0;
  const becomes = (name: string, on: boolean) =>
    !on && count(name) === 1 ? ' · vira especialização' : '';
  const capped = (name: string, on: boolean) => !on && count(name) >= 2;
  // O que a ficha tem agora (resolvido pelo servidor) e o ajuste do narrador.
  const finalSkills = ((player.proficiencies?.skills ?? []) as ISkill[])
    .map((k) => ({ ...k, level: proficiencyLevel(k) }))
    .filter((k) => k.level > 0);
  const staffList = data.creation.staffSkills ?? [];
  const staffLevelOf = (name: string): 0 | 1 | 2 =>
    staffList.find((s) => s.name === name)?.level ??
    proficiencyLevel(
      (player.proficiencies?.skills as ISkill[] | undefined)?.find(
        (k) => k.name === name
      )
    );
  const LEVEL_TEXT = {
    0: 'sem proficiência',
    1: 'proficiente',
    2: 'especialização',
  } as const;
  const next = (level: 0 | 1 | 2) => ((level + 1) % 3) as 0 | 1 | 2;
  const setStaffLevel = (name: string, level: 0 | 1 | 2) => {
    creation.patch({
      staffSkills: [
        ...staffList.filter((s) => s.name !== name),
        { name, level },
      ],
    });
    sheetSounds.play('pick');
  };
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
                disabled={(!on && full) || capped(name, on)}
                title={capped(name, on) ? CAP_MESSAGE(name) : undefined}
                onClick={() => toggle(name)}
              >
                {name}
                {becomes(name, on)}
              </button>
            );
          })}
        </div>
        {/* O resultado: o que a ficha terá, com as fontes (Narrador incluso). */}
        {finalSkills.length > 0 && (
          <ul className={handles.crSpellList} aria-label="Perícias da ficha">
            {finalSkills.map((k) => (
              <li key={k.name} className={handles.crSpellItem}>
                <span>
                  {k.name}
                  {k.level === 2 && ' · Esp.'}
                </span>
                <small>{sourceCaption(sourcesOf(k))}</small>
              </li>
            ))}
          </ul>
        )}
        {creation.isStaff && (
          <>
            <div className={lu.luPaneHead}>
              <h3>Ajuste do narrador</h3>
              <p>
                Só a staff: leve qualquer perícia direto a nenhuma, proficiente
                ou especialização, venha a proficiência de onde vier. O que
                passa das fontes entra como &ldquo;Narrador&rdquo;.
              </p>
            </div>
            <div className={handles.crPicks}>
              {Object.keys(SKILL_ATTR).map((name) => {
                const level = staffLevelOf(name);
                return (
                  <div key={name} className={handles.crPickRow}>
                    <span>{name}</span>
                    <button
                      type="button"
                      className={handles.crLevelPip}
                      data-level={level}
                      disabled={!creation.canEdit}
                      aria-label={`${name}: ${LEVEL_TEXT[level]}. Clique para ${LEVEL_TEXT[next(level)]}`}
                      title={`${name}: ${LEVEL_TEXT[level]}. Clique para ${LEVEL_TEXT[next(level)]}`}
                      onClick={() => setStaffLevel(name, next(level))}
                    >
                      <span aria-hidden="true" />
                      {LEVEL_TEXT[level]}
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
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
                  capped(name, on);
                return (
                  <button
                    key={name}
                    type="button"
                    className={handles.crSkill}
                    aria-pressed={on}
                    disabled={!creation.canEdit || blocked}
                    title={capped(name, on) ? CAP_MESSAGE(name) : undefined}
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
                          (pick.value !== name && count(name) >= 2)
                        }
                        title={
                          pick.value !== name && count(name) >= 2
                            ? CAP_MESSAGE(name)
                            : undefined
                        }
                        onClick={() => write({ kind: 'skill', value: name })}
                      >
                        {name}
                        {becomes(name, pick.value === name)}
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
