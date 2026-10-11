'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import type IMonster from '@/db/monsters/monster';
import type { ITreeNode } from '@/db/evolutionTrees/evolutionTree';
import {
  buildTreeStructure,
  computePositions,
  MIN_NODE_WIDTH,
  NODE_HEIGHT,
} from './layout';

// Must match .treeNodeName in evolutionTreeView.scss.
const NODE_FONT = '14px "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
// icon + gap + horizontal padding + border + measurement buffer
const NODE_CHROME_WIDTH = 32 + 8 + 24 + 2 + 8;
const PAN_DURATION_MS = 400;
const DRAG_THRESHOLD = 5;
const MSG_SOURCE = 'ifdb-embed';

const noopSubscribe = () => () => {};

export function getMonsterName(monsters: Record<string, IMonster>, id: string) {
  return monsters[id]?.name ?? id;
}

export function useEvolutionTreeView(
  nodes: ITreeNode[],
  monsters: Record<string, IMonster>,
  forumOrigin: string
) {
  const structure = useMemo(() => buildTreeStructure(nodes), [nodes]);

  // Text measurement needs a canvas, so the server (and the hydration pass)
  // render with the minimum width and the real widths kick in right after.
  const isClient = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );
  const widths = useMemo(() => {
    const result: Record<string, number> = {};
    if (!isClient) return result;
    const ctx = document.createElement('canvas').getContext('2d');
    if (!ctx) return result;
    ctx.font = NODE_FONT;
    structure.order.forEach((id) => {
      const name = getMonsterName(monsters, structure.byId[id].monsterId);
      result[id] = Math.max(
        MIN_NODE_WIDTH,
        Math.ceil(NODE_CHROME_WIDTH + ctx.measureText(name).width)
      );
    });
    return result;
  }, [isClient, structure, monsters]);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const positions = useMemo(
    () => computePositions(structure, expanded, widths),
    [structure, expanded, widths]
  );

  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanAnimating, setIsPanAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const viewportRef = useRef<HTMLDivElement>(null);
  const panTimer = useRef(0);
  const drag = useRef<{
    startX: number;
    startY: number;
    panX: number;
    panY: number;
  } | null>(null);
  const dragMoved = useRef(false);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      setViewport({ width: el.clientWidth, height: el.clientHeight });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const d = drag.current;
      if (!d) return;
      const dx = e.clientX - d.startX;
      const dy = e.clientY - d.startY;
      if (!dragMoved.current && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      dragMoved.current = true;
      setIsDragging(true);
      setPan({ x: d.panX + dx, y: d.panY + dy });
    };
    const onUp = () => {
      drag.current = null;
      setIsDragging(false);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      window.clearTimeout(panTimer.current);
    };
  }, []);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    // A fresh gesture: only reset here, since `click` fires after pointerup
    // and still needs to know whether the previous gesture was a drag.
    dragMoved.current = false;
    drag.current = {
      startX: e.clientX,
      startY: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  };

  const centerOn = (x: number, y: number) => {
    const el = viewportRef.current;
    if (!el) return;
    window.clearTimeout(panTimer.current);
    setIsPanAnimating(true);
    setPan({ x: el.clientWidth / 2 - x, y: el.clientHeight / 2 - y });
    panTimer.current = window.setTimeout(
      () => setIsPanAnimating(false),
      PAN_DURATION_MS
    );
  };

  const toggle = (id: string) => {
    if (dragMoved.current) return;
    const node = structure.byId[id];
    const next = { ...expanded };
    let focusIds: string[];

    if (expanded[id]) {
      // Collapse the whole branch so reopening it starts clean.
      const clear = (nodeId: string) => {
        delete next[nodeId];
        structure.byId[nodeId].childIds.forEach(clear);
      };
      clear(id);
      focusIds = [id];
    } else {
      next[id] = true;
      focusIds = node.childIds;
    }

    setExpanded(next);

    // Layout is pure, so the post-toggle positions can be computed right here
    // to pick the pan target — the opened children (their average) or the
    // collapsed node itself end up in the middle of the viewport.
    const placed = computePositions(structure, next, widths);
    const targets = focusIds.map((fid) => placed.byId[fid]).filter(Boolean);
    if (!targets.length) return;
    const cx =
      targets.reduce((sum, t) => sum + t.x + t.width / 2, 0) / targets.length;
    const cy =
      targets.reduce((sum, t) => sum + t.y + NODE_HEIGHT / 2, 0) /
      targets.length;
    centerOn(cx, cy);
  };

  const showMonster = (monsterId: string) => {
    if (dragMoved.current) return;
    const monster = monsters[monsterId];
    if (!monster || window.parent === window || !forumOrigin) return;
    // The drawer lives in the forum page (drawer.js), outside this iframe.
    window.parent.postMessage(
      { source: MSG_SOURCE, type: 'monster:show', monster },
      forumOrigin
    );
  };

  const overflows =
    positions.width > viewport.width || positions.height > viewport.height;

  return {
    structure,
    positions,
    expanded,
    pan,
    isPanAnimating,
    isDragging,
    overflows,
    viewportRef,
    onPointerDown,
    toggle,
    showMonster,
  };
}
