'use client';

import { useState } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import { sheetSounds } from '@/lib/sheetSounds';
import { FREE_TEXT_MAX } from '@/lib/catalogPicks';
import LevelUpChoice from '../../LevelUpChoice';
import LevelUpDetail from '../../LevelUpDetail';
import LevelUpViewHandles from '../handles';
import type { IStepProps } from '../types';

interface IProps extends IStepProps {
  /** Slug da lista de escolha da classe deste passo. */
  slug: string;
}

/**
 * Uma lista de escolha da classe ("Técnicas de Investida", "Formas de
 * Fúria"): escolhe-se o número que o nível dá, sem repetir o que já foi
 * escolhido antes. O texto de pré-requisito de um item aparece na descrição e
 * não é conferido.
 */
const CatalogPickStep = ({ plan, draft, patch, slug }: IProps) => {
  const handles = useCssHandles(LevelUpViewHandles);
  const cat = plan.catalogPicks.find((c) => c.slug === slug);
  const [hover, setHover] = useState<string | null>(null);
  const [free, setFree] = useState('');
  if (!cat) return null;

  const picks = draft.catalogPicks[slug] ?? [];
  const full = picks.length >= cat.need;
  const set = (next: string[]) =>
    patch({ catalogPicks: { ...draft.catalogPicks, [slug]: next } });
  const label = cat.freeTextLabel;
  const freePicks = label
    ? picks.filter((p) => p.startsWith(`${label}: `))
    : [];
  const focus =
    cat.options.find((o) => o.name === hover) ??
    cat.options.find((o) => o.name === picks[picks.length - 1]) ??
    cat.options[0];

  return (
    <div className={handles.luContent}>
      <div className={handles.luPane}>
        <div className={handles.luPaneHead}>
          <h3>{cat.name}</h3>
          <p>
            Escolha{' '}
            <b>
              {cat.need} {cat.need === 1 ? 'item' : 'itens'}
            </b>{' '}
            desta lista. O que já foi escolhido antes não aparece.
          </p>
        </div>
        <div className={handles.luFilterRow}>
          <span className={handles.luCounter}>
            Escolhidos{' '}
            <b>
              {picks.length}/{cat.need}
            </b>
          </span>
        </div>
        <div className={handles.luChoices} role="group" aria-label={cat.name}>
          {cat.options.map((o) => {
            const on = picks.includes(o.name);
            return (
              <LevelUpChoice
                key={o.name}
                name={o.name}
                description={o.description}
                selected={on}
                locked={!on && full}
                onHover={() => setHover(o.name)}
                onSelect={() => {
                  set(
                    on ? picks.filter((p) => p !== o.name) : [...picks, o.name]
                  );
                  setHover(o.name);
                  sheetSounds.play(on ? 'unpick' : 'pick');
                }}
              />
            );
          })}
        </div>
        {label && (
          <div className={handles.luNote}>
            <label>
              {label}:{' '}
              <input
                value={free}
                maxLength={FREE_TEXT_MAX}
                onChange={(e) => setFree(e.target.value)}
                aria-label={label}
              />
            </label>{' '}
            <button
              type="button"
              disabled={!free.trim() || full}
              onClick={() => {
                set([...picks, `${label}: ${free.trim()}`]);
                setFree('');
                sheetSounds.play('pick');
              }}
            >
              Usar este
            </button>
            {freePicks.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => set(picks.filter((x) => x !== p))}
                aria-label={`Remover ${p}`}
              >
                {p} ×
              </button>
            ))}
          </div>
        )}
      </div>
      {focus && (
        <LevelUpDetail
          kind={cat.name}
          title={focus.name}
          body={focus.description}
        />
      )}
    </div>
  );
};

export default CatalogPickStep;
