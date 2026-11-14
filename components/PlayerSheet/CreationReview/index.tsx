'use client';

import { useEffect, useRef, useState } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import { sheetSounds } from '@/lib/sheetSounds';
import { ATTRIBUTES } from '@/lib/creation';
import { ATTRIBUTE_LABELS } from '@/lib/levelUp';
import { formatModifier } from '@/lib/stats';
import { ClassSigilIcon, CheckIcon, LockIcon } from '../../Icons';
import CopyFichaTag from '../../CopyFichaTag';
import LevelUpButton from '../LevelUpButton';
import LevelUpPill from '../LevelUpPill';
import LevelUpViewHandles from '../LevelUpView/handles';
import SoundButton from '../SoundButton';
import CreationViewHandles from '../CreationView/handles';
import { derive } from '../CreationView/derive';
import { useCreation } from '../CreationContext';
import '@/styles/components/levelUp.scss';
import '@/styles/components/creation.scss';

const STEPS = [
  ['identidade', 'Identidade'],
  ['raca', 'Raça'],
  ['classe', 'Classe'],
  ['atributos', 'Atributos'],
  ['nivel1', 'Nível 1'],
  ['pericias', 'Perícias'],
  ['magias', 'Magias'],
  ['equipamento', 'Equipamento'],
  ['historia', 'História'],
] as const;

const when = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });

/**
 * A revisão da staff, em três colunas: o checklist conferido pelo servidor, a
 * ficha inteira (os vazios em itálico) e o histórico com as rolagens
 * auditáveis. "Aprovar" trava a ficha; "Devolver" pede observações.
 */
const CreationReview = () => {
  const lu = useCssHandles(LevelUpViewHandles);
  const handles = useCssHandles(CreationViewHandles);
  const creation = useCreation();
  const { data, player, close } = creation;
  const [returning, setReturning] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [notes, setNotes] = useState('');
  const [flags, setFlags] = useState<string[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    rootRef.current?.focus({ preventScroll: true });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !event.defaultPrevented) {
        event.preventDefault();
        close();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [close]);

  if (!data || !player) return null;
  const d = derive(data, player);
  const required = data.issues.filter((i) => i.kind === 'required');
  const soft = data.issues.filter((i) => i.kind === 'recommended');
  const gilRolls = data.rolls.filter((r) => r.kind === 'gil');
  const gil = gilRolls.find((r) => r.classSlug === d.klass?.slug);
  const attr = data.rolls.find((r) => r.kind === 'attributes');

  const spells = (player.playerSpellcasting?.spellLevels ?? []).flatMap((l) =>
    (l.spells ?? []).map(
      (s) => `${s.name} (${l.level === 0 ? 'truque' : `${l.level}º`})`
    )
  );
  const skills = (
    (player.proficiencies?.skills ?? []) as {
      name: string;
      proficient?: boolean;
    }[]
  )
    .filter((s) => s.proficient)
    .map((s) => s.name);
  const fields: [string, string][] = [
    ['Nome', String(player.name ?? '')],
    ['Epíteto', String(player.subtitle ?? '')],
    ['Raça', String(player.race ?? '')],
    ['Classe', String(player.class ?? '')],
    [
      'Atributos',
      d.placed
        ? ATTRIBUTES.map(
            (k) =>
              `${ATTRIBUTE_LABELS[k][0]} ${d.totals[k].total} (${formatModifier(d.totals[k].mod)})`
          ).join(' · ')
        : '',
    ],
    ['Vida', d.hp !== null ? String(d.hp) : ''],
    [
      'Deslocamento',
      d.speed.walk !== undefined
        ? [
            `${d.speed.walk} m`,
            d.speed.fly !== undefined && `voo ${d.speed.fly} m`,
            d.speed.swim !== undefined && `natação ${d.speed.swim} m`,
          ]
            .filter(Boolean)
            .join(' · ')
        : '',
    ],
    [
      'Características escolhidas',
      (data.creation.featureChoices ?? []).join(', '),
    ],
    ['Perícias', skills.join(', ')],
    ['Idiomas', ((player.languages ?? []) as string[]).join(', ')],
    ['Magias', spells.join(', ')],
    ['Equipamento', String(player.equipment?.backpack ?? '')],
    ['Gil', gil ? String(player.equipment?.gil ?? '') : ''],
    ['Aparência', String(player.appearance ?? '')],
    ['História', String(player.backstory ?? '')],
    ['Narração', String(player.narrationStyle ?? '')],
    ['Retrato', player.image ? 'Enviado' : ''],
  ];

  return (
    <div
      ref={rootRef}
      tabIndex={-1}
      className={lu.luView}
      role="dialog"
      aria-label="Revisão da ficha"
    >
      <div className={lu.luViewTop}>
        <ClassSigilIcon className={lu.luViewEmblem} />
        <div className={lu.luViewHead}>
          <small>{player.ownerUsername}</small>
          <h2>
            Revisão <span>{String(player.name ?? 'sem nome')}</span>
            <LevelUpPill tone={creation.status === 'approved' ? 'ok' : 'gold'}>
              {creation.status === 'submitted'
                ? 'aguardando aprovação'
                : creation.status === 'returned'
                  ? 'devolvida'
                  : creation.status === 'approved'
                    ? 'aprovada'
                    : 'em criação'}
            </LevelUpPill>
          </h2>
        </div>
        <div className={lu.luViewTopRight}>
          <CopyFichaTag playerId={String(player._id)} />
          <SoundButton place="down" />
          <LevelUpButton variant="ghost" onClick={close}>
            Sair
          </LevelUpButton>
        </div>
      </div>
      <div className={handles.crReview} inert={confirm || undefined}>
        <section className={handles.crReviewCol} aria-label="Checklist">
          <h3>Checklist</h3>
          <ul className={handles.crIssues}>
            {required.length === 0 && (
              <li className={handles.crIssue} data-kind="ok">
                <CheckIcon width={12} height={12} /> Obrigatório completo
              </li>
            )}
            {required.map((i, n) => (
              <li
                key={`r${n}`}
                className={handles.crIssue}
                data-kind="required"
              >
                {i.message}
              </li>
            ))}
            {soft.map((i, n) => (
              <li
                key={`s${n}`}
                className={handles.crIssue}
                data-kind="recommended"
              >
                {i.message}
              </li>
            ))}
          </ul>
        </section>
        <section className={handles.crReviewCol} aria-label="A ficha">
          <h3>A ficha</h3>
          <dl className={handles.crFieldList}>
            {fields.map(([label, value]) => (
              <div key={label} className={handles.crFieldItem}>
                <dt>{label}</dt>
                <dd data-empty={!value || undefined}>{value || 'vazio'}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section className={handles.crReviewCol} aria-label="Histórico">
          <h3>Histórico</h3>
          <ul className={handles.crHistory}>
            {attr && (
              <li>
                <LockIcon width={11} height={11} /> <b>Atributos rolados</b>{' '}
                {when(attr.at)} por {attr.byUsername}
                <small>
                  {attr.sets.map((s) => `[${s.join(' ')}]`).join(' ')} →{' '}
                  {attr.sums.join(', ')} · {attr.rollId}
                </small>
              </li>
            )}
            {gilRolls.map((g) => (
              <li key={g.rollId}>
                <LockIcon width={11} height={11} /> <b>Gil rolado</b>{' '}
                {g.classSlug === d.klass?.slug
                  ? '(classe atual)'
                  : '(outra classe)'}{' '}
                {when(g.at)} por {g.byUsername}
                <small>
                  {g.classSlug} · {g.formula}: [{g.sets[0]?.join(' ')}] →{' '}
                  {g.sums[0]} · {g.rollId}
                </small>
              </li>
            ))}
            {[...data.review].reverse().map((r, i) => (
              <li key={i}>
                <b>
                  {r.kind === 'submit'
                    ? 'Enviada'
                    : r.kind === 'approve'
                      ? 'Aprovada'
                      : 'Devolvida'}
                </b>{' '}
                {when(r.at)} por {r.by}
                {r.notes && <small>{r.notes}</small>}
                {r.steps && r.steps.length > 0 && (
                  <small>Passos marcados: {r.steps.join(', ')}</small>
                )}
              </li>
            ))}
            {!attr && gilRolls.length === 0 && data.review.length === 0 && (
              <li>Nada registrado ainda.</li>
            )}
          </ul>
        </section>
      </div>
      <div className={lu.luFoot}>
        <div className={lu.luFootProg}>
          <span>
            {required.length === 0
              ? 'Pronta para aprovar'
              : `${required.length} pendência(s) obrigatória(s)`}
          </span>
        </div>
        {creation.isStaff && creation.status !== 'approved' ? (
          <div className={lu.luFootActs}>
            <LevelUpButton onClick={() => setReturning(true)}>
              Devolver com observações
            </LevelUpButton>
            {(creation.status === 'submitted' ||
              creation.status === 'returned') && (
              <LevelUpButton
                disabled={required.length > 0}
                onClick={creation.startAdjust}
              >
                Aprovar com ajustes
              </LevelUpButton>
            )}
            <LevelUpButton
              variant="primary"
              size="lg"
              disabled={required.length > 0}
              onClick={() => {
                setConfirm(true);
                sheetSounds.play('paperSlide');
              }}
            >
              Aprovar ficha
            </LevelUpButton>
          </div>
        ) : null}
      </div>
      {returning && (
        <div className={lu.luVeil}>
          <div
            className={lu.luSealDlg}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="cr-return-title"
          >
            <h3 id="cr-return-title">Devolver com observações</h3>
            <label className={handles.crField}>
              <span>Observações para a dona da ficha *</span>
              <textarea
                className={handles.crTextarea}
                rows={5}
                value={notes}
                maxLength={4000}
                onChange={(e) => setNotes(e.target.value)}
              />
            </label>
            <fieldset className={handles.crStepFlags}>
              <legend>Passos a corrigir (opcional)</legend>
              {STEPS.map(([id, label]) => (
                <label key={id}>
                  <input
                    type="checkbox"
                    checked={flags.includes(id)}
                    onChange={(e) =>
                      setFlags((prev) =>
                        e.target.checked
                          ? [...prev, id]
                          : prev.filter((f) => f !== id)
                      )
                    }
                  />
                  {label}
                </label>
              ))}
            </fieldset>
            {creation.error && (
              <p role="alert" className={lu.luError}>
                {creation.error}
              </p>
            )}
            <div className={lu.luDialogActs}>
              <LevelUpButton onClick={() => setReturning(false)}>
                Cancelar
              </LevelUpButton>
              <LevelUpButton
                variant="danger"
                disabled={!notes.trim() || creation.busy}
                onClick={() => void creation.returnSheet(notes.trim(), flags)}
              >
                Devolver
              </LevelUpButton>
            </div>
          </div>
        </div>
      )}
      {confirm && (
        <div className={lu.luVeil}>
          <div
            className={lu.luSealDlg}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="cr-approve-title"
          >
            <h3 id="cr-approve-title">Aprovar a ficha?</h3>
            <ul className={lu.luWarnList}>
              <li>
                <b>A ficha trava.</b> A dona só poderá subir de nível; só um
                admin altera o resto.
              </li>
            </ul>
            {creation.error && (
              <p role="alert" className={lu.luError}>
                {creation.error}
              </p>
            )}
            <div className={lu.luDialogActs}>
              <LevelUpButton onClick={() => setConfirm(false)}>
                Voltar
              </LevelUpButton>
              <LevelUpButton
                variant="primary"
                size="lg"
                disabled={creation.busy}
                onClick={() => void creation.approve()}
              >
                Aprovar
              </LevelUpButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreationReview;
