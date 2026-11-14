'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import { sheetSounds } from '@/lib/sheetSounds';
import { ClassSigilIcon, CheckIcon } from '../../Icons';
import LevelUpButton from '../LevelUpButton';
import LevelUpPill from '../LevelUpPill';
import { useLevelUp } from '../LevelUpContext';
import SoundButton from '../SoundButton';
import ArchetypeStep from './ArchetypeStep';
import AttributeStep from './AttributeStep';
import CantripStep from './CantripStep';
import CatalogPickStep from './CatalogPickStep';
import FeatureStep from './FeatureStep';
import GainsStep from './GainsStep';
import HpStep from './HpStep';
import ReviewStep from './ReviewStep';
import RollAskDialog from './RollAskDialog';
import RollStage from './RollStage';
import SealDialog from './SealDialog';
import SpellStep from './SpellStep';
import TalentStep from './TalentStep';
import LevelUpViewHandles from './handles';
import {
  buildChoices,
  conModOf,
  hpGainFor,
  pointsSum,
  stepDone,
  useLevelDraft,
  type StepId,
} from './useLevelDraft';
import { ATTRIBUTE_LABELS } from '@/lib/levelUp';
import type { ILevelPlan } from '@/lib/levelUp';
import '@/styles/components/levelUp.scss';

const reducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

interface IInnerProps {
  plan: ILevelPlan;
}

/**
 * A subida de nível, numa tela própria sobre a ficha: um passo por vez, ✓ em
 * cada um pronto, painel de detalhe ao lado, e o selo só liga com tudo feito.
 * O rascunho é local; a única coisa gravada antes do selo é a rolagem de vida.
 */
const LevelUpInner = ({ plan }: IInnerProps) => {
  const handles = useCssHandles(LevelUpViewHandles);
  const {
    player,
    progress,
    editingLevel,
    close,
    seal,
    roll,
    busy,
    error,
    clearError,
  } = useLevelUp();
  const editing = editingLevel !== null;
  const { draft, patch, steps, required, doneCount, clear, allDone } =
    useLevelDraft(plan, String(player._id), editing);
  const [at, setAt] = useState(0);
  const [sealAsk, setSealAsk] = useState(false);
  const [rollAsk, setRollAsk] = useState(false);
  const [stage, setStage] = useState<null | {
    phase: 'tumble' | 'settled';
    result?: number;
    rolledAt?: string;
    rollId?: string;
  }>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const step = steps[at];
  const pending = progress.pending;
  const last = at === steps.length - 1;

  const go = useCallback((index: number) => {
    setAt(index);
    sheetSounds.play('pageTurn');
  }, []);
  const goTo = (id: StepId) => go(steps.findIndex((s) => s.id === id));

  // Esc sai da tela (a camada própria cuida dos diálogos).
  // Com um diálogo aberto (selo, aviso, dado rolando) o Esc não sai da tela
  // inteira: o diálogo cuida dele, e a rolagem o ignora até mostrar o resultado.
  const blocked = sealAsk || rollAsk || !!stage;
  useEffect(() => {
    rootRef.current?.focus({ preventScroll: true });
  }, []);
  useEffect(() => {
    if (blocked) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return;
      event.preventDefault();
      close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [close, blocked]);

  // O resultado do dado aparece depois da animação; sair da tela cancela isso.
  const timers = useRef<number[]>([]);
  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((id) => window.clearTimeout(id));
  }, []);

  const hpGain = hpGainFor(plan, draft);

  const stepDesc = (id: StepId): string => {
    switch (id) {
      case 'ganhos':
        return 'Automático';
      case 'carac':
        return draft.features.filter(Boolean).join(', ') || 'Uma opção';
      case 'arquetipo':
        return (
          draft.archetypeFeatures.join(', ') ||
          draft.archetypeSlug ||
          plan.archetype?.currentSlug ||
          'Escolher'
        );
      case 'talento':
        return (
          draft.classTalentKeys
            .map((k) => plan.talentOptions.find((t) => t.key === k)?.name)
            .join(', ') || plan.className
        );
      case 'marco':
        return draft.milestoneUse === 'attribute'
          ? Object.entries(draft.points)
              .filter(([, v]) => v)
              .map(
                ([k, v]) =>
                  `${ATTRIBUTE_LABELS[k as keyof typeof ATTRIBUTE_LABELS][0]} +${v}`
              )
              .join(', ') || '2 pontos'
          : (plan.talentOptions.find((t) => t.key === draft.milestoneTalent)
              ?.name ?? 'Talento');
      case 'truques':
        return (
          draft.cantripIds
            .map((i) => plan.cantrips.options.find((o) => o.id === i)?.name)
            .join(', ') || `${plan.cantrips.need} para escolher`
        );
      case 'magias':
        return plan.spells.need
          ? draft.spellIds
              .map((i) => plan.spells.options.find((o) => o.id === i)?.name)
              .join(', ') || `${plan.spells.need} para preparar`
          : 'Nada novo';
      case 'vida':
        return hpGain !== null ? `+${hpGain} vida` : 'Fixo ou rolar';
      default:
        if (id.startsWith('cat:')) {
          const picked = draft.catalogPicks[id.slice(4)] ?? [];
          const need =
            plan.catalogPicks.find((c) => `cat:${c.slug}` === id)?.need ?? 0;
          return picked.length > 0
            ? picked.join(', ')
            : `${need} para escolher`;
        }
        return allDone
          ? 'Pronto para selar'
          : `${required.length - doneCount} pendente${required.length - doneCount === 1 ? '' : 's'}`;
    }
  };

  const doRoll = async () => {
    setRollAsk(false);
    setStage({ phase: 'tumble' });
    const result = await roll();
    if (!result) {
      setStage(null);
      return;
    }
    const wait = reducedMotion() ? 250 : 1500;
    sheetSounds.die(wait / 1000);
    timers.current.push(
      window.setTimeout(() => {
        patch({ hpMode: 'roll' });
        setStage({
          phase: 'settled',
          result: result.result,
          rolledAt: result.at,
          rollId: result.rollId,
        });
      }, wait)
    );
  };

  const sealItems = () => {
    const out: { text: string; kind: string }[] = [];
    plan.autoFeatures.forEach((f) =>
      out.push({ text: f.name, kind: 'característica' })
    );
    draft.features
      .filter(Boolean)
      .forEach((f) => out.push({ text: f as string, kind: 'característica' }));
    if (plan.archetype) {
      const slug = plan.archetype.pickSlug
        ? draft.archetypeSlug
        : plan.archetype.currentSlug;
      const name = plan.archetype.archetypes.find((a) => a.slug === slug)?.name;
      if (plan.archetype.pickSlug && name)
        out.push({ text: name, kind: 'arquétipo' });
      draft.archetypeFeatures.forEach((f) =>
        out.push({ text: f, kind: 'habilidade' })
      );
    }
    draft.classTalentKeys.forEach((k) =>
      out.push({
        text: plan.talentOptions.find((t) => t.key === k)?.name ?? k,
        kind: 'talento',
      })
    );
    if (plan.milestone) {
      if (draft.milestoneUse === 'talent') {
        out.push({
          text:
            plan.talentOptions.find((t) => t.key === draft.milestoneTalent)
              ?.name ?? '',
          kind: 'talento',
        });
      } else if (pointsSum(draft) > 0) {
        out.push({ text: stepDesc('marco'), kind: 'atributos' });
      }
    }
    for (const c of plan.catalogPicks) {
      (draft.catalogPicks[c.slug] ?? []).forEach((item) =>
        out.push({ text: item, kind: c.name })
      );
    }
    draft.cantripIds.forEach((id) =>
      out.push({
        text: plan.cantrips.options.find((o) => o.id === id)?.name ?? id,
        kind: 'truque',
      })
    );
    draft.spellIds.forEach((id) =>
      out.push({
        text: plan.spells.options.find((o) => o.id === id)?.name ?? id,
        kind: 'magia',
      })
    );
    return out;
  };

  const doSeal = async () => {
    const ok = await seal(
      buildChoices(plan, draft),
      editing ? 'Escolhas editadas pelo admin' : undefined
    );
    if (ok) clear();
  };

  const renderStep = () => {
    const common = { plan, draft, patch };
    switch (step.id) {
      case 'ganhos':
        return <GainsStep {...common} />;
      case 'carac':
        return <FeatureStep {...common} />;
      case 'arquetipo':
        return <ArchetypeStep {...common} />;
      case 'talento':
        return <TalentStep {...common} />;
      case 'marco':
        return <AttributeStep {...common} />;
      case 'truques':
        return <CantripStep {...common} />;
      case 'magias':
        return <SpellStep {...common} />;
      case 'vida':
        return (
          <HpStep
            {...common}
            locked={!!plan.hp.roll && editing}
            onAskRoll={() => {
              setRollAsk(true);
              sheetSounds.play('paperSlide');
            }}
          />
        );
      default:
        if (step.id.startsWith('cat:')) {
          return <CatalogPickStep {...common} slug={step.id.slice(4)} />;
        }
        return <ReviewStep {...common} onGo={goTo} />;
    }
  };

  const con = conModOf(plan, draft);

  return (
    <div
      ref={rootRef}
      tabIndex={-1}
      className={handles.luView}
      role="dialog"
      aria-label={`Subir para o nível ${plan.level}`}
    >
      <div className={handles.luViewTop} inert={blocked || undefined}>
        <ClassSigilIcon className={handles.luViewEmblem} />
        <div className={handles.luViewHead}>
          <small>
            {String(player.name)} · {plan.className}
            {pending > 1 && !editing
              ? ` · nível ${plan.level} de ${progress.earned}`
              : ''}
          </small>
          <h2>
            Nível{' '}
            <span>
              {plan.level - 1} → {plan.level}
            </span>
            {editing && <LevelUpPill tone="warn">edição de admin</LevelUpPill>}
          </h2>
        </div>
        <div className={handles.luViewTopRight}>
          {pending > 1 && !editing && (
            <span className={handles.luViewQueue}>
              {Array.from({ length: pending }, (_, i) => (
                <i key={i} data-cur={i === 0 || undefined} />
              ))}
            </span>
          )}
          <SoundButton place="down" />
          <LevelUpButton variant="ghost" onClick={close}>
            Sair
          </LevelUpButton>
        </div>
      </div>
      <div className={handles.luMain} inert={blocked || undefined}>
        <ol
          className={handles.luSteps}
          aria-label={`Passos do nível ${plan.level}`}
        >
          {steps.map((s, i) => {
            const done = s.required && stepDone(plan, draft, s.id);
            return (
              <li key={s.id}>
                <button
                  type="button"
                  className={`${handles.luStep}${done ? ` ${handles.luStep}--done` : ''}`}
                  aria-current={i === at ? 'step' : undefined}
                  onClick={() => go(i)}
                >
                  <span className={handles.luStepNum}>
                    {done ? <CheckIcon width={11} height={11} /> : i + 1}
                  </span>
                  <span className={handles.luStepTitle}>{s.title}</span>
                  <span className={handles.luStepDesc}>{stepDesc(s.id)}</span>
                </button>
              </li>
            );
          })}
          <li className={handles.luStepsFoot}>
            <span>Escolhas</span>
            <span className={handles.luPips}>
              {required.map((s) => (
                <i
                  key={s.id}
                  data-on={stepDone(plan, draft, s.id) || undefined}
                />
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
              <i
                key={s.id}
                data-on={stepDone(plan, draft, s.id) || undefined}
              />
            ))}
          </span>
          <span>
            <b>
              {doneCount} de {required.length}
            </b>{' '}
            <span data-long>escolhas feitas</span>
          </span>
        </div>
        <div className={handles.luFootActs}>
          {at > 0 && (
            <LevelUpButton onClick={() => go(at - 1)}>Voltar</LevelUpButton>
          )}
          {last ? (
            <LevelUpButton
              variant="primary"
              size="lg"
              className={handles.luSealBtn}
              disabled={!allDone}
              onClick={() => {
                clearError();
                setSealAsk(true);
                sheetSounds.play('paperSlide');
              }}
            >
              {editing
                ? `Gravar nível ${plan.level}`
                : `Selar nível ${plan.level}`}
            </LevelUpButton>
          ) : (
            <LevelUpButton
              variant="primary"
              size="lg"
              onClick={() => go(at + 1)}
            >
              {steps[at + 1].id === 'revisao' ? 'Revisar' : 'Próximo'}:{' '}
              {steps[at + 1].title}
            </LevelUpButton>
          )}
        </div>
      </div>
      {sealAsk && hpGain !== null && (
        <SealDialog
          level={plan.level}
          items={sealItems()}
          hpFrom={plan.hp.current}
          hpTo={plan.hp.current + hpGain}
          more={pending > 1 && !editing}
          busy={busy}
          error={error}
          editing={editing}
          onCancel={() => setSealAsk(false)}
          onConfirm={() => void doSeal()}
        />
      )}
      {rollAsk && plan.hp.die && (
        <RollAskDialog
          level={plan.level}
          die={plan.hp.die}
          conMod={con}
          fixed={plan.hp.fixed ?? 0}
          onCancel={() => setRollAsk(false)}
          onFixed={() => {
            setRollAsk(false);
            patch({ hpMode: 'fixed' });
            sheetSounds.play('pick');
          }}
          onRoll={() => void doRoll()}
        />
      )}
      {stage && plan.hp.die && (
        <RollStage
          phase={stage.phase}
          die={plan.hp.die}
          result={stage.result}
          conMod={con}
          hpFrom={plan.hp.current}
          rolledAt={stage.rolledAt}
          rollId={stage.rollId}
          onContinue={() => {
            setStage(null);
            sheetSounds.play('paperSlide');
          }}
        />
      )}
      {!sealAsk && !rollAsk && !stage && error && (
        <p role="alert" className={handles.luError}>
          {error}
        </p>
      )}
    </div>
  );
};

const LevelUpView = () => {
  const { plan } = useLevelUp();
  if (!plan) return null;
  // Uma chave por nível: trocar de nível recomeça o rascunho e os passos.
  return (
    <LevelUpInner
      key={`${plan.level}-${plan.sealed ? 'edit' : 'new'}`}
      plan={plan}
    />
  );
};

export default LevelUpView;
