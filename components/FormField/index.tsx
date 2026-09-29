'use client';

import { useCssHandles } from '@/hooks/useCssHandles';
import FormFieldHandles from './handles';

interface IProps {
  label: string;
  id?: string;
  name?: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onBlur?: () => void;
  required?: boolean;
  isTextarea?: boolean;
  type?: string;
}

const FormField = ({
  label,
  id,
  name,
  value,
  onChange,
  onBlur,
  required,
  isTextarea,
  type,
}: IProps) => {
  const handles = useCssHandles(FormFieldHandles);

  return (
    <div className={handles.fieldGroup}>
      <label className={handles.label} htmlFor={id}>
        {label}
      </label>
      {isTextarea ? (
        <textarea
          className={handles.textarea}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
        />
      ) : (
        <input
          className={handles.input}
          type={type || 'text'}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          onWheel={
            type === 'number'
              ? (e) => (e.target as HTMLInputElement).blur()
              : undefined
          }
        />
      )}
    </div>
  );
};

export default FormField;
