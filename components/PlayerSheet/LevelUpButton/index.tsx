import type { ComponentProps } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import LevelUpButtonHandles from './handles';

interface IProps extends ComponentProps<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'md' | 'lg';
}

/** O botão das telas de XP e de subida: primário, secundário, fantasma e perigo. */
const LevelUpButton = ({
  variant = 'secondary',
  size = 'md',
  className,
  type = 'button',
  ...rest
}: IProps) => {
  const handles = useCssHandles(LevelUpButtonHandles);
  return (
    <button
      type={type}
      className={`${handles.luBtn} ${handles.luBtn}--${variant}${
        size === 'lg' ? ` ${handles.luBtn}--lg` : ''
      }${className ? ` ${className}` : ''}`}
      {...rest}
    />
  );
};

export default LevelUpButton;
