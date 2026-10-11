'use client';

import type IMonster from '@/db/monsters/monster';
import type { ITreeNode } from '@/db/evolutionTrees/evolutionTree';
import { useCssHandles } from '@/hooks/useCssHandles';
import { useEvolutionTreeView, getMonsterName } from './useEvolutionTreeView';
import { NODE_HEIGHT } from './layout';
import { MouseIcon } from '../Icons';
import EvolutionTreeViewHandles from './handles';
import '@/styles/components/evolutionTreeView.scss';

interface IProps {
  nodes: ITreeNode[];
  monsters: Record<string, IMonster>;
  forumOrigin: string;
}

const EvolutionTreeView = ({ nodes, monsters, forumOrigin }: IProps) => {
  const handles = useCssHandles(EvolutionTreeViewHandles);
  const {
    structure,
    positions,
    expanded,
    view,
    canZoomIn,
    canZoomOut,
    zoomIn,
    zoomOut,
    resetZoom,
    isPanAnimating,
    isDragging,
    overflows,
    viewportRef,
    onPointerDown,
    toggle,
    showMonster,
  } = useEvolutionTreeView(nodes, monsters, forumOrigin);

  return (
    <div className={handles.treeView}>
      <div
        ref={viewportRef}
        className={`${handles.treeViewport}${isDragging ? ` ${handles.treeViewport}--dragging` : ''}`}
        onPointerDown={onPointerDown}
      >
        <div
          className={`${handles.treeCanvas}${isPanAnimating ? ` ${handles.treeCanvas}--animated` : ''}`}
          style={{
            width: positions.width,
            height: positions.height,
            transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
          }}
        >
          <svg className={handles.treeLinks} aria-hidden="true">
            {positions.nodes.map((node) => {
              const parentId = structure.byId[node.id].parentId;
              const parent = parentId ? positions.byId[parentId] : null;
              if (!parent) return null;
              const x1 = parent.x + parent.width;
              const y1 = parent.y + NODE_HEIGHT / 2;
              const x2 = node.x;
              const y2 = node.y + NODE_HEIGHT / 2;
              const dx = (x2 - x1) * 0.45;
              return (
                <g key={node.id}>
                  <path
                    className={handles.treeLink}
                    d={`M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`}
                  />
                  <circle
                    className={handles.treeLinkDot}
                    cx={x2}
                    cy={y2}
                    r={3}
                  />
                </g>
              );
            })}
          </svg>

          {positions.nodes.map((node) => {
            const { monsterId, childIds } = structure.byId[node.id];
            const monster = monsters[monsterId];
            const icon = monster?.icon || monster?.image;
            const isExpanded = !!expanded[node.id];
            return (
              <div
                key={node.id}
                className={handles.treeNode}
                style={{
                  left: node.x,
                  top: node.y,
                  width: node.width,
                  height: NODE_HEIGHT,
                }}
              >
                <button
                  type="button"
                  className={handles.treeNodeButton}
                  onClick={() => showMonster(monsterId)}
                >
                  <span
                    className={handles.treeNodeIcon}
                    style={
                      icon
                        ? { backgroundImage: `url(${JSON.stringify(icon)})` }
                        : undefined
                    }
                  />
                  <span className={handles.treeNodeName}>
                    {getMonsterName(monsters, monsterId)}
                  </span>
                </button>
                {childIds.length > 0 && (
                  <button
                    type="button"
                    className={handles.treeNodeToggle}
                    aria-expanded={isExpanded}
                    aria-label={
                      isExpanded
                        ? 'Recolher ramificação'
                        : 'Expandir ramificação'
                    }
                    title={
                      isExpanded
                        ? 'Recolher ramificação'
                        : 'Expandir ramificação'
                    }
                    onClick={() => toggle(node.id)}
                  >
                    {isExpanded ? '−' : '+'}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div
          className={handles.treeZoomControls}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className={handles.treeZoomButton}
            onClick={zoomIn}
            disabled={!canZoomIn}
            aria-label="Aproximar"
            title="Aproximar (Ctrl + roda do mouse)"
          >
            +
          </button>
          <button
            type="button"
            className={`${handles.treeZoomButton} ${handles.treeZoomButton}--level`}
            onClick={resetZoom}
            aria-label="Restaurar zoom"
            title="Restaurar zoom"
          >
            {Math.round(view.scale * 100)}%
          </button>
          <button
            type="button"
            className={handles.treeZoomButton}
            onClick={zoomOut}
            disabled={!canZoomOut}
            aria-label="Afastar"
            title="Afastar (Ctrl + roda do mouse)"
          >
            −
          </button>
        </div>
      </div>

      <div className={handles.treeHints}>
        <span className={handles.treeHint}>
          Clique no monstro para ver mais
        </span>
        <div className={handles.treeHintGroup}>
          <span
            className={`${handles.treeHint}${overflows ? '' : ` ${handles.treeHint}--hidden`}`}
          >
            Arraste para visualizar
          </span>
          <span className={handles.treeHint}>
            <MouseIcon className={handles.treeHintIcon} />
            Ctrl + scroll para zoom
          </span>
        </div>
      </div>
    </div>
  );
};

export default EvolutionTreeView;
