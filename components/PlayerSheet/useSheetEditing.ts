'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { IPublicPlayer } from '@/db/players/publicFields';

/**
 * Estado de edição da ficha embutida.
 *
 * Deliberadamente separado de usePlayerSheet, que é dono da geometria do cursor
 * (useLayoutEffect sobre itemRefs), do par focusSeq/focusTarget e de um
 * ResizeObserver. Um rascunho que muda a cada tecla e uma chamada de rede ali
 * dentro colocariam re-renders no meio do posicionamento do cursor ◆.
 */

const MSG_SOURCE = 'ifdb-embed';

export type EditPermission = 'unknown' | 'none' | 'granted';

type Primitive = string | number | undefined;

// Lê/escreve por caminho pontilhado ("combat.ac.value"), que é como os campos
// da ficha são endereçados na UI. O corpo enviado ao servidor é reconstruído em
// subárvores inteiras, porque é isso que a rota de escrita aceita.
function readPath(source: unknown, path: string): unknown {
  return path
    .split('.')
    .reduce<unknown>(
      (acc, key) =>
        acc && typeof acc === 'object'
          ? (acc as Record<string, unknown>)[key]
          : undefined,
      source
    );
}

function writePath(
  target: Record<string, unknown>,
  path: string,
  value: unknown
): Record<string, unknown> {
  const keys = path.split('.');
  const out = { ...target };
  let cursor = out;

  for (let i = 0; i < keys.length - 1; i += 1) {
    const key = keys[i];
    const existing = cursor[key];
    cursor[key] =
      existing && typeof existing === 'object' && !Array.isArray(existing)
        ? { ...(existing as Record<string, unknown>) }
        : {};
    cursor = cursor[key] as Record<string, unknown>;
  }

  cursor[keys[keys.length - 1]] = value;
  return out;
}

export const useSheetEditing = (
  initialPlayer: IPublicPlayer,
  forumOrigin: string
) => {
  const [player, setPlayer] = useState(initialPlayer);
  // Os dois casos sem saída — acesso direto pela URL (não há pai com quem
  // falar) e origem do fórum não configurada — são conhecidos já na primeira
  // renderização, então saem daqui em vez de um setState dentro do efeito.
  // Não há risco de divergência na hidratação: 'unknown' e 'none' renderizam o
  // mesmo DOM, porque só 'granted' mostra a afordância de edição.
  const [permission, setPermission] = useState<EditPermission>(() => {
    if (typeof window === 'undefined') return 'unknown';
    return window.parent === window || !forumOrigin ? 'none' : 'unknown';
  });
  const [isEditing, setIsEditing] = useState(false);
  // `unknown` porque o rascunho guarda desde um escalar de campo até listas de
  // objetos (perícias, testes de resistência). Os leitores abaixo é que dão o
  // tipo certo a cada tipo de editor.
  const [draft, setDraft] = useState<Record<string, unknown>>({});
  const [isSaving, setIsSaving] = useState(false);
  // `status` é informativo (vai para a linha de dicas); `error` é falha de
  // gravação e fica junto do botão de salvar, onde a ação aconteceu.
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const hostOrigin = useRef<string>('');
  const requestId = useRef<string>('');
  const asked = useRef(false);

  const isDirty = Object.keys(draft).length > 0;

  // ── Handshake ────────────────────────────────────────────

  useEffect(() => {
    // Sem pai (URL aberta direto) ou sem origem de fórum configurada, não há
    // handshake a fazer — `permission` já nasceu 'none' acima.
    if (typeof window === 'undefined') return;
    if (window.parent === window || !forumOrigin) return;

    let alive = true;
    let knockTimer = 0;
    let knocks = 0;

    // O sso.js instala o listener dele no `init()`, e o bbcodeparser só cria
    // este iframe no ready do jQuery — ou seja, não há garantia de ordem entre
    // a batida e o outro lado estar ouvindo. Repetir algumas vezes até o
    // `host:hello` chegar elimina a corrida, em vez de torcer pela ordem.
    const knock = () => {
      if (!alive || hostOrigin.current) return;
      window.parent.postMessage(
        { source: MSG_SOURCE, type: 'embed:ready' },
        '*'
      );
      knocks += 1;
      if (knocks < 5) knockTimer = window.setTimeout(knock, 400);
    };

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== forumOrigin) return;
      if (event.source !== window.parent) return;
      const data = event.data;
      if (!data || data.source !== MSG_SOURCE) return;

      if (data.type === 'host:hello') {
        hostOrigin.current = event.origin;
        // Sem usuário logado no fórum não há identidade a provar.
        if (!data.user) {
          setPermission('none');
          return;
        }
        if (asked.current) return;
        asked.current = true;
        requestId.current = crypto.randomUUID();
        window.parent.postMessage(
          {
            source: MSG_SOURCE,
            type: 'embed:verify-request',
            requestId: requestId.current,
          },
          event.origin
        );
        setStatus('Verificando identidade...');
        return;
      }

      if (data.type === 'host:verify-result') {
        // Descarta resposta cujo id não foi emitido por esta ficha.
        if (data.requestId !== requestId.current) return;
        if (!data.ok) {
          setStatus('');
          setPermission('none');
          return;
        }
        void exchangeTicket(data.ticket);
      }
    };

    const exchangeTicket = async (ticket: string) => {
      try {
        const res = await fetch('/api/auth/forum/embed-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ticket }),
        });
        if (!alive) return;
        setStatus('');
        if (!res.ok) {
          setPermission('none');
          return;
        }
        const data = await res.json();
        setPermission(data.role === 'admin' ? 'granted' : 'none');
      } catch {
        if (alive) {
          setStatus('');
          setPermission('none');
        }
      }
    };

    // Caminho comum: o cookie de sessão do embed ainda vale, e nada é escrito
    // no perfil do fórum. Só quando ele falta é que o handshake começa.
    const start = async () => {
      try {
        const res = await fetch('/api/auth/forum/embed-session');
        if (!alive) return;
        if (res.ok) {
          const data = await res.json();
          setPermission(data.role === 'admin' ? 'granted' : 'none');
          return;
        }
      } catch {
        // Sem sessão utilizável; cai no handshake abaixo.
      }
      if (!alive) return;
      window.addEventListener('message', onMessage);
      knock();
    };

    void start();

    return () => {
      alive = false;
      window.clearTimeout(knockTimer);
      window.removeEventListener('message', onMessage);
    };
  }, [forumOrigin]);

  // ── Rascunho ─────────────────────────────────────────────

  const raw = useCallback(
    (path: string): unknown =>
      path in draft ? draft[path] : readPath(player, path),
    [draft, player]
  );

  // Leitor escalar, para EditableText. Um array aqui seria erro de uso, então
  // vira undefined em vez de ser renderizado como "a,b,c".
  const value = useCallback(
    (path: string): Primitive => {
      const v = raw(path);
      return v === null || typeof v === 'object' ? undefined : (v as Primitive);
    },
    [raw]
  );

  /** Leitor de lista, para o editor de chips. Descarta entradas em branco. */
  const list = useCallback(
    (path: string): string[] => {
      const v = raw(path);
      return Array.isArray(v)
        ? v.filter((item): item is string => typeof item === 'string')
        : [];
    },
    [raw]
  );

  /** Leitor de lista de objetos — perícias e testes de resistência. */
  const objects = useCallback(
    <T>(path: string): T[] => {
      const v = raw(path);
      return Array.isArray(v) ? (v as T[]) : [];
    },
    [raw]
  );

  // Um valor volta ao estado original quando o CONTEÚDO coincide, não quando é
  // a mesma referência — os editores de lista sempre geram um array novo.
  const sameValue = (a: unknown, b: unknown) => {
    if (typeof a === 'object' || typeof b === 'object') {
      return JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
    }
    return (a ?? '') === (b ?? '') || (a === undefined && b === '');
  };

  const setField = useCallback(
    (path: string, next: unknown) => {
      setDraft((prev) => {
        const original = readPath(player, path);
        const isSame = sameValue(original, next);

        // Voltar um campo ao valor original o tira do rascunho, para o contador
        // de alterações não mentir e o save não mandar ruído.
        if (isSame) {
          if (!(path in prev)) return prev;
          const copy = { ...prev };
          delete copy[path];
          return copy;
        }
        return { ...prev, [path]: next };
      });
    },
    [player]
  );

  const cancel = useCallback(() => {
    setDraft({});
    setIsEditing(false);
    setStatus('');
    setError('');
  }, []);

  const isFieldDirty = useCallback((path: string) => path in draft, [draft]);

  const save = useCallback(async () => {
    if (!isDirty || isSaving) return;
    setIsSaving(true);
    setError('');

    // O rascunho é por caminho, mas a rota grava subárvores inteiras: monta o
    // corpo só com as raízes tocadas, cada uma completa.
    let fields: Record<string, unknown> = {};
    for (const [path, next] of Object.entries(draft)) {
      const root = path.split('.')[0];
      if (!(root in fields)) {
        fields[root] = readPath(player, root);
      }
      fields = writePath(fields, path, next);
    }

    try {
      const res = await fetch(`/api/embed/players/${player._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields, updatedAt: player.updatedAt }),
      });

      if (res.status === 403) {
        setPermission('none');
        setError('Você não tem mais permissão para editar esta ficha.');
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.error ?? 'Não foi possível salvar.');
        return;
      }

      setPlayer(await res.json());
      setDraft({});
      setError('');
      setStatus('Alterações salvas.');
    } catch {
      setError('Não foi possível salvar. Verifique a conexão.');
    } finally {
      setIsSaving(false);
    }
  }, [draft, isDirty, isSaving, player]);

  return {
    player,
    permission,
    isEditing,
    setIsEditing,
    isDirty,
    dirtyCount: Object.keys(draft).length,
    isSaving,
    status,
    error,
    value,
    list,
    objects,
    setField,
    isFieldDirty,
    save,
    cancel,
  };
};
