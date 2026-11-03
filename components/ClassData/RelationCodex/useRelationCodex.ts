'use client';

import { useCallback, useMemo, useState } from 'react';
import type { IRelationEntity, IRelationGroup } from '@/db/classes/class.d';

export type RcView = 'tabua' | 'entity';

export type RcGroup = string;

export interface IRcResult {
  group: RcGroup;
  label: string;
  context: string;
  tag?: string;
  target:
    | { kind: 'entityA'; slug: string }
    | { kind: 'entityB'; slug: string }
    | { kind: 'abilityA'; slug: string; index: number }
    | { kind: 'abilityB'; slug: string; index: number };
  nl: string;
  nt: string;
}

const MAX_PINS = 2;
const MAX_RESULTS = 40;
const MIN_QUERY = 2;

export const rcNorm = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export const rcAbilityId = (slug: string, index: number) =>
  `rc-ab-${slug}-${index}`;
export const rcLevelId = (level: number) => `rc-lv-${level}`;

export function useRelationCodex(
  groupA: IRelationGroup,
  groupB: IRelationGroup
) {
  const [view, setView] = useState<RcView>('tabua');
  const [entitySlug, setEntitySlug] = useState<string | null>(null);
  const [entitySide, setEntitySide] = useState<'groupA' | 'groupB'>('groupA');
  const [panel, setPanel] = useState<string | null>(null);
  const [panelSide, setPanelSide] = useState<'groupA' | 'groupB'>('groupB');
  const [pins, setPins] = useState<string[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [hotCol, setHotCol] = useState<string | null>(null);
  const [menu, setMenu] = useState(false);
  const [query, setQueryState] = useState('');
  const [resultsOpen, setResultsOpen] = useState(false);
  const [selected, setSelected] = useState(0);
  const [flash, setFlash] = useState<{ id: string; nonce: number } | null>(
    null
  );
  const [editing, setEditing] = useState<{
    group: 'groupA' | 'groupB';
    index: number;
  } | null>(null);

  const entityABySlug = useMemo(
    () => new Map(groupA.entities.map((e) => [e.slug, e])),
    [groupA.entities]
  );
  const entityBBySlug = useMemo(
    () => new Map(groupB.entities.map((e) => [e.slug, e])),
    [groupB.entities]
  );

  const sortedA = useMemo(
    () =>
      [...groupA.entities].sort((a, b) =>
        a.name.localeCompare(b.name, 'pt-BR')
      ),
    [groupA.entities]
  );
  const sortedB = useMemo(
    () =>
      [...groupB.entities].sort((a, b) =>
        a.name.localeCompare(b.name, 'pt-BR')
      ),
    [groupB.entities]
  );

  const grantedBy = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const entity of groupA.entities) {
      for (const slug of entity.relatedSlugs) {
        if (!entityBBySlug.has(slug)) continue;
        const list = map.get(slug) ?? [];
        list.push(entity.slug);
        map.set(slug, list);
      }
    }
    return map;
  }, [groupA.entities, entityBBySlug]);

  const usedB = useMemo(
    () =>
      [...grantedBy.keys()].sort(
        (a, b) =>
          (grantedBy.get(b)?.length ?? 0) - (grantedBy.get(a)?.length ?? 0) ||
          (entityBBySlug.get(a)?.name ?? a).localeCompare(
            entityBBySlug.get(b)?.name ?? b,
            'pt-BR'
          )
      ),
    [grantedBy, entityBBySlug]
  );

  const unusedB = useMemo(
    () =>
      groupB.entities
        .filter((e) => !grantedBy.has(e.slug))
        .map((e) => e.slug)
        .sort((a, b) =>
          (entityBBySlug.get(a)?.name ?? a).localeCompare(
            entityBBySlug.get(b)?.name ?? b,
            'pt-BR'
          )
        ),
    [groupB.entities, grantedBy, entityBBySlug]
  );

  const entityBName = useCallback(
    (slug: string) => entityBBySlug.get(slug)?.name ?? slug,
    [entityBBySlug]
  );
  const entityAName = useCallback(
    (slug: string) => entityABySlug.get(slug)?.name ?? slug,
    [entityABySlug]
  );

  const matchesPins = useCallback(
    (entity: IRelationEntity) =>
      pins.every((p) => entity.relatedSlugs.includes(p)),
    [pins]
  );

  const index = useMemo<IRcResult[]>(() => {
    const out: IRcResult[] = [];
    const add = (r: Omit<IRcResult, 'nl' | 'nt'>, text: string) =>
      out.push({ ...r, nl: rcNorm(r.label), nt: rcNorm(text) });

    for (const e of groupA.entities) {
      add(
        {
          group: groupA.label,
          label: e.name,
          context: e.subtitle ?? '',
          target: { kind: 'entityA', slug: e.slug },
        },
        `${e.name} ${e.subtitle ?? ''} ${e.description ?? ''}`
      );
      (e.abilities ?? []).forEach((a, i) =>
        add(
          {
            group: `Habilidades (${groupA.unitSingular})`,
            label: a.name,
            context: `${e.name}${a.level ? ` · ${a.level}º nível` : ''}`,
            tag: a.level ? `${a.level}º` : undefined,
            target: { kind: 'abilityA', slug: e.slug, index: i },
          },
          a.name
        )
      );
    }
    for (const e of groupB.entities) {
      const by = grantedBy.get(e.slug);
      add(
        {
          group: groupB.label,
          label: e.name,
          context: by
            ? by.map((s) => entityABySlug.get(s)?.name ?? s).join(', ')
            : `Sem ${groupA.unitSingular} catalogada`,
          target: { kind: 'entityB', slug: e.slug },
        },
        `${e.name} ${e.description ?? ''}`
      );
      (e.abilities ?? []).forEach((a, i) =>
        add(
          {
            group: `Habilidades (${groupB.unitSingular})`,
            label: a.name,
            context: `${e.name}${a.level ? ` · ${a.level}º nível` : ''}`,
            tag: a.level ? `${a.level}º` : undefined,
            target: { kind: 'abilityB', slug: e.slug, index: i },
          },
          a.name
        )
      );
    }
    return out;
  }, [groupA, groupB, grantedBy, entityABySlug]);

  const normQuery = rcNorm(query.trim());

  const results = useMemo(() => {
    if (normQuery.length < MIN_QUERY) return [];
    return index
      .map((x) => ({
        x,
        s: x.nl.startsWith(normQuery)
          ? 0
          : x.nl.includes(normQuery)
            ? 1
            : x.nt.includes(normQuery)
              ? 2
              : 9,
      }))
      .filter((r) => r.s < 9)
      .sort((a, b) => a.s - b.s)
      .slice(0, MAX_RESULTS)
      .map((r) => r.x);
  }, [index, normQuery]);

  const requestFlash = useCallback((id: string) => {
    setFlash((f) => ({ id, nonce: (f?.nonce ?? 0) + 1 }));
  }, []);

  const goTabua = useCallback(() => {
    setView('tabua');
    setMenu(false);
    setPanel(null);
  }, []);

  const openEntity = useCallback((slug: string, side: 'groupA' | 'groupB') => {
    setEntitySlug(slug);
    setEntitySide(side);
    setView('entity');
    setMenu(false);
    setPanel(null);
  }, []);

  const openPanel = useCallback(
    (slug: string, side: 'groupA' | 'groupB' = 'groupB') => {
      setPanel(slug);
      setPanelSide(side);
    },
    []
  );
  const closePanel = useCallback(() => setPanel(null), []);

  const togglePin = useCallback((slug: string) => {
    setPins((p) =>
      p.includes(slug)
        ? p.filter((x) => x !== slug)
        : [...p.slice(-(MAX_PINS - 1)), slug]
    );
  }, []);
  const clearPins = useCallback(() => setPins([]), []);

  const setQuery = useCallback((value: string) => {
    setQueryState(value);
    setSelected(0);
    setResultsOpen(value.trim().length >= MIN_QUERY);
  }, []);
  const closeResults = useCallback(() => setResultsOpen(false), []);
  const openResults = useCallback(() => {
    if (query.trim().length >= MIN_QUERY) setResultsOpen(true);
  }, [query]);
  const clearSearch = useCallback(() => {
    setQueryState('');
    setResultsOpen(false);
  }, []);

  const moveSelection = useCallback(
    (dir: 1 | -1) => {
      if (!results.length) return;
      setSelected((s) => (s + dir + results.length) % results.length);
    },
    [results.length]
  );

  const pick = useCallback(
    (result: IRcResult | undefined) => {
      if (!result) return;
      setResultsOpen(false);
      const t = result.target;
      if (t.kind === 'entityA') {
        openEntity(t.slug, 'groupA');
      } else if (t.kind === 'entityB') {
        openPanel(t.slug, 'groupB');
      } else if (t.kind === 'abilityA') {
        openEntity(t.slug, 'groupA');
        requestFlash(rcAbilityId(t.slug, t.index));
      } else if (t.kind === 'abilityB') {
        openPanel(t.slug, 'groupB');
        requestFlash(rcAbilityId(t.slug, t.index));
      }
    },
    [openEntity, openPanel, requestFlash]
  );

  const openEditor = useCallback(
    (group: 'groupA' | 'groupB', index: number) => {
      setEditing({ group, index });
    },
    []
  );
  const closeEditor = useCallback(() => setEditing(null), []);

  const currentEntity = useMemo(() => {
    if (!entitySlug) return null;
    const map = entitySide === 'groupA' ? entityABySlug : entityBBySlug;
    return map.get(entitySlug) ?? null;
  }, [entitySlug, entitySide, entityABySlug, entityBBySlug]);

  const panelEntity = useMemo(() => {
    if (!panel) return null;
    const map = panelSide === 'groupA' ? entityABySlug : entityBBySlug;
    return map.get(panel) ?? null;
  }, [panel, panelSide, entityABySlug, entityBBySlug]);

  return {
    view,
    entitySlug,
    entitySide,
    entity: currentEntity,
    panel,
    panelSide,
    panelEntity,
    pins,
    preview,
    hotCol,
    menu,
    query,
    results,
    resultsOpen,
    selected,
    flash,
    editing,
    entityABySlug,
    entityBBySlug,
    sortedA,
    sortedB,
    grantedBy,
    usedB,
    unusedB,
    entityAName,
    entityBName,
    matchesPins,
    setPreview,
    setHotCol,
    setMenu,
    setSelected,
    setQuery,
    openResults,
    closeResults,
    clearSearch,
    moveSelection,
    pick,
    goTabua,
    openEntity,
    openPanel,
    closePanel,
    togglePin,
    clearPins,
    requestFlash,
    openEditor,
    closeEditor,
  };
}

export type RelationCodexState = ReturnType<typeof useRelationCodex>;
