'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { IPublicPlayer } from '@/db/players/publicFields';
import type { IDraftBody } from '@/services/creation.service';
import { sheetSounds } from '@/lib/sheetSounds';
import type {
  AttributeRoll,
  CreationPayload,
  CreationView,
  ICreation,
  WizardStep,
} from './CreationContext';

/**
 * O estado da criação. Fica no organismo da ficha (e não em cada passo) porque
 * o rascunho atravessa o assistente, a revisão e a faixa de estado da ficha.
 *
 * O rascunho vive no SERVIDOR: cada passo vira um PATCH, e a resposta (a ficha
 * refeita com os derivados) é o que a tela passa a mostrar. Entre a digitação e
 * a resposta o que o usuário mudou aparece na hora (`pending`), sem esperar.
 */

const api = (playerId: string, path = '') =>
  `/api/embed/players/${playerId}/${path}`;

const MSG_SOURCE = 'ifdb-embed';

class ApiError extends Error {
  issues?: unknown;
}

async function call<T>(
  url: string,
  method: 'GET' | 'POST' | 'PATCH',
  body?: unknown
) {
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new ApiError(data?.error ?? 'Não foi possível concluir.');
    error.issues = data?.issues;
    throw Object.assign(error, { status: res.status });
  }
  return data as T;
}

/** Aplica um corpo de rascunho sobre o que a tela já mostra (otimista). */
function applyBody(data: CreationPayload, body: IDraftBody): CreationPayload {
  const player = { ...(data.player ?? {}) } as Record<string, unknown>;
  const creation = { ...data.creation } as Record<string, unknown>;
  for (const [key, value] of Object.entries(body.fields ?? {})) {
    if (key === 'equipment') {
      player.equipment = {
        ...((player.equipment as object) ?? {}),
        ...(value as object),
      };
    } else if (key === 'playerSpellcasting') {
      player.playerSpellcasting = {
        ...((player.playerSpellcasting as object) ?? {}),
        ...(value as object),
      };
    } else {
      player[key] = value;
    }
  }
  Object.assign(creation, body.creation ?? {});
  if (body.skills) creation.classSkills = body.skills;
  if (body.grants) {
    creation.grants = {
      ...((creation.grants as object) ?? {}),
      ...body.grants,
    };
  }
  return {
    ...data,
    player: player as unknown as IPublicPlayer,
    creation: creation as CreationPayload['creation'],
  };
}

const mergeBodies = (a: IDraftBody, b: IDraftBody): IDraftBody => ({
  fields: { ...a.fields, ...b.fields },
  creation: { ...a.creation, ...b.creation },
  ...((b.skills ?? a.skills) ? { skills: b.skills ?? a.skills } : {}),
  ...(a.grants || b.grants ? { grants: { ...a.grants, ...b.grants } } : {}),
});

// ── Cópia local do que ainda não chegou ao servidor ──────────
//
// O servidor é a fonte da verdade, mas uma falha de rede, o Render acordando
// ou um F5 no meio do envio não podem levar o que a pessoa digitou. O que está
// pendente fica também no navegador e é reenviado ao voltar.

const backupKey = (id: string) => `ifdb-creation-backup:${id}`;

function readBackup(id: string): IDraftBody | null {
  try {
    const raw = window.localStorage.getItem(backupKey(id));
    return raw ? (JSON.parse(raw) as IDraftBody) : null;
  } catch {
    return null;
  }
}

function writeBackup(id: string, body: IDraftBody | null) {
  try {
    if (body) window.localStorage.setItem(backupKey(id), JSON.stringify(body));
    else window.localStorage.removeItem(backupKey(id));
  } catch {
    // Sem armazenamento (aba anônima, bloqueio): segue só com o servidor.
  }
}

/**
 * O servidor RECUSOU o conteúdo (valor inválido, estado que não aceita mais
 * escrita): aí a tela volta ao que vale. Qualquer outra falha — rede, 5xx,
 * sessão ou origem — é passageira: o que foi digitado fica e é reenviado.
 */
const isRejection = (error: unknown) => {
  const status = (error as { status?: number })?.status;
  return status === 400 || status === 409 || status === 422;
};

const RETRY_DELAYS = [2000, 5000, 10000, 20000, 30000];

export const useCreationState = (args: {
  player: IPublicPlayer;
  identified: boolean;
  access: { isStaff: boolean; isOwner: boolean };
  forumOrigin: string;
}): ICreation => {
  const { player: sheet, identified, access, forumOrigin } = args;
  const id = String(sheet._id);
  const sheetStatus = sheet.status;
  const inCreation = !!sheetStatus && sheetStatus !== 'approved';

  const [data, setData] = useState<CreationPayload | null>(null);
  const [forbidden, setForbidden] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState<CreationView>('sheet');
  const [step, setStep] = useState<WizardStep>('identidade');
  const [adjusting, setAdjusting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  // Há alterações que o servidor ainda não confirmou (falha passageira).
  const [unsaved, setUnsaved] = useState(false);

  const pending = useRef<IDraftBody | null>(null);
  const inFlight = useRef(false);
  const timer = useRef(0);
  const retries = useRef(0);

  // Sem identificação (nem sessão) o rascunho nunca carrega: é visitante.
  useEffect(() => {
    if (!inCreation) return;
    const t = window.setTimeout(() => setLoaded(true), 2500);
    return () => window.clearTimeout(t);
  }, [inCreation]);

  const flush = useCallback(async () => {
    window.clearTimeout(timer.current);
    if (inFlight.current || !pending.current) return;
    const body = pending.current;
    pending.current = null;
    inFlight.current = true;
    setSaving(true);
    let retryIn = 0;
    try {
      const next = await call<CreationPayload>(api(id, 'draft'), 'PATCH', body);
      // O que foi digitado enquanto a resposta voltava continua na tela.
      setData(pending.current ? applyBody(next, pending.current) : next);
      writeBackup(id, pending.current);
      retries.current = 0;
      setUnsaved(!!pending.current);
      setError('');
    } catch (e) {
      const message =
        e instanceof Error ? e.message : 'Não foi possível salvar.';
      if (isRejection(e)) {
        // O servidor não aceitou ESTE conteúdo: a tela volta ao que vale.
        setError(message);
        writeBackup(id, pending.current);
        setUnsaved(!!pending.current);
        try {
          const fresh = await call<CreationPayload>(api(id, 'draft'), 'GET');
          setData(pending.current ? applyBody(fresh, pending.current) : fresh);
        } catch {
          // Sem rede: fica o que está.
        }
      } else {
        // Passageira: nada se perde. O corpo volta para a fila (com o que foi
        // digitado depois por cima) e sai de novo, cada vez mais espaçado.
        pending.current = pending.current
          ? mergeBodies(body, pending.current)
          : body;
        writeBackup(id, pending.current);
        setUnsaved(true);
        setError(`Não salvo: ${message} Tentando de novo…`);
        retryIn =
          RETRY_DELAYS[Math.min(retries.current, RETRY_DELAYS.length - 1)];
        retries.current += 1;
      }
    } finally {
      inFlight.current = false;
      setSaving(false);
      // O que chegou durante a resposta sai logo em seguida; depois de uma
      // falha passageira, só depois da espera.
      if (pending.current) {
        timer.current = window.setTimeout(
          () => void flushRef.current(),
          retryIn
        );
      }
    }
  }, [id]);

  const flushRef = useRef(flush);
  useEffect(() => {
    flushRef.current = flush;
  });

  // O rascunho só carrega para quem pode vê-lo (o servidor decide).
  useEffect(() => {
    // Só quem pode editar (dona ou admin) lê o rascunho, e só até a aprovação.
    if (!identified || !inCreation || !(access.isOwner || access.isStaff)) {
      return;
    }
    let alive = true;
    call<CreationPayload>(api(id, 'draft'), 'GET')
      .then((next) => {
        if (!alive) return;
        // Volta com o que não tinha chegado ao servidor (F5, aba fechada, rede
        // caída): reaplica na tela e reenvia.
        const backup = readBackup(id);
        if (backup) {
          pending.current = pending.current
            ? mergeBodies(backup, pending.current)
            : backup;
          setData(applyBody(next, pending.current));
          setUnsaved(true);
          timer.current = window.setTimeout(() => void flushRef.current(), 0);
        } else {
          setData(next);
        }
        setForbidden(false);
        setLoaded(true);
      })
      .catch(() => {
        if (!alive) return;
        setForbidden(true);
        setLoaded(true);
      });
    return () => {
      alive = false;
    };
  }, [id, identified, inCreation, access.isOwner, access.isStaff, sheetStatus]);

  const patch = useCallback(
    (body: IDraftBody) => {
      setData((prev) => (prev ? applyBody(prev, body) : prev));
      pending.current = pending.current
        ? mergeBodies(pending.current, body)
        : body;
      writeBackup(id, pending.current);
      setUnsaved(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => void flush(), 450);
    },
    [flush, id]
  );

  // Sair da tela com o que está esperando: grava antes.
  useEffect(() => {
    const onHide = () => {
      if (!pending.current) return;
      void fetch(api(id, 'draft'), {
        method: 'PATCH',
        keepalive: true,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pending.current),
      });
      // A cópia local fica: se este envio de saída não chegar, a próxima
      // abertura reenvia (gravar o mesmo valor de novo é inofensivo).
      pending.current = null;
    };
    window.addEventListener('pagehide', onHide);
    return () => window.removeEventListener('pagehide', onHide);
  }, [id]);

  const guarded = useCallback(
    async <T>(fn: () => Promise<T>): Promise<T | null> => {
      setBusy(true);
      setError('');
      try {
        // As escolhas em espera valem antes de uma rolagem ou do envio.
        await flush();
        return await fn();
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Não foi possível concluir.');
        return null;
      } finally {
        setBusy(false);
      }
    },
    [flush]
  );

  const reload = useCallback(async () => {
    setData(await call<CreationPayload>(api(id, 'draft'), 'GET'));
  }, [id]);

  const tellForum = useCallback(() => {
    // A mesma ficha pode estar aberta no post e no modal ampliado.
    if (window.parent !== window && forumOrigin) {
      window.parent.postMessage(
        { source: MSG_SOURCE, type: 'sheet:saved', id },
        forumOrigin
      );
    }
  }, [forumOrigin, id]);

  const roll = useCallback(
    (path: 'roll-attributes' | 'roll-gil') =>
      guarded(async () => {
        const result = await call<AttributeRoll>(
          api(id, `draft/${path}`),
          'POST'
        );
        await reload();
        return result;
      }),
    [guarded, id, reload]
  );

  // Enviar, aprovar e devolver mudam o que TODOS veem: a ficha recarrega.
  const transition = useCallback(
    (path: string, body: unknown, sound: () => void) =>
      guarded(async () => {
        await call(api(id, path), 'POST', body);
        sound();
        tellForum();
        window.location.reload();
        return true;
      }),
    [guarded, id, tellForum]
  );

  const canEdit =
    inCreation && (access.isOwner || access.isStaff) && !forbidden;

  const status = data?.status ?? sheetStatus;

  return useMemo<ICreation>(
    () => ({
      status,
      isOwner: access.isOwner,
      isStaff: access.isStaff,
      canEdit,
      forbidden,
      loaded,
      data,
      player: data?.player ?? null,
      view,
      step,
      setStep,
      openRite: () => {
        sheetSounds.rite();
        setView('rite');
      },
      openWizard: (to) => {
        if (to) setStep(to);
        sheetSounds.play('unroll');
        setView('wizard');
      },
      openReview: () => setView('review'),
      adjusting,
      startAdjust: () => {
        setAdjusting(true);
        setView('sheet');
      },
      cancelAdjust: () => {
        setAdjusting(false);
        setView('review');
      },
      close: () => {
        void flush();
        setView('sheet');
      },
      patch,
      saving,
      unsaved,
      error,
      clearError: () => setError(''),
      rollAttributes: () => roll('roll-attributes'),
      rollGil: () => roll('roll-gil'),
      submit: async () =>
        !!(await transition('submit', {}, () => {
          sheetSounds.play('seal');
          sheetSounds.play('distantBell', 0.5);
        })),
      approve: async () =>
        !!(await transition('approve', {}, () => {
          sheetSounds.play('seal');
          sheetSounds.play('fanfare', 0.4);
        })),
      returnSheet: async (notes, steps) =>
        !!(await transition('return', { notes, steps }, () =>
          sheetSounds.play('crumple')
        )),
      busy,
    }),
    [
      status,
      access.isOwner,
      access.isStaff,
      canEdit,
      forbidden,
      loaded,
      data,
      view,
      step,
      adjusting,
      patch,
      saving,
      unsaved,
      error,
      roll,
      transition,
      busy,
      flush,
    ]
  );
};
