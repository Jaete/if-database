'use client';

import { useState } from 'react';
import type { ITalentOption } from '@/services/talentCatalog';
import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import Modal from '@/components/Modal';
import { requiredLevel, shortCategory } from '../../sheetData';
import type { ITalentProgress } from '../../sheetData';
import { onRadioGroupKeyDown, rovingTabIndex } from '../../radioGroup';
import TalentPickerHandles from './handles';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  /** `null` enquanto o catálogo baixa. */
  options: ITalentOption[] | null;
  failed: boolean;
  /** Nome da classe ligada: dá nome ao filtro de escopo. */
  className: string;
  level: number;
  progress: ITalentProgress;
  /** Quantas vezes a ficha já tem o talento. */
  countOf: (key: string) => number;
  onAdd: (option: ITalentOption, level: number) => void;
}

type Scope = 'all' | 'general' | 'class';

const fold = (text: string) =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/**
 * Escolhe um talento, geral ou da classe.
 *
 * Em dois toques: o primeiro seleciona e mostra o rodapé com o nível em que foi
 * tomado; o segundo adiciona. A contagem de marcos é só informação — um marco
 * sem talento pode ter ido para atributos, e a ficha não sabe disso.
 *
 * O corpo só existe com o modal aberto (como em ArchetypePicker): a busca e os
 * filtros nascem limpos a cada abertura.
 */
const TalentPicker = ({ isOpen, onClose, ...rest }: IProps) => {
  const handles = useCssHandles(TalentPickerHandles);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Escolher talento"
      variant="sheet"
      className={handles.sheetTalentPickerShell}
    >
      {isOpen && <TalentPickerBody onClose={onClose} {...rest} />}
    </Modal>
  );
};

const TalentPickerBody = ({
  onClose,
  options,
  failed,
  className,
  level,
  progress,
  countOf,
  onAdd,
}: Omit<IProps, 'isOpen'>) => {
  const handles = useCssHandles(TalentPickerHandles);
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState<Scope>('all');
  const [category, setCategory] = useState('all');
  const [selected, setSelected] = useState<string | null>(null);
  const [at, setAt] = useState(Math.max(1, level));

  if (!options) {
    return (
      <p className={handles.sheetTalentPickerNote}>
        {failed
          ? 'Não foi possível carregar os talentos. Feche e tente de novo.'
          : 'Carregando os talentos...'}
      </p>
    );
  }

  const general = options.filter((o) => o.scope === 'general');
  const ofClass = options.filter((o) => o.scope === 'class');
  const categories = [...new Set(general.map((o) => o.category ?? ''))]
    .filter(Boolean)
    .map((name) => ({
      name,
      count: general.filter((o) => o.category === name).length,
    }))
    .sort((a, b) => b.count - a.count);

  const needle = fold(query.trim());
  const list = options.filter(
    (o) =>
      (scope === 'all' || o.scope === scope) &&
      (category === 'all' || o.scope === 'class' || o.category === category) &&
      (!needle ||
        fold(
          `${o.name} ${o.prerequisites ?? ''} ${o.description ?? ''}`
        ).includes(needle))
  );

  const chosen = options.find((o) => o.key === selected);
  const free = Math.max(0, progress.reached - progress.taken);
  const reachedLevels = progress.nodes
    .filter((n) => n.level <= level)
    .map((n) => n.level);

  /** O primeiro marco livre que serve ao escopo do talento, ou o nível atual. */
  const defaultLevel = (option: ITalentOption) => {
    const kinds: ('class' | 'general')[] =
      option.scope === 'class' ? ['class', 'general'] : ['general'];
    for (const kind of kinds) {
      const node = progress.nodes.find(
        (n) => n.kind === kind && n.state === 'open'
      );
      if (node) return node.level;
    }
    return Math.max(1, level);
  };

  const select = (option: ITalentOption) => {
    setSelected(option.key);
    setAt(defaultLevel(option));
  };

  const scopes: [Scope, string, number][] = [
    ['all', 'Todos', options.length],
    ['general', 'Gerais', general.length],
    ['class', className || 'Classe', ofClass.length],
  ];

  return (
    <div className={handles.sheetTalentPicker}>
      <div className={handles.sheetTalentPickerBody}>
        <p className={handles.sheetTalentPickerNote}>
          <b>
            {progress.reached} {progress.reached === 1 ? 'marco' : 'marcos'}
          </b>{' '}
          até o nível {level}
          {reachedLevels.length > 0 &&
            ` (níveis ${reachedLevels.join(', ')})`}{' '}
          · {progress.taken} {progress.taken === 1 ? 'escolhido' : 'escolhidos'}{' '}
          ·{' '}
          {free > 0 ? (
            <b>
              {free} {free === 1 ? 'livre' : 'livres'}
            </b>
          ) : (
            'nenhum livre'
          )}
          . A contagem só informa e não bloqueia.
        </p>

        <div className={handles.sheetTalentPickerTools}>
          <input
            className={handles.sheetTalentPickerSearch}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nome, pré-requisito ou texto"
            aria-label="Buscar talento"
          />
          <div className={handles.sheetTalentPickerRow}>
            <div
              className={handles.sheetTalentPickerScopes}
              role="radiogroup"
              aria-label="Escopo"
              onKeyDown={onRadioGroupKeyDown}
            >
              {scopes.map(([value, label, count], i) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={scope === value}
                  tabIndex={rovingTabIndex(scope === value, true, i)}
                  className={handles.sheetTalentPickerScope}
                  onClick={() => setScope(value)}
                >
                  {label}
                  <small>{count}</small>
                </button>
              ))}
            </div>
            <span className={handles.sheetTalentPickerNote} aria-live="polite">
              {list.length} {list.length === 1 ? 'talento' : 'talentos'}
            </span>
          </div>
          {scope !== 'class' && categories.length > 0 && (
            <div
              className={handles.sheetTalentPickerCategories}
              role="group"
              aria-label="Categoria"
            >
              {[{ name: 'all', count: 0 }, ...categories].map((cat) => (
                <button
                  key={cat.name}
                  type="button"
                  className={handles.sheetTalentPickerCategory}
                  aria-pressed={category === cat.name}
                  onClick={() => setCategory(cat.name)}
                >
                  {cat.name === 'all' ? 'Todas' : shortCategory(cat.name)}
                  {cat.count > 0 && <small>{cat.count}</small>}
                </button>
              ))}
            </div>
          )}
        </div>

        <ul className={handles.sheetTalentPickerList}>
          {list.length === 0 && (
            <li className={handles.sheetTalentPickerEmpty}>
              {`Nenhum talento com "${query}". Tente outro termo ou limpe o filtro.`}
            </li>
          )}
          {list.map((option) => {
            const count = countOf(option.key);
            const locked = count > 0 && !option.stackable;
            const needs = requiredLevel(option.prerequisites, className);
            return (
              <li key={option.key}>
                <button
                  type="button"
                  className={handles.sheetTalentPickerOption}
                  aria-pressed={selected === option.key}
                  disabled={locked}
                  onClick={() => select(option)}
                >
                  <span className={handles.sheetTalentPickerHead}>
                    <span className={handles.sheetTalentPickerName}>
                      {option.name}
                    </span>
                    {count > 0 && (
                      <span className={handles.sheetTalentPickerTaken}>
                        {locked ? 'escolhido' : `×${count}`}
                      </span>
                    )}
                  </span>
                  <span className={handles.sheetTalentPickerTags}>
                    <span
                      className={`${handles.sheetTalentPickerPill}${
                        option.scope === 'class'
                          ? ` ${applyModifiers(handles.sheetTalentPickerPill, 'class')}`
                          : ''
                      }`}
                    >
                      {option.scope === 'class' ? 'classe' : 'geral'}
                    </span>
                    <span>
                      {option.scope === 'class'
                        ? option.group || className
                        : shortCategory(option.category)}
                    </span>
                    {option.stackable && (
                      <span className={handles.sheetTalentPickerPill}>
                        repetível
                      </span>
                    )}
                    {needs > level && (
                      <span className={handles.sheetTalentPickerFlag}>
                        pede nível {needs}
                      </span>
                    )}
                  </span>
                  {option.prerequisites && (
                    <span className={handles.sheetTalentPickerPrereq}>
                      <b>Pré-requisito:</b> {option.prerequisites}
                    </span>
                  )}
                  {option.description && (
                    <span className={handles.sheetTalentPickerDesc}>
                      {option.description}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className={handles.sheetTalentPickerFoot}>
        {chosen ? (
          <div className={handles.sheetTalentPickerChosen}>
            <div className={handles.sheetTalentPickerRow2}>
              <span>
                <span className={handles.sheetTalentPickerChosenName}>
                  {chosen.name}
                </span>
                <span className={handles.sheetTalentPickerTags}>
                  <span
                    className={`${handles.sheetTalentPickerPill}${
                      chosen.scope === 'class'
                        ? ` ${applyModifiers(handles.sheetTalentPickerPill, 'class')}`
                        : ''
                    }`}
                  >
                    {chosen.scope === 'class' ? 'classe' : 'geral'}
                  </span>
                  <span>
                    {chosen.scope === 'class'
                      ? className
                      : shortCategory(chosen.category)}
                  </span>
                </span>
              </span>
              <label className={handles.sheetTalentPickerLevel}>
                Tomado no nível
                <select
                  value={at}
                  onChange={(event) => setAt(Number(event.target.value))}
                  aria-label="Nível em que foi tomado"
                >
                  {Array.from(
                    { length: Math.max(1, level) },
                    (_, i) => i + 1
                  ).map((lv) => (
                    <option key={lv} value={lv}>
                      {lv}
                      {progress.nodes.some((n) => n.level === lv)
                        ? ' · marco'
                        : ''}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className={handles.sheetTalentPickerRow2}>
              <span className={handles.sheetTalentPickerNote}>
                {free > 0
                  ? free === 1
                    ? 'Ocupa o marco livre.'
                    : 'Ocupa um dos marcos livres.'
                  : 'Todos os marcos já têm talento. Dá para adicionar mesmo assim.'}
              </span>
              <span className={handles.sheetTalentPickerActions}>
                <PickerButton variant="ghost" onClick={onClose}>
                  Cancelar
                </PickerButton>
                <PickerButton
                  variant="primary"
                  onClick={() => {
                    onAdd(chosen, at);
                    onClose();
                  }}
                >
                  Adicionar
                </PickerButton>
              </span>
            </div>
          </div>
        ) : (
          <>
            <span className={handles.sheetTalentPickerNote}>
              Selecione um talento na lista.
            </span>
            <span className={handles.sheetTalentPickerActions}>
              <PickerButton variant="ghost" onClick={onClose}>
                Cancelar
              </PickerButton>
            </span>
          </>
        )}
      </div>
    </div>
  );
};

const PickerButton = ({
  variant,
  onClick,
  children,
}: {
  variant: 'primary' | 'ghost';
  onClick: () => void;
  children: string;
}) => {
  const handles = useCssHandles(TalentPickerHandles);
  return (
    <button
      type="button"
      className={`${handles.sheetTalentPickerButton} ${applyModifiers(handles.sheetTalentPickerButton, variant)}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default TalentPicker;
