'use client';

import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import PromptModalHandles from '@/components/PromptModal/handles';
import ImageFieldHandles from './handles';
import '@/styles/components/imageField.scss';

interface IProps {
  value: string;
  onChange: (next: string) => void;
  /** Forma da miniatura: retrato 3:4 (classes) ou paisagem 16:9 (magias). */
  aspect?: 'portrait' | 'landscape';
  /** Dica sob o campo. */
  hint?: string;
}

const isUrl = (value: string) => /^https?:\/\//i.test(value.trim());

const PLACEHOLDERS = {
  portrait: 'https://… (retrato vertical, ~3:4)',
  landscape: 'https://… (paisagem, ~16:9)',
} as const;

/** A URL de uma arte, com uma miniatura do que ela carrega. */
const ImageField = ({ value, onChange, aspect = 'portrait', hint }: IProps) => {
  const handles = useCssHandles(ImageFieldHandles);
  const prompt = useCssHandles(PromptModalHandles);

  return (
    <>
      <span className={handles.imageField}>
        <span
          className={`${handles.imageThumb} ${applyModifiers(
            handles.imageThumb,
            aspect
          )}`}
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
          placeholder={PLACEHOLDERS[aspect]}
          aria-label="Imagem (URL)"
          onChange={(event) => onChange(event.target.value)}
          // O Escape é do modal e as setas não devem vazar para a página atrás.
          onKeyDown={(event) => event.stopPropagation()}
        />
      </span>
      {hint && <span className={handles.imageHint}>{hint}</span>}
    </>
  );
};

export default ImageField;
