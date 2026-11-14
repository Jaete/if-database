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
  const chosen = (
    (player.proficiencies?.skills ?? []) as {
      name: string;
      proficient?: boolean;
    }[]
  )
    .filter((s) => s.proficient)
    .map((s) => s.name);
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
                disabled={!on && full}
                onClick={() => toggle(name)}
              >
                {name}
              </button>
            );
          })}
        </div>
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
