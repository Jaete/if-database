'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { IPublicPlayer } from '@/db/players/publicFields';
import type { IEventView } from '@/services/levelUp.service';
import type { ILevelPlan, ISealChoices } from '@/lib/levelUp';
import { xpProgress } from '@/lib/xp';
import { sheetSounds } from '@/lib/sheetSounds';
import type {
  IGrantPayload,
  IHpRollResult,
  ILevelUp,
  ISealedInfo,
  LevelView,
} from './LevelUpContext';

/**
 * O estado da subida de nível. Fica no organismo da ficha (e não em cada tela)
 * porque XP, histórico e a tela aberta atravessam o cabeçalho, a Crônica e a
 * camada por cima da ficha.
 *
 * Todas as escritas voltam com a ficha já resolvida pelo servidor, que é o que
 * vira `player`: a tela nunca monta o resultado por conta própria.
 */

const api = (playerId: string, path: string) =>
  `/api/embed/players/${playerId}/${path}`;

async function send<T>(url: string, body: unknown) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error ?? 'Não foi possível concluir.');
  return data as T;
}

export const useLevelUpState = (args: {
  player: IPublicPlayer;
  identified: boolean;
  initialHistory: IEventView[];
  onPlayer: (next: IPublicPlayer) => void;
}): ILevelUp => {
  const { player, identified, initialHistory, onPlayer } = args;
  const id = String(player._id);

  const [access, setAccess] = useState({ isStaff: false, isOwner: false });
  const [history, setHistory] = useState(initialHistory);
  const [view, setView] = useState<LevelView>('sheet');
  const [plan, setPlan] = useState<ILevelPlan | null>(null);
  const [sealedInfo, setSealedInfo] = useState<ISealedInfo | null>(null);
  const [grantPrefill, setGrantPrefill] =
    useState<ILevelUp['grantPrefill']>(null);
  const [editingLevel, setEditingLevel] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Quem a sessão do embed é, em relação a ESTA ficha (dono e/ou admin).
  useEffect(() => {
    if (!identified) return;
    let alive = true;
    fetch(api(id, 'level?view=access'))
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (alive && data) setAccess(data);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [id, identified]);

  // O dono abre a ficha com nível disponível: um sino distante, mas só depois
  // do primeiro gesto dentro dela (nada toca antes).
  const ownerReady =
    access.isOwner && Number(player.level) > 0 && view === 'sheet';
  const bell = useRef(false);
  const levelNow = Number(player.level) || 1;
  const poolNow = Number(player.experience?.current) || 0;
  const pendingNow = useMemo(
    () => xpProgress(levelNow, poolNow).pending,
    [levelNow, poolNow]
  );
  useEffect(() => {
    if (!ownerReady || pendingNow === 0 || bell.current) return;
    const ring = () => {
      if (bell.current) return;
      // Só conta como tocado se o som tocou de fato: com os eventos desligados
      // ou sem gesto liberado, o sino continua valendo para o próximo clique.
      if (sheetSounds.play('distantBell', 0.25)) bell.current = true;
    };
    document.addEventListener('pointerdown', ring);
    return () => document.removeEventListener('pointerdown', ring);
  }, [ownerReady, pendingNow]);

  const progress = useMemo(() => {
    const p = xpProgress(levelNow, poolNow);
    return {
      level: levelNow,
      earned: p.earned,
      pending: p.pending,
      pool: poolNow,
      into: p.into,
      needed: p.needed,
    };
  }, [levelNow, poolNow]);

  const absorb = useCallback(
    (data: { player?: IPublicPlayer; history?: IEventView[] }) => {
      if (data.player) onPlayer(data.player);
      if (data.history) setHistory(data.history);
    },
    [onPlayer]
  );

  const run = useCallback(
    async <T>(fn: () => Promise<T>): Promise<T | null> => {
      setBusy(true);
      setError('');
      try {
        return await fn();
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Não foi possível concluir.');
        return null;
      } finally {
        setBusy(false);
      }
    },
    []
  );

  const close = useCallback(() => {
    setView('sheet');
    setPlan(null);
    setEditingLevel(null);
    setError('');
  }, []);

  const openGrant = useCallback((prefill?: Partial<IGrantPayload>) => {
    setGrantPrefill(prefill ?? null);
    setError('');
    setView('grant');
  }, []);

  const openRite = useCallback(() => {
    setError('');
    setView('rite');
    sheetSounds.rite();
  }, []);

  const startLevel = useCallback(async () => {
    const data = await run(async () => {
      const res = await fetch(api(id, 'level?view=plan'));
      const body = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(body?.error ?? 'Não foi possível abrir a subida.');
      return body as ILevelPlan;
    });
    if (!data) return;
    setPlan(data);
    setEditingLevel(null);
    setView('level');
    sheetSounds.play('unroll');
  }, [id, run]);

  const startEdit = useCallback(
    async (level: number) => {
      const data = await run(async () => {
        const res = await fetch(api(id, `level?view=sealed&level=${level}`));
        const body = await res.json().catch(() => ({}));
        if (!res.ok)
          throw new Error(body?.error ?? 'Não foi possível abrir o nível.');
        return body as ILevelPlan;
      });
      if (!data) return;
      setPlan(data);
      setEditingLevel(level);
      setView('level');
      sheetSounds.play('unroll');
    },
    [id, run]
  );

  const grant = useCallback(
    async (payload: IGrantPayload) => {
      const data = await run(() =>
        send<{ player: IPublicPlayer; history: IEventView[] }>(api(id, 'xp'), {
          amount: payload.amount,
          reason: payload.reason,
          lines: payload.lines,
          reversalOf: payload.reversalOf,
        })
      );
      if (!data) return false;
      absorb(data);
      if (payload.amount < 0) sheetSounds.play('paperSlide');
      else {
        sheetSounds.play('coins');
        sheetSounds.play('coinSeq', 0.35);
      }
      setView('sheet');
      return true;
    },
    [id, run, absorb]
  );

  const roll = useCallback(async (): Promise<IHpRollResult | null> => {
    const data = await run(() =>
      send<IHpRollResult>(api(id, 'level'), { action: 'roll' })
    );
    if (data && plan) {
      // A rolagem já está gravada no banco: o plano passa a carregá-la.
      setPlan({ ...plan, hp: { ...plan.hp, roll: { ...data } } });
    }
    return data;
  }, [id, run, plan]);

  const seal = useCallback(
    async (choices: ISealChoices, reason?: string) => {
      if (!plan) return false;
      const level = plan.level;
      const data = await run(() =>
        send<{
          summary: string;
          hpGain: number;
          player: IPublicPlayer;
          history: IEventView[];
        }>(
          api(id, 'level'),
          editingLevel
            ? { action: 'edit', level, choices, reason }
            : { action: 'seal', choices }
        )
      );
      if (!data) return false;
      absorb(data);
      if (editingLevel) {
        sheetSounds.play('stampLight');
        close();
        return true;
      }
      sheetSounds.play('seal');
      const more = xpProgress(
        Number(data.player.level) || level,
        Number(data.player.experience?.current) || 0
      ).pending;
      if (more === 0) sheetSounds.play('fanfare', 0.65);
      else sheetSounds.play('distantBell', 0.5);
      setSealedInfo({
        level,
        got: data.summary.split(', ').filter(Boolean),
        hpGain: data.hpGain,
      });
      setView('sealed');
      return true;
    },
    [id, plan, editingLevel, run, absorb, close]
  );

  const reopen = useCallback(
    async (level: number, reason: string) => {
      const data = await run(() =>
        send<{ player: IPublicPlayer; history: IEventView[] }>(
          api(id, 'level'),
          {
            action: 'reopen',
            level,
            reason,
          }
        )
      );
      if (!data) return false;
      absorb(data);
      sheetSounds.play('stampLight');
      return true;
    },
    [id, run, absorb]
  );

  const markSeen = useCallback(
    (section: string) => {
      if (!access.isOwner) return;
      const has = (player.novelties ?? []).some((n) => n.section === section);
      if (!has) return;
      void send<{ player: IPublicPlayer }>(api(id, 'level'), {
        action: 'seen',
        section,
      })
        .then((data) => onPlayer(data.player))
        .catch(() => {});
    },
    [access.isOwner, id, onPlayer, player.novelties]
  );

  return {
    access,
    history,
    progress,
    view,
    plan,
    sealedInfo,
    busy,
    error,
    editingLevel,
    openGrant,
    grantPrefill,
    openRite,
    startLevel,
    startEdit,
    close,
    grant,
    roll,
    seal,
    reopen,
    markSeen,
    clearError: () => setError(''),
    player,
  };
};
