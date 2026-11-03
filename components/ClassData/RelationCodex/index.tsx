'use client';

import {
  Fragment,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type RefObject,
  type ReactNode,
} from 'react';
import type {
  IFeatureTable,
  IRelationAbility,
  IRelationEntity,
  IRelationFact,
  IRelationGroup,
  IRelationListItem,
} from '@/db/classes/class.d';
import { classSlug } from '@/db/l10n/classes';
import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import {
  ChevronRightIcon,
  CloseIcon,
  ExternalLinkIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from '../../Icons';
import Modal from '../../Modal';
import {
  rcAbilityId,
  rcLevelId,
  rcNorm,
  useRelationCodex,
  type RelationCodexState,
} from './useRelationCodex';
import RelationCodexHandles from './handles';
import '@/styles/components/relationCodex.scss';

type RcHandles = Record<(typeof RelationCodexHandles)[number], string>;

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  className: string;
  catalogName: string;
  catalogIcon?: string;
  catalogDescription?: string;
  groupA: IRelationGroup;
  groupB: IRelationGroup;
  canEdit: boolean;
  onSaveEntity: (
    group: 'groupA' | 'groupB',
    entityIndex: number,
    entity: IRelationEntity
  ) => Promise<boolean | undefined> | boolean | undefined;
  onRemoveEntity: (
    group: 'groupA' | 'groupB',
    entityIndex: number
  ) => Promise<boolean | undefined> | boolean | undefined;
  onEditCatalog?: () => void;
}

const PANEL_HEADING_ID = 'rc-panel-h';
const ENTITY_HEADING_ID = 'rc-entity-h';

const cx = (...parts: (string | false | null | undefined)[]) =>
  parts.filter(Boolean).join(' ');

const plural = (n: number, one: string, many: string) =>
  `${n} ${n === 1 ? one : many}`;

// ── Text utils ────────────────────────────────────────────────────────────────

function highlight(text: string, normQuery: string): ReactNode {
  if (!normQuery) return text;
  const i = rcNorm(text).indexOf(normQuery);
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark>{text.slice(i, i + normQuery.length)}</mark>
      {text.slice(i + normQuery.length)}
    </>
  );
}

// ── Description renderer ──────────────────────────────────────────────────────

interface IDescProps {
  text: string;
  tables?: IFeatureTable[];
  handles: RcHandles;
  dropCap?: boolean;
}

const LIST_ITEM = /^(-{1,4}|[*•])\s+(.*)$/;

function renderDesc({ text, tables, handles, dropCap }: IDescProps): ReactNode {
  const parts = text.split(/\[\[tabela:(\d+)\]\]/g);
  const blocks: ReactNode[] = [];

  parts.forEach((part, i) => {
    if (i % 2 === 1) {
      const table = tables?.[Number(part)];
      if (!table) return;
      blocks.push(
        <div key={`tbl${i}`} className={handles.rcDescTable}>
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
                <tr key={j}>
                  {row.map((cell, c) => (
                    <td key={c}>{cell}</td>
                  ))}
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
          <ul key={key} className={handles.rcDescBullets}>
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
        listItems.push({
          depth: m[1].startsWith('-') ? m[1].length : 1,
          text: m[2].trim(),
        });
        return;
      }
      flushList();
      if (line.trim()) {
        out.push(
          <p key={`p${out.length}-${li}`} className={handles.rcDescText}>
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
        handles.rcProse,
        dropCap && applyModifiers(handles.rcProse, 'drop')
      )}
    >
      {blocks}
    </div>
  );
}

// ── Seal ──────────────────────────────────────────────────────────────────────

function Seal({ level, handles }: { level?: number; handles: RcHandles }) {
  if (level == null) {
    return (
      <div
        className={cx(handles.rcSeal, applyModifiers(handles.rcSeal, 'none'))}
        aria-label="habilidade base"
      >
        <b>—</b>
      </div>
    );
  }
  return (
    <div className={handles.rcSeal} aria-label={`${level}º nível`}>
      <b>{level}º</b>
      <small>nível</small>
    </div>
  );
}

// ── Bar: breadcrumb + search ──────────────────────────────────────────────────

interface IBarProps {
  codex: RelationCodexState;
  handles: RcHandles;
  crumbsRef: RefObject<HTMLElement | null>;
  searchRef: RefObject<HTMLDivElement | null>;
  inputRef: RefObject<HTMLInputElement | null>;
  groupA: IRelationGroup;
  groupB: IRelationGroup;
  catalogName: string;
}

function Bar({
  codex,
  handles,
  crumbsRef,
  searchRef,
  inputRef,
  groupA,
  groupB,
  catalogName,
}: IBarProps) {
  const uid = useId();
  const listId = `${uid}-results`;
  const optionId = (i: number) => `${uid}-r${i}`;
  const normQuery = rcNorm(codex.query.trim());

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
      e.stopPropagation();
      codex.clearSearch();
    }
  };

  const sortedEntities =
    codex.entitySide === 'groupA' ? codex.sortedA : codex.sortedB;
  const entityGroup = codex.entitySide === 'groupA' ? groupA : groupB;

  return (
    <div className={handles.rcBar}>
      <nav
        ref={crumbsRef}
        className={handles.rcCrumbs}
        aria-label="Onde você está"
      >
        <button
          type="button"
          className={handles.rcCrumb}
          aria-current={codex.view === 'tabua' ? 'page' : undefined}
          onClick={codex.goTabua}
        >
          Tábua
          <span className={handles.rcLong}> {catalogName.toLowerCase()}</span>
        </button>
        {codex.view === 'entity' && codex.entity && (
          <>
            <span className={handles.rcCrumbSep} aria-hidden="true">
              ›
            </span>
            <button
              type="button"
              className={cx(
                handles.rcCrumb,
                applyModifiers(handles.rcCrumb, 'menu')
              )}
              aria-current="page"
              aria-haspopup="true"
              aria-expanded={codex.menu}
              onClick={() => codex.setMenu(!codex.menu)}
            >
              {codex.entity.name}
              <ChevronRightIcon aria-hidden="true" />
            </button>
          </>
        )}
        {codex.menu && (
          <div className={handles.rcMenu} role="menu">
            {sortedEntities.map((e) => (
              <button
                key={e.slug}
                type="button"
                role="menuitem"
                className={handles.rcMenuItem}
                aria-current={e.slug === codex.entitySlug}
                onClick={() => codex.openEntity(e.slug, codex.entitySide)}
              >
                <b>{e.name}</b>
                <small>{e.subtitle ?? '—'}</small>
              </button>
            ))}
          </div>
        )}
      </nav>

      <div ref={searchRef} className={handles.rcSearch}>
        <label className={handles.rcSearchField}>
          <SearchIcon aria-hidden="true" />
          <span className={handles.rcSr}>
            Buscar em {groupA.label.toLowerCase()} e{' '}
            {groupB.label.toLowerCase()}
          </span>
          <input
            ref={inputRef}
            type="search"
            autoComplete="off"
            placeholder={`Buscar ${entityGroup.unitSingular}, habilidade…`}
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
          <kbd className={handles.rcSearchKbd} aria-hidden="true">
            /
          </kbd>
        </label>
        {codex.resultsOpen && (
          <div
            id={listId}
            className={handles.rcResults}
            role="listbox"
            aria-label="Resultados"
            onMouseDown={(e) => e.preventDefault()}
          >
            {codex.results.length === 0 && (
              <div className={handles.rcResEmpty}>
                Nada encontrado para &ldquo;{codex.query.trim()}&rdquo;.
              </div>
            )}
            {codex.results.map((r, i) => {
              const header =
                r.group !== codex.results[i - 1]?.group ? (
                  <div
                    key={`g-${r.group}`}
                    className={handles.rcResGroup}
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
                    className={handles.rcRes}
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

// ── Preview ─────────────────────────────────────────────────────────────────

function Preview({
  entity,
  codex,
  handles,
}: {
  entity: IRelationEntity;
  codex: RelationCodexState;
  handles: RcHandles;
}) {
  return (
    <aside className={handles.rcPreview} aria-live="polite">
      <div>
        <span className={handles.rcKicker}>Prévia</span>
        <h4>{entity.name}</h4>
        {entity.subtitle && (
          <p className={handles.rcPreviewSub}>{entity.subtitle}</p>
        )}
      </div>
      {entity.description && (
        <p className={handles.rcBlurb}>{entity.description}</p>
      )}
      {(entity.facts?.length ?? 0) > 0 && (
        <dl className={handles.rcMini}>
          {entity.facts!.map((f, i) => (
            <Fragment key={i}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </Fragment>
          ))}
        </dl>
      )}
      <button
        type="button"
        className={cx(handles.rcBtn, applyModifiers(handles.rcBtn, 'primary'))}
        onClick={() => codex.openEntity(entity.slug, 'groupA')}
      >
        Abrir {entity.name}
        <ChevronRightIcon aria-hidden="true" />
      </button>
    </aside>
  );
}

// ── Empty state ─────────────────────────────────────────────────────────────

function EmptyState({
  groupA,
  groupB,
  handles,
  catalogDescription,
  onAddA,
  onAddB,
}: {
  groupA: IRelationGroup;
  groupB: IRelationGroup;
  handles: RcHandles;
  catalogDescription?: string;
  onAddA: () => void;
  onAddB: () => void;
}) {
  return (
    <div className={handles.rcPad}>
      {catalogDescription && (
        <p className={handles.rcLede}>{catalogDescription}</p>
      )}
      <div className={handles.rcEmptyState}>
        <span className={handles.rcEmptyDiamond} aria-hidden="true">
          ◆
        </span>
        <h4 className={handles.rcH3}>Nenhuma entidade cadastrada ainda</h4>
        <p className={handles.rcLede}>
          Comece adicionando entidades dos dois lados da relação para montar a
          tábua.
        </p>
        <div className={handles.rcEmptyActions}>
          <button
            type="button"
            className={cx(
              handles.rcBtn,
              applyModifiers(handles.rcBtn, 'primary')
            )}
            onClick={onAddA}
          >
            <PlusIcon aria-hidden="true" />
            Nova {groupA.unitSingular}
          </button>
          <button type="button" className={handles.rcAddBtn} onClick={onAddB}>
            <PlusIcon aria-hidden="true" />
            Novo {groupB.unitSingular}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Tábua ─────────────────────────────────────────────────────────────────────

function TabuaView({
  codex,
  handles,
  groupA,
  groupB,
  canEdit,
  onAddA,
  onAddB,
}: {
  codex: RelationCodexState;
  handles: RcHandles;
  groupA: IRelationGroup;
  groupB: IRelationGroup;
  canEdit: boolean;
  onAddA: () => void;
  onAddB: () => void;
}) {
  const { pins, usedB, unusedB, sortedA, grantedBy } = codex;
  const hits = sortedA.filter(codex.matchesPins);
  const previewEntity =
    codex.entityABySlug.get(codex.preview ?? '') ?? sortedA[0];
  const countOf = (slug: string) => grantedBy.get(slug)?.length ?? 0;

  return (
    <div className={handles.rcPad}>
      <div className={handles.rcTabHead}>
        <div>
          <span className={handles.rcKicker}>
            {sortedA.length}{' '}
            {sortedA.length === 1 ? groupA.unitSingular : groupA.unitPlural}
            {' · '}
            {usedB.length}{' '}
            {usedB.length === 1 ? groupB.unitSingular : groupB.unitPlural}{' '}
            concedidos
          </span>
          <h3 className={handles.rcH3}>Tábua {groupA.label.toLowerCase()}</h3>
        </div>
        {canEdit && (
          <div className={handles.rcEditActions}>
            <button type="button" className={handles.rcAddBtn} onClick={onAddA}>
              <PlusIcon aria-hidden="true" />
              Nova {groupA.unitSingular}
            </button>
            <button type="button" className={handles.rcAddBtn} onClick={onAddB}>
              <PlusIcon aria-hidden="true" />
              Novo {groupB.unitSingular}
            </button>
          </div>
        )}
        <div className={handles.rcFilterLine} aria-live="polite">
          {pins.length > 0 ? (
            <>
              <span>
                <em>{pins.map(codex.entityBName).join(' + ')}</em>:{' '}
                {hits.length > 0 ? (
                  <>
                    <b>
                      {plural(
                        hits.length,
                        groupA.unitSingular,
                        groupA.unitPlural
                      )}
                    </b>{' '}
                    — {hits.map((e) => e.name).join(', ')}
                  </>
                ) : (
                  <b>nenhuma {groupA.unitSingular} permite essa combinação</b>
                )}
              </span>
              <button
                type="button"
                className={handles.rcBtnGhost}
                onClick={codex.clearPins}
              >
                Limpar
              </button>
            </>
          ) : (
            <span>
              Fixe até dois {groupB.unitPlural} nas colunas para filtrar quais{' '}
              {groupA.unitPlural} os permitem.
            </span>
          )}
        </div>
      </div>

      <div
        className={handles.rcPinRow}
        role="group"
        aria-label={`Fixar ${groupB.unitPlural}`}
      >
        {usedB.map((s) => (
          <button
            key={s}
            type="button"
            className={handles.rcChip}
            aria-pressed={pins.includes(s)}
            onClick={() => codex.togglePin(s)}
          >
            {codex.entityBName(s)} <small>{countOf(s)}</small>
          </button>
        ))}
      </div>

      <div className={handles.rcTabGrid}>
        <div className={handles.rcMatrixWrap}>
          <table
            className={handles.rcMatrix}
            onMouseLeave={() => codex.setHotCol(null)}
          >
            <caption className={handles.rcSr}>
              {groupA.label} nas linhas, {groupB.label} nas colunas. O losango
              marca uma relação.
            </caption>
            <thead>
              <tr>
                <th className={handles.rcCorner} scope="col">
                  {groupA.unitSingular}
                </th>
                {usedB.map((s) => (
                  <th
                    key={s}
                    scope="col"
                    className={cx(
                      handles.rcColHead,
                      pins.includes(s) &&
                        applyModifiers(handles.rcColHead, 'pin'),
                      codex.hotCol === s &&
                        applyModifiers(handles.rcColHead, 'hot')
                    )}
                    onMouseEnter={() => codex.setHotCol(s)}
                  >
                    <button
                      type="button"
                      className={handles.rcColBtn}
                      aria-pressed={pins.includes(s)}
                      title={`Fixar ${codex.entityBName(s)}`}
                      onClick={() => codex.togglePin(s)}
                    >
                      <span>{codex.entityBName(s)}</span>
                      <small>{countOf(s)}</small>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedA.map((e) => (
                <tr
                  key={e.slug}
                  className={cx(
                    handles.rcRow,
                    pins.length > 0 &&
                      !codex.matchesPins(e) &&
                      applyModifiers(handles.rcRow, 'out'),
                    previewEntity?.slug === e.slug &&
                      applyModifiers(handles.rcRow, 'hot')
                  )}
                  onMouseEnter={() => codex.setPreview(e.slug)}
                  onFocus={() => codex.setPreview(e.slug)}
                >
                  <th scope="row">
                    <button
                      type="button"
                      className={handles.rcRowBtn}
                      onClick={() => codex.openEntity(e.slug, 'groupA')}
                    >
                      <b>{e.name}</b>
                      <small>{e.subtitle ?? '—'}</small>
                    </button>
                  </th>
                  {usedB.map((s) => (
                    <td
                      key={s}
                      className={cx(
                        handles.rcCell,
                        pins.includes(s) &&
                          applyModifiers(handles.rcCell, 'pin'),
                        codex.hotCol === s &&
                          applyModifiers(handles.rcCell, 'hot')
                      )}
                      onMouseEnter={() => codex.setHotCol(s)}
                    >
                      {e.relatedSlugs.includes(s) && (
                        <span
                          className={handles.rcPip}
                          role="img"
                          aria-label={`${e.name} permite ${codex.entityBName(s)}`}
                        />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className={handles.rcCards}>
          {sortedA.map((e) => (
            <li
              key={e.slug}
              className={cx(
                handles.rcCard,
                pins.length > 0 &&
                  !codex.matchesPins(e) &&
                  applyModifiers(handles.rcCard, 'out')
              )}
            >
              <button
                type="button"
                onClick={() => codex.openEntity(e.slug, 'groupA')}
              >
                <b>{e.name}</b>
                <small>{e.subtitle ?? '—'}</small>
                <span className={handles.rcCardRels}>
                  {e.relatedSlugs.map((s) => (
                    <span
                      key={s}
                      className={
                        pins.includes(s)
                          ? applyModifiers(handles.rcCardRels, 'hit')
                          : undefined
                      }
                    >
                      <span className={handles.rcPip} />
                      {codex.entityBName(s)}
                    </span>
                  ))}
                </span>
              </button>
            </li>
          ))}
        </ul>

        {previewEntity && (
          <Preview entity={previewEntity} codex={codex} handles={handles} />
        )}
      </div>

      <div className={handles.rcRelIndex}>
        <section>
          <h4>
            Concedidos <small>{usedB.length}</small>
          </h4>
          <div className={handles.rcChips}>
            {usedB.map((s) => (
              <button
                key={s}
                type="button"
                className={handles.rcChip}
                onClick={() => codex.openPanel(s, 'groupB')}
              >
                {codex.entityBName(s)} <small>{countOf(s)}</small>
              </button>
            ))}
          </div>
        </section>
        {unusedB.length > 0 && (
          <section>
            <h4>
              Sem {groupA.unitSingular} catalogada{' '}
              <small>{unusedB.length}</small>
            </h4>
            <p>
              Estão no compêndio, mas nenhuma das {groupA.unitPlural} os lista.
            </p>
            <div className={handles.rcChips}>
              {unusedB.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={handles.rcChip}
                  onClick={() => codex.openPanel(s, 'groupB')}
                >
                  {codex.entityBName(s)}
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

// ── Entity view ──────────────────────────────────────────────────────────────

function AbilityBlock({
  entity,
  ability,
  index,
  handles,
}: {
  entity: IRelationEntity;
  ability: {
    name: string;
    level?: number;
    description: string;
    tables?: IFeatureTable[];
  };
  index: number;
  handles: RcHandles;
}) {
  return (
    <article className={handles.rcAbility} id={rcAbilityId(entity.slug, index)}>
      <div className={handles.rcAbilityHead}>
        <h5>{ability.name}</h5>
        {ability.level != null && (
          <span className={handles.rcLvlTag}>{ability.level}º nível</span>
        )}
      </div>
      <div className={handles.rcBody}>
        {renderDesc({
          text: ability.description,
          tables: ability.tables,
          handles,
        })}
      </div>
    </article>
  );
}

function EntityView({
  entity,
  entitySide,
  codex,
  handles,
  groupA,
  groupB,
  canEdit,
  onEditCatalog,
  onEditEntity,
}: {
  entity: IRelationEntity;
  entitySide: 'groupA' | 'groupB';
  codex: RelationCodexState;
  handles: RcHandles;
  groupA: IRelationGroup;
  groupB: IRelationGroup;
  canEdit: boolean;
  onEditCatalog?: () => void;
  onEditEntity: (group: 'groupA' | 'groupB', index: number) => void;
}) {
  const currentGroup = entitySide === 'groupA' ? groupA : groupB;
  const relatedGroup = entitySide === 'groupA' ? groupB : groupA;
  const relatedBySlug =
    entitySide === 'groupA' ? codex.entityBBySlug : codex.entityABySlug;

  const relatedEntities = entity.relatedSlugs
    .map((s) => relatedBySlug.get(s))
    .filter((d): d is IRelationEntity => Boolean(d));

  const abilities = entity.abilities ?? [];
  const levels = [...new Set(abilities.map((a) => a.level ?? 0))].sort(
    (a, b) => a - b
  );
  const lastLevel = levels.length ? levels[levels.length - 1] : 0;

  const entityIndex = (
    entitySide === 'groupA' ? groupA : groupB
  ).entities.findIndex((e) => e.slug === entity.slug);

  return (
    <div className={handles.rcPad}>
      <article className={handles.rcEntity}>
        <header className={handles.rcFront}>
          <span className={handles.rcKicker}>
            {currentGroup.unitSingular}
            {entity.subtitle ? ` · ${entity.subtitle}` : ''}
          </span>
          <h3 className={handles.rcH3} id={ENTITY_HEADING_ID} tabIndex={-1}>
            {entity.name}
          </h3>
          {canEdit && (
            <div className={handles.rcEditActions}>
              <button
                type="button"
                className={handles.rcEditBtn}
                aria-label={`Editar ${currentGroup.unitSingular}`}
                onClick={() => onEditEntity(entitySide, entityIndex)}
              >
                <PencilIcon aria-hidden="true" />
              </button>
              {onEditCatalog && (
                <button
                  type="button"
                  className={handles.rcEditBtn}
                  aria-label="Editar tabela"
                  onClick={onEditCatalog}
                >
                  <PencilIcon aria-hidden="true" />
                  Tabela
                </button>
              )}
            </div>
          )}
          <div className={handles.rcFiligree} aria-hidden="true">
            ◆
          </div>
          {entity.description &&
            renderDesc({ text: entity.description, handles, dropCap: true })}
        </header>

        {(entity.facts?.length ?? 0) > 0 && (
          <dl className={handles.rcFacts}>
            {entity.facts!.map((f, i) => (
              <div key={i} className={handles.rcFact}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {relatedEntities.length > 0 && (
          <aside className={handles.rcRels} aria-labelledby="rc-rels-h">
            <div className={handles.rcRelsHead}>
              <span className={handles.rcKicker}>
                {relatedGroup.label} permitidos
              </span>
              <h4 id="rc-rels-h">
                {plural(
                  relatedEntities.length,
                  relatedGroup.unitSingular,
                  relatedGroup.unitPlural
                )}
              </h4>
            </div>
            <ul className={handles.rcRelList}>
              {relatedEntities.map((rel) => {
                const relSide: 'groupA' | 'groupB' =
                  entitySide === 'groupA' ? 'groupB' : 'groupA';
                const others =
                  entitySide === 'groupA'
                    ? (codex.grantedBy.get(rel.slug) ?? []).filter(
                        (s) => s !== entity.slug
                      )
                    : [];
                return (
                  <li
                    key={rel.slug}
                    className={handles.rcRelItem}
                    onClick={() => codex.openPanel(rel.slug, relSide)}
                  >
                    <b>{rel.name}</b>
                    <button
                      type="button"
                      className={handles.rcRelOpen}
                      aria-label={`Abrir ${rel.name}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        codex.openPanel(rel.slug, relSide);
                      }}
                    >
                      <ExternalLinkIcon aria-hidden="true" />
                    </button>
                    {rel.description && <span>{rel.description}</span>}
                    {others.length > 0 && (
                      <em>
                        também em{' '}
                        <b>
                          {others
                            .map((s) => codex.entityABySlug.get(s)?.name ?? s)
                            .join(', ')}
                        </b>
                      </em>
                    )}
                  </li>
                );
              })}
            </ul>
          </aside>
        )}

        {abilities.length > 0 && (
          <section className={handles.rcAbilities} aria-labelledby="rc-ab-h">
            <div className={handles.rcAbilitiesHead}>
              <h4 id="rc-ab-h">Habilidades</h4>
              {lastLevel > 0 && (
                <span className={handles.rcLede}>
                  {plural(abilities.length, 'habilidade', 'habilidades')}, do 1º
                  ao {lastLevel}º nível
                </span>
              )}
            </div>

            {lastLevel > 0 && (
              <div
                className={handles.rcRuler}
                role="navigation"
                aria-label="Habilidades por nível"
              >
                {Array.from({ length: 20 }, (_, i) => i + 1).map((L) =>
                  levels.includes(L) ? (
                    <button
                      key={L}
                      type="button"
                      className={cx(
                        handles.rcTick,
                        applyModifiers(handles.rcTick, 'gift')
                      )}
                      aria-label={`Ir ao ${L}º nível`}
                      onClick={() => codex.requestFlash(rcLevelId(L))}
                    >
                      <span className={handles.rcPip} />
                      {L}
                    </button>
                  ) : (
                    <span key={L} className={handles.rcTick} aria-hidden="true">
                      {L}
                    </span>
                  )
                )}
              </div>
            )}

            {levels.map((L) => (
              <section key={L} className={handles.rcLvl} id={rcLevelId(L)}>
                {L > 0 && <Seal level={L} handles={handles} />}
                <div className={handles.rcLvlItems}>
                  {abilities.map((a, i) =>
                    (a.level ?? 0) === L ? (
                      <AbilityBlock
                        key={i}
                        entity={entity}
                        ability={a}
                        index={i}
                        handles={handles}
                      />
                    ) : null
                  )}
                </div>
              </section>
            ))}
          </section>
        )}

        {entity.list && entity.list.items.length > 0 && (
          <section>
            <h4>{entity.list.label}</h4>
            <ol className={handles.rcLadder}>
              {entity.list.items.map((item, i) => (
                <li key={i}>
                  <strong aria-label={`${item.rank}º`}>{item.rank}º</strong>
                  <span>{item.name}</span>
                </li>
              ))}
            </ol>
          </section>
        )}
      </article>
    </div>
  );
}

// ── Entity panel ─────────────────────────────────────────────────────────────

function EntityPanel({
  entity,
  side,
  codex,
  handles,
  groupA,
  groupB,
  canEdit,
  onEditEntity,
}: {
  entity: IRelationEntity;
  side: 'groupA' | 'groupB';
  codex: RelationCodexState;
  handles: RcHandles;
  groupA: IRelationGroup;
  groupB: IRelationGroup;
  canEdit: boolean;
  onEditEntity: (group: 'groupA' | 'groupB', index: number) => void;
}) {
  const currentGroup = side === 'groupA' ? groupA : groupB;

  const by = side === 'groupB' ? (codex.grantedBy.get(entity.slug) ?? []) : [];

  const entityIndex = (side === 'groupA' ? groupA : groupB).entities.findIndex(
    (e) => e.slug === entity.slug
  );

  return (
    <>
      <div className={handles.rcScrim} onClick={codex.closePanel} />
      <section
        className={handles.rcPanel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={PANEL_HEADING_ID}
      >
        <header className={handles.rcPanelHead}>
          <div>
            <span className={handles.rcKicker}>
              {currentGroup.unitSingular}
            </span>
            <h3 id={PANEL_HEADING_ID} tabIndex={-1}>
              {entity.name}
            </h3>
          </div>
          <div className={handles.rcEditActions}>
            {canEdit && entityIndex >= 0 && (
              <button
                type="button"
                className={handles.rcEditBtn}
                aria-label={`Editar ${currentGroup.unitSingular}`}
                onClick={() => onEditEntity(side, entityIndex)}
              >
                <PencilIcon aria-hidden="true" />
              </button>
            )}
            <button
              type="button"
              className={handles.rcClose}
              aria-label={`Fechar ${currentGroup.unitSingular}`}
              onClick={codex.closePanel}
            >
              <CloseIcon aria-hidden="true" />
            </button>
          </div>
          {entity.description &&
            renderDesc({ text: entity.description, handles })}
        </header>

        <div className={handles.rcPanelBody}>
          {(entity.facts?.length ?? 0) > 0 && (
            <section>
              <h4>Detalhes</h4>
              <dl className={handles.rcFacts}>
                {entity.facts!.map((f, i) => (
                  <div key={i} className={handles.rcFact}>
                    <dt>{f.label}</dt>
                    <dd>{f.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {(entity.abilities?.length ?? 0) > 0 && (
            <section>
              <h4>Habilidades</h4>
              {entity.abilities!.map((a, i) => (
                <article
                  key={i}
                  className={handles.rcAbility}
                  id={rcAbilityId(entity.slug, i)}
                >
                  <div className={handles.rcAbilityHead}>
                    <h5>{a.name}</h5>
                    {a.level != null && (
                      <span className={handles.rcLvlTag}>{a.level}º nível</span>
                    )}
                  </div>
                  {renderDesc({
                    text: a.description,
                    tables: a.tables,
                    handles,
                  })}
                </article>
              ))}
            </section>
          )}

          {entity.list && entity.list.items.length > 0 && (
            <section>
              <h4>{entity.list.label}</h4>
              <ol className={handles.rcLadder}>
                {entity.list.items.map((item, i) => (
                  <li key={i}>
                    <strong aria-label={`${item.rank}º`}>{item.rank}º</strong>
                    <span>{item.name}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {by.length > 0 && (
            <section>
              <h4>Concedido por</h4>
              <div className={handles.rcGrantedBy}>
                {by.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={handles.rcChip}
                    onClick={() => codex.openEntity(s, 'groupA')}
                  >
                    {codex.entityAName(s)}
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      </section>
    </>
  );
}

// ── Entity editor ────────────────────────────────────────────────────────────

function EntityEditor({
  entity,
  group,
  index,
  groupA,
  groupB,
  handles,
  onSave,
  onRemove,
  onClose,
}: {
  entity: IRelationEntity | null;
  group: 'groupA' | 'groupB';
  index: number;
  groupA: IRelationGroup;
  groupB: IRelationGroup;
  handles: RcHandles;
  onSave: (
    group: 'groupA' | 'groupB',
    entityIndex: number,
    entity: IRelationEntity
  ) => Promise<boolean | undefined> | boolean | undefined;
  onRemove: (
    group: 'groupA' | 'groupB',
    entityIndex: number
  ) => Promise<boolean | undefined> | boolean | undefined;
  onClose: () => void;
}) {
  const isNew = index < 0;
  const currentGroup = group === 'groupA' ? groupA : groupB;
  const otherGroup = group === 'groupA' ? groupB : groupA;

  const [name, setName] = useState(entity?.name ?? '');
  const [subtitle, setSubtitle] = useState(entity?.subtitle ?? '');
  const [description, setDescription] = useState(entity?.description ?? '');
  const [facts, setFacts] = useState<IRelationFact[]>(
    () => entity?.facts ?? []
  );
  const [abilities, setAbilities] = useState<IRelationAbility[]>(
    () => entity?.abilities ?? []
  );
  const [relatedSlugs, setRelatedSlugs] = useState<string[]>(
    () => entity?.relatedSlugs ?? []
  );
  const [listLabel, setListLabel] = useState(entity?.list?.label ?? '');
  const [listItems, setListItems] = useState<IRelationListItem[]>(
    () => entity?.list?.items ?? []
  );

  const handleSave = async () => {
    if (!name.trim()) return;
    const built: IRelationEntity = {
      name: name.trim(),
      slug: entity?.slug ?? classSlug(name.trim()),
      subtitle: subtitle.trim() || undefined,
      image: entity?.image,
      description: description.trim() || undefined,
      facts: facts.filter((f) => f.label.trim() && f.value.trim()),
      abilities: abilities.filter((a) => a.name.trim() && a.description.trim()),
      list:
        listItems.length > 0
          ? {
              label: listLabel.trim() || 'Lista',
              items: listItems.filter((it) => it.name.trim()),
            }
          : undefined,
      relatedSlugs,
    };
    const ok = await onSave(group, index, built);
    if (ok !== false) onClose();
  };

  const handleRemove = async () => {
    if (isNew) return;
    const ok = await onRemove(group, index);
    if (ok !== false) onClose();
  };

  const addFact = () => setFacts([...facts, { label: '', value: '' }]);
  const removeFact = (i: number) => setFacts(facts.filter((_, j) => j !== i));
  const updateFact = (i: number, patch: Partial<IRelationFact>) =>
    setFacts(facts.map((f, j) => (j === i ? { ...f, ...patch } : f)));

  const addAbility = () =>
    setAbilities([...abilities, { name: '', description: '' }]);
  const removeAbility = (i: number) =>
    setAbilities(abilities.filter((_, j) => j !== i));
  const updateAbility = (i: number, patch: Partial<IRelationAbility>) =>
    setAbilities(abilities.map((a, j) => (j === i ? { ...a, ...patch } : a)));

  const addListItem = () =>
    setListItems([
      ...listItems,
      {
        rank:
          (listItems.length > 0 ? listItems[listItems.length - 1].rank : 0) + 1,
        name: '',
      },
    ]);
  const removeListItem = (i: number) =>
    setListItems(listItems.filter((_, j) => j !== i));
  const updateListItem = (i: number, patch: Partial<IRelationListItem>) =>
    setListItems(
      listItems.map((it, j) => (j === i ? { ...it, ...patch } : it))
    );

  const toggleRelated = (slug: string) =>
    setRelatedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={
        isNew
          ? `Nova ${currentGroup.unitSingular}`
          : `Editar ${currentGroup.unitSingular}`
      }
    >
      <div className={handles.rcEditorBody}>
        <label>
          <span className={handles.rcFieldLabel}>
            Nome <span className={handles.rcFieldReq}>*</span>
          </span>
          <input
            type="text"
            className={handles.rcFieldInput}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={`ex.: ${group === 'groupA' ? 'Protetor' : 'Destruição'}`}
          />
        </label>

        {group === 'groupA' && (
          <label>
            <span className={handles.rcFieldLabel}>Subtítulo</span>
            <input
              type="text"
              className={handles.rcFieldInput}
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="ex.: Devotos de Alexander"
            />
          </label>
        )}

        <label>
          <span className={handles.rcFieldLabel}>Descrição</span>
          <textarea
            className={handles.rcFieldInput}
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={`O que esta ${currentGroup.unitSingular} é.`}
          />
        </label>

        <hr className={handles.rcSep} />

        {/* Facts (group A only) */}
        {group === 'groupA' && (
          <details className={handles.rcDisclosure} open={facts.length > 0}>
            <summary className={handles.rcDisclosureTrigger}>
              <span className={handles.rcDisclosureArrow} aria-hidden="true">
                ▶
              </span>
              Fatos resumidos
              <span className={handles.rcDisclosureCount}>
                {facts.length} {facts.length === 1 ? 'item' : 'itens'}
              </span>
            </summary>
            <div className={handles.rcDisclosureBody}>
              {facts.map((f, i) => (
                <div key={i} className={handles.rcDynItem}>
                  <div className={handles.rcDynFields}>
                    <div className={handles.rcDynRowWide}>
                      <input
                        type="text"
                        className={handles.rcFieldInput}
                        value={f.label}
                        onChange={(e) =>
                          updateFact(i, { label: e.target.value })
                        }
                        placeholder="Label"
                      />
                      <input
                        type="text"
                        className={handles.rcFieldInput}
                        value={f.value}
                        onChange={(e) =>
                          updateFact(i, { value: e.target.value })
                        }
                        placeholder="Valor"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    className={handles.rcDynRemove}
                    aria-label="Remover"
                    onClick={() => removeFact(i)}
                  >
                    <CloseIcon aria-hidden="true" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className={handles.rcAddItem}
                onClick={addFact}
              >
                + Fato
              </button>
            </div>
          </details>
        )}

        {/* Abilities (both groups) */}
        <details className={handles.rcDisclosure} open={abilities.length > 0}>
          <summary className={handles.rcDisclosureTrigger}>
            <span className={handles.rcDisclosureArrow} aria-hidden="true">
              ▶
            </span>
            {group === 'groupA' ? 'Habilidades' : 'Poderes'}
            <span className={handles.rcDisclosureCount}>
              {abilities.length} {abilities.length === 1 ? 'item' : 'itens'}
            </span>
          </summary>
          <div className={handles.rcDisclosureBody}>
            {abilities.map((a, i) => (
              <div key={i} className={handles.rcDynItem}>
                <div className={handles.rcDynFields}>
                  <div className={handles.rcDynRow}>
                    <input
                      type="number"
                      className={cx(
                        handles.rcFieldInput,
                        applyModifiers(handles.rcFieldInput, 'num')
                      )}
                      value={a.level ?? ''}
                      onChange={(e) =>
                        updateAbility(i, {
                          level: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        })
                      }
                      placeholder="Nv."
                    />
                    <input
                      type="text"
                      className={handles.rcFieldInput}
                      value={a.name}
                      onChange={(e) =>
                        updateAbility(i, { name: e.target.value })
                      }
                      placeholder={`Nome ${group === 'groupA' ? 'da habilidade' : 'do poder'}`}
                    />
                  </div>
                  <textarea
                    className={handles.rcFieldInput}
                    rows={2}
                    value={a.description}
                    onChange={(e) =>
                      updateAbility(i, { description: e.target.value })
                    }
                    placeholder={`Descrição ${group === 'groupA' ? 'da habilidade' : 'do poder'}...`}
                  />
                </div>
                <button
                  type="button"
                  className={handles.rcDynRemove}
                  aria-label="Remover"
                  onClick={() => removeAbility(i)}
                >
                  <CloseIcon aria-hidden="true" />
                </button>
              </div>
            ))}
            <button
              type="button"
              className={handles.rcAddItem}
              onClick={addAbility}
            >
              + {group === 'groupA' ? 'Habilidade' : 'Poder'}
            </button>
          </div>
        </details>

        {/* Relations (group A: checkbox grid of group B) */}
        {group === 'groupA' && otherGroup.entities.length > 0 && (
          <details
            className={handles.rcDisclosure}
            open={relatedSlugs.length > 0}
          >
            <summary className={handles.rcDisclosureTrigger}>
              <span className={handles.rcDisclosureArrow} aria-hidden="true">
                ▶
              </span>
              {otherGroup.label} permitidos
              <span className={handles.rcDisclosureCount}>
                {relatedSlugs.length} selecionados
              </span>
            </summary>
            <div className={handles.rcDisclosureBody}>
              <div className={handles.rcCheckGrid}>
                {[...otherGroup.entities]
                  .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
                  .map((e) => {
                    const checked = relatedSlugs.includes(e.slug);
                    return (
                      <label
                        key={e.slug}
                        className={cx(
                          handles.rcCheckItem,
                          checked &&
                            applyModifiers(handles.rcCheckItem, 'checked')
                        )}
                      >
                        <span
                          className={cx(
                            handles.rcCheckBox,
                            checked &&
                              applyModifiers(handles.rcCheckBox, 'checked')
                          )}
                          aria-hidden="true"
                        >
                          {checked ? '✓' : ''}
                        </span>
                        <input
                          type="checkbox"
                          className={handles.rcSr}
                          checked={checked}
                          onChange={() => toggleRelated(e.slug)}
                        />
                        {e.name}
                      </label>
                    );
                  })}
              </div>
            </div>
          </details>
        )}

        {/* Linked list (group B only) */}
        {group === 'groupB' && (
          <details className={handles.rcDisclosure} open={listItems.length > 0}>
            <summary className={handles.rcDisclosureTrigger}>
              <span className={handles.rcDisclosureArrow} aria-hidden="true">
                ▶
              </span>
              Lista vinculada
              <span className={handles.rcDisclosureCount}>
                {listItems.length} {listItems.length === 1 ? 'item' : 'itens'}
              </span>
            </summary>
            <div className={handles.rcDisclosureBody}>
              <label>
                <span className={handles.rcFieldLabel}>Label da lista</span>
                <input
                  type="text"
                  className={handles.rcFieldInput}
                  value={listLabel}
                  onChange={(e) => setListLabel(e.target.value)}
                  placeholder="ex.: Magias do Domínio"
                />
              </label>
              {listItems.map((it, i) => (
                <div key={i} className={handles.rcDynItem}>
                  <div className={handles.rcDynFields}>
                    <div className={handles.rcDynRow}>
                      <input
                        type="number"
                        className={cx(
                          handles.rcFieldInput,
                          applyModifiers(handles.rcFieldInput, 'num')
                        )}
                        value={it.rank}
                        onChange={(e) =>
                          updateListItem(i, {
                            rank: Number(e.target.value) || 0,
                          })
                        }
                        placeholder="Nv."
                      />
                      <input
                        type="text"
                        className={handles.rcFieldInput}
                        value={it.name}
                        onChange={(e) =>
                          updateListItem(i, { name: e.target.value })
                        }
                        placeholder="Nome do item"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    className={handles.rcDynRemove}
                    aria-label="Remover"
                    onClick={() => removeListItem(i)}
                  >
                    <CloseIcon aria-hidden="true" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className={handles.rcAddItem}
                onClick={addListItem}
              >
                + Item
              </button>
            </div>
          </details>
        )}
      </div>

      <div className={handles.rcEditorFoot}>
        {!isNew && (
          <button
            type="button"
            className={handles.rcDeleteBtn}
            onClick={handleRemove}
          >
            <TrashIcon aria-hidden="true" />
            Remover
          </button>
        )}
        <div className={handles.rcEditActions}>
          <button type="button" className={handles.rcAddBtn} onClick={onClose}>
            Cancelar
          </button>
          <button
            type="button"
            className={cx(
              handles.rcBtn,
              applyModifiers(handles.rcBtn, 'primary')
            )}
            disabled={!name.trim()}
            onClick={handleSave}
          >
            Salvar
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ── Root component ────────────────────────────────────────────────────────────

const RelationCodex = ({
  isOpen,
  onClose,
  className,
  catalogName,
  catalogDescription,
  groupA,
  groupB,
  canEdit,
  onSaveEntity,
  onRemoveEntity,
  onEditCatalog,
}: IProps) => {
  const handles = useCssHandles(RelationCodexHandles);
  const codex = useRelationCodex(groupA, groupB);
  const viewRef = useRef<HTMLDivElement>(null);
  const crumbsRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { menu, panel, flash, view, entitySlug, resultsOpen, editing } = codex;
  const { setMenu, closePanel, closeResults } = codex;

  const handleClose = useCallback(() => {
    if (panel) closePanel();
    else if (menu) setMenu(false);
    else onClose();
  }, [panel, menu, closePanel, setMenu, onClose]);

  useEffect(() => {
    viewRef.current?.scrollTo({ top: 0 });
  }, [view, entitySlug]);

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
      el.classList.remove(handles.rcFlash);
      void el.offsetWidth;
      el.classList.add(handles.rcFlash);
    });
    return () => cancelAnimationFrame(raf);
  }, [flash, handles.rcFlash]);

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

  const isEmpty = groupA.entities.length === 0 && groupB.entities.length === 0;

  const editingEntity = editing
    ? editing.index >= 0
      ? ((editing.group === 'groupA' ? groupA : groupB).entities[
          editing.index
        ] ?? null)
      : null
    : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      eyebrow={className}
      title={catalogName}
      variant="sheet"
      className={handles.rcShell}
      headerExtra={
        <Bar
          codex={codex}
          handles={handles}
          crumbsRef={crumbsRef}
          searchRef={searchRef}
          inputRef={inputRef}
          groupA={groupA}
          groupB={groupB}
          catalogName={catalogName}
        />
      }
    >
      <div className={handles.rcStage}>
        <div ref={viewRef} className={handles.rcView} tabIndex={-1}>
          {canEdit && isEmpty ? (
            <EmptyState
              groupA={groupA}
              groupB={groupB}
              handles={handles}
              catalogDescription={catalogDescription}
              onAddA={() => codex.openEditor('groupA', -1)}
              onAddB={() => codex.openEditor('groupB', -1)}
            />
          ) : view === 'entity' && codex.entity ? (
            <EntityView
              entity={codex.entity}
              entitySide={codex.entitySide}
              codex={codex}
              handles={handles}
              groupA={groupA}
              groupB={groupB}
              canEdit={canEdit}
              onEditCatalog={onEditCatalog}
              onEditEntity={codex.openEditor}
            />
          ) : (
            <TabuaView
              codex={codex}
              handles={handles}
              groupA={groupA}
              groupB={groupB}
              canEdit={canEdit}
              onAddA={() => codex.openEditor('groupA', -1)}
              onAddB={() => codex.openEditor('groupB', -1)}
            />
          )}
        </div>
        {codex.panelEntity && (
          <EntityPanel
            entity={codex.panelEntity}
            side={codex.panelSide}
            codex={codex}
            handles={handles}
            groupA={groupA}
            groupB={groupB}
            canEdit={canEdit}
            onEditEntity={codex.openEditor}
          />
        )}
      </div>

      {editing && (
        <EntityEditor
          entity={editingEntity}
          group={editing.group}
          index={editing.index}
          groupA={groupA}
          groupB={groupB}
          handles={handles}
          onSave={onSaveEntity}
          onRemove={onRemoveEntity}
          onClose={codex.closeEditor}
        />
      )}
    </Modal>
  );
};

export default RelationCodex;
