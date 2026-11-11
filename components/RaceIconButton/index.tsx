'use client';

import type { ReactNode } from 'react';
import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import RaceIconButtonHandles from './handles';
import '@/styles/components/raceControls.scss';

interface IProps {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
  small?: boolean;
  danger?: boolean;
  /** Desligado: continua na tela (a posição não pula) mas não faz nada. */
  off?: boolean;
  /** Fica sobre arte: o fundo ganha um véu. */
  onArt?: boolean;
}

/** O botão redondo de edição: lápis, setas, lixeira. */
const RaceIconButton = ({
  label,
  icon,
  onClick,
  small,
  danger,
  off,
  onArt,
}: IProps) => {
  const handles = useCssHandles(RaceIconButtonHandles);
  const mod = (m: string) => ` ${applyModifiers(handles.raceIconBtn, m)}`;
  return (
    <button
      type="button"
      className={`${handles.raceIconBtn}${small ? mod('sm') : ''}${
        danger ? mod('danger') : ''
      }${off ? mod('off') : ''}${onArt ? mod('art') : ''}`}
      aria-label={label}
      title={label}
      aria-disabled={off || undefined}
      onClick={off ? undefined : onClick}
    >
      {icon}
    </button>
  );
};

export default RaceIconButton;
