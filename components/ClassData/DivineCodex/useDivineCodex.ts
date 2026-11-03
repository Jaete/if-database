'use client';

import { useCallback, useMemo, useState } from 'react';
import type { IClassDomain, IDivineOrder } from '@/db/classes/class.d';

export type DvView = 'tabua' | 'ordem';

export type DvGroup =
  | 'Ordens'
  | 'Domínios'
  | 'Dádivas de ordem'
  | 'Poderes de domínio'
  | 'Magias de domínio';

type DvTarget =
  | { kind: 'order'; slug: string }
  | { kind: 'ability'; slug: string; index: number }
  | { kind: 'domain'; slug: string }
  | { kind: 'power'; slug: string; index: number }
  | { kind: 'spell'; slug: string; circle: number };

export interface IDvResult {
  group: DvGroup;
  label: string;
  context: string;
  tag?: string;
  target: DvTarget;
  /** Normalized label / full text, for matching. */
  nl: string;
  nt: string;
}

const GROUP_ORDER: DvGroup[] = [
  'Ordens',
  'Domínios',
  'Dádivas de ordem',
  'Poderes de domínio',
  'Magias de domínio',
];

const MAX_PINS = 2;
const MAX_RESULTS = 40;
const MIN_QUERY = 2;

export const dvNorm = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export const dvAbilityId = (slug: string, index: number) =>
  `dv-ab-${slug}-${index}`;
export const dvLevelId = (level: number) => `dv-lv-${level}`;
export const dvPowerId = (slug: string, index: number) =>
  `dv-pw-${slug}-${index}`;
export const dvSpellId = (slug: string, circle: number) =>
  `dv-sp-${slug}-${circle}`;

/** Short spell-list name, read from "conjura magias de/do/da <lista>". */
export function castListOf(order: IDivineOrder): string {
  const m = order.spellcasting.match(
    /conjura(?:m)?\s+magias\s+(?:de |do |da |dos |das )?([^,.\n]+)/i
  );
  return m ? m[1].trim() : '';
}

export function useDivineCodex(
  orders: IDivineOrder[],
  domains: IClassDomain[]
) {
  const [view, setView] = useState<DvView>('tabua');
  const [orderSlug, setOrderSlug] = useState<string | null>(null);
  const [panel, setPanel] = useState<string | null>(null);
  const [pins, setPins] = useState<string[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [hotCol, setHotCol] = useState<string | null>(null);
  const [menu, setMenu] = useState(false);
  const [attuned, setAttuned] = useState<string | null>(null);
  const [query, setQueryState] = useState('');
  const [resultsOpen, setResultsOpen] = useState(false);
  const [selected, setSelected] = useState(0);
  const [flash, setFlash] = useState<{ id: string; nonce: number } | null>(
    null
  );

  const orderBySlug = useMemo(
    () => new Map(orders.map((o) => [o.slug, o])),
    [orders]
  );
  const domainBySlug = useMemo(
    () => new Map(domains.map((d) => [d.slug, d])),
    [domains]
  );

  const sortedOrders = useMemo(
    () => [...orders].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')),
    [orders]
  );

  const grantedBy = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const o of orders) {
      for (const slug of o.domainSlugs) {
        if (!domainBySlug.has(slug)) continue;
        const list = map.get(slug) ?? [];
        list.push(o.slug);
        map.set(slug, list);
      }
    }
    return map;
  }, [orders, domainBySlug]);

  const domainName = useCallback(
    (slug: string) => domainBySlug.get(slug)?.name ?? slug,
    [domainBySlug]
  );

  // Domains that some order grants, most frequent first.
  const usedDomains = useMemo(
    () =>
      [...grantedBy.keys()].sort(
        (a, b) =>
          (grantedBy.get(b)?.length ?? 0) - (grantedBy.get(a)?.length ?? 0) ||
          domainName(a).localeCompare(domainName(b), 'pt-BR')
      ),
    [grantedBy, domainName]
  );

  const unusedDomains = useMemo(
    () =>
      domains
        .filter((d) => !grantedBy.has(d.slug))
        .map((d) => d.slug)
        .sort((a, b) => domainName(a).localeCompare(domainName(b), 'pt-BR')),
    [domains, grantedBy, domainName]
  );

  const matchesPins = useCallback(
    (o: IDivineOrder) => pins.every((p) => o.domainSlugs.includes(p)),
    [pins]
  );

  const index = useMemo<IDvResult[]>(() => {
    const out: IDvResult[] = [];
    const add = (r: Omit<IDvResult, 'nl' | 'nt'>, text: string) =>
      out.push({ ...r, nl: dvNorm(r.label), nt: dvNorm(text) });

    for (const o of orders) {
      add(
        {
          group: 'Ordens',
          label: o.name,
          context: [o.deity, castListOf(o)].filter(Boolean).join(' · '),
          target: { kind: 'order', slug: o.slug },
        },
        `${o.name} ${o.deity ?? ''}`
      );
      o.abilities.forEach((a, i) =>
        add(
          {
            group: 'Dádivas de ordem',
            label: a.name,
            context: `${o.name} · ${a.level}º nível`,
            tag: `${a.level}º`,
            target: { kind: 'ability', slug: o.slug, index: i },
          },
          a.name
        )
      );
    }
    for (const d of domains) {
      const by = grantedBy.get(d.slug);
      add(
        {
          group: 'Domínios',
          label: d.name,
          context: by
            ? by.map((s) => orderBySlug.get(s)?.name ?? s).join(', ')
            : 'Sem ordem catalogada',
          target: { kind: 'domain', slug: d.slug },
        },
        `${d.name} ${d.description}`
      );
      d.powers.forEach((p, i) =>
        add(
          {
            group: 'Poderes de domínio',
            label: p.name,
            context: `${d.name} · ${p.level ?? 1}º nível`,
            tag: `${p.level ?? 1}º`,
            target: { kind: 'power', slug: d.slug, index: i },
          },
          p.name
        )
      );
      d.spells.forEach((s) =>
        add(
          {
            group: 'Magias de domínio',
            label: s.name,
            context: `${d.name} · ${s.circle}º círculo`,
            tag: `${s.circle}º circ.`,
            target: { kind: 'spell', slug: d.slug, circle: s.circle },
          },
          s.name
        )
      );
    }
    return out;
  }, [orders, domains, grantedBy, orderBySlug]);

  const normQuery = dvNorm(query.trim());

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
      .sort(
        (a, b) =>
          GROUP_ORDER.indexOf(a.x.group) - GROUP_ORDER.indexOf(b.x.group) ||
          a.s - b.s
      )
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

  const openOrder = useCallback((slug: string) => {
    setOrderSlug(slug);
    setView('ordem');
    setMenu(false);
    setPanel(null);
  }, []);

  const openPanel = useCallback((slug: string) => setPanel(slug), []);
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
    (result: IDvResult | undefined) => {
      if (!result) return;
      setResultsOpen(false);
      const t = result.target;
      if (t.kind === 'order') {
        openOrder(t.slug);
      } else if (t.kind === 'ability') {
        openOrder(t.slug);
        requestFlash(dvAbilityId(t.slug, t.index));
      } else if (t.kind === 'domain') {
        setPanel(t.slug);
      } else if (t.kind === 'power') {
        setPanel(t.slug);
        requestFlash(dvPowerId(t.slug, t.index));
      } else {
        setPanel(t.slug);
        requestFlash(dvSpellId(t.slug, t.circle));
      }
    },
    [openOrder, requestFlash]
  );

  return {
    view,
    orderSlug,
    order: orderSlug ? (orderBySlug.get(orderSlug) ?? null) : null,
    panel,
    panelDomain: panel ? (domainBySlug.get(panel) ?? null) : null,
    pins,
    preview,
    hotCol,
    menu,
    attuned,
    query,
    results,
    resultsOpen,
    selected,
    flash,
    orderBySlug,
    domainBySlug,
    sortedOrders,
    grantedBy,
    usedDomains,
    unusedDomains,
    domainName,
    matchesPins,
    setPreview,
    setHotCol,
    setMenu,
    setAttuned,
    setSelected,
    setQuery,
    openResults,
    closeResults,
    clearSearch,
    moveSelection,
    pick,
    goTabua,
    openOrder,
    openPanel,
    closePanel,
    togglePin,
    clearPins,
    requestFlash,
  };
}

export type DivineCodexState = ReturnType<typeof useDivineCodex>;
