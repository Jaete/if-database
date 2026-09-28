'use client';

import type IMonster from '@/db/monsters/monster';
import { useCssHandles } from '@/hooks/useCssHandles';
import EvolutionTreeModalHandles from './handles';
import MonsterSearch from '../MonsterSearch';
import AlertModal from '../AlertModal';
import {
  useEvolutionTreeModal,
  getMonsterImage,
  getAllMonsterIds,
  NODE_WIDTH,
  NODE_HEIGHT,
} from './useEvolutionTreeModal';
import '@/styles/components/evolutionTreeModal.scss';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  monsters: IMonster[];
}

const EvolutionTreeModal = ({ isOpen, onClose, monsters }: IProps) => {
  const handles = useCssHandles(EvolutionTreeModalHandles);
  const {
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
  } = useEvolutionTreeModal({ isOpen, onClose, monsters });

  if (!isOpen) return null;

  return (
    <div className={handles.fullScreenOverlay}>
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
                className={handles.toolbarBackButton}
                onClick={handleBackToList}
                title="Voltar para lista"
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
                  className={`${handles.treeNodeAddBtn} ${handles.toolbarAddButton}`}
                  onClick={() => setShowRootSearch(true)}
                  title="Adicionar raiz"
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
            </div>
          )}

          {(showCanvas || treeNodes.length > 0) && (
            <div
              className={handles.treeContainer}
              style={{ opacity: positionsReady ? 1 : 0 }}
            >
              <svg
                className={handles.edgeCanvas}
                width={canvasWidth}
                height={canvasHeight}
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
                    className={`${handles.treeNode}${draggingNodeId === node.id ? ` ${handles.treeNode}--dragging` : ''}`}
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

        {canEdit && !showCanvas && treeNodes.length === 0 && (
          <div className={handles.listFooter}>
            <button className={handles.newTreeBtn} onClick={handleNewTree}>
              + Nova Arvore
            </button>
          </div>
        )}
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
