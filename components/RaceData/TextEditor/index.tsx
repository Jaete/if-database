'use client';

import { useState } from 'react';
import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import { clip } from '../fields';
import RaceField from '../../RaceField';
import RaceFieldHandles from '../../RaceField/handles';
import RaceModal from '../../RaceModal';
import TextEditorHandles from './handles';

interface ITextField {
  name: string;
  label: string;
  rows?: number;
  hint?: string;
  placeholder?: string;
}

interface IProps {
  title: string;
  fields: readonly ITextField[];
  values: Record<string, string>;
  /**
   * Os valores da raça, quando o editor é de uma sub-raça: campo vazio herda,
   * e o selo ao lado do rótulo diz "Próprio", "Herda da raça" ou "Vazio".
   */
  inheritFrom?: Record<string, string | undefined>;
  lead?: string;
  wide?: boolean;
  error: string | null;
  onSave: (values: Record<string, string>) => Promise<boolean>;
  onClose: () => void;
}

/** Editor de um bloco de campos de texto: traços, crônica ou notas. */
const TextEditor = ({
  title,
  fields,
  values: initial,
  inheritFrom,
  lead,
  wide = true,
  error,
  onSave,
  onClose,
}: IProps) => {
  const handles = useCssHandles(TextEditorHandles);
  const fld = useCssHandles(RaceFieldHandles);
  const [values, setValues] = useState(initial);

  const pillOf = (name: string) => {
    if (!inheritFrom) return undefined;
    const own = Boolean(values[name]?.trim());
    return (
      <span
        className={`${fld.racePill} ${applyModifiers(fld.racePill, own ? 'own' : 'inherited')}`}
      >
        {own ? 'Próprio' : inheritFrom[name] ? 'Herda da raça' : 'Vazio'}
      </span>
    );
  };

  const hintOf = (field: ITextField) => {
    if (!inheritFrom) return field.hint;
    if (field.name === 'abilityScoreIncrease') {
      return 'Na sub-raça, o incremento aparece junto com o da raça (não substitui).';
    }
    const base = inheritFrom[field.name];
    return base
      ? `Vazio herda: “${clip(base, 90)}”`
      : 'A raça também não tem este traço.';
  };

  return (
    <RaceModal
      title={title}
      wide={wide}
      onClose={onClose}
      error={error}
      onSave={() =>
        onSave(
          Object.fromEntries(
            Object.entries(values).map(([k, v]) => [k, v.trim()])
          )
        )
      }
    >
      {lead && <p className={handles.raceTextLead}>{lead}</p>}
      <div className={handles.raceTextGrid}>
        {fields.map((field) => (
          <RaceField
            key={field.name}
            label={field.label}
            multiline
            rows={field.rows ?? 2}
            value={values[field.name] ?? ''}
            onChange={(next) =>
              setValues((prev) => ({ ...prev, [field.name]: next }))
            }
            pill={pillOf(field.name)}
            hint={hintOf(field)}
            placeholder={
              field.placeholder ??
              (inheritFrom
                ? inheritFrom[field.name]
                  ? 'Vazio = herda da raça'
                  : undefined
                : undefined)
            }
          />
        ))}
      </div>
    </RaceModal>
  );
};

export default TextEditor;
