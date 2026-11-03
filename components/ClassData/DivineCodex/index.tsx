'use client';

import {
  Fragment,
  useCallback,
  useEffect,
  useId,
  useRef,
  type KeyboardEvent,
  type RefObject,
  type ReactNode,
} from 'react';
import type {
  IClassDomain,
  IDivineOrder,
  IDivineOrderAbility,
  IFeatureTable,
} from '@/db/classes/class.d';
import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import {
  ChevronRightIcon,
  CloseIcon,
  ExternalLinkIcon,
  SearchIcon,
} from '../../Icons';
import Modal from '../../Modal';
import {
  castListOf,
  dvAbilityId,
  dvLevelId,
  dvNorm,
  dvPowerId,
  dvSpellId,
  useDivineCodex,
  type DivineCodexState,
} from './useDivineCodex';
import DivineCodexHandles from './handles';
import '@/styles/components/divineCodex.scss';

type DvHandles = Record<(typeof DivineCodexHandles)[number], string>;

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  className: string;
  orders: IDivineOrder[];
  domains: IClassDomain[];
}

const PANEL_HEADING_ID = 'dv-panel-h';
const ORDER_HEADING_ID = 'dv-order-h';

const ELEMENTS = [
  'Trevas',
  'Terra',
  'Fogo',
  'Gelo',
  'Luz',
  'Raio',
  'Água',
  'Vento',
];
const ELEMENT_KEYS = new Set(ELEMENTS.map(dvNorm));

const cx = (...parts: (string | false | null | undefined)[]) =>
  parts.filter(Boolean).join(' ');

const plural = (n: number, one: string, many: string) =>
  `${n} ${n === 1 ? one : many}`;

// ── Text utils ────────────────────────────────────────────────────────────────

/** Wraps the match of an already-normalized query, keeping original accents. */
function highlight(text: string, normQuery: string): ReactNode {
  if (!normQuery) return text;
  const i = dvNorm(text).indexOf(normQuery);
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark>{text.slice(i, i + normQuery.length)}</mark>
      {text.slice(i + normQuery.length)}
    </>
  );
}

/** First sentence of the spellcasting string — used as the fact heading. */
function spellcastingHeading(text: string): string {
  const match = text.match(/^[^.]+\./);
  return match ? match[0] : text.split('\n')[0];
}

const isElementTable = (t: IFeatureTable) =>
  t.rows.length > 0 &&
  t.rows.filter((r) => ELEMENT_KEYS.has(dvNorm(r[0] ?? ''))).length >=
    t.rows.length / 2;

// ── Description renderer ──────────────────────────────────────────────────────

interface IDescProps {
  text: string;
  tables?: IFeatureTable[];
  handles: DvHandles;
  dropCap?: boolean;
  /** Element picked in the Cristalista picker; highlights its table rows. */
  attuned?: string | null;
}

const LIST_ITEM = /^(-{1,4}|[*•])\s+(.*)$/;

function renderDesc({
  text,
  tables,
  handles,
  dropCap,
  attuned,
}: IDescProps): ReactNode {
  const parts = text.split(/\[\[tabela:(\d+)\]\]/g);
  const blocks: ReactNode[] = [];

  parts.forEach((part, i) => {
    if (i % 2 === 1) {
      const table = tables?.[Number(part)];
      if (!table) return;
      const elemental = isElementTable(table);
      blocks.push(
        <div key={`tbl${i}`} className={handles.dvDescTable}>
          <table>
            {table.headers && (
              <thead>
                <tr>
                  {table.headers.map((h, j) => (
                    <th key={j} scope="col">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {table.rows.map((row, j) => (
                <tr
                  key={j}
                  aria-current={
                    elemental &&
                    attuned &&
                    dvNorm(row[0] ?? '') === dvNorm(attuned)
                      ? 'true'
                      : undefined
                  }
                >
                  {row.map((cell, c) =>
                    elemental && c === 0 ? (
                      <th key={c} scope="row">
                        {cell}
                      </th>
                    ) : (
                      <td key={c}>{cell}</td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      return;
    }

    const lines = part.split('\n');
    const out: ReactNode[] = [];
    let listItems: { depth: number; text: string }[] = [];

    const flushList = () => {
      if (!listItems.length) return;
      const buildTree = (items: typeof listItems): ReactNode => {
        interface INode {
          text: string;
          children: INode[];
        }
        const roots: INode[] = [];
        const stack: { depth: number; node: INode }[] = [];
        for (const item of items) {
          const node: INode = { text: item.text, children: [] };
          while (stack.length && stack[stack.length - 1].depth >= item.depth)
            stack.pop();
          if (!stack.length) roots.push(node);
          else stack[stack.length - 1].node.children.push(node);
          stack.push({ depth: item.depth, node });
        }
        const toJsx = (nodes: INode[], key: string): ReactNode => (
          <ul key={key} className={handles.dvDescBullets}>
            {nodes.map((n, idx) => (
              <li key={idx}>
                {n.text}
                {n.children.length > 0 && toJsx(n.children, `${key}-${idx}`)}
              </li>
            ))}
          </ul>
        );
        return toJsx(roots, 'root');
      };
      out.push(<div key={`l${out.length}`}>{buildTree(listItems)}</div>);
      listItems = [];
    };

    lines.forEach((line, li) => {
      const m = LIST_ITEM.exec(line.trim());
      if (m) {
        const marker = m[1];
        listItems.push({
          depth: marker.startsWith('-') ? marker.length : 1,
          text: m[2].trim(),
        });
        return;
      }
      flushList();
      if (line.trim()) {
        out.push(
          <p key={`p${out.length}-${li}`} className={handles.dvDescText}>
            {line.trim()}
          </p>
        );
      }
    });
    flushList();

    blocks.push(<div key={`chunk${i}`}>{out}</div>);
  });

  return (
    <div
      className={cx(
        handles.dvProse,
        dropCap && applyModifiers(handles.dvProse, 'drop')
      )}
    >
      {blocks}
    </div>
  );
}

// ── Seal ──────────────────────────────────────────────────────────────────────

function Seal({ level, handles }: { level?: number; handles: DvHandles }) {
  if (level == null) {
    return (
      <div
        className={cx(handles.dvSeal, applyModifiers(handles.dvSeal, 'none'))}
        aria-label="desde que o domínio é ganho"
      >
        <b>—</b>
      </div>
    );
  }
  return (
    <div className={handles.dvSeal} aria-label={`${level}º nível`}>
      <b>{level}º</b>
      <small>nível</small>
    </div>
  );
}

// ── Bar: breadcrumb + search ──────────────────────────────────────────────────

interface IBarProps {
  codex: DivineCodexState;
  handles: DvHandles;
  crumbsRef: RefObject<HTMLElement | null>;
  searchRef: RefObject<HTMLDivElement | null>;
  inputRef: RefObject<HTMLInputElement | null>;
}

function Bar({ codex, handles, crumbsRef, searchRef, inputRef }: IBarProps) {
  const uid = useId();
  const listId = `${uid}-results`;
  const optionId = (i: number) => `${uid}-r${i}`;
  const normQuery = dvNorm(codex.query.trim());

  // Keeps the highlighted option visible while arrowing through the list.
  useEffect(() => {
    if (!codex.resultsOpen) return;
    document
      .getElementById(`${uid}-r${codex.selected}`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [codex.selected, codex.resultsOpen, uid]);

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      codex.moveSelection(e.key === 'ArrowDown' ? 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      codex.pick(codex.results[codex.selected]);
      e.currentTarget.blur();
    } else if (e.key === 'Escape' && (codex.query || codex.resultsOpen)) {
      // Clears the search without also closing the modal.
      e.stopPropagation();
      codex.clearSearch();
    }
  };

  return (
    <div className={handles.dvBar}>
      <nav
        ref={crumbsRef}
        className={handles.dvCrumbs}
        aria-label="Onde você está"
      >
        <button
          type="button"
          className={handles.dvCrumb}
          aria-current={codex.view === 'tabua' ? 'page' : undefined}
          onClick={codex.goTabua}
        >
          Tábua<span className={handles.dvLong}> das ordens</span>
        </button>
        {codex.view === 'ordem' && codex.order && (
          <>
            <span className={handles.dvCrumbSep} aria-hidden="true">
              ›
            </span>
            <button
              type="button"
              className={cx(
                handles.dvCrumb,
                applyModifiers(handles.dvCrumb, 'menu')
              )}
              aria-current="page"
              aria-haspopup="true"
              aria-expanded={codex.menu}
              onClick={() => codex.setMenu(!codex.menu)}
            >
              {codex.order.name}
              <ChevronRightIcon aria-hidden="true" />
            </button>
          </>
        )}
        {codex.menu && (
          <div className={handles.dvMenu} role="menu">
            {codex.sortedOrders.map((o) => (
              <button
                key={o.slug}
                type="button"
                role="menuitem"
                className={handles.dvMenuItem}
                aria-current={o.slug === codex.orderSlug}
                onClick={() => codex.openOrder(o.slug)}
              >
                <b>{o.name}</b>
                <small>
                  {[o.deity, castListOf(o)].filter(Boolean).join(' · ') || '—'}
                </small>
              </button>
            ))}
          </div>
        )}
      </nav>

      <div ref={searchRef} className={handles.dvSearch}>
        <label className={handles.dvSearchField}>
          <SearchIcon aria-hidden="true" />
          <span className={handles.dvSr}>Buscar em ordens e domínios</span>
          <input
            ref={inputRef}
            type="search"
            autoComplete="off"
            placeholder="Buscar ordem, dádiva, domínio, poder ou magia"
            role="combobox"
            aria-expanded={codex.resultsOpen}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={
              codex.resultsOpen && codex.results.length
                ? optionId(codex.selected)
                : undefined
            }
            value={codex.query}
            onChange={(e) => codex.setQuery(e.target.value)}
            onFocus={codex.openResults}
            onKeyDown={onKeyDown}
          />
          <kbd className={handles.dvSearchKbd} aria-hidden="true">
            /
          </kbd>
        </label>
        {codex.resultsOpen && (
          <div
            id={listId}
            className={handles.dvResults}
            role="listbox"
            aria-label="Resultados"
            onMouseDown={(e) => e.preventDefault()}
          >
            {codex.results.length === 0 && (
              <div className={handles.dvResEmpty}>
                Nada encontrado para &ldquo;{codex.query.trim()}&rdquo;.
              </div>
            )}
            {codex.results.map((r, i) => {
              const header =
                r.group !== codex.results[i - 1]?.group ? (
                  <div
                    key={`g-${r.group}`}
                    className={handles.dvResGroup}
                    role="presentation"
                  >
                    {r.group}
                  </div>
                ) : null;
              return (
                <Fragment key={`${r.group}-${i}`}>
                  {header}
                  <button
                    type="button"
                    id={optionId(i)}
                    role="option"
                    className={handles.dvRes}
                    aria-selected={i === codex.selected}
                    onMouseEnter={() => codex.setSelected(i)}
                    onClick={() => codex.pick(r)}
                  >
                    <b>{highlight(r.label, normQuery)}</b>
                    <small>{r.context}</small>
                    {r.tag && <i>{r.tag}</i>}
                  </button>
                </Fragment>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Tábua ─────────────────────────────────────────────────────────────────────

function Preview({
  order,
  codex,
  handles,
}: {
  order: IDivineOrder;
  codex: DivineCodexState;
  handles: DvHandles;
}) {
  const cast = castListOf(order) || spellcastingHeading(order.spellcasting);
  const skill = order.skill.split(';')[0].trim();
  return (
    <aside className={handles.dvPreview} aria-live="polite">
      <div>
        <span className={handles.dvKicker}>Prévia</span>
        <h4>{order.name}</h4>
        <p className={handles.dvPreviewDeity}>
          {order.deity ? (
            <>
              devotos de <b>{order.deity}</b>
            </>
          ) : (
            'deidade não citada no texto'
          )}
        </p>
      </div>
      <p className={handles.dvBlurb}>{order.description}</p>
      <dl className={handles.dvMini}>
        <dt>Magias</dt>
        <dd>{cast}</dd>
        <dt>Perícia</dt>
        <dd>{skill || '—'}</dd>
        <dt>Arma</dt>
        <dd>{order.weapon || '—'}</dd>
        <dt>Domínios</dt>
        <dd>{order.domainSlugs.map(codex.domainName).join(', ')}</dd>
      </dl>
      <ul className={handles.dvGiftList} aria-label="Dádivas por nível">
        {order.abilities.map((a, i) => (
          <li key={i}>
            <i>{a.level}º</i>
            <span>{a.name}</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className={cx(handles.dvBtn, applyModifiers(handles.dvBtn, 'primary'))}
        onClick={() => codex.openOrder(order.slug)}
      >
        Abrir {order.name}
        <ChevronRightIcon aria-hidden="true" />
      </button>
    </aside>
  );
}

function TabuaView({
  codex,
  handles,
}: {
  codex: DivineCodexState;
  handles: DvHandles;
}) {
  const { pins, usedDomains, unusedDomains, sortedOrders, grantedBy } = codex;
  const hits = sortedOrders.filter(codex.matchesPins);
  const previewOrder =
    codex.orderBySlug.get(codex.preview ?? '') ?? sortedOrders[0];
  const countOf = (slug: string) => grantedBy.get(slug)?.length ?? 0;

  return (
    <div className={handles.dvPad}>
      <div className={handles.dvTabHead}>
        <div>
          <span className={handles.dvKicker}>
            {sortedOrders.length} ordens deíficas · {usedDomains.length}{' '}
            domínios concedidos
          </span>
          <h3 className={handles.dvH3}>Tábua das ordens</h3>
          <p className={handles.dvLede}>
            Cada ordem serve a uma deidade e libera um conjunto de domínios. O
            clérigo jura uma ordem e escolhe dois desses domínios.
          </p>
        </div>
        <div className={handles.dvFilterLine} aria-live="polite">
          {pins.length > 0 ? (
            <>
              <span>
                <em>{pins.map(codex.domainName).join(' + ')}</em>:{' '}
                {hits.length > 0 ? (
                  <>
                    <b>{plural(hits.length, 'ordem', 'ordens')}</b> —{' '}
                    {hits.map((o) => o.name).join(', ')}
                  </>
                ) : (
                  <b>nenhuma ordem permite essa dupla</b>
                )}
              </span>
              <button
                type="button"
                className={handles.dvBtnGhost}
                onClick={codex.clearPins}
              >
                Limpar
              </button>
            </>
          ) : (
            <span>
              Fixe até dois domínios nas colunas para ver quais ordens permitem
              a dupla.
            </span>
          )}
        </div>
      </div>

      <div
        className={handles.dvPinRow}
        role="group"
        aria-label="Fixar domínios"
      >
        {usedDomains.map((s) => (
          <button
            key={s}
            type="button"
            className={handles.dvChip}
            aria-pressed={pins.includes(s)}
            onClick={() => codex.togglePin(s)}
          >
            {codex.domainName(s)} <small>{countOf(s)}</small>
          </button>
        ))}
      </div>

      <div className={handles.dvTabGrid}>
        <div className={handles.dvMatrixWrap}>
          <table
            className={handles.dvMatrix}
            onMouseLeave={() => codex.setHotCol(null)}
          >
            <caption className={handles.dvSr}>
              Ordens nas linhas, domínios nas colunas. O losango marca um
              domínio que a ordem permite.
            </caption>
            <thead>
              <tr>
                <th className={handles.dvCorner} scope="col">
                  Ordem · deidade · lista
                </th>
                {usedDomains.map((s) => (
                  <th
                    key={s}
                    scope="col"
                    className={cx(
                      handles.dvColHead,
                      pins.includes(s) &&
                        applyModifiers(handles.dvColHead, 'pin'),
                      codex.hotCol === s &&
                        applyModifiers(handles.dvColHead, 'hot')
                    )}
                    onMouseEnter={() => codex.setHotCol(s)}
                  >
                    <button
                      type="button"
                      className={handles.dvColBtn}
                      aria-pressed={pins.includes(s)}
                      title={`Fixar ${codex.domainName(s)}`}
                      onClick={() => codex.togglePin(s)}
                    >
                      <span>{codex.domainName(s)}</span>
                      <small>{countOf(s)}</small>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedOrders.map((o) => (
                <tr
                  key={o.slug}
                  className={cx(
                    handles.dvRow,
                    pins.length > 0 &&
                      !codex.matchesPins(o) &&
                      applyModifiers(handles.dvRow, 'out'),
                    previewOrder?.slug === o.slug &&
                      applyModifiers(handles.dvRow, 'hot')
                  )}
                  onMouseEnter={() => codex.setPreview(o.slug)}
                  onFocus={() => codex.setPreview(o.slug)}
                >
                  <th scope="row">
                    <button
                      type="button"
                      className={handles.dvRowBtn}
                      onClick={() => codex.openOrder(o.slug)}
                    >
                      <b>{o.name}</b>
                      <small>
                        {o.deity || 'deidade não citada'}
                        {castListOf(o) && (
                          <>
                            {' · '}
                            <em>{castListOf(o)}</em>
                          </>
                        )}
                      </small>
                    </button>
                  </th>
                  {usedDomains.map((s) => (
                    <td
                      key={s}
                      className={cx(
                        handles.dvCell,
                        pins.includes(s) &&
                          applyModifiers(handles.dvCell, 'pin'),
                        codex.hotCol === s &&
                          applyModifiers(handles.dvCell, 'hot')
                      )}
                      onMouseEnter={() => codex.setHotCol(s)}
                    >
                      {o.domainSlugs.includes(s) && (
                        <span
                          className={handles.dvPip}
                          role="img"
                          aria-label={`${o.name} permite ${codex.domainName(s)}`}
                        />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className={handles.dvCards}>
          {sortedOrders.map((o) => (
            <li
              key={o.slug}
              className={cx(
                handles.dvCard,
                pins.length > 0 &&
                  !codex.matchesPins(o) &&
                  applyModifiers(handles.dvCard, 'out')
              )}
            >
              <button type="button" onClick={() => codex.openOrder(o.slug)}>
                <b>{o.name}</b>
                <small>
                  {[o.deity || 'deidade não citada', castListOf(o)]
                    .filter(Boolean)
                    .join(' · ')}
                </small>
                <span className={handles.dvCardDoms}>
                  {o.domainSlugs.map((s) => (
                    <span
                      key={s}
                      className={
                        pins.includes(s)
                          ? applyModifiers(handles.dvCardDoms, 'hit')
                          : undefined
                      }
                    >
                      <span className={handles.dvPip} />
                      {codex.domainName(s)}
                    </span>
                  ))}
                </span>
              </button>
            </li>
          ))}
        </ul>

        {previewOrder && (
          <Preview order={previewOrder} codex={codex} handles={handles} />
        )}
      </div>

      <div className={handles.dvDomIndex}>
        <section>
          <h4>
            Concedidos <small>{usedDomains.length}</small>
          </h4>
          <div className={handles.dvChips}>
            {usedDomains.map((s) => (
              <button
                key={s}
                type="button"
                className={handles.dvChip}
                onClick={() => codex.openPanel(s)}
              >
                {codex.domainName(s)} <small>{countOf(s)}</small>
              </button>
            ))}
          </div>
        </section>
        {unusedDomains.length > 0 && (
          <section>
            <h4>
              Sem ordem catalogada <small>{unusedDomains.length}</small>
            </h4>
            <p>Estão no compêndio, mas nenhuma das ordens os lista.</p>
            <div className={handles.dvChips}>
              {unusedDomains.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={handles.dvChip}
                  onClick={() => codex.openPanel(s)}
                >
                  {codex.domainName(s)}
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

// ── Ordem ─────────────────────────────────────────────────────────────────────

function AttunePicker({
  attuned,
  onChange,
  handles,
}: {
  attuned: string | null;
  onChange: (element: string) => void;
  handles: DvHandles;
}) {
  const labelId = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    let next = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown')
      next = (i + 1) % ELEMENTS.length;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp')
      next = (i - 1 + ELEMENTS.length) % ELEMENTS.length;
    if (next < 0) return;
    e.preventDefault();
    onChange(ELEMENTS[next]);
    refs.current[next]?.focus({ preventScroll: true });
  };

  return (
    <div className={handles.dvAttune}>
      <div className={handles.dvAttuneHead}>
        <span id={labelId}>Cristal sintonizado</span>
        <small>Escolha um elemento para destacá-lo nas tabelas</small>
      </div>
      <div
        className={handles.dvElems}
        role="radiogroup"
        aria-labelledby={labelId}
      >
        {ELEMENTS.map((el, i) => (
          <button
            key={el}
            ref={(node) => {
              refs.current[i] = node;
            }}
            type="button"
            role="radio"
            className={handles.dvElem}
            aria-checked={el === attuned}
            tabIndex={el === attuned || (!attuned && i === 0) ? 0 : -1}
            onClick={() => onChange(el)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            {el}
          </button>
        ))}
      </div>
    </div>
  );
}

function AbilityBlock({
  order,
  ability,
  index,
  withPicker,
  codex,
  handles,
}: {
  order: IDivineOrder;
  ability: IDivineOrderAbility;
  index: number;
  withPicker: boolean;
  codex: DivineCodexState;
  handles: DvHandles;
}) {
  return (
    <article className={handles.dvAbility} id={dvAbilityId(order.slug, index)}>
      <div className={handles.dvAbilityHead}>
        <h5>{ability.name}</h5>
        <span className={handles.dvLvlTag}>{ability.level}º nível</span>
      </div>
      <div className={handles.dvBody}>
        {withPicker && (
          <AttunePicker
            attuned={codex.attuned}
            onChange={codex.setAttuned}
            handles={handles}
          />
        )}
        {renderDesc({
          text: ability.description,
          tables: ability.tables,
          handles,
          attuned: codex.attuned,
        })}
      </div>
    </article>
  );
}

function OrdemView({
  order,
  codex,
  handles,
}: {
  order: IDivineOrder;
  codex: DivineCodexState;
  handles: DvHandles;
}) {
  const castLines = order.spellcasting.split('\n\n').filter(Boolean);
  const heading = spellcastingHeading(order.spellcasting);
  const skillHead = order.skill.split(';')[0].trim();
  const skillFull = order.skill.split(';').slice(1).join(';').trim();

  const levels = [...new Set(order.abilities.map((a) => a.level))].sort(
    (a, b) => a - b
  );
  const lastLevel = levels.length ? levels[levels.length - 1] : 1;
  const pickerIndex =
    dvNorm(order.name) === 'cristalista'
      ? order.abilities.findIndex((a) => a.tables?.some(isElementTable))
      : -1;

  const domains = order.domainSlugs
    .map((s) => codex.domainBySlug.get(s))
    .filter((d): d is IClassDomain => Boolean(d));

  return (
    <div className={handles.dvPad}>
      <article className={handles.dvOrder}>
        <header className={handles.dvFront}>
          <span className={handles.dvKicker}>
            Ordem deífica{order.deity ? ` · devotos de ${order.deity}` : ''}
          </span>
          <h3 className={handles.dvH3} id={ORDER_HEADING_ID} tabIndex={-1}>
            {order.name}
          </h3>
          <div className={handles.dvFiligree} aria-hidden="true">
            ◆
          </div>
          {renderDesc({ text: order.description, handles, dropCap: true })}
        </header>

        <dl className={handles.dvFacts}>
          <div className={handles.dvFact}>
            <dt>Magias</dt>
            <dd>{heading}</dd>
            {castLines.length > 1 ? (
              <dd>
                <details>
                  <summary>
                    <ChevronRightIcon aria-hidden="true" />
                    Regras de conjuração
                  </summary>
                  {castLines.slice(1).map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </details>
              </dd>
            ) : (
              castLines[0] !== heading && (
                <dd className={handles.dvFactNote}>{castLines[0]}</dd>
              )
            )}
          </div>
          <div className={handles.dvFact}>
            <dt>Perícia de classe</dt>
            <dd>{skillHead}</dd>
            {skillFull && <dd className={handles.dvFactNote}>{skillFull}</dd>}
          </div>
          <div className={handles.dvFact}>
            <dt>Arma favorita</dt>
            {order.weapon ? (
              <dd>{order.weapon}</dd>
            ) : (
              <dd className={handles.dvFactMissing}>
                O texto da ordem não declara arma favorita.
              </dd>
            )}
          </div>
        </dl>

        <aside className={handles.dvDoms} aria-labelledby="dv-doms-h">
          <div className={handles.dvDomsHead}>
            <span className={handles.dvKicker}>Domínios permitidos</span>
            <h4 id="dv-doms-h">
              {plural(domains.length, 'domínio', 'domínios')}
            </h4>
            <p>Ao jurar esta ordem, o clérigo escolhe dois entre estes.</p>
          </div>
          <ul className={handles.dvDomList}>
            {domains.map((d) => {
              const others = (codex.grantedBy.get(d.slug) ?? []).filter(
                (s) => s !== order.slug
              );
              return (
                <li
                  key={d.slug}
                  className={handles.dvDomItem}
                  onClick={() => codex.openPanel(d.slug)}
                >
                  <b>{d.name}</b>
                  <button
                    type="button"
                    className={handles.dvDomOpen}
                    aria-label={`Abrir ${d.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      codex.openPanel(d.slug);
                    }}
                  >
                    <ExternalLinkIcon aria-hidden="true" />
                  </button>
                  <span>{d.description}</span>
                  <em>
                    {plural(d.powers.length, 'poder', 'poderes')} ·{' '}
                    {plural(d.spells.length, 'magia', 'magias')}
                    {others.length > 0 ? (
                      <>
                        {' · também em '}
                        <b>
                          {others
                            .map((s) => codex.orderBySlug.get(s)?.name ?? s)
                            .join(', ')}
                        </b>
                      </>
                    ) : (
                      ' · exclusivo desta ordem'
                    )}
                  </em>
                </li>
              );
            })}
          </ul>
        </aside>

        <section className={handles.dvGifts} aria-labelledby="dv-gifts-h">
          <div className={handles.dvGiftsHead}>
            <h4 id="dv-gifts-h">
              Dádivas {order.deity ? `de ${order.deity}` : 'da deidade'}
            </h4>
            <span className={handles.dvLede}>
              {plural(order.abilities.length, 'habilidade', 'habilidades')}, do
              1º ao {lastLevel}º nível
            </span>
          </div>

          <div
            className={handles.dvRuler}
            role="navigation"
            aria-label="Dádivas por nível"
          >
            {Array.from({ length: 20 }, (_, i) => i + 1).map((L) =>
              levels.includes(L) ? (
                <button
                  key={L}
                  type="button"
                  className={cx(
                    handles.dvTick,
                    applyModifiers(handles.dvTick, 'gift')
                  )}
                  aria-label={`Ir ao ${L}º nível`}
                  onClick={() => codex.requestFlash(dvLevelId(L))}
                >
                  <span className={handles.dvPip} />
                  {L}
                </button>
              ) : (
                <span key={L} className={handles.dvTick} aria-hidden="true">
                  {L}
                </span>
              )
            )}
          </div>

          {levels.map((L) => (
            <section key={L} className={handles.dvLvl} id={dvLevelId(L)}>
              <Seal level={L} handles={handles} />
              <div className={handles.dvLvlItems}>
                {order.abilities.map((a, i) =>
                  a.level === L ? (
                    <AbilityBlock
                      key={i}
                      order={order}
                      ability={a}
                      index={i}
                      withPicker={i === pickerIndex}
                      codex={codex}
                      handles={handles}
                    />
                  ) : null
                )}
              </div>
            </section>
          ))}
        </section>
      </article>
    </div>
  );
}

// ── Painel de domínio ─────────────────────────────────────────────────────────

function DomainPanel({
  domain,
  codex,
  handles,
}: {
  domain: IClassDomain;
  codex: DivineCodexState;
  handles: DvHandles;
}) {
  const by = codex.grantedBy.get(domain.slug) ?? [];
  return (
    <>
      <div className={handles.dvScrim} onClick={codex.closePanel} />
      <section
        className={handles.dvPanel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={PANEL_HEADING_ID}
      >
        <header className={handles.dvPanelHead}>
          <div>
            <span className={handles.dvKicker}>Domínio</span>
            <h3 id={PANEL_HEADING_ID} tabIndex={-1}>
              {domain.name}
            </h3>
          </div>
          <button
            type="button"
            className={handles.dvClose}
            aria-label="Fechar domínio"
            onClick={codex.closePanel}
          >
            <CloseIcon aria-hidden="true" />
          </button>
          {renderDesc({ text: domain.description, handles })}
        </header>

        <div className={handles.dvPanelBody}>
          <section>
            <h4>Poderes concedidos</h4>
            {domain.powers.map((p, i) => (
              <article
                key={i}
                className={handles.dvPower}
                id={dvPowerId(domain.slug, i)}
              >
                <Seal level={p.level} handles={handles} />
                <div>
                  <h5>{p.name}</h5>
                  {renderDesc({ text: p.description, handles })}
                </div>
              </article>
            ))}
          </section>

          <section>
            <h4>Magias do domínio</h4>
            <ol className={handles.dvLadder}>
              {domain.spells.map((s) => (
                <li key={s.circle} id={dvSpellId(domain.slug, s.circle)}>
                  <strong aria-label={`${s.circle}º círculo`}>
                    {s.circle}º
                  </strong>
                  <span>{s.name}</span>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h4>Concedido por</h4>
            {by.length > 0 ? (
              <div className={handles.dvGrantedBy}>
                {by.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={handles.dvChip}
                    onClick={() => codex.openOrder(s)}
                  >
                    {codex.orderBySlug.get(s)?.name ?? s}
                  </button>
                ))}
              </div>
            ) : (
              <p className={handles.dvLede}>
                Nenhuma ordem catalogada lista este domínio.
              </p>
            )}
          </section>
        </div>
      </section>
    </>
  );
}

// ── Root component ────────────────────────────────────────────────────────────

const DivineCodex = ({
  isOpen,
  onClose,
  className,
  orders,
  domains,
}: IProps) => {
  const handles = useCssHandles(DivineCodexHandles);
  const codex = useDivineCodex(orders, domains);
  const viewRef = useRef<HTMLDivElement>(null);
  const crumbsRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { menu, panel, flash, view, orderSlug, resultsOpen } = codex;
  const { setMenu, closePanel, closeResults } = codex;

  // Escape (and the modal's close button) peel off the topmost layer first.
  const handleClose = useCallback(() => {
    if (panel) closePanel();
    else if (menu) setMenu(false);
    else onClose();
  }, [panel, menu, closePanel, setMenu, onClose]);

  // A new view starts at the top; filtering a pin or picking an element keeps
  // the scroll because neither changes these two values.
  useEffect(() => {
    viewRef.current?.scrollTo({ top: 0 });
  }, [view, orderSlug]);

  useEffect(() => {
    if (panel) document.getElementById(PANEL_HEADING_ID)?.focus();
  }, [panel]);

  useEffect(() => {
    if (!flash) return;
    const raf = requestAnimationFrame(() => {
      const el = document.getElementById(flash.id);
      if (!el) return;
      if (el instanceof HTMLDetailsElement) el.open = true;
      const reduced = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;
      el.scrollIntoView({
        block: 'start',
        behavior: reduced ? 'auto' : 'smooth',
      });
      // Re-adding the class restarts the animation on repeated hits.
      el.classList.remove(handles.dvFlash);
      void el.offsetWidth;
      el.classList.add(handles.dvFlash);
    });
    return () => cancelAnimationFrame(raf);
  }, [flash, handles.dvFlash]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      const tag = document.activeElement?.tagName;
      if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);

  useEffect(() => {
    if (!menu && !resultsOpen) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (menu && !crumbsRef.current?.contains(target)) setMenu(false);
      if (resultsOpen && !searchRef.current?.contains(target)) closeResults();
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [menu, resultsOpen, setMenu, closeResults]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      eyebrow={className}
      title="Ordens & Domínios"
      variant="sheet"
      className={handles.dvShell}
      headerExtra={
        <Bar
          codex={codex}
          handles={handles}
          crumbsRef={crumbsRef}
          searchRef={searchRef}
          inputRef={inputRef}
        />
      }
    >
      <div className={handles.dvStage}>
        <div ref={viewRef} className={handles.dvView} tabIndex={-1}>
          {view === 'ordem' && codex.order ? (
            <OrdemView order={codex.order} codex={codex} handles={handles} />
          ) : (
            <TabuaView codex={codex} handles={handles} />
          )}
        </div>
        {codex.panelDomain && (
          <DomainPanel
            domain={codex.panelDomain}
            codex={codex}
            handles={handles}
          />
        )}
      </div>
    </Modal>
  );
};

export default DivineCodex;
