'use client';

import { useRef } from 'react';
import type { ChangeEvent } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import { useImageUpload } from '@/hooks/useImageUpload';
import { UploadIcon } from '../../../Icons';
import RaceIconButton from '../../../RaceIconButton';
import UploadActionHandles from './handles';

interface IProps {
  /**
   * Chamado ao clicar: o editor devolve a identidade estável da linha. A
   * posição não serve, porque a linha pode subir, descer ou sumir durante o envio.
   */
  getRowKey: () => string;
  onUploaded: (rowKey: string, url: string) => void;
  /** A linha já tem imagem: o envio a substitui. */
  replacing?: boolean;
  /** Mensagem de erro do envio (ou null); o editor a mostra sob a lista. */
  onError: (message: string | null) => void;
}

/** O botão "Enviar imagem" de uma linha do editor: escolhe, envia, devolve a URL. */
const UploadAction = ({
  getRowKey,
  onUploaded,
  onError,
  replacing,
}: IProps) => {
  const handles = useCssHandles(UploadActionHandles);
  const inputRef = useRef<HTMLInputElement>(null);
  const target = useRef('');
  const { upload, uploading } = useImageUpload(
    (url) => onUploaded(target.current, url),
    onError
  );

  const onPick = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (file) void upload(file);
  };

  return (
    <>
      <RaceIconButton
        small
        off={uploading}
        label={
          uploading
            ? 'Enviando imagem…'
            : replacing
              ? 'Substituir imagem'
              : 'Enviar imagem'
        }
        icon={<UploadIcon />}
        onClick={() => {
          target.current = getRowKey();
          inputRef.current?.click();
        }}
      />
      <input
        ref={inputRef}
        className={handles.raceImgFile}
        type="file"
        accept="image/*"
        tabIndex={-1}
        aria-hidden="true"
        onChange={onPick}
      />
    </>
  );
};

export default UploadAction;
