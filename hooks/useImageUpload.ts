'use client';

import { useEffect, useRef, useState } from 'react';

const MAX_BYTES = 10 * 1024 * 1024;

/**
 * Envia um arquivo para `POST /api/images` e entrega a URL devolvida. O
 * servidor converte para WebP e reduz; aqui só barramos o óbvio antes de gastar
 * a banda. `onError` recebe a mensagem (ou null ao começar/ter sucesso) direto
 * do envio, sem depender de efeito.
 */
export const useImageUpload = (
  onUploaded: (url: string) => void,
  onError?: (message: string | null) => void
) => {
  const [uploading, setUploading] = useState(false);
  const [error, setErrorState] = useState<string | null>(null);
  // Trava síncrona: o estado só muda no próximo render, e um segundo drop ou
  // clique nesse intervalo passaria.
  const busy = useRef(false);
  // Os callbacks são chamados depois do `await`; guarda sempre os mais novos.
  const latest = useRef({ onUploaded, onError });
  useEffect(() => {
    latest.current = { onUploaded, onError };
  });

  const setError = (message: string | null) => {
    setErrorState(message);
    latest.current.onError?.(message);
  };

  const upload = async (file: File) => {
    if (busy.current) {
      setError('Aguarde: já há um envio em andamento.');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError('Escolha um arquivo de imagem.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setError('A imagem passa de 10 MB.');
      return;
    }

    busy.current = true;
    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.append('file', file);
      const response = await fetch('/api/images', { method: 'POST', body });
      const data = (await response.json().catch(() => null)) as {
        url?: string;
        error?: string;
      } | null;
      if (!response.ok || !data?.url) {
        setError(data?.error ?? 'Não foi possível enviar a imagem.');
        return;
      }
      latest.current.onUploaded(data.url);
    } catch {
      setError('Sem conexão. Tente de novo.');
    } finally {
      busy.current = false;
      setUploading(false);
    }
  };

  return { upload, uploading, error, clearError: () => setError(null) };
};
