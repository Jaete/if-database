'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import { sheetSounds } from '@/lib/sheetSounds';
import type { WizardStepId } from '@/lib/creation';
import { ClassSigilIcon, CheckIcon } from '../../Icons';
import LevelUpButton from '../LevelUpButton';
import LevelUpPill from '../LevelUpPill';
import SoundButton from '../SoundButton';
import CatalogLayerHost from '../CatalogLayerHost';
import { useCatalogRequest } from '../CatalogLayerContext';
import { useCreation, type CreationPayload } from '../CreationContext';
import LevelUpViewHandles from '../LevelUpView/handles';
import CreationEditingBridge from './CreationEditingBridge';
import AttributesStep from './AttributesStep';
import ClassStep from './ClassStep';
import EquipmentStep from './EquipmentStep';
import HistoryStep from './HistoryStep';
import IdentityStep from './IdentityStep';
import Level1Step from './Level1Step';
import RaceStep from './RaceStep';
import ReviewStep from './ReviewStep';
import SkillsStep from './SkillsStep';
import SpellsStep from './SpellsStep';
import SubmitDialog from './SubmitDialog';
import { derive } from './derive';
import '@/styles/components/levelUp.scss';
import '@/styles/components/creation.scss';

interface IStepDef {
  id: WizardStepId;
  title: string;
  desc: string;
  done: boolean;
  /** Passo que a classe dispensa (magias de quem não conjura). */
  skip?: boolean;
  soft?: boolean;
}

const hasIssue = (data: CreationPayload, step: string) =>
  data.issues.some((i) => i.step === step && i.kind === 'required');

/**
 * A criação da ficha, numa tela própria sobre a ficha: os mesmos passos com ✓,
 * painel e detalhe da subida de nível. O rascunho vai para o servidor a cada
 * passo; sair e voltar continua de onde parou.
 */
const CreationView = () => {
  const handles = useCssHandles(LevelUpViewHandles);
  const creation = useCreation();
  const { data, player, step, setStep, close, error, saving, unsaved } =
    creation;
  const catalogOpen = !!useCatalogRequest().request;
  const [askSubmit, setAskSubmit] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    rootRef.current?.focus({ preventScroll: true });
  }, []);

  // Esc sai da tela, a menos que um diálogo ou o códice esteja por cima.
  const blocked = askSubmit;
  useEffect(() => {
    if (blocked || catalogOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return;
      event.preventDefault();
      close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [close, blocked, catalogOpen]);

  const go = useCallback(
    (to: WizardStepId) => {
      setStep(to);
      sheetSounds.play('pageTurn');
    },
    [setStep]
  );

  if (!data || !player) return null;
  const d = derive(data, player);
  const k = d.klass;
  const casting = !!k?.caster;

  const skills = (
    (player.proficiencies?.skills ?? []) as { proficient?: boolean }[]
  ).filter((s) => s.proficient).length;
  const spells = (player.playerSpellcasting?.spellLevels ?? []).flatMap((l) =>
    (l.spells ?? []).map(() => l.level)
  );

  const steps: IStepDef[] = [
    {
      id: 'identidade',
      title: 'Identidade',
      desc: String(player.name ?? '').trim() || 'Nome e retrato',
      done: !hasIssue(data, 'identidade'),
    },
    {
      id: 'raca',
      title: 'Raça',
      desc: String(player.race ?? '') || 'Escolher no códice',
      done: !!d.race && !hasIssue(data, 'raca'),
    },
    {
      id: 'classe',
      title: 'Classe',
      desc: k?.name ?? 'Escolher no códice',
      done: !!k,
    },
    {
      id: 'atributos',
      title: 'Atributos',
      desc: d.baseComplete
        ? Object.values(d.totals)
            .map((t) => t.total)
            .join(' · ')
        : data.creation.method
          ? 'Faltam valores'
          : 'Escolher o método',
      done: !hasIssue(data, 'atributos'),
    },
    {
      id: 'nivel1',
      title: 'Nível 1',
      desc: !k
        ? 'Depende da classe'
        : d.hp !== null
          ? `${d.hp} de vida`
          : 'Vida e características',
      done: !!k && !hasIssue(data, 'nivel1') && d.hp !== null,
    },
    {
      id: 'pericias',
      title: 'Perícias',
      desc: k
        ? `${skills} de ${k.skills.n ?? 'livre'} · idioma ${
            data.creation.extraLanguage ? 1 : 0
          }/1`
        : 'Depende da classe',
      done: !!k && !hasIssue(data, 'pericias'),
    },
    {
      id: 'magias',
      title: 'Magias',
      desc: !k
        ? 'Depende da classe'
        : !casting
          ? 'A classe não conjura no nível 1'
          : `${spells.filter((c) => c === 0).length}/${k.cantripsKnown} truques · ${spells.filter((c) => c !== 0).length}/${k.preparedLimit}`,
      done: !!k && !hasIssue(data, 'magias'),
      skip: !!k && !casting,
    },
    {
      id: 'equipamento',
      title: 'Equipamento',
      desc: String(player.equipment?.backpack ?? '').trim()
        ? 'Descrito'
        : 'Texto livre e gil',
      done: !!String(player.equipment?.backpack ?? '').trim(),
      soft: true,
    },
    {
      id: 'historia',
      title: 'História',
      desc: String(player.backstory ?? '').trim()
        ? 'Escrita'
        : 'Aparência, passado, narração',
      done: !!String(player.backstory ?? '').trim(),
      soft: true,
    },
    {
      id: 'revisao',
      title: 'Revisão',
      desc: data.issues.some((i) => i.kind === 'required')
        ? `Faltam ${data.issues.filter((i) => i.kind === 'required').length}`
        : 'Pronta para enviar',
      done: !data.issues.some((i) => i.kind === 'required'),
    },
  ];
  const at = Math.max(
    0,
    steps.findIndex((s) => s.id === step)
  );
  const required = steps.filter(
    (s) => !s.soft && s.id !== 'revisao' && !s.skip
  );
  const doneCount = required.filter((s) => s.done).length;
  const ready = !data.issues.some((i) => i.kind === 'required');
  const last = at === steps.length - 1;

  const nextIndex = () => {
    let n = at + 1;
    while (steps[n]?.skip) n += 1;
    return n;
  };
  const prevIndex = () => {
    let n = at - 1;
    while (steps[n]?.skip) n -= 1;
    return n;
  };

  const renderStep = () => {
    switch (step) {
      case 'identidade':
        return <IdentityStep />;
      case 'raca':
        return <RaceStep />;
      case 'classe':
        return <ClassStep />;
      case 'atributos':
        return <AttributesStep />;
      case 'nivel1':
        return <Level1Step />;
      case 'pericias':
        return <SkillsStep />;
      case 'magias':
        return <SpellsStep />;
      case 'equipamento':
        return <EquipmentStep />;
      case 'historia':
        return <HistoryStep />;
      default:
        return <ReviewStep onGo={go} />;
    }
  };

  return (
    <CreationEditingBridge>
      <div
        ref={rootRef}
        tabIndex={-1}
        className={handles.luView}
        role="dialog"
        aria-label="Criação da ficha, nível 1"
      >
        <div className={handles.luViewTop} inert={blocked || undefined}>
          <ClassSigilIcon className={handles.luViewEmblem} />
          <div className={handles.luViewHead}>
            <small>
              {player.ownerUsername}
              {saving
                ? ' · salvando…'
                : unsaved
                  ? ' · não salvo · tentando de novo'
                  : ' · salvo no servidor'}
            </small>
            <h2>
              Criação <span>Nível 1</span>
              {creation.status === 'returned' && (
                <LevelUpPill tone="warn">devolvida</LevelUpPill>
              )}
            </h2>
          </div>
          <div className={handles.luViewTopRight}>
            <SoundButton place="down" />
            <LevelUpButton variant="ghost" onClick={close}>
              Sair
            </LevelUpButton>
          </div>
        </div>
        <div className={handles.luMain} inert={blocked || undefined}>
          <ol className={handles.luSteps} aria-label="Passos da criação">
            {steps.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  className={`${handles.luStep}${
                    s.done && !s.skip ? ` ${handles.luStep}--done` : ''
                  }`}
                  aria-current={i === at ? 'step' : undefined}
                  onClick={() => go(s.id)}
                >
                  <span className={handles.luStepNum}>
                    {s.done && !s.skip ? (
                      <CheckIcon width={11} height={11} />
                    ) : (
                      i + 1
                    )}
                  </span>
                  <span className={handles.luStepTitle}>{s.title}</span>
                  <span className={handles.luStepDesc}>{s.desc}</span>
                </button>
              </li>
            ))}
            <li className={handles.luStepsFoot}>
              <span>Obrigatório</span>
              <span className={handles.luPips}>
                {required.map((s) => (
                  <i key={s.id} data-on={s.done || undefined} />
                ))}
              </span>
            </li>
          </ol>
          {renderStep()}
        </div>
        <div className={handles.luFoot} inert={blocked || undefined}>
          <div className={handles.luFootProg}>
            <span className={handles.luPips}>
              {required.map((s) => (
                <i key={s.id} data-on={s.done || undefined} />
              ))}
            </span>
            <span>
              <b>
                {doneCount} de {required.length}
              </b>{' '}
              <span data-long>passos obrigatórios</span>
            </span>
          </div>
          <div className={handles.luFootActs}>
            {at > 0 && (
              <LevelUpButton onClick={() => go(steps[prevIndex()].id)}>
                Voltar
              </LevelUpButton>
            )}
            {last ? (
              <LevelUpButton
                variant="primary"
                size="lg"
                className={handles.luSealBtn}
                disabled={!ready || saving}
                onClick={() => {
                  creation.clearError();
                  setAskSubmit(true);
                  sheetSounds.play('paperSlide');
                }}
              >
                {creation.status === 'submitted'
                  ? 'Enviar de novo'
                  : 'Enviar para aprovação'}
              </LevelUpButton>
            ) : (
              <LevelUpButton
                variant="primary"
                size="lg"
                onClick={() => go(steps[nextIndex()].id)}
              >
                {steps[nextIndex()].id === 'revisao' ? 'Revisar' : 'Próximo'}:{' '}
                {steps[nextIndex()].title}
              </LevelUpButton>
            )}
          </div>
        </div>
        {askSubmit && (
          <SubmitDialog
            busy={creation.busy}
            error={error}
            onCancel={() => setAskSubmit(false)}
            onConfirm={() => void creation.submit()}
          />
        )}
        {!askSubmit && error && (
          <p role="alert" className={handles.luError}>
            {error}
          </p>
        )}
      </div>
      <CatalogLayerHost inCreation />
    </CreationEditingBridge>
  );
};

export default CreationView;
