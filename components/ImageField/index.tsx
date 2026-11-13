'use client';

import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import { isImageUrl, isUploadedImageUrl } from '@/lib/imageUrl';
import { UploadIcon } from '../Icons';
import PromptModalHandles from '@/components/PromptModal/handles';
import ImageFieldHandles from './handles';
import { useImageField } from './useImageField';
import '@/styles/components/imageField.scss';

interface IProps {
  value: string;
  onChange: (next: string) => void;
  /** Forma da miniatura: retrato 3:4 (classes) ou paisagem 16:9 (magias). */
  aspect?: 'portrait' | 'landscape';
  /** Dica sob o campo. */
  hint?: string;
}

const isUrl = (value: string) => isImageUrl(value.trim());

const PLACEHOLDERS = {
  portrait: 'https://… (retrato vertical, ~3:4)',
  landscape: 'https://… (paisagem, ~16:9)',
} as const;

/**
 * A URL de uma arte, com uma miniatura do que ela carrega. Aceita colar um
 * link, escolher um arquivo ou soltá-lo no campo: o arquivo vai para o app e a
 * URL devolvida preenche o valor.
 */
const ImageField = ({ value, onChange, aspect = 'portrait', hint }: IProps) => {
  const handles = useCssHandles(ImageFieldHandles);
  const prompt = useCssHandles(PromptModalHandles);
  const {
    inputRef,
    openPicker,
    onPick,
    dropProps,
    dragging,
    uploading,
    error,
  } = useImageField(onChange);

  return (
    <>
      <span
        className={`${handles.imageField}${
          dragging ? ` ${applyModifiers(handles.imageField, 'dragging')}` : ''
        }`}
        {...dropProps}
      >
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
        <span className={handles.imageBody}>
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
          <span className={handles.imageActions}>
            <button
              type="button"
              className={handles.imageUpload}
              disabled={uploading}
              onClick={openPicker}
            >
              <UploadIcon
                className={`${handles.imageUploadIcon}${
                  uploading
                    ? ` ${applyModifiers(handles.imageUploadIcon, 'busy')}`
                    : ''
                }`}
              />
              {uploading
                ? 'Enviando…'
                : isUrl(value)
                  ? 'Substituir imagem'
                  : 'Enviar imagem'}
            </button>
            <span className={handles.imageHint}>ou solte um arquivo aqui</span>
          </span>
          {isUploadedImageUrl(value.trim()) && (
            <span className={handles.imageHint}>
              A imagem atual é substituída ao salvar.
            </span>
          )}
          {error && (
            <span className={handles.imageError} role="alert">
              {error}
            </span>
          )}
          <input
            ref={inputRef}
            className={handles.imageFile}
            type="file"
            accept="image/*"
            tabIndex={-1}
            aria-hidden="true"
            onChange={onPick}
          />
        </span>
      </span>
      {hint && <span className={handles.imageHint}>{hint}</span>}
    </>
  );
};

export default ImageField;
