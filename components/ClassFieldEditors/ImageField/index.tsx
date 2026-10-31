'use client';

import { useCssHandles } from '@/hooks/useCssHandles';
import PromptModalHandles from '../../PromptModal/handles';
import ImageFieldHandles from './handles';

interface IProps {
  value: string;
  onChange: (next: string) => void;
}

const isUrl = (value: string) => /^https?:\/\//i.test(value.trim());

/** A URL da arte da classe, com uma miniatura 3:4 do que ela carrega. */
const ImageField = ({ value, onChange }: IProps) => {
  const handles = useCssHandles(ImageFieldHandles);
  const prompt = useCssHandles(PromptModalHandles);

  return (
    <span className={handles.imageField}>
      <span
        className={handles.imageThumb}
        style={
          isUrl(value)
            ? { backgroundImage: `url(${JSON.stringify(value.trim())})` }
            : undefined
        }
        aria-hidden="true"
      />
      <input
        className={prompt.promptInput}
        type="text"
        inputMode="url"
        value={value}
        placeholder="https://… (retrato vertical, ~3:4)"
        aria-label="Imagem (URL)"
        onChange={(event) => onChange(event.target.value)}
        // O Escape é do modal e as setas não devem vazar para a página atrás.
        onKeyDown={(event) => event.stopPropagation()}
      />
    </span>
  );
};

export default ImageField;
