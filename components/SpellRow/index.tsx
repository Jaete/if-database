'use client';

import type { CSSProperties } from 'react';
import type ISpell from '@/db/spells/spell.d';
import {
  circleLabel,
  circleTitle,
  spellSchoolKey,
  spellSchoolLabel,
} from '@/db/l10n/spells';
import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import { AstrolabeIcon, SpellSchoolIcon } from '../Icons';
import SpellRowHandles from './handles';
import '@/styles/components/spellRow.scss';

interface IProps {
  spell: ISpell;
  /** A última magia aberta no detalhe: fica marcada ao voltar à lista. */
  isCurrent?: boolean;
  onOpen: (spell: ISpell) => void;
}

// Gira o astrolábio de cada magia por um ângulo estável, para a lista de
// placeholders não parecer carimbada.
const rotationOf = (slug: string) =>
  [...slug].reduce((hash, ch) => (hash * 31 + ch.charCodeAt(0)) % 360, 0);

/**
 * Uma linha do grimório: selo do círculo, nome, escola e a arte à direita.
 *
 * ~590 linhas na página, sem virtualização: a arte é `loading="lazy"` e, sem
 * ela, o placeholder é só CSS e SVG.
 */
const SpellRow = ({ spell, isCurrent = false, onOpen }: IProps) => {
  const handles = useCssHandles(SpellRowHandles);
  const school = spellSchoolKey(spell.school);
  const label = `${spell.name}, ${circleTitle(spell.circle).toLowerCase()}, ${
    spell.school || 'escola não informada'
  }`;

  return (
    <button
      type="button"
      className={`${handles.spellbookRow} ${applyModifiers(handles.spellbookRow, school)}`}
      data-slug={spell.slug}
      aria-label={label}
      aria-current={isCurrent || undefined}
      onClick={() => onOpen(spell)}
    >
      <span className={handles.spellbookRowCircle} aria-hidden="true">
        {circleLabel(spell.circle)}
      </span>
      <span className={handles.spellbookRowText} aria-hidden="true">
        <span className={handles.spellbookRowName}>{spell.name}</span>
        {spell.school && (
          <span className={handles.spellbookRowSchool}>
            {spellSchoolLabel(spell.school)}
          </span>
        )}
      </span>
      <span className={handles.spellbookRowArt} aria-hidden="true">
        {spell.image ? (
          // `<img>` simples: 590 itens de hosts arbitrários, sem o otimizador.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className={handles.spellbookRowImage}
            src={spell.image}
            alt=""
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className={handles.spellbookRowSigil}>
            <AstrolabeIcon
              className={handles.spellbookRowRing}
              style={
                { '--rot': `${rotationOf(spell.slug)}deg` } as CSSProperties
              }
            />
            <SpellSchoolIcon
              school={school}
              className={handles.spellbookRowGlyph}
            />
          </span>
        )}
      </span>
      <span className={handles.spellbookRowSchoolBar} aria-hidden="true" />
    </button>
  );
};

export default SpellRow;
