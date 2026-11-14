'use client';

import { useCssHandles } from '@/hooks/useCssHandles';
import { formatModifier } from '@/lib/stats';
import { ATTRIBUTE_LABELS } from '@/lib/levelUp';
import LevelUpViewHandles from '../handles';
import type { IStepProps } from '../types';
import {
  conModOf,
  hpGainFor,
  stepDone,
  stepsOf,
  type StepId,
} from '../useLevelDraft';

interface IProps extends IStepProps {
  onGo: (id: StepId) => void;
}

/** O resumo do nível, com link para cada passo que ainda falta. */
const ReviewStep = ({ plan, draft, onGo }: IProps) => {
  const handles = useCssHandles(LevelUpViewHandles);
  const steps = stepsOf(plan, draft);
  const required = steps.filter((s) => s.required);
  const missing = required.filter((s) => !stepDone(plan, draft, s.id));
  const gain = hpGainFor(plan, draft);
  const talentName = (key: string | null) =>
    plan.talentOptions.find((t) => t.key === key)?.name ?? '';

  const row = (
    key: string,
    value: React.ReactNode,
    step?: StepId,
    ok = true,
    id: string = key
  ) => (
    <div
      key={id}
      className={`${handles.luReviewRow}${ok ? '' : ` ${handles.luReviewRow}--miss`}`}
    >
      <span data-k>{key}</span>
      <span data-v>{value}</span>
      {step ? (
        <button type="button" onClick={() => onGo(step)}>
          {ok ? 'alterar' : 'resolver'}
        </button>
      ) : (
        <span />
      )}
    </div>
  );

  const points = Object.entries(draft.points)
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `${ATTRIBUTE_LABELS[k as keyof typeof ATTRIBUTE_LABELS][0]} +${v}`
    )
    .join(', ');

  return (
    <div className={`${handles.luContent} ${handles.luContent}--single`}>
      <div className={handles.luPane}>
        <div className={handles.luPaneHead}>
          <h3>Resumo do nível {plan.level}</h3>
          <p>
            {missing.length ? (
              <>
                Faltam <b>{missing.map((s) => s.title).join(', ')}</b>. O botão
                Selar liga quando tudo estiver pronto.
              </>
            ) : (
              'Tudo pronto. Ao selar, o nível é gravado na ficha e as escolhas ficam fixas.'
            )}
          </p>
        </div>
        <div className={handles.luReview}>
          {plan.proficiency.to !== null &&
            row(
              'Proficiência',
              plan.proficiency.from === plan.proficiency.to ||
                plan.proficiency.from === null ? (
                <>
                  +{plan.proficiency.to} <small>sem mudança</small>
                </>
              ) : (
                <>
                  +{plan.proficiency.from} → <b>+{plan.proficiency.to}</b>
                </>
              )
            )}
          {plan.autoFeatures.map((f) =>
            row(
              'Característica',
              <>
                {f.name} <small>automática</small>
              </>,
              undefined,
              true,
              `auto-${f.name}`
            )
          )}
          {plan.featureChoices.length > 0 &&
            row(
              'Característica',
              draft.features.every(Boolean)
                ? draft.features.join(', ')
                : 'Falta escolher a característica',
              'carac',
              stepDone(plan, draft, 'carac')
            )}
          {plan.archetype &&
            row(
              'Arquétipo',
              stepDone(plan, draft, 'arquetipo')
                ? [
                    draft.archetypeSlug ?? plan.archetype.currentSlug,
                    ...draft.archetypeFeatures,
                  ]
                    .filter(Boolean)
                    .join(', ')
                : 'Falta escolher o arquétipo e as habilidades',
              'arquetipo',
              stepDone(plan, draft, 'arquetipo')
            )}
          {steps.some((s) => s.id === 'talento') &&
            row(
              'Talento',
              stepDone(plan, draft, 'talento')
                ? draft.classTalentKeys.map(talentName).join(', ')
                : 'Falta escolher o talento da classe',
              'talento',
              stepDone(plan, draft, 'talento')
            )}
          {steps
            .filter((s) => s.id.startsWith('cat:'))
            .map((s) =>
              row(
                s.title,
                stepDone(plan, draft, s.id)
                  ? (draft.catalogPicks[s.id.slice(4)] ?? []).join(', ')
                  : `Falta escolher em ${s.title}`,
                s.id,
                stepDone(plan, draft, s.id),
                `cat-${s.id}`
              )
            )}
          {plan.milestone &&
            row(
              'Marco',
              stepDone(plan, draft, 'marco')
                ? draft.milestoneUse === 'attribute'
                  ? points
                  : `Talento: ${talentName(draft.milestoneTalent)}`
                : 'Falta distribuir os pontos ou escolher o talento',
              'marco',
              stepDone(plan, draft, 'marco')
            )}
          {plan.cantrips.need > 0 &&
            row(
              'Truques',
              stepDone(plan, draft, 'truques')
                ? draft.cantripIds
                    .map(
                      (id) =>
                        plan.cantrips.options.find((o) => o.id === id)?.name
                    )
                    .join(', ')
                : `Falta escolher ${plan.cantrips.need - draft.cantripIds.length}`,
              'truques',
              stepDone(plan, draft, 'truques')
            )}
          {plan.spells.adds.length > 0 &&
            row(
              'Magias',
              plan.spells.need === 0
                ? 'Nada novo para preparar'
                : draft.spellIds.length >= plan.spells.need
                  ? draft.spellIds
                      .map(
                        (id) =>
                          plan.spells.options.find((o) => o.id === id)?.name
                      )
                      .join(', ')
                  : `Falta preparar ${plan.spells.need - draft.spellIds.length}`,
              'magias',
              stepDone(plan, draft, 'magias')
            )}
          {row(
            'Vida',
            gain !== null ? (
              <>
                {plan.hp.current} → <b>{plan.hp.current + gain}</b>{' '}
                <small>
                  (
                  {plan.hp.mode === 'manual'
                    ? 'informada'
                    : draft.hpMode === 'roll'
                      ? `d${plan.hp.die} rolado: ${plan.hp.roll?.result}`
                      : `fixo ${plan.hp.fixed}`}
                  {plan.hp.mode === 'dice'
                    ? `, CON ${formatModifier(conModOf(plan, draft))}`
                    : ''}
                  )
                </small>
              </>
            ) : (
              'Falta escolher entre valor fixo e rolagem'
            ),
            'vida',
            gain !== null
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;
