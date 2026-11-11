'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { IRaceChoiceRule, IRaceTrait, ISubrace } from '@/db/races/race.d';
import type { IRaceView, TraitScope } from './types';

/**
 * Estado da página de detalhe: a raça, a sub-raça em foco e a gravação.
 *
 * Cada edição manda só os campos tocados num PUT, e o estado local acompanha
 * quando o servidor aceita.
 */
export function useRaceData(initial: IRaceView, initialSub?: string) {
  const router = useRouter();
  const [race, setRace] = useState(initial);
  const [subSlug, setSubSlug] = useState(initialSub);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  // Avisos do último import desta sessão: o banco não os guarda.
  const [warnings, setWarnings] = useState<string[]>([]);

  const sub = race.subraces.find((s) => s.slug === subSlug) ?? race.subraces[0];

  // Um aviso novo cancela o timer do anterior, e sair da página cancela o
  // último: sem isso o timer atualizaria um componente desmontado.
  const flashTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  useEffect(() => () => clearTimeout(flashTimer.current), []);

  const flash = (message: string) => {
    clearTimeout(flashTimer.current);
    setNotice(message);
    flashTimer.current = setTimeout(() => setNotice(null), 2600);
  };

  const syncUrl = (slug?: string) => {
    const query = slug ? `?sub=${encodeURIComponent(slug)}` : '';
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${query}${window.location.hash}`
    );
  };

  const selectSub = (slug: string) => {
    setSubSlug(slug);
    syncUrl(slug);
  };

  const save = async (
    patch: Partial<IRaceView>,
    message = 'Salvo.'
  ): Promise<boolean> => {
    setError(null);
    let res: Response;
    try {
      res = await fetch(`/api/races/${race.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
    } catch {
      setError('Sem conexão com o servidor. Tente de novo.');
      return false;
    }
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? 'Não consegui salvar.');
      return false;
    }
    setRace((prev) => ({ ...prev, ...patch }));
    flash(message);
    return true;
  };

  const traitsOf = (scope: TraitScope): IRaceTrait[] =>
    scope === 'race'
      ? race.traits
      : scope === 'base'
        ? (race.baseOnlyTraits ?? [])
        : (sub?.traits ?? []);

  /** Grava a lista de habilidades de um escopo inteira. */
  const saveTraits = (
    scope: TraitScope,
    traits: IRaceTrait[],
    message?: string
  ) => {
    if (scope === 'race') return save({ traits }, message);
    if (scope === 'base') return save({ baseOnlyTraits: traits }, message);
    return saveSub({ traits }, message);
  };

  /** Grava campos da sub-raça em foco. */
  const saveSub = (patch: Partial<ISubrace>, message?: string) =>
    save(
      {
        subraces: race.subraces.map((s) =>
          s.slug === sub?.slug ? { ...s, ...patch } : s
        ),
      },
      message
    );

  /** Troca a sub-raça em foco por uma versão sem o campo (campo apagado). */
  const replaceSub = (next: ISubrace, message?: string) =>
    save(
      { subraces: race.subraces.map((s) => (s.slug === next.slug ? next : s)) },
      message
    );

  const addSub = async (created: ISubrace) => {
    const ok = await save(
      { subraces: [...race.subraces, created] },
      'Sub-raça criada.'
    );
    if (ok) selectSub(created.slug);
    return ok;
  };

  const removeSub = async () => {
    if (!sub) return false;
    const ok = await save(
      { subraces: race.subraces.filter((s) => s.slug !== sub.slug) },
      'Sub-raça excluída.'
    );
    if (ok) {
      setSubSlug(undefined);
      syncUrl();
    }
    return ok;
  };

  const moveSub = (step: -1 | 1) => {
    const from = race.subraces.findIndex((s) => s.slug === sub?.slug);
    const to = from + step;
    if (from < 0 || to < 0 || to >= race.subraces.length) return;
    const subraces = [...race.subraces];
    [subraces[from], subraces[to]] = [subraces[to], subraces[from]];
    return save({ subraces }, 'Ordem salva.');
  };

  const saveRules = (choiceRules: IRaceChoiceRule[], message?: string) =>
    save({ choiceRules }, message);

  /** Relê a raça do servidor, depois de uma reimportação. */
  const reload = async (nextWarnings: string[]) => {
    let res: Response;
    try {
      res = await fetch(`/api/races/${race.slug}`);
    } catch {
      setError('Sem conexão com o servidor. Tente de novo.');
      return false;
    }
    if (!res.ok) return false;
    setRace(await res.json());
    setWarnings(nextWarnings);
    setSubSlug(undefined);
    syncUrl();
    flash('Raça reimportada do tópico.');
    return true;
  };

  const remove = async () => {
    let res: Response;
    try {
      res = await fetch(`/api/races/${race.slug}`, { method: 'DELETE' });
    } catch {
      setError('Sem conexão com o servidor. Tente de novo.');
      return false;
    }
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? 'Não consegui excluir.');
      return false;
    }
    router.push('/races');
    return true;
  };

  return {
    race,
    sub,
    error,
    setError,
    notice,
    warnings,
    selectSub,
    save,
    saveSub,
    replaceSub,
    saveTraits,
    traitsOf,
    saveRules,
    addSub,
    removeSub,
    moveSub,
    reload,
    remove,
  };
}
