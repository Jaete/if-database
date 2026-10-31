'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type ISpell from '@/db/spells/spell.d';
import { circleLabel, circleTitle, spellSchoolKey } from '@/db/l10n/spells';
import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import {
  ArrowLeftIcon,
  AstrolabeIcon,
  PencilIcon,
  SpellSchoolIcon,
} from '../Icons';
import SpellDetailHandles from './handles';
import '@/styles/components/spellDetail.scss';

interface IProps {
  spell: ISpell;
  /** Nome de cada classe pelo id, para os chips. `null` até carregar. */
  classNames: Record<string, string> | null;
  canEdit: boolean;
  compact?: boolean;
  onClose: () => void;
  onEdit: (spell: ISpell) => void;
}

// A ficha na ordem do sistema: quatro campos em quadro, o resto em lista.
const PRIMARY_FIELDS = [
  { name: 'castingTime', label: 'Tempo de conjuração' },
  { name: 'range', label: 'Alcance' },
  { name: 'components', label: 'Componentes' },
  { name: 'duration', label: 'Duração' },
] as const;

const SECONDARY_FIELDS = [
  { name: 'target', label: 'Alvo' },
  { name: 'area', label: 'Área' },
  { name: 'effect', label: 'Efeito' },
  { name: 'save', label: 'Teste de resistência' },
  { name: 'spellResistance', label: 'Resistência a magia' },
  { name: 'use', label: 'Uso' },
] as const;

const BULLET = /^\s*[-•]\s+/;

/** Parágrafos por linha em branco; um bloco só de "- " vira lista. */
const renderDescription = (text: string): ReactNode[] =>
  text
    .split(/\n\s*\n/)
    .filter((block) => block.trim())
    .map((block, index) => {
      const lines = block.split('\n');
      if (lines.every((line) => BULLET.test(line))) {
        return (
          <ul key={index}>
            {lines.map((line, i) => (
              <li key={i}>{line.replace(BULLET, '')}</li>
            ))}
          </ul>
        );
      }
      return (
        <p key={index}>
          {lines.map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </p>
      );
    });

/**
 * A magia aberta por cima do grimório, em tela cheia: arte, título, ficha e
 * descrição. O overlay, o scroll lock e o Esc são do `SpellGrid`.
 */
const SpellDetail = ({
  spell,
  classNames,
  canEdit,
  compact = false,
  onClose,
  onEdit,
}: IProps) => {
  const handles = useCssHandles(SpellDetailHandles);
  const backRef = useRef<HTMLButtonElement>(null);
  const school = spellSchoolKey(spell.school);

  useEffect(() => {
    backRef.current?.focus({ preventScroll: true });
  }, []);

  const primary = PRIMARY_FIELDS.filter((f) => spell[f.name]);
  const secondary = SECONDARY_FIELDS.filter((f) => spell[f.name]);
  const linked = (spell.classIds ?? [])
    .map((id) => classNames?.[id])
    .filter((name): name is string => !!name);
  // O texto do fórum só entra quando nenhuma classe foi vinculada.
  const loose =
    linked.length === 0 && spell.classes
      ? spell.classes
          .split(/[,;]/)
          .map((part) => part.trim())
          .filter(Boolean)
      : [];
  const source =
    spell.sourceUrl && /^https?:\/\//i.test(spell.sourceUrl)
      ? spell.sourceUrl
      : null;
  const hasSheet =
    primary.length > 0 ||
    secondary.length > 0 ||
    linked.length > 0 ||
    loose.length > 0 ||
    !!source;

  const root = `${handles.spellDetail} ${applyModifiers(handles.spellDetail, school)}${
    compact ? ` ${applyModifiers(handles.spellDetail, 'compact')}` : ''
  }`;

  return (
    <div
      className={root}
      role="dialog"
      aria-modal="true"
      aria-label={spell.name}
    >
      <div className={handles.spellDetailBar}>
        <button
          ref={backRef}
          type="button"
          className={handles.spellDetailBack}
          onClick={onClose}
        >
          <ArrowLeftIcon />
          Grimório
        </button>
        {canEdit && (
          <button
            type="button"
            className={handles.spellDetailEdit}
            onClick={() => onEdit(spell)}
          >
            <PencilIcon />
            Editar
          </button>
        )}
      </div>

      {spell.image ? (
        <div className={handles.spellDetailHero}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={handles.spellDetailHeroImage}
            src={spell.image}
            alt=""
          />
        </div>
      ) : (
        <div
          className={`${handles.spellDetailHero} ${applyModifiers(
            handles.spellDetailHero,
            'empty'
          )}`}
          aria-hidden="true"
        >
          <AstrolabeIcon className={handles.spellDetailRing} />
          <SpellSchoolIcon
            school={school}
            className={handles.spellDetailGlyph}
          />
        </div>
      )}

      <div className={handles.spellDetailMain}>
        <div className={handles.spellDetailTitleBlock}>
          <div className={handles.spellDetailSeal} aria-hidden="true">
            <b className={handles.spellDetailSealNumber}>
              {circleLabel(spell.circle)}
            </b>
            <small className={handles.spellDetailSealLabel}>
              {spell.circle === 0 ? 'truque' : 'círculo'}
            </small>
          </div>
          <div className={handles.spellDetailTitleText}>
            <h1 className={handles.spellDetailName}>{spell.name}</h1>
            <div className={handles.spellDetailSchool}>
              <SpellSchoolIcon
                school={school}
                className={handles.spellDetailSchoolGlyph}
              />
              <span className={handles.spellDetailSchoolText}>
                {spell.school || 'Escola não informada'}
              </span>
              <span aria-hidden="true">·</span>
              {circleTitle(spell.circle)}
            </div>
          </div>
        </div>

        <div
          className={`${handles.spellDetailBody}${
            hasSheet
              ? ''
              : ` ${applyModifiers(handles.spellDetailBody, 'solo')}`
          }`}
        >
          {hasSheet && (
            <aside
              className={handles.spellDetailSheet}
              aria-label="Ficha da magia"
            >
              {primary.length > 0 && (
                <div className={handles.spellDetailQuad}>
                  {primary.map((field) => (
                    <div
                      key={field.name}
                      className={handles.spellDetailQuadCell}
                    >
                      <span className={handles.spellDetailLabel}>
                        {field.label}
                      </span>
                      <span className={handles.spellDetailValue}>
                        {spell[field.name]}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {secondary.length > 0 && (
                <dl className={handles.spellDetailFields}>
                  {secondary.map((field) => (
                    <div key={field.name} className={handles.spellDetailField}>
                      <dt className={handles.spellDetailFieldTerm}>
                        {field.label}
                      </dt>
                      <dd className={handles.spellDetailFieldValue}>
                        {spell[field.name]}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}

              {(linked.length > 0 || loose.length > 0) && (
                <div>
                  <p className={handles.spellDetailClassesHead}>
                    Classes que conhecem
                  </p>
                  <ul className={handles.spellDetailChips}>
                    {linked.map((name) => (
                      <li key={name} className={handles.spellDetailChip}>
                        {name}
                      </li>
                    ))}
                    {loose.map((name) => (
                      <li
                        key={name}
                        className={`${handles.spellDetailChip} ${applyModifiers(
                          handles.spellDetailChip,
                          'loose'
                        )}`}
                        title="Texto do fórum, sem classe vinculada"
                      >
                        {name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {source && (
                <p className={handles.spellDetailSource}>
                  Fonte:{' '}
                  <a
                    className={handles.spellDetailSourceLink}
                    href={source}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    tópico no fórum ↗
                  </a>
                  {spell.importedAt && (
                    <>
                      <br />
                      Importada em{' '}
                      {new Date(spell.importedAt).toLocaleDateString('pt-BR')}
                    </>
                  )}
                </p>
              )}
            </aside>
          )}

          <div className={handles.spellDetailDescription}>
            {spell.description?.trim() ? (
              renderDescription(spell.description)
            ) : (
              <p className={handles.spellDetailEmpty}>
                Sem descrição.
                {canEdit && ' Use “Editar” para escrever uma.'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpellDetail;
