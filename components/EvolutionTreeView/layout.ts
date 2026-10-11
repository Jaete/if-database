import type { ITreeNode } from '@/db/evolutionTrees/evolutionTree';

export const NODE_HEIGHT = 64;
export const MIN_NODE_WIDTH = 90;
const GAP_X = 80;
const GAP_Y = 24;
const PAD = 24;

export interface ITreeStructureNode {
  id: string;
  monsterId: string;
  depth: number;
  parentId: string | null;
  childIds: string[];
}

export interface ITreeStructure {
  byId: Record<string, ITreeStructureNode>;
  order: string[];
  roots: string[];
}

export interface IPlacedNode {
  id: string;
  x: number;
  y: number;
  width: number;
}

export interface ITreePositions {
  nodes: IPlacedNode[];
  byId: Record<string, IPlacedNode>;
  width: number;
  height: number;
}

// Static structure only (ids, depth, child order) — positions depend on the
// expanded state and are recomputed by computePositions on every change.
export function buildTreeStructure(nodes: ITreeNode[]): ITreeStructure {
  const byId: Record<string, ITreeStructureNode> = {};
  const order: string[] = [];
  const roots: string[] = [];

  const walk = (node: ITreeNode, depth: number, parentId: string | null) => {
    const base = node.monsterId || 'unknown';
    let id = base;
    for (let n = 1; byId[id]; n++) id = `${base}--${n}`;

    byId[id] = { id, monsterId: base, depth, parentId, childIds: [] };
    order.push(id);
    if (parentId) byId[parentId].childIds.push(id);
    else roots.push(id);

    (node.children ?? []).forEach((child) => walk(child, depth + 1, id));
  };

  nodes.forEach((node) => walk(node, 0, null));
  return { byId, order, roots };
}

export function collectMonsterSlugs(nodes: ITreeNode[]): string[] {
  const slugs = new Set<string>();
  const walk = (node: ITreeNode) => {
    if (node.monsterId) slugs.add(node.monsterId);
    (node.children ?? []).forEach(walk);
  };
  nodes.forEach(walk);
  return [...slugs];
}

// Lays out only the visible nodes, from the roots down. Each visible leaf (or
// collapsed node) takes the next vertical slot; each expanded parent is
// centered on its children — so siblings and cousins only spread apart as
// branches actually open, instead of reserving room for hidden descendants.
export function computePositions(
  structure: ITreeStructure,
  expanded: Record<string, boolean>,
  widths: Record<string, number>
): ITreePositions {
  const ys: Record<string, number> = {};
  const visible: string[] = [];
  const colWidth: number[] = [];
  let cursorY = PAD;

  const place = (id: string) => {
    const node = structure.byId[id];
    const width = widths[id] ?? MIN_NODE_WIDTH;
    visible.push(id);
    colWidth[node.depth] = Math.max(colWidth[node.depth] ?? 0, width);

    if (expanded[id] && node.childIds.length) {
      node.childIds.forEach(place);
      const first = ys[node.childIds[0]];
      const last = ys[node.childIds[node.childIds.length - 1]];
      ys[id] = (first + last) / 2;
    } else {
      ys[id] = cursorY;
      cursorY += NODE_HEIGHT + GAP_Y;
    }
  };

  structure.roots.forEach(place);

  // Columns are as wide as their widest *visible* node.
  const colX: number[] = [];
  let cursorX = PAD;
  colWidth.forEach((w, depth) => {
    colX[depth] = cursorX;
    cursorX += w + GAP_X;
  });

  const byId: Record<string, IPlacedNode> = {};
  const nodes = visible.map((id) => {
    const placed = {
      id,
      x: colX[structure.byId[id].depth],
      y: ys[id],
      width: widths[id] ?? MIN_NODE_WIDTH,
    };
    byId[id] = placed;
    return placed;
  });

  return {
    nodes,
    byId,
    width: cursorX - GAP_X + PAD,
    height: cursorY - GAP_Y + PAD,
  };
}
