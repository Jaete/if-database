'use client';

import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import { CATALOG_ICON_ENTRIES } from '../catalogIcons';
import IconPickerHandles from './handles';
import '@/styles/components/iconPicker.scss';

interface IProps {
  value: string;
  onChange: (slug: string) => void;
}

/** Grade de ícones para uma lista; o escolhido leva `aria-pressed`. */
const IconPicker = ({ value, onChange }: IProps) => {
  const handles = useCssHandles(IconPickerHandles);

  return (
    <div className={handles.iconGrid}>
      {CATALOG_ICON_ENTRIES.map(({ slug, Icon, label }) => {
        const selected = slug === value;
        return (
          <button
            key={slug}
            type="button"
            className={
              selected
                ? `${handles.iconOption} ${applyModifiers(handles.iconOption, 'selected')}`
                : handles.iconOption
            }
            aria-pressed={selected}
            aria-label={label}
            title={label}
            onClick={() => onChange(slug)}
          >
            <Icon />
          </button>
        );
      })}
    </div>
  );
};

export default IconPicker;
