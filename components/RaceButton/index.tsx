'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import RaceButtonHandles from './handles';
import '@/styles/components/raceControls.scss';

interface IProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'className'
> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  small?: boolean;
  icon?: ReactNode;
}

const RaceButton = ({
  variant = 'secondary',
  small,
  icon,
  children,
  type = 'button',
  ...rest
}: IProps) => {
  const handles = useCssHandles(RaceButtonHandles);
  return (
    <button
      type={type}
      className={`${handles.raceBtn} ${applyModifiers(handles.raceBtn, variant)}${
        small ? ` ${applyModifiers(handles.raceBtn, 'sm')}` : ''
      }`}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
};

export default RaceButton;
