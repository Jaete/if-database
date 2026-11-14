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
  if (body.skills) {
    const pb = Number(player.proficiencyBonus) || 2;
    player.proficiencies = {
      ...((player.proficiencies as object) ?? {}),
      skills: body.skills.map((name) => ({
        name,
        proficient: true,
        value: pb,
      })),
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
});

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
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const pending = useRef<IDraftBody | null>(null);
  const inFlight = useRef(false);
  const timer = useRef(0);

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
        setData(next);
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
    try {
      const next = await call<CreationPayload>(api(id, 'draft'), 'PATCH', body);
      // O que foi digitado enquanto a resposta voltava continua na tela.
      setData(pending.current ? applyBody(next, pending.current) : next);
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Não foi possível salvar.');
      // Volta ao que o servidor tem: a tela não pode mostrar o que não valeu.
      try {
        setData(await call<CreationPayload>(api(id, 'draft'), 'GET'));
      } catch {
        // Sem rede: fica o que está.
      }
    } finally {
      inFlight.current = false;
      setSaving(false);
      // O que chegou durante a resposta sai logo em seguida.
      if (pending.current) {
        timer.current = window.setTimeout(() => void flushRef.current(), 0);
      }
    }
  }, [id]);

  const flushRef = useRef(flush);
  useEffect(() => {
    flushRef.current = flush;
  });

  const patch = useCallback(
    (body: IDraftBody) => {
      setData((prev) => (prev ? applyBody(prev, body) : prev));
      pending.current = pending.current
        ? mergeBodies(pending.current, body)
        : body;
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => void flush(), 450);
    },
    [flush]
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
      close: () => {
        void flush();
        setView('sheet');
      },
      patch,
      saving,
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
      patch,
      saving,
      error,
      roll,
      transition,
      busy,
      flush,
    ]
  );
};
