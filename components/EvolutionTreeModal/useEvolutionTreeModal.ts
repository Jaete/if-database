'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type IMonster from '@/db/monsters/monster';
import type IEvolutionTree from '@/db/evolutionTrees/evolutionTree';
import type { ITreeNode } from '@/db/evolutionTrees/evolutionTree';
import { useAuth } from '@/app/context/AuthContext';
import * as api from '@/app/context/evolutionTreesUtils';

interface ILayoutNode {
  id: string;
  monsterId: string;
  depth: number;
  parentId: string | null;
}

export const NODE_WIDTH = 200;
export const NODE_HEIGHT = 80;
const LEVEL_GAP = 80;
const NODE_GAP = 30;

function slugify(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function getMonsterImage(monster: IMonster | undefined): string {
  return monster?.icon || monster?.image || '';
}

// Returns tree structure only (no x/y). Uses monsterId as stable ID.
function computeTreeInfo(nodes: ITreeNode[]): ILayoutNode[] {
  const result: ILayoutNode[] = [];
  const seen = new Set<string>();

  function ensureId(monsterId: string): string {
    let id = monsterId;
    let counter = 0;
    while (seen.has(id)) {
      counter++;
      id = `${monsterId}-${counter}`;
    }
    seen.add(id);
    return id;
  }

  function walk(node: ITreeNode, depth: number, parentId: string | null) {
    const id = ensureId(node.monsterId);
    result.push({ id, monsterId: node.monsterId, depth, parentId });
    for (const child of node.children) {
      walk(child, depth + 1, id);
    }
  }

  for (const rootNode of nodes) {
    walk(rootNode, 0, null);
  }

  return result;
}

function findNodeAndAddChild(
  nodes: ITreeNode[],
  targetMonsterId: string,
  newChildMonsterId: string
): ITreeNode[] {
  return nodes.map((node) => {
    if (node.monsterId === targetMonsterId) {
      return {
        ...node,
        children: [
          ...node.children,
          { monsterId: newChildMonsterId, children: [] },
        ],
      };
    }
    return {
      ...node,
      children: findNodeAndAddChild(
        node.children,
        targetMonsterId,
        newChildMonsterId
      ),
    };
  });
}

function findNodeAndRemove(
  nodes: ITreeNode[],
  targetMonsterId: string
): ITreeNode[] {
  return nodes
    .filter((node) => node.monsterId !== targetMonsterId)
    .map((node) => ({
      ...node,
      children: findNodeAndRemove(node.children, targetMonsterId),
    }));
}

export function getAllMonsterIds(nodes: ITreeNode[]): string[] {
  const ids: string[] = [];
  function walk(list: ITreeNode[]) {
    for (const n of list) {
      ids.push(n.monsterId);
      walk(n.children);
    }
  }
  walk(nodes);
  return ids;
}

interface IUseEvolutionTreeModalProps {
  isOpen: boolean;
  onClose: () => void;
  monsters: IMonster[];
}

export const useEvolutionTreeModal = ({
  isOpen,
  onClose,
  monsters,
}: IUseEvolutionTreeModalProps) => {
  const { canEdit } = useAuth();

  const [savedTrees, setSavedTrees] = useState<IEvolutionTree[]>([]);
  const [currentTree, setCurrentTree] = useState<IEvolutionTree | null>(null);
  const [treeName, setTreeName] = useState('');
  const [treeNodes, setTreeNodes] = useState<ITreeNode[]>([]);
  const [showRootSearch, setShowRootSearch] = useState(false);
  const [activeAddTarget, setActiveAddTarget] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);

  // --- Drag state ---
  const [nodePositions, setNodePositions] = useState<
    Record<string, { x: number; y: number }>
  >({});
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [alertTitle, setAlertTitle] = useState('Aviso');
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const dragRef = useRef<{
    nodeId: string;
    startMouseX: number;
    startMouseY: number;
    startNodeX: number;
    startNodeY: number;
  } | null>(null);

  const monsterMap = useMemo(() => {
    const map = new Map<string, IMonster>();
    for (const m of monsters) {
      map.set(m.slug, m);
    }
    return map;
  }, [monsters]);

  const usedMonsterIds = useMemo(
    () => getAllMonsterIds(treeNodes),
    [treeNodes]
  );

  const availableMonsters = useMemo(() => {
    return monsters.filter((m) => !usedMonsterIds.includes(m.slug));
  }, [monsters, usedMonsterIds]);

  const layoutNodes = useMemo(() => computeTreeInfo(treeNodes), [treeNodes]);

  // Sync nodePositions: preserve existing positions, place new ones relative to parent
  useEffect(() => {
    setNodePositions((prev) => {
      const next = { ...prev };
      for (const n of layoutNodes) {
        if (!next[n.id]) {
          if (n.parentId && next[n.parentId]) {
            const parentPos = next[n.parentId];
            const siblingIds = layoutNodes
              .filter(
                (l) => l.parentId === n.parentId && l.id !== n.id && next[l.id]
              )
              .map((l) => l.id);
            if (siblingIds.length > 0) {
              const lastSib = next[siblingIds[siblingIds.length - 1]];
              next[n.id] = {
                x: n.depth * (NODE_WIDTH + LEVEL_GAP),
                y: lastSib.y + NODE_HEIGHT + NODE_GAP,
              };
            } else {
              next[n.id] = {
                x: n.depth * (NODE_WIDTH + LEVEL_GAP),
                y: parentPos.y,
              };
            }
          } else {
            const rootPositions = layoutNodes
              .filter((l) => !l.parentId && next[l.id])
              .map((l) => next[l.id].y);
            const maxY =
              rootPositions.length > 0
                ? Math.max(...rootPositions)
                : -NODE_HEIGHT;
            next[n.id] = {
              x: 0,
              y: maxY + NODE_HEIGHT + NODE_GAP,
            };
          }
        }
      }
      return next;
    });
  }, [layoutNodes]);

  const loadSavedTrees = useCallback(async () => {
    try {
      const trees = await api.fetchEvolutionTrees();
      setSavedTrees(trees);
    } catch {
      console.error('Failed to load evolution trees');
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadSavedTrees();
      setCurrentTree(null);
      setTreeName('');
      setTreeNodes([]);
      setHasUnsavedChanges(false);
      setShowRootSearch(false);
      setActiveAddTarget(null);
      setNodePositions({});
      setShowCanvas(false);
    }
  }, [isOpen, loadSavedTrees]);

  // --- Drag handlers ---
  const handleMouseDown = useCallback(
    (e: React.MouseEvent, nodeId: string) => {
      if (!canEdit) return;
      e.preventDefault();
      const pos = nodePositions[nodeId];
      if (!pos) return;
      dragRef.current = {
        nodeId,
        startMouseX: e.clientX,
        startMouseY: e.clientY,
        startNodeX: pos.x,
        startNodeY: pos.y,
      };
      setDraggingNodeId(nodeId);
    },
    [canEdit, nodePositions]
  );

  useEffect(() => {
    if (!canEdit) return;

    const handleMouseMove = (e: MouseEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const dx = e.clientX - drag.startMouseX;
      const dy = e.clientY - drag.startMouseY;
      setNodePositions((prev) => ({
        ...prev,
        [drag.nodeId]: {
          x: Math.max(0, drag.startNodeX + dx),
          y: Math.max(0, drag.startNodeY + dy),
        },
      }));
    };

    const handleMouseUp = () => {
      if (dragRef.current) {
        dragRef.current = null;
        setDraggingNodeId(null);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [canEdit]);

  const handleClose = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        'Existem alteracoes nao salvas. Deseja realmente sair?'
      );
      if (!confirmed) return;
    }
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, hasUnsavedChanges]);

  const handleNewTree = () => {
    setCurrentTree(null);
    setTreeName('');
    setTreeNodes([]);
    setHasUnsavedChanges(false);
    setShowRootSearch(false);
    setActiveAddTarget(null);
    setNodePositions({});
    setShowCanvas(true);
  };

  const handleLoadTree = (tree: IEvolutionTree) => {
    setCurrentTree(tree);
    setTreeName(tree.name);
    setTreeNodes(JSON.parse(JSON.stringify(tree.nodes)));
    setHasUnsavedChanges(false);
    setShowRootSearch(false);
    setActiveAddTarget(null);
    setShowCanvas(true);
  };

  const handleAddRootNode = (monsterId: string) => {
    setTreeNodes((prev) => [...prev, { monsterId, children: [] }]);
    setHasUnsavedChanges(true);
    setShowRootSearch(false);
  };

  const handleAddChildNode = (
    parentMonsterId: string,
    childMonsterId: string
  ) => {
    setTreeNodes((prev) =>
      findNodeAndAddChild(prev, parentMonsterId, childMonsterId)
    );
    setActiveAddTarget(null);
    setHasUnsavedChanges(true);
  };

  const handleRemoveNode = (monsterId: string) => {
    setTreeNodes((prev) => findNodeAndRemove(prev, monsterId));
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    if (!treeName.trim()) {
      setAlertTitle('Aviso');
      setAlertMsg('Defina um nome para a arvore');
      return;
    }
    if (treeNodes.length === 0) {
      setAlertTitle('Aviso');
      setAlertMsg('Adicione pelo menos um monstro a arvore');
      return;
    }

    setIsLoading(true);
    try {
      const slug = slugify(treeName);
      if (currentTree) {
        await api.updateEvolutionTree(currentTree.slug, {
          name: treeName,
          slug,
          nodes: treeNodes,
        });
      } else {
        await api.createEvolutionTree({
          name: treeName,
          slug,
          nodes: treeNodes,
        } as IEvolutionTree);
      }
      setHasUnsavedChanges(false);
      await loadSavedTrees();
      setAlertTitle('Sucesso');
      setAlertMsg('Arvore salva com sucesso!');
    } catch {
      setAlertTitle('Erro');
      setAlertMsg('Erro ao salvar arvore');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTree = async (slug: string) => {
    const confirmed = window.confirm(
      'Tem certeza que deseja excluir esta arvore?'
    );
    if (!confirmed) return;
    try {
      await api.deleteEvolutionTree(slug);
      if (currentTree?.slug === slug) {
        handleNewTree();
      }
      await loadSavedTrees();
    } catch {
      setAlertTitle('Erro');
      setAlertMsg('Erro ao excluir arvore');
    }
  };

  const handleCopyBBCode = (slug: string) => {
    const bbcode = '[arvore=' + slug + ']';
    navigator.clipboard.writeText(bbcode).then(() => {
      setAlertTitle('Copiado!');
      setAlertMsg(
        'BBCode [arvore=' + slug + '] copiado para a area de transferencia'
      );
    });
  };

  const handleBackToList = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        'Existem alteracoes nao salvas. Deseja realmente voltar?'
      );
      if (!confirmed) return;
    }
    setCurrentTree(null);
    setTreeName('');
    setTreeNodes([]);
    setHasUnsavedChanges(false);
    setShowRootSearch(false);
    setActiveAddTarget(null);
    setNodePositions({});
    setShowCanvas(false);
  };

  // Build positions map for rendering
  const positions = layoutNodes.map((n) => {
    const pos = nodePositions[n.id];
    return { id: n.id, x: pos?.x ?? 0, y: pos?.y ?? 0 };
  });
  const canvasWidth = Math.max(
    positions.length > 0
      ? Math.max(...positions.map((p) => p.x)) + NODE_WIDTH + LEVEL_GAP
      : 800,
    800
  );
  const canvasHeight = Math.max(
    positions.length > 0
      ? Math.max(...positions.map((p) => p.y)) + NODE_HEIGHT + NODE_GAP
      : 600,
    600
  );
  const positionsReady =
    layoutNodes.length === 0 || layoutNodes.every((n) => nodePositions[n.id]);

  return {
    canEdit,
    savedTrees,
    currentTree,
    treeName,
    setTreeName,
    treeNodes,
    showRootSearch,
    setShowRootSearch,
    activeAddTarget,
    setActiveAddTarget,
    isLoading,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    showCanvas,
    nodePositions,
    alertMsg,
    setAlertMsg,
    alertTitle,
    dragRef,
    draggingNodeId,
    monsterMap,
    availableMonsters,
    layoutNodes,
    handleMouseDown,
    handleClose,
    handleNewTree,
    handleLoadTree,
    handleAddRootNode,
    handleAddChildNode,
    handleRemoveNode,
    handleSave,
    handleDeleteTree,
    handleCopyBBCode,
    handleBackToList,
    canvasWidth,
    canvasHeight,
    positionsReady,
  };
};
