'use client';

import type { ComponentType, SVGProps } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import { HaloSwordIcon } from '@/components/Icons';
import ClassWheelHandles from './handles';
import '@/styles/components/classWheel.scss';

export interface IClassWheelNode {
  id: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

interface IProps {
  nodes: IClassWheelNode[];
  name: string;
  onOpen: (id: string) => void;
  onAddList?: () => void;
}

const RING = 36;

const ClassWheel = ({ nodes, name, onOpen, onAddList }: IProps) => {
  const handles = useCssHandles(ClassWheelHandles);

  return (
    <div className={handles.classWheel}>
      <div className={handles.classWheelStage}>
        <svg
          className={handles.classWheelLines}
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          <circle cx="50" cy="50" r={RING} />
          {nodes.map((node, index) => {
            const angle = -Math.PI / 2 + (index / nodes.length) * 2 * Math.PI;
            return (
              <line
                key={node.id}
                x1="50"
                y1="50"
                x2={50 + RING * Math.cos(angle)}
                y2={50 + RING * Math.sin(angle)}
              />
            );
          })}
        </svg>
        <div className={handles.classWheelCenter} aria-hidden="true">
          <HaloSwordIcon className={handles.classWheelMark} />
          <span className={handles.classWheelCenterName}>{name}</span>
        </div>
        {nodes.map((node, index) => {
          const angle = -Math.PI / 2 + (index / nodes.length) * 2 * Math.PI;
          const Icon = node.icon;
          return (
            <button
              key={node.id}
              type="button"
              className={handles.classWheelNode}
              style={{
                left: `${50 + RING * Math.cos(angle)}%`,
                top: `${50 + RING * Math.sin(angle)}%`,
              }}
              onClick={() => onOpen(node.id)}
            >
              <span className={handles.classWheelOrb}>
                <Icon />
              </span>
              <span className={handles.classWheelLabel}>{node.label}</span>
            </button>
          );
        })}
      </div>
      <ul className={handles.classWheelList}>
        {nodes.map((node) => {
          const Icon = node.icon;
          return (
            <li key={node.id} className={handles.classWheelListItem}>
              <button
                type="button"
                className={handles.classWheelListButton}
                onClick={() => onOpen(node.id)}
              >
                <Icon />
                {node.label}
              </button>
            </li>
          );
        })}
      </ul>
      {onAddList && (
        <button
          type="button"
          className={handles.classWheelAdd}
          onClick={onAddList}
        >
          + Lista
        </button>
      )}
    </div>
  );
};

export default ClassWheel;
