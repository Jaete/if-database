'use client';

import { useId, useState } from 'react';
import type { ICitizenRaceChoice } from '@/db/citizens/citizen.d';
import type { IRaceCatalogEntry } from '@/db/races/race.d';
import { abilityChips } from '@/lib/raceAbilityChips';
import {
  commonTraitsOf,
  hybridPoolOfParents,
  isMixedRace,
  raceChoiceIssues,
  raceLabelOf,
  resolveRaceTraits,
  sameContent,
  traitMatchesRef,
  type IResolvedRaceTrait,
  type RaceChoiceStep,
} from '@/services/raceTraits.service';
import { sanitizeRaceChoice } from '@/services/raceLineage';
import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import Modal from '@/components/Modal';
import RaceArt from '@/components/RaceArt';
import RaceChips from '@/components/RaceChips';
import { onRadioGroupKeyDown, rovingTabIndex } from '../radioGroup';
import { useRaceChoice } from '../useRaceChoice';
import RacePickerHandles from './handles';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  /** Passo onde abrir, quando o que falta já se sabe. */
  initialStep?: RaceChoiceStep;
}

const STEP_LABEL: Record<RaceChoiceStep, string> = {
  raca: 'Raça',
  subraca: 'Sub-raça',
  origens: 'Origens',
  sangue: 'Sangue Forte',
  heranca: 'Herança Híbrida',
  opcoes: 'Opções',
};

/** Os passos se ajustam à raça: o Mestiço tem mais, e as opções só se pedem se houver. */
function stepsFor(
  race: IRaceCatalogEntry | undefined,
  hasOptions: boolean
): RaceChoiceStep[] {
  if (!race) return ['raca'];
  const steps: RaceChoiceStep[] = isMixedRace(race)
    ? ['raca', 'origens', 'sangue', 'heranca']
    : race.subraces.length > 0
      ? ['raca', 'subraca']
      : ['raca'];
  if (hasOptions) steps.push('opcoes');
  return steps;
}

/**
 * Escolhe a raça do personagem, a sub-raça ou o caminho do Mestiço.
 *
 * O corpo só existe com o modal aberto (como em ArchetypePicker): é isso que
 * faz o rascunho do seletor nascer da ficha de agora a cada abertura. Nada é
 * gravado até "Aplicar à ficha", e aplicar nunca é recusado — uma escolha
 * incompleta vai para a ficha marcada como incompleta, com o que falta.
 */
const RacePicker = ({ isOpen, onClose, initialStep }: IProps) => {
  const handles = useCssHandles(RacePickerHandles);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Raça do personagem"
      variant="sheet"
      className={handles.sheetRacePickerShell}
    >
      {isOpen && <RacePickerBody onClose={onClose} initialStep={initialStep} />}
    </Modal>
  );
};

const RacePickerBody = ({
  onClose,
  initialStep,
}: Pick<IProps, 'onClose' | 'initialStep'>) => {
  const handles = useCssHandles(RacePickerHandles);
  const {
    catalog,
    bySlug,
    failed,
    lineage,
    choice: current,
    apply,
  } = useRaceChoice();

  const [slug, setSlug] = useState(lineage?.slug ?? '');
  const [choice, setChoice] = useState<ICitizenRaceChoice>(current);
  const [step, setStep] = useState<RaceChoiceStep>(initialStep ?? 'raca');

  if (!catalog || !bySlug) {
    return (
      <p className={handles.sheetRacePickerNote}>
        {failed
          ? 'Não foi possível carregar as raças. Feche e tente de novo.'
          : 'Carregando as raças...'}
      </p>
    );
  }

  const race = bySlug.get(slug);
  const resolved = race ? resolveRaceTraits(race, choice, bySlug) : [];
  const withOptions = resolved.filter((t) => t.options?.length);
  const steps = stepsFor(race, withOptions.length > 0);
  const at = steps.includes(step) ? step : 'raca';
  const index = steps.indexOf(at);
  const issues = race ? raceChoiceIssues(race, choice, bySlug) : [];
  const badSteps = new Set(issues.map((issue) => issue.step));
  const sub = race?.subraces.find((s) => s.slug === choice.subrace);
  const hadRace = !!lineage;

  /** Toda mudança passa por aqui: o que deixou de existir sai junto. */
  const update = (next: ICitizenRaceChoice, target = race) =>
    setChoice(target ? sanitizeRaceChoice(target, next, bySlug) : next);

  const chooseRace = (target: IRaceCatalogEntry) => {
    if (target.slug === slug) return;
    setSlug(target.slug);
    setChoice({});
  };

  const parents = choice.parents ?? [];
  const toggleParent = (parent: string) =>
    update({
      ...choice,
      parents: parents.includes(parent)
        ? parents.filter((s) => s !== parent)
        : [...parents, parent],
    });

  const apply_ = () => {
    if (!race) return;
    apply(race, choice);
    onClose();
  };

  const last = index === steps.length - 1;
  const goTo = (next: RaceChoiceStep) => setStep(next);

  const renderStep = () => {
    switch (at) {
      case 'raca':
        return (
          <>
            {hadRace && lineage && slug !== lineage.slug && (
              <p className={handles.sheetRacePickerSwap}>
                Trocar de raça apaga{' '}
                {lineage.mixed
                  ? 'as origens e as habilidades escolhidas do Mestiço'
                  : 'a sub-raça escolhida'}
                . <b>Atual: {lineage.label}.</b>
              </p>
            )}
            <div
              className={handles.sheetRacePickerTiles}
              role="radiogroup"
              aria-label="Raça"
              onKeyDown={onRadioGroupKeyDown}
            >
              {catalog.map((entry, i) => (
                <Tile
                  key={entry.slug}
                  race={entry}
                  role="radio"
                  tabIndex={rovingTabIndex(
                    entry.slug === slug,
                    catalog.some((c) => c.slug === slug),
                    i
                  )}
                  checked={entry.slug === slug}
                  onClick={() => chooseRace(entry)}
                />
              ))}
            </div>
          </>
        );
      case 'subraca': {
        if (!race) return null;
        const baseNames = (race.baseOnlyTraits ?? []).map((t) => t.name);
        let lastGroup: string | undefined;
        return (
          <>
            <p className={handles.sheetRacePickerNote}>
              As habilidades em comum de {race.name} (
              <b>{race.traits.map((t) => t.name).join(', ') || '—'}</b>) valem
              para qualquer escolha. A sub-raça soma as dela.
            </p>
            <div
              className={handles.sheetRacePickerOptions}
              role="radiogroup"
              aria-label="Sub-raça"
              onKeyDown={onRadioGroupKeyDown}
            >
              <Option
                tabIndex={rovingTabIndex(
                  !choice.subrace,
                  !choice.subrace ||
                    race.subraces.some((x) => x.slug === choice.subrace),
                  0
                )}
                checked={!choice.subrace}
                onClick={() => update({ ...choice, subrace: undefined })}
                name="Sem sub-raça"
                text={
                  baseNames.length > 0
                    ? 'Fica com as em comum mais as da raça base, que não passam às sub-raças.'
                    : 'Fica só com as habilidades em comum.'
                }
                tags={baseNames}
              />
              {race.subraces.map((s, i) => {
                const heading =
                  s.group && s.group !== lastGroup ? s.group : undefined;
                lastGroup = s.group ?? lastGroup;
                return (
                  <div key={s.slug} className={handles.sheetRacePickerGroup}>
                    {heading && (
                      <span className={handles.sheetRacePickerCaption}>
                        {heading}
                      </span>
                    )}
                    <Option
                      tabIndex={rovingTabIndex(
                        choice.subrace === s.slug,
                        true,
                        i + 1
                      )}
                      checked={choice.subrace === s.slug}
                      onClick={() => update({ ...choice, subrace: s.slug })}
                      name={s.name}
                      chips={abilityChips(s.abilityScoreIncrease)}
                      tags={s.traits.map((t) => t.name)}
                    />
                  </div>
                );
              })}
            </div>
          </>
        );
      }
      case 'origens':
        return (
          <>
            <p className={handles.sheetRacePickerNote}>
              Escolha <b>pelo menos duas</b> raças de origem. O Mestiço não
              entra aqui. {parents.length}{' '}
              {parents.length === 1 ? 'escolhida' : 'escolhidas'}.
            </p>
            <div
              className={handles.sheetRacePickerTiles}
              role="group"
              aria-label="Raças de origem"
            >
              {catalog
                .filter((entry) => !isMixedRace(entry))
                .map((entry) => (
                  <Tile
                    key={entry.slug}
                    race={entry}
                    role="checkbox"
                    checked={parents.includes(entry.slug)}
                    onClick={() => toggleParent(entry.slug)}
                  />
                ))}
            </div>
          </>
        );
      case 'sangue': {
        const rule = race?.choiceRules?.find((r) => r.kind === 'dominantBlood');
        return (
          <>
            {rule && (
              <p className={handles.sheetRacePickerNote}>{rule.description}</p>
            )}
            {parents.length === 0 ? (
              <p className={handles.sheetRacePickerNote}>
                Escolha as origens primeiro.
              </p>
            ) : (
              <div
                className={handles.sheetRacePickerOptions}
                role="radiogroup"
                aria-label="Raça dominante"
                onKeyDown={onRadioGroupKeyDown}
              >
                {parents.map((parent, i) => {
                  const entry = bySlug.get(parent);
                  if (!entry) return null;
                  return (
                    <Option
                      key={parent}
                      tabIndex={rovingTabIndex(
                        choice.dominantParent === parent,
                        !!choice.dominantParent,
                        i
                      )}
                      checked={choice.dominantParent === parent}
                      onClick={() =>
                        update({ ...choice, dominantParent: parent })
                      }
                      name={entry.name}
                      text="Ganha as em comum:"
                      tags={entry.traits.map((t) => t.name)}
                    />
                  );
                })}
              </div>
            )}
          </>
        );
      }
      case 'heranca': {
        if (!race) return null;
        const rule = race.choiceRules?.find((r) => r.kind === 'hybridHeritage');
        const count = rule?.count ?? 2;
        const picked = choice.hybridTraits ?? [];
        const full = picked.length >= count;
        const dominant = choice.dominantParent
          ? bySlug.get(choice.dominantParent)
          : undefined;
        const inherited = dominant ? commonTraitsOf(dominant) : [];
        const pool = hybridPoolOfParents(parents, bySlug);

        const item = (trait: IResolvedRaceTrait) => {
          const on = picked.some((ref) => traitMatchesRef(trait, ref));
          const viaDominant = inherited.some((t) => sameContent(t, trait));
          const disabled = viaDominant || (!on && full);
          const why = viaDominant
            ? 'já vem pelo Sangue Forte'
            : !on && full
              ? `limite de ${count} atingido`
              : '';
          return (
            <Option
              key={`${trait.ref.race}:${trait.ref.subrace ?? ''}:${trait.name}`}
              role="checkbox"
              square
              checked={on}
              disabled={disabled}
              onClick={() =>
                update({
                  ...choice,
                  hybridTraits: on
                    ? picked.filter((ref) => !traitMatchesRef(trait, ref))
                    : [...picked, trait.ref],
                })
              }
              name={trait.name}
              text={trait.description}
              clamp
              why={why}
              tags={
                trait.alsoOrigins.length > 0
                  ? [`também em ${trait.alsoOrigins.join(', ')}`]
                  : undefined
              }
            />
          );
        };

        return (
          <>
            <div className={handles.sheetRacePickerCounter} aria-live="polite">
              <span className={handles.sheetRacePickerCounterBig}>
                {picked.length} <small>de {count}</small>
              </span>
              <span
                className={handles.sheetRacePickerCounterPips}
                aria-hidden="true"
              >
                {Array.from({ length: count }, (_, i) => (
                  <i
                    key={i}
                    className={
                      i < picked.length
                        ? `${handles.sheetRacePickerCounterPip} ${applyModifiers(handles.sheetRacePickerCounterPip, 'on')}`
                        : handles.sheetRacePickerCounterPip
                    }
                  />
                ))}
              </span>
              <span className={handles.sheetRacePickerNote}>
                {full
                  ? 'Herança completa. Desmarque uma para trocar.'
                  : `Escolha mais ${count - picked.length}.`}
              </span>
            </div>
            {rule && (
              <p className={handles.sheetRacePickerNote}>{rule.description}</p>
            )}
            {parents.length === 0 && (
              <p className={handles.sheetRacePickerNote}>
                Escolha as origens primeiro.
              </p>
            )}
            {parents.map((parent) => {
              const entry = bySlug.get(parent);
              if (!entry) return null;
              const own = pool.filter((t) => t.ref.race === parent);
              const groups: [string, IResolvedRaceTrait[]][] = [
                ['Em comum', own.filter((t) => t.kind === 'common')],
                ['Raça base', own.filter((t) => t.kind === 'base')],
                ...entry.subraces.map((s): [string, IResolvedRaceTrait[]] => [
                  `Sub-raça · ${s.name}`,
                  own.filter(
                    (t) => t.kind === 'sub' && t.ref.subrace === s.slug
                  ),
                ]),
              ];
              return (
                <div key={parent} className={handles.sheetRacePickerGroup}>
                  <div className={handles.sheetRacePickerPoolHead}>
                    <b>{entry.name}</b>
                    {parent === choice.dominantParent && (
                      <small>dominante</small>
                    )}
                  </div>
                  {groups
                    .filter(([, list]) => list.length > 0)
                    .map(([label, list]) => (
                      <div key={label} className={handles.sheetRacePickerGroup}>
                        <span className={handles.sheetRacePickerPoolSub}>
                          {label}
                        </span>
                        <div className={handles.sheetRacePickerOptions}>
                          {list.map(item)}
                        </div>
                      </div>
                    ))}
                </div>
              );
            })}
          </>
        );
      }
      case 'opcoes':
        return (
          <>
            <p className={handles.sheetRacePickerNote}>
              Estas habilidades mandam escolher uma opção. A ficha guarda qual.
            </p>
            {withOptions.map((trait) => {
              const picked = choice.traitOptions?.find((o) =>
                traitMatchesRef(trait, o.ref)
              )?.option;
              return (
                <div
                  key={`${trait.ref.race}:${trait.ref.subrace ?? ''}:${trait.name}`}
                  className={handles.sheetRacePickerGroup}
                >
                  <span className={handles.sheetRacePickerPoolSub}>
                    {trait.name} · {trait.origin}
                  </span>
                  <div
                    className={handles.sheetRacePickerOptions}
                    role="radiogroup"
                    aria-label={trait.name}
                    onKeyDown={onRadioGroupKeyDown}
                  >
                    {trait.options?.map((option, i) => (
                      <Option
                        key={option.name}
                        tabIndex={rovingTabIndex(
                          picked === option.name,
                          !!picked,
                          i
                        )}
                        checked={picked === option.name}
                        onClick={() =>
                          update({
                            ...choice,
                            traitOptions: [
                              ...(choice.traitOptions ?? []).filter(
                                (o) => !traitMatchesRef(trait, o.ref)
                              ),
                              { ref: trait.ref, option: option.name },
                            ],
                          })
                        }
                        name={option.name}
                        text={option.description}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        );
    }
  };

  const chips =
    race && !isMixedRace(race)
      ? [
          ...abilityChips(race.abilityScoreIncrease),
          ...abilityChips(sub?.abilityScoreIncrease),
        ]
      : [];

  return (
    <div className={handles.sheetRacePicker}>
      <div className={handles.sheetRacePickerBody}>
        <ol className={handles.sheetRacePickerSteps} aria-label="Passos">
          {steps.map((s, i) => {
            const done = i < index && !badSteps.has(s);
            const bad = i < index && badSteps.has(s);
            return (
              <li key={s}>
                <button
                  type="button"
                  className={`${handles.sheetRacePickerStep}${
                    s === at
                      ? ` ${applyModifiers(handles.sheetRacePickerStep, 'current')}`
                      : ''
                  }${done ? ` ${applyModifiers(handles.sheetRacePickerStep, 'done')}` : ''}${
                    bad
                      ? ` ${applyModifiers(handles.sheetRacePickerStep, 'bad')}`
                      : ''
                  }`}
                  disabled={!race && i > 0}
                  aria-current={s === at ? 'step' : undefined}
                  onClick={() => goTo(s)}
                >
                  <span
                    className={handles.sheetRacePickerStepPip}
                    aria-hidden="true"
                  />
                  {STEP_LABEL[s]}
                </button>
              </li>
            );
          })}
        </ol>
        <span className={handles.sheetRacePickerStepMini}>
          {`Passo ${index + 1} de ${steps.length} · ${STEP_LABEL[at]}`}
        </span>

        <div className={handles.sheetRacePickerMain}>{renderStep()}</div>

        <aside className={handles.sheetRacePickerSide} aria-label="Resultado">
          <span className={handles.sheetRacePickerCaption}>A ficha ganha</span>
          {resolved.length > 0 ? (
            <ul className={handles.sheetRacePickerGrant}>
              {resolved.map((trait) => (
                <li
                  key={`${trait.ref.race}:${trait.ref.subrace ?? ''}:${trait.name}`}
                >
                  {trait.name}
                  {trait.chosen && <> · {trait.chosen.name}</>}
                  <span className={handles.sheetRacePickerGrantOrigin}>
                    {trait.via === 'dominantBlood'
                      ? 'sangue forte'
                      : trait.via === 'hybridHeritage'
                        ? 'herança'
                        : trait.kind === 'sub'
                          ? trait.subraceName
                          : trait.kind === 'base'
                            ? 'raça base'
                            : 'raça'}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={handles.sheetRacePickerNote}>Nada ainda.</p>
          )}
          {race && !isMixedRace(race) && (
            <>
              <span className={handles.sheetRacePickerCaption}>Atributos</span>
              {chips.length > 0 ? (
                <RaceChips chips={chips} />
              ) : (
                <span className={handles.sheetRacePickerNote}>—</span>
              )}
            </>
          )}
          {race &&
            (issues.length > 0 ? (
              <ul className={handles.sheetRacePickerIssues} aria-live="polite">
                {issues.map((issue) => (
                  <li key={issue.message}>
                    <b>Falta:</b> {issue.message}
                  </li>
                ))}
              </ul>
            ) : (
              <p className={handles.sheetRacePickerOk}>Escolha completa.</p>
            ))}
        </aside>
      </div>

      <div className={handles.sheetRacePickerFoot}>
        <span className={handles.sheetRacePickerFootNote}>
          {race && issues.length > 0 ? (
            <>
              <b>Incompleta.</b> Dá para aplicar agora e terminar depois.
            </>
          ) : race ? (
            <b>{raceLabelOf(race, choice, bySlug)}</b>
          ) : (
            'Escolha uma raça.'
          )}
        </span>
        <div className={handles.sheetRacePickerActions}>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          {index > 0 && (
            <Button variant="secondary" onClick={() => goTo(steps[index - 1])}>
              Voltar
            </Button>
          )}
          {last ? (
            <Button variant="primary" disabled={!race} onClick={apply_}>
              Aplicar à ficha
            </Button>
          ) : (
            <Button variant="primary" onClick={() => goTo(steps[index + 1])}>
              Continuar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Peças locais ─────────────────────────────────────────
// Só existem aqui: cada uma é uma linha de marcação que o seletor repete.

const Button = ({
  variant,
  disabled,
  onClick,
  children,
}: {
  variant: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  onClick: () => void;
  children: string;
}) => {
  const handles = useCssHandles(RacePickerHandles);
  return (
    <button
      type="button"
      className={`${handles.sheetRacePickerButton} ${applyModifiers(handles.sheetRacePickerButton, variant)}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const Tile = ({
  race,
  role,
  tabIndex,
  checked,
  onClick,
}: {
  race: IRaceCatalogEntry;
  role: 'radio' | 'checkbox';
  tabIndex?: 0 | -1;
  checked: boolean;
  onClick: () => void;
}) => {
  const handles = useCssHandles(RacePickerHandles);
  const chips = abilityChips(race.abilityScoreIncrease);
  const meta = isMixedRace(race)
    ? 'mistura de raças'
    : chips.length > 0
      ? chips.map((chip) => chip.label).join(' · ')
      : 'sem incremento';

  return (
    <button
      type="button"
      role={role}
      aria-checked={checked}
      tabIndex={tabIndex}
      className={handles.sheetRacePickerTile}
      onClick={onClick}
    >
      <span className={handles.sheetRacePickerTileArt}>
        <RaceArt image={race.images[0]} label={race.name} />
      </span>
      <span className={handles.sheetRacePickerTick} aria-hidden="true" />
      <span className={handles.sheetRacePickerTileBody}>
        <span className={handles.sheetRacePickerTileName}>{race.name}</span>
        <span className={handles.sheetRacePickerTileMeta}>{meta}</span>
        <span className={handles.sheetRacePickerTilePills}>
          {race.unique && (
            <span
              className={`${handles.sheetRacePickerPill} ${applyModifiers(handles.sheetRacePickerPill, 'unique')}`}
            >
              única
            </span>
          )}
          {isMixedRace(race) && (
            <span className={handles.sheetRacePickerPill}>mista</span>
          )}
        </span>
      </span>
    </button>
  );
};

const Option = ({
  role = 'radio',
  tabIndex,
  square,
  checked,
  disabled,
  onClick,
  name,
  text,
  clamp,
  why,
  tags,
  chips,
}: {
  role?: 'radio' | 'checkbox';
  tabIndex?: 0 | -1;
  square?: boolean;
  checked: boolean;
  disabled?: boolean;
  onClick: () => void;
  name: string;
  text?: string;
  clamp?: boolean;
  why?: string;
  tags?: string[];
  chips?: ReturnType<typeof abilityChips>;
}) => {
  const handles = useCssHandles(RacePickerHandles);
  const whyId = useId();
  return (
    <button
      type="button"
      role={role}
      aria-checked={checked}
      aria-describedby={why ? whyId : undefined}
      tabIndex={tabIndex}
      disabled={disabled}
      className={handles.sheetRacePickerOption}
      onClick={onClick}
    >
      <span
        className={`${handles.sheetRacePickerMark}${
          square
            ? ` ${applyModifiers(handles.sheetRacePickerMark, 'square')}`
            : ''
        }`}
        aria-hidden="true"
      />
      <span className={handles.sheetRacePickerOptionName}>
        {name}
        {chips?.map((chip) => (
          <span key={chip.label} className={handles.sheetRacePickerChip}>
            {chip.label}
          </span>
        ))}
      </span>
      {text && (
        <span
          className={`${handles.sheetRacePickerOptionText}${
            clamp
              ? ` ${applyModifiers(handles.sheetRacePickerOptionText, 'clamp')}`
              : ''
          }`}
        >
          {text}
        </span>
      )}
      {why && (
        <span id={whyId} className={handles.sheetRacePickerOptionWhy}>
          {why}
        </span>
      )}
      {tags && tags.length > 0 && (
        <span className={handles.sheetRacePickerOptionTags}>
          {tags.map((tag) => (
            <span key={tag} className={handles.sheetRacePickerTag}>
              {tag}
            </span>
          ))}
        </span>
      )}
    </button>
  );
};

export default RacePicker;
