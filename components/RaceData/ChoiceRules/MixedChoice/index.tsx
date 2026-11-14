'use client';

import { useId } from 'react';
import type { ICitizenRaceChoice } from '@/db/citizens/citizen.d';
import type { IRaceCatalogEntry } from '@/db/races/race.d';
import type { IRaceChoice } from '@/lib/catalogChoice';
import { abilityChips } from '@/lib/raceAbilityChips';
import { sanitizeRaceChoice } from '@/services/raceLineage';
import {
  commonTraitsOf,
  hybridPoolOfParents,
  isMixedRace,
  resolveRaceTraits,
  sameContent,
  traitMatchesRef,
  type IResolvedRaceTrait,
} from '@/services/raceTraits.service';
import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import RaceArt from '../../../RaceArt';
import ChoiceTag from '../../../ChoiceTag';
import MixedChoiceHandles from './handles';
import '@/styles/components/raceMixedChoice.scss';

type Kind = 'origins' | 'dominantBlood' | 'hybridHeritage' | 'options';

interface IProps {
  kind: Kind;
  race: IRaceCatalogEntry;
  choice: IRaceChoice;
  /** Descrição que o tópico traz para a regra. */
  description?: string;
  count?: number;
}

/**
 * O seletor de uma regra de escolha do Mestiço, montado embaixo do texto dela
 * na página da raça (modo escolha). Cada regra guarda a sua parte de
 * `raceChoice`; toda mudança passa por `sanitizeRaceChoice`, que tira o que
 * deixou de fazer sentido (uma origem desmarcada leva junto o sangue forte e as
 * heranças que dependiam dela).
 */
const MixedChoice = ({ kind, race, choice, description, count }: IProps) => {
  const handles = useCssHandles(MixedChoiceHandles);
  const bySlug = new Map(choice.catalog.map((r) => [r.slug, r]));
  const draft =
    choice.draft?.slug === race.slug
      ? choice.draft.choice
      : ({} as ICitizenRaceChoice);
  const update = (next: ICitizenRaceChoice) =>
    choice.onChange({
      slug: race.slug,
      choice: sanitizeRaceChoice(race, next, bySlug),
    });
  const parents = draft.parents ?? [];

  if (kind === 'origins') {
    return (
      <div className={handles.raceMix}>
        <p className={handles.raceMixNote}>
          Escolha <b>pelo menos duas</b> raças de origem. {parents.length}{' '}
          {parents.length === 1 ? 'escolhida' : 'escolhidas'}. “Ver raça” abre a
          página dela, com as habilidades.
        </p>
        <div
          className={handles.raceMixTiles}
          role="group"
          aria-label="Raças de origem"
        >
          {choice.catalog
            .filter((entry) => !isMixedRace(entry))
            .map((entry) => {
              const on = parents.includes(entry.slug);
              const chips = abilityChips(entry.abilityScoreIncrease);
              return (
                <div
                  key={entry.slug}
                  className={`${handles.raceMixTile}${
                    on ? ` ${applyModifiers(handles.raceMixTile, 'on')}` : ''
                  }`}
                >
                  <span className={handles.raceMixTileArt}>
                    <RaceArt image={entry.images[0]} label={entry.name} />
                  </span>
                  <span className={handles.raceMixTileBody}>
                    <span className={handles.raceMixTileName}>
                      {entry.name}
                    </span>
                    <span className={handles.raceMixTileMeta}>
                      {chips.length > 0
                        ? chips.map((c) => c.label).join(' · ')
                        : 'sem incremento'}
                    </span>
                  </span>
                  <span className={handles.raceMixTileActs}>
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={on}
                      className={handles.raceMixMark}
                      onClick={() =>
                        update({
                          ...draft,
                          parents: on
                            ? parents.filter((s) => s !== entry.slug)
                            : [...parents, entry.slug],
                        })
                      }
                    >
                      {on ? 'Usada como origem' : 'Usar como origem'}
                    </button>
                    <button
                      type="button"
                      className={handles.raceMixSee}
                      onClick={() => choice.onOpen(entry.slug, 'origin')}
                    >
                      ver raça
                    </button>
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    );
  }

  if (kind === 'dominantBlood') {
    return (
      <div className={handles.raceMix}>
        {parents.length === 0 ? (
          <p className={handles.raceMixNote}>Escolha as origens primeiro.</p>
        ) : (
          <div
            role="radiogroup"
            aria-label="Raça dominante"
            className={handles.raceMixOptions}
          >
            {parents.map((parent) => {
              const entry = bySlug.get(parent);
              if (!entry) return null;
              return (
                <Option
                  key={parent}
                  checked={draft.dominantParent === parent}
                  onClick={() => update({ ...draft, dominantParent: parent })}
                  name={entry.name}
                  text="Ganha as habilidades em comum:"
                  tags={entry.traits.map((t) => t.name)}
                />
              );
            })}
          </div>
        )}
      </div>
    );
  }

  if (kind === 'hybridHeritage') {
    const total = count ?? 2;
    const picked = draft.hybridTraits ?? [];
    const full = picked.length >= total;
    const dominant = draft.dominantParent
      ? bySlug.get(draft.dominantParent)
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
          ? `limite de ${total} atingido`
          : '';
      return (
        <Option
          key={`${trait.ref.race}:${trait.ref.subrace ?? ''}:${trait.name}`}
          role="checkbox"
          checked={on}
          disabled={disabled}
          onClick={() =>
            update({
              ...draft,
              hybridTraits: on
                ? picked.filter((ref) => !traitMatchesRef(trait, ref))
                : [...picked, trait.ref],
            })
          }
          name={trait.name}
          text={trait.description}
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
      <div className={handles.raceMix}>
        <div className={handles.raceMixCounter} aria-live="polite">
          <span className={handles.raceMixCounterBig}>
            {picked.length} <small>de {total}</small>
          </span>
          <span className={handles.raceMixCounterPips} aria-hidden="true">
            {Array.from({ length: total }, (_, i) => (
              <i
                key={i}
                className={`${handles.raceMixCounterPip}${
                  i < picked.length
                    ? ` ${applyModifiers(handles.raceMixCounterPip, 'on')}`
                    : ''
                }`}
              />
            ))}
          </span>
          <span className={handles.raceMixNote}>
            {full
              ? 'Herança completa. Desmarque uma para trocar.'
              : `Escolha mais ${total - picked.length}.`}
          </span>
        </div>
        {description && <p className={handles.raceMixNote}>{description}</p>}
        {parents.length === 0 && (
          <p className={handles.raceMixNote}>Escolha as origens primeiro.</p>
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
              own.filter((t) => t.kind === 'sub' && t.ref.subrace === s.slug),
            ]),
          ];
          return (
            <div key={parent} className={handles.raceMixGroup}>
              <div className={handles.raceMixPoolHead}>
                <b>{entry.name}</b>
                {parent === draft.dominantParent && (
                  <ChoiceTag kind="current">dominante</ChoiceTag>
                )}
              </div>
              {groups
                .filter(([, list]) => list.length > 0)
                .map(([label, list]) => (
                  <div key={label} className={handles.raceMixGroup}>
                    <span className={handles.raceMixPoolSub}>{label}</span>
                    <div className={handles.raceMixOptions}>
                      {list.map(item)}
                    </div>
                  </div>
                ))}
            </div>
          );
        })}
      </div>
    );
  }

  // Opções de uma habilidade ("Chamado da Constelação"): só aparece quando a
  // herança pegou uma habilidade que manda escolher uma opção.
  const resolved = resolveRaceTraits(race, draft, bySlug);
  const withOptions = resolved.filter((t) => t.options?.length);
  return (
    <div className={handles.raceMix}>
      {withOptions.map((trait) => {
        const picked = draft.traitOptions?.find((o) =>
          traitMatchesRef(trait, o.ref)
        )?.option;
        return (
          <div
            key={`${trait.ref.race}:${trait.ref.subrace ?? ''}:${trait.name}`}
            className={handles.raceMixGroup}
          >
            <span className={handles.raceMixPoolSub}>
              {trait.name} · {trait.origin}
            </span>
            <div
              role="radiogroup"
              aria-label={trait.name}
              className={handles.raceMixOptions}
            >
              {trait.options?.map((option) => (
                <Option
                  key={option.name}
                  checked={picked === option.name}
                  onClick={() =>
                    update({
                      ...draft,
                      traitOptions: [
                        ...(draft.traitOptions ?? []).filter(
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
    </div>
  );
};

const Option = ({
  role = 'radio',
  checked,
  disabled,
  onClick,
  name,
  text,
  why,
  tags,
}: {
  role?: 'radio' | 'checkbox';
  checked: boolean;
  disabled?: boolean;
  onClick: () => void;
  name: string;
  text?: string;
  why?: string;
  tags?: string[];
}) => {
  const handles = useCssHandles(MixedChoiceHandles);
  const whyId = useId();
  return (
    <button
      type="button"
      role={role}
      aria-checked={checked}
      aria-describedby={why ? whyId : undefined}
      disabled={disabled}
      className={handles.raceMixOption}
      onClick={onClick}
    >
      <span className={handles.raceMixOptionName}>{name}</span>
      {text && <span className={handles.raceMixOptionText}>{text}</span>}
      {why && (
        <span id={whyId} className={handles.raceMixOptionWhy}>
          {why}
        </span>
      )}
      {tags && tags.length > 0 && (
        <span className={handles.raceMixOptionTags}>
          {tags.map((tag) => (
            <span key={tag} className={handles.raceMixTag}>
              {tag}
            </span>
          ))}
        </span>
      )}
    </button>
  );
};

export default MixedChoice;
