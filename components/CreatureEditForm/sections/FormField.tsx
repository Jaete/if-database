import { useCssHandles } from '@/hooks/useCssHandles';
import CreatureEditFormHandles from '../handles';

interface IProps {
  label: string;
  id?: string;
  name?: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
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
  required,
  isTextarea,
  type,
}: IProps) => {
  const handles = useCssHandles(CreatureEditFormHandles);

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
          required={required}
        />
      )}
    </div>
  );
};

export default FormField;
