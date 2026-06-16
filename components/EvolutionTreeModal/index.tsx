'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type IMonster from '@/db/monsters/monster';
import type IEvolutionTree from '@/db/evolutionTrees/evolutionTree';
import type { ITreeNode } from '@/db/evolutionTrees/evolutionTree';
import { useCssHandles } from '@/hooks/useCssHandles';
import { useAuth } from '@/app/context/AuthContext';
import EvolutionTreeModalHandles from './handles';
import MonsterSearch from './MonsterSearch';
import * as api from '@/app/context/evolutionTreesUtils';
import AlertModal from '../AlertModal';
import '@/styles/components/evolutionTreeModal.scss';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  monsters: IMonster[];
}

interface ILayoutNode {
  id: string;
  monsterId: string;
  depth: number;
  parentId: string | null;
}

const NODE_WIDTH = 200;
const NODE_HEIGHT = 80;
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

function getMonsterImage(monster: IMonster | undefined): string {
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

function getAllMonsterIds(nodes: ITreeNode[]): string[] {
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

const EvolutionTreeModal = ({ isOpen, onClose, monsters }: IProps) => {
  const handles = useCssHandles(EvolutionTreeModalHandles);
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

  if (!isOpen) return null;

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

  return (
    <div className={handles.fullScreenOverlay} onClick={handleClose}>
      <div
        className={handles.fullScreenModal}
        onClick={(e) => e.stopPropagation()}
      >
        <header className={handles.modalHeader}>
          <h2 className={handles.modalTitle}>
            {currentTree
              ? `Editando: ${currentTree.name}`
              : 'Árvore de Evoluções'}
          </h2>
          <button
            className={handles.modalCloseButton}
            onClick={handleClose}
            aria-label="Fechar"
          >
            &times;
          </button>
        </header>

        {canEdit && (showCanvas || treeNodes.length > 0) && (
          <div className={handles.toolbar}>
            <div className={handles.toolbarLeft}>
              <button
                onClick={handleBackToList}
                title="Voltar para lista"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9c841c',
                  cursor: 'pointer',
                  fontSize: 14,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '0 8px',
                  whiteSpace: 'nowrap',
                }}
              >
                &larr; Voltar
              </button>
            </div>
            <div className={handles.toolbarCenter}>
              <input
                className={handles.treeNameInput}
                type="text"
                placeholder="Nome da arvore..."
                value={treeName}
                onChange={(e) => {
                  setTreeName(e.target.value);
                  setHasUnsavedChanges(true);
                }}
              />
              {showRootSearch ? (
                <MonsterSearch
                  monsters={availableMonsters}
                  onSelect={handleAddRootNode}
                  placeholder="Buscar criatura para adicionar..."
                  autoFocus
                  onClose={() => setShowRootSearch(false)}
                />
              ) : (
                <button
                  className={handles.treeNodeAddBtn}
                  onClick={() => setShowRootSearch(true)}
                  title="Adicionar raiz"
                  style={{
                    height: 32,
                    width: 'auto',
                    fontSize: 13,
                    borderRadius: 4,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '0 12px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  + Adicionar monstro
                </button>
              )}
            </div>
            <div className={handles.toolbarRight}>
              <button
                className={handles.saveButton}
                onClick={handleSave}
                disabled={isLoading || !hasUnsavedChanges}
              >
                {isLoading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        )}

        <div className={handles.canvas}>
          {!showCanvas && treeNodes.length === 0 && savedTrees.length === 0 && (
            <div className={handles.noTreeMessage}>
              Nenhuma arvore criada ainda. Crie uma nova ou selecione uma
              existente.
            </div>
          )}

          {!showCanvas && treeNodes.length === 0 && savedTrees.length > 0 && (
            <div className={handles.savedTreesList}>
              <h3 className={handles.sectionTitle}>Arvores Salvas</h3>
              {savedTrees.map((tree) => {
                const totalNodes = getAllMonsterIds(tree.nodes).length;
                return (
                  <div key={tree.slug} className={handles.savedTreeItem}>
                    <div className={handles.savedTreeItemInfo}>
                      <strong>{tree.name}</strong>
                      <span>{totalNodes} monstros</span>
                    </div>
                    <div className={handles.savedTreeItemActions}>
                      <button
                        className={handles.loadTreeBtn}
                        onClick={() => handleLoadTree(tree)}
                      >
                        Carregar
                      </button>
                      <button
                        className={handles.copyBBCodeBtn}
                        onClick={() => handleCopyBBCode(tree.slug)}
                      >
                        Copiar BBCode
                      </button>
                      {canEdit && (
                        <button
                          className={handles.deleteTreeBtn}
                          onClick={() => handleDeleteTree(tree.slug)}
                        >
                          Excluir
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              {canEdit && (
                <button className={handles.newTreeBtn} onClick={handleNewTree}>
                  + Nova Arvore
                </button>
              )}
            </div>
          )}

          {(showCanvas || treeNodes.length > 0) && (
            <div
              className={handles.treeContainer}
              style={{ opacity: positionsReady ? 1 : 0 }}
            >
              <svg
                width={canvasWidth}
                height={canvasHeight}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  pointerEvents: 'none',
                }}
              >
                {layoutNodes.map((node) => {
                  if (!node.parentId) return null;
                  const parentLayout = layoutNodes.find(
                    (n) => n.id === node.parentId
                  );
                  if (!parentLayout) return null;
                  const parentPos = nodePositions[parentLayout.id] ?? {
                    x: 0,
                    y: 0,
                  };
                  const childPos = nodePositions[node.id] ?? { x: 0, y: 0 };
                  const x1 = parentPos.x + NODE_WIDTH;
                  const y1 = parentPos.y + NODE_HEIGHT / 2;
                  const x2 = childPos.x;
                  const y2 = childPos.y + NODE_HEIGHT / 2;
                  const cx = (x1 + x2) / 2;
                  return (
                    <path
                      key={`line-${node.id}`}
                      d={`M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`}
                      fill="none"
                      stroke="#9c841c"
                      strokeWidth="2"
                      opacity="0.6"
                    />
                  );
                })}
              </svg>

              {layoutNodes.map((node) => {
                const pos = nodePositions[node.id] ?? { x: 0, y: 0 };
                const monster = monsterMap.get(node.monsterId);
                const imgSrc = getMonsterImage(monster);
                return (
                  <div
                    key={node.id}
                    className={`${handles.treeNode}${dragRef.current?.nodeId === node.id ? ` ${handles.treeNode}--dragging` : ''}`}
                    style={{
                      position: 'absolute',
                      left: pos.x,
                      top: pos.y,
                      width: NODE_WIDTH,
                      height: NODE_HEIGHT,
                      cursor: canEdit ? 'grab' : 'default',
                    }}
                    onMouseDown={(e) => handleMouseDown(e, node.id)}
                  >
                    <div className={handles.treeNodeContent}>
                      {imgSrc && (
                        <img
                          className={handles.treeNodeImage}
                          src={imgSrc}
                          alt={monster?.name || node.monsterId}
                        />
                      )}
                      <div className={handles.treeNodeInfo}>
                        <span className={handles.treeNodeName}>
                          {monster?.name || node.monsterId}
                        </span>
                      </div>
                    </div>
                    {canEdit && (
                      <div className={handles.treeNodeActions}>
                        {activeAddTarget === node.id ? (
                          <MonsterSearch
                            monsters={availableMonsters}
                            onSelect={(monsterId) =>
                              handleAddChildNode(node.monsterId, monsterId)
                            }
                            placeholder="Buscar..."
                            autoFocus
                            onClose={() => setActiveAddTarget(null)}
                          />
                        ) : (
                          <button
                            className={handles.treeNodeAddBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveAddTarget(node.id);
                            }}
                            title="Adicionar filho"
                          >
                            +
                          </button>
                        )}
                        <button
                          className={handles.treeNodeRemoveBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveNode(node.monsterId);
                          }}
                          title="Remover"
                        >
                          &times;
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <AlertModal
        isOpen={!!alertMsg}
        message={alertMsg ?? ''}
        title={alertTitle}
        onClose={() => setAlertMsg(null)}
      />
    </div>
  );
};

export default EvolutionTreeModal;
