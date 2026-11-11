'use client';

import { useState } from 'react';
import type { ISubrace } from '@/db/races/race.d';
import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import { ChevronDownIcon, ChevronUpIcon, PencilIcon } from '../../Icons';
import RaceArt from '../../RaceArt';
import RaceButton from '../../RaceButton';
import RaceIconButton from '../../RaceIconButton';
import Abilities from '../Abilities';
import { LORE_FIELDS, TRAIT_FIELDS, borrowHue, paragraphs } from '../fields';
import type { IRaceActions, IRaceView } from '../types';
import SubracePanelHandles from './handles';

interface IProps {
  race: IRaceView;
  sub: ISubrace;
  onSelect: (slug: string) => void;
  actions: IRaceActions;
}

type Status = 'own' | 'inherited' | 'sum';

/** O painel de uma sub-raça: traços próprios x herdados, habilidades e crônica. */
const SubracePanel = ({ race, sub, onSelect, actions }: IProps) => {
  const handles = useCssHandles(SubracePanelHandles);
  const [onlyOwn, setOnlyOwn] = useState(false);
  const { canEdit } = actions;

  const index = race.subraces.findIndex((s) => s.slug === sub.slug);
  const prev = race.subraces[index - 1];
  const next = race.subraces[index + 1];
  const headArt = sub.image ?? race.images[0];
  const borrowed = !sub.image;
  const hue = borrowHue(index);
  const notPassed = race.baseOnlyTraits ?? [];
  const lore = LORE_FIELDS.filter(({ name }) => sub[name]);

  const pill = (status: Status) => (
    <span
      className={`${handles.racePanelPill} ${applyModifiers(
        handles.racePanelPill,
        status
      )}`}
    >
      {status === 'own'
        ? 'Próprio'
        : status === 'sum'
          ? 'Raça + sub-raça'
          : 'Herdado'}
    </span>
  );

  const rows = TRAIT_FIELDS.map(({ name, label }) => {
    const fromRace = race[name];
    const own = sub[name];
    if (!fromRace && !own) return null;

    // O incremento é a exceção: o da sub-raça se SOMA ao da raça.
    if (name === 'abilityScoreIncrease' && fromRace && own) {
      return (
        <div
          key={name}
          className={`${handles.racePanelRow} ${applyModifiers(handles.racePanelRow, 'own')}`}
        >
          <span>{label}</span>
          <div>
            <div className={handles.racePanelLayer}>
              <small>Da raça</small>
              <span>{fromRace}</span>
            </div>
            <div
              className={`${handles.racePanelLayer} ${applyModifiers(handles.racePanelLayer, 'mine')}`}
            >
              <small>Desta sub-raça</small>
              <span>{own}</span>
            </div>
          </div>
          {pill('sum')}
        </div>
      );
    }
    if (own) {
      return (
        <div
          key={name}
          className={`${handles.racePanelRow} ${applyModifiers(handles.racePanelRow, 'own')}`}
        >
          <span>{label}</span>
          <div>
            <span>{own}</span>
            {fromRace && (
              <details>
                <summary>Substitui o da raça</summary>
                <p>{fromRace}</p>
              </details>
            )}
          </div>
          {pill('own')}
        </div>
      );
    }
    if (onlyOwn) return null;
    return (
      <div
        key={name}
        className={`${handles.racePanelRow} ${applyModifiers(handles.racePanelRow, 'inherited')}`}
      >
        <span>{label}</span>
        <div>
          <span>{fromRace}</span>
        </div>
        {pill('inherited')}
      </div>
    );
  }).filter(Boolean);

  return (
    <article
      id="race-subpanel"
      className={handles.racePanel}
      role="tabpanel"
      aria-labelledby={`race-tab-${sub.slug}`}
      tabIndex={-1}
    >
      <header
        className={`${handles.racePanelHead}${
          headArt ? '' : ` ${applyModifiers(handles.racePanelHead, 'noart')}`
        }`}
      >
        {headArt && (
          <div className={handles.racePanelArt}>
            <RaceArt
              key={headArt.url}
              image={headArt}
              label={sub.name}
              alt={sub.image ? `Arte de ${sub.name}` : undefined}
              borrowed={borrowed}
              hue={hue}
            />
          </div>
        )}
        {canEdit ? (
          <div className={handles.racePanelTools}>
            <RaceIconButton
              small
              onArt
              off={index === 0}
              label={`Subir ${sub.name}`}
              icon={<ChevronUpIcon />}
              onClick={() => actions.moveSub(-1)}
            />
            <RaceIconButton
              small
              onArt
              off={index === race.subraces.length - 1}
              label={`Descer ${sub.name}`}
              icon={<ChevronDownIcon />}
              onClick={() => actions.moveSub(1)}
            />
            <RaceButton
              small
              icon={<PencilIcon />}
              onClick={actions.editSubIdentity}
            >
              Nome, grupo e arte
            </RaceButton>
          </div>
        ) : (
          borrowed &&
          headArt && (
            <span className={handles.racePanelLend}>
              Sem arte própria · arte da raça
            </span>
          )
        )}
        <div>
          {canEdit && borrowed && headArt && (
            <span className={handles.racePanelLend}>
              Sem arte própria · usando a da raça
            </span>
          )}
          <div className={handles.racePanelKicker}>
            <span>Sub-raça de {race.name}</span>
            {sub.group && <span>{sub.group}</span>}
          </div>
          <h3>{sub.name}</h3>
        </div>
      </header>

      <div className={handles.racePanelBody}>
        {headArt && (
          <div className={handles.racePanelAmb} aria-hidden="true">
            <RaceArt
              image={headArt}
              label={sub.name}
              borrowed={borrowed}
              hue={hue}
            />
          </div>
        )}

        <section className={handles.racePanelSec} aria-label="Traços">
          <h4>
            Traços
            <span className={handles.racePanelSecTools}>
              {canEdit && (
                <RaceIconButton
                  small
                  label={`Editar traços de ${sub.name}`}
                  icon={<PencilIcon />}
                  onClick={actions.editSubTraits}
                />
              )}
              <label className={handles.racePanelOnly}>
                <input
                  type="checkbox"
                  checked={onlyOwn}
                  onChange={(e) => setOnlyOwn(e.target.checked)}
                />{' '}
                Só o que muda
              </label>
            </span>
          </h4>
          <div className={handles.racePanelCmp}>
            {rows.length > 0 ? (
              rows
            ) : (
              <p className={handles.racePanelEmpty}>
                {onlyOwn
                  ? 'Esta sub-raça não muda nenhum traço da raça.'
                  : 'Nem a raça nem a sub-raça têm traços preenchidos.'}
              </p>
            )}
          </div>
        </section>

        <section className={handles.racePanelSec} aria-label="Habilidades">
          <h4>
            Habilidades
            <span className={handles.racePanelLegend}>
              <span
                className={`${handles.racePanelPill} ${applyModifiers(handles.racePanelPill, 'own')}`}
              >
                Desta sub-raça
              </span>
              <span
                className={`${handles.racePanelPill} ${applyModifiers(handles.racePanelPill, 'inherited')}`}
              >
                + Comum a todas
              </span>
            </span>
          </h4>
          <p className={handles.racePanelNote}>
            Quem é {sub.name} recebe as duas listas: as desta sub-raça{' '}
            <b>somadas</b> às comuns da raça.
          </p>
          {sub.traits.length > 0 || canEdit ? (
            <Abilities traits={sub.traits} scope="sub" actions={actions} />
          ) : (
            <p className={handles.racePanelEmpty}>
              Nenhuma habilidade própria.
            </p>
          )}
          {(race.traits.length > 0 || notPassed.length > 0) && (
            <div className={handles.racePanelStrip}>
              <span>Comum a todas as sub-raças · da raça {race.name}</span>
              <div>
                {race.traits.map((t) => (
                  <a
                    key={t.name}
                    href="#habilidades"
                    onClick={(e) => {
                      e.preventDefault();
                      document
                        .getElementById('habilidades')
                        ?.scrollIntoView({ block: 'start' });
                    }}
                  >
                    {t.name}
                  </a>
                ))}
              </div>
              {notPassed.length > 0 && (
                <p>
                  Não recebe as habilidades só da raça base:{' '}
                  {notPassed.map((t, i) => (
                    <span key={t.name}>
                      {i > 0 && ', '}
                      <s>{t.name}</s>
                    </span>
                  ))}
                  .
                </p>
              )}
            </div>
          )}
        </section>

        {(lore.length > 0 || canEdit) && (
          <section
            className={`${handles.racePanelSec} ${handles.racePanelLore}`}
            aria-label="Crônica"
          >
            <h4>
              Crônica
              {canEdit && (
                <RaceIconButton
                  small
                  label={`Editar crônica de ${sub.name}`}
                  icon={<PencilIcon />}
                  onClick={actions.editSubLore}
                />
              )}
            </h4>
            {lore.length > 0 ? (
              lore.map(({ name, label }) => (
                <div key={name}>
                  <h5>{label}</h5>
                  {paragraphs(sub[name] ?? '').map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              ))
            ) : (
              <p className={handles.racePanelEmpty}>Sem crônica própria.</p>
            )}
          </section>
        )}
      </div>

      <footer className={handles.racePanelFoot}>
        <RaceButton
          disabled={!prev}
          onClick={() => {
            if (!prev) return;
            onSelect(prev.slug);
            document
              .getElementById('sub-racas')
              ?.scrollIntoView({ block: 'start' });
          }}
        >
          ← {prev ? prev.name : 'Anterior'}
        </RaceButton>
        <RaceButton
          disabled={!next}
          onClick={() => {
            if (!next) return;
            onSelect(next.slug);
            document
              .getElementById('sub-racas')
              ?.scrollIntoView({ block: 'start' });
          }}
        >
          {next ? next.name : 'Próxima'} →
        </RaceButton>
      </footer>
    </article>
  );
};

export default SubracePanel;
