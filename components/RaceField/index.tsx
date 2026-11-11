'use client';

import type { ReactNode } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import RaceFieldHandles from './handles';
import '@/styles/components/raceForm.scss';

interface IProps {
  label: string;
  value: string;
  onChange: (next: string) => void;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  hint?: ReactNode;
  /** Selo ao lado do rótulo ("Próprio", "Herda da raça"). */
  pill?: ReactNode;
  type?: 'text' | 'url' | 'number';
  list?: string;
  min?: number;
  max?: number;
  autoFocus?: boolean;
}

/** Um campo de formulário das Raças: rótulo, controle e dica. */
const RaceField = ({
  label,
  value,
  onChange,
  multiline,
  rows = 3,
  placeholder,
  hint,
  pill,
  type = 'text',
  list,
  min,
  max,
  autoFocus,
}: IProps) => {
  const handles = useCssHandles(RaceFieldHandles);

  return (
    <label className={handles.raceFld}>
      <span className={handles.raceFldLabel}>
        {label}
        {pill}
      </span>
      {multiline ? (
        <textarea
          className={handles.raceInp}
          rows={rows}
          value={value}
          placeholder={placeholder}
          autoFocus={autoFocus}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className={handles.raceInp}
          type={type}
          list={list}
          min={min}
          max={max}
          value={value}
          placeholder={placeholder}
          autoFocus={autoFocus}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {hint && <small className={handles.raceFldHint}>{hint}</small>}
    </label>
  );
};

export default RaceField;
