'use client';

import type { ReactNode } from 'react';
import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import { ChevronRightIcon, PlusIcon } from '../../Icons';
import type { ISectionNode } from '../sections';
import ClassWheelHandles from './handles';
import '@/styles/components/classWheel.scss';

interface IProps {
  nodes: ISectionNode[];
  /** A seção aberta no modal, para o `aria-expanded` e o orbe preenchido. */
  openId: string | null;
  onOpen: (id: string) => void;
  onAddList?: () => void;
  /** O retrato da classe, no centro do astrolábio. */
  children: ReactNode;
}

// Raio do anel dos nós, em % do palco; o tracejado externo e as marcações
// ficam por fora dele.
const RING = 42;
const OUTER_RING = 48;
const TICKS = [0, 45, 90, 135, 180, 225, 270, 315];

const ariaLabel = (node: ISectionNode) =>
  node.count > 0 ? `${node.label}, ${node.count} ${node.unit}` : node.label;

/**
 * A roda de seções, em forma de astrolábio: o retrato da classe no centro e
 * um nó por seção no anel. No mobile ela vira uma lista vertical ("a roda
 * desenrolada") com os mesmos orbes ligados por um fio de ouro.
 */
const ClassWheel = ({ nodes, openId, onOpen, onAddList, children }: IProps) => {
  const handles = useCssHandles(ClassWheelHandles);

  const positions = nodes.map((_, index) => {
    const angle = -Math.PI / 2 + (index / nodes.length) * 2 * Math.PI;
    return {
      x: 50 + RING * Math.cos(angle),
      y: 50 + RING * Math.sin(angle),
    };
  });

  return (
    <>
      <div className={handles.classWheel}>
        <nav className={handles.classWheelStage} aria-label="Seções da classe">
          <svg
            className={handles.classWheelLines}
            viewBox="0 0 100 100"
            aria-hidden="true"
          >
            <circle cx="50" cy="50" r={RING} data-kind="ring" />
            <circle cx="50" cy="50" r={OUTER_RING} data-kind="outer" />
            {TICKS.map((deg) => {
              const rad = (deg * Math.PI) / 180;
              return (
                <line
                  key={deg}
                  data-kind="tick"
                  x1={50 + 46 * Math.cos(rad)}
                  y1={50 + 46 * Math.sin(rad)}
                  x2={50 + 50 * Math.cos(rad)}
                  y2={50 + 50 * Math.sin(rad)}
                />
              );
            })}
            {positions.map((p, i) => (
              <line
                key={nodes[i].id}
                data-kind="spoke"
                x1="50"
                y1="50"
                x2={p.x}
                y2={p.y}
              />
            ))}
          </svg>
          {children}
          <ul className={handles.classWheelNodes}>
            {nodes.map((node, i) => {
              const Icon = node.icon;
              const up = positions[i].y < 20;
              return (
                <li key={node.id}>
                  <button
                    type="button"
                    className={`${handles.classWheelNode}${
                      up
                        ? ` ${applyModifiers(handles.classWheelNode, 'up')}`
                        : ''
                    }`}
                    style={{
                      left: `${positions[i].x}%`,
                      top: `${positions[i].y}%`,
                    }}
                    aria-expanded={openId === node.id}
                    aria-label={ariaLabel(node)}
                    onClick={() => onOpen(node.id)}
                  >
                    <span className={handles.classWheelOrb}>
                      <Icon />
                      {node.count > 0 && (
                        <span
                          className={handles.classWheelCount}
                          aria-hidden="true"
                        >
                          {node.count}
                        </span>
                      )}
                    </span>
                    <span
                      className={handles.classWheelLabel}
                      aria-hidden="true"
                    >
                      {node.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        {onAddList && (
          <button
            type="button"
            className={handles.classWheelAdd}
            onClick={onAddList}
          >
            <PlusIcon />
            Lista
          </button>
        )}
      </div>

      <nav className={handles.classWheelSpine} aria-label="Seções da classe">
        <p className={handles.classWheelSpineHead}>Seções</p>
        <ol className={handles.classWheelSpineList}>
          {nodes.map((node) => {
            const Icon = node.icon;
            return (
              <li key={node.id}>
                <button
                  type="button"
                  className={handles.classWheelSpineButton}
                  aria-expanded={openId === node.id}
                  onClick={() => onOpen(node.id)}
                >
                  <span className={handles.classWheelOrb}>
                    <Icon />
                  </span>
                  <span className={handles.classWheelSpineLabel}>
                    {node.label}
                  </span>
                  <span
                    className={handles.classWheelSpineCount}
                    aria-label={`${node.count} ${node.unit}`}
                  >
                    {node.count}
                  </span>
                  <ChevronRightIcon aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ol>
        {onAddList && (
          <button
            type="button"
            className={handles.classWheelSpineAdd}
            onClick={onAddList}
          >
            <PlusIcon />
            Lista
          </button>
        )}
      </nav>
    </>
  );
};

export default ClassWheel;
