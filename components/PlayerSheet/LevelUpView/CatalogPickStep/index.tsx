'use client';

import { useRef, useState } from 'react';
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
  const chipsRef = useRef<HTMLSpanElement>(null);
  if (!cat) return null;

  const picks = draft.catalogPicks[slug] ?? [];
  const full = picks.length >= cat.need;
  const set = (next: string[]) =>
    patch({ catalogPicks: { ...draft.catalogPicks, [slug]: next } });
  const label = cat.freeTextLabel;
  const freePicks = label
    ? picks.filter((p) => p.startsWith(`${label}: `))
    : [];
  // Enter ou "Usar este": acrescenta. Com a lista cheia o campo desliga, então
  // o foco vai para o chip recém-criado (onde dá para desfazer).
  const add = () => {
    const text = free.trim();
    if (!label || !text || full) return;
    set([...picks, `${label}: ${text}`]);
    setFree('');
    sheetSounds.play('pick');
    if (picks.length + 1 >= cat.need) {
      window.setTimeout(() => {
        const chips =
          chipsRef.current?.querySelectorAll<HTMLElement>('[data-chip]');
        chips?.[chips.length - 1]?.focus();
      }, 0);
    }
  };
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
          <div className={handles.luFreeRow}>
            <label className={handles.luFreeLabel}>
              <span>{label}</span>
              <input
                className={handles.luFreeInput}
                value={free}
                maxLength={FREE_TEXT_MAX}
                disabled={full}
                placeholder={full ? 'Tudo escolhido' : 'Escreva e tecle Enter'}
                onChange={(e) => setFree(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    add();
                  }
                }}
              />
            </label>
            <button
              type="button"
              className={handles.luFreeAdd}
              disabled={!free.trim() || full}
              onClick={add}
            >
              Usar este
            </button>
            {freePicks.length > 0 && (
              <span ref={chipsRef} className={handles.luFreeChips}>
                {freePicks.map((p) => (
                  <button
                    key={p}
                    type="button"
                    data-chip
                    className={handles.luFreeChip}
                    onClick={() => set(picks.filter((x) => x !== p))}
                    aria-label={`Remover ${p}`}
                  >
                    {p.slice(label.length + 2)} ×
                  </button>
                ))}
              </span>
            )}
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
