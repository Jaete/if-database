'use client';

import { useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import { useImageUpload } from '@/hooks/useImageUpload';

/** Envio por botão e por arrastar-e-soltar para o campo de imagem. */
export const useImageField = (onChange: (next: string) => void) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const { upload, uploading, error } = useImageUpload(onChange);

  const openPicker = () => inputRef.current?.click();

  const onPick = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Zera para poder escolher o mesmo arquivo de novo depois.
    event.target.value = '';
    if (file) void upload(file);
  };

  const hasFiles = (event: DragEvent) =>
    Array.from(event.dataTransfer.types).includes('Files');

  const dropProps = {
    onDragOver: (event: DragEvent) => {
      if (!hasFiles(event)) return;
      event.preventDefault();
      setDragging(true);
    },
    onDragLeave: (event: DragEvent) => {
      // Ignora o leave que só passa para um filho do campo.
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
        setDragging(false);
      }
    },
    onDrop: (event: DragEvent) => {
      if (!hasFiles(event)) return;
      event.preventDefault();
      setDragging(false);
      const file = event.dataTransfer.files[0];
      if (file) void upload(file);
    },
  };

  return {
    inputRef,
    openPicker,
    onPick,
    dropProps,
    dragging,
    uploading,
    error,
  };
};
