'use client';

import type { IRaceChoice } from '@/lib/catalogChoice';
import { isMixedRace } from '@/services/raceTraits.service';
import { sanitizeRaceChoice } from '@/services/raceLineage';
import { useCssHandles } from '@/hooks/useCssHandles';
import ChoiceTag from '../../ChoiceTag';
import type { IRaceView } from '../types';
import ChoiceStripHandles from './handles';
import '@/styles/components/raceChoiceStrip.scss';

interface IProps {
  race: IRaceView;
  choice: IRaceChoice;
  /** Sub-raça em foco na página, para a faixa acompanhar o que se lê. */
  focusedSub?: string;
  onFocusSub: (slug: string) => void;
}

/**
 * A faixa de escolha no topo da página da raça (modo escolha): usar esta raça,
 * a sub-raça, ou — numa raça de origem do Mestiço — usá-la como origem.
 */
const ChoiceStrip = ({ race, choice, focusedSub, onFocusSub }: IProps) => {
  const handles = useCssHandles(ChoiceStripHandles);
  const entry = choice.catalog.find((r) => r.slug === race.slug);
  const bySlug = new Map(choice.catalog.map((r) => [r.slug, r]));
  const mixed = isMixedRace(race);
  const taken = entry?.takenBy;
  const isCurrent = choice.current?.slug === race.slug;
  const draft = choice.draft;
  const using = draft?.slug === race.slug;

  if (choice.mode === 'origin') {
    const mestico = draft ? bySlug.get(draft.slug) : undefined;
    const parents = draft?.choice.parents ?? [];
    const on = parents.includes(race.slug);
    return (
      <div className={handles.raceStrip}>
        <div className={handles.raceStripHead}>
          <h2 className={handles.raceStripTitle}>
            {on ? `${race.name} é uma das origens` : `Origem do Mestiço`}
          </h2>
          <p className={handles.raceStripNote}>
            Leia as habilidades abaixo e decida se {race.name} entra na mistura.
            “Voltar” leva de volta às regras do Mestiço.
          </p>
        </div>
        <div className={handles.raceStripActs}>
          <button
            type="button"
            className={handles.raceStripBtn}
            disabled={!mestico || !draft}
            onClick={() =>
              mestico &&
              draft &&
              choice.onChange({
                slug: draft.slug,
                choice: sanitizeRaceChoice(
                  mestico,
                  {
                    ...draft.choice,
                    parents: on
                      ? parents.filter((s) => s !== race.slug)
                      : [...parents, race.slug],
                  },
                  bySlug
                ),
              })
            }
          >
            {on ? 'Remover das origens' : 'Usar como origem'}
          </button>
        </div>
      </div>
    );
  }

  const pickWhole = () =>
    choice.onChange({
      slug: race.slug,
      choice: using ? draft.choice : isCurrent ? choice.current!.choice : {},
    });

  const pickSub = (slug: string | undefined) => {
    if (slug) onFocusSub(slug);
    if (!entry) return;
    choice.onChange({
      slug: race.slug,
      choice: sanitizeRaceChoice(
        entry,
        { ...(using ? draft.choice : {}), subrace: slug },
        bySlug
      ),
    });
  };

  return (
    <div className={handles.raceStrip}>
      <div className={handles.raceStripHead}>
        <h2 className={handles.raceStripTitle}>
          {mixed ? 'Mestiço' : race.name}
        </h2>
        {isCurrent && <ChoiceTag kind="current">Atual</ChoiceTag>}
        {using && !isCurrent && <ChoiceTag kind="chosen">Escolhida</ChoiceTag>}
        {race.unique && (
          <ChoiceTag kind={taken ? 'blocked' : 'unique'}>
            {taken ? `Raça única · ${taken.name}` : 'Raça única'}
          </ChoiceTag>
        )}
      </div>
      {taken && (
        <p className={handles.raceStripNote}>
          {race.name} é uma raça única e já pertence a {taken.name}. Não dá para
          escolher.
        </p>
      )}
      {!taken && !mixed && race.subraces.length > 0 && (
        <div
          className={handles.raceStripSubs}
          role="radiogroup"
          aria-label="Sub-raça"
        >
          <button
            type="button"
            role="radio"
            aria-checked={using && !draft.choice.subrace}
            className={handles.raceStripSub}
            onClick={() => pickSub(undefined)}
          >
            Sem sub-raça
          </button>
          {race.subraces.map((s) => (
            <button
              key={s.slug}
              type="button"
              role="radio"
              aria-checked={using && draft.choice.subrace === s.slug}
              aria-current={focusedSub === s.slug || undefined}
              className={handles.raceStripSub}
              onClick={() => pickSub(s.slug)}
            >
              {s.name}
            </button>
          ))}
        </div>
      )}
      {!taken && (
        <div className={handles.raceStripActs}>
          <button
            type="button"
            className={handles.raceStripBtn}
            disabled={using && (mixed || race.subraces.length === 0)}
            onClick={pickWhole}
          >
            {using
              ? 'Raça escolhida'
              : mixed
                ? 'Usar Mestiço e montar a mistura'
                : `Usar ${race.name}`}
          </button>
        </div>
      )}
    </div>
  );
};

export default ChoiceStrip;
