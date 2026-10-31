'use client';

import { useEffect, useState } from 'react';
import type ISpell from '@/db/spells/spell.d';

interface IPeekState {
  slug: string;
  spell: ISpell | null;
  classNames: Record<string, string> | null;
  error: boolean;
}

/**
 * Busca a magia do grimório (e os nomes das classes, para os chips) para lê-la
 * por cima da lista da classe, sem sair dela.
 *
 * O estado guarda o slug a que se refere: trocar de magia descarta o que veio
 * da anterior sem um reset dentro do efeito.
 */
export function useSpellPeek(slug: string) {
  const [state, setState] = useState<IPeekState | null>(null);

  useEffect(() => {
    let alive = true;
    Promise.all([
      fetch(`/api/spells/${encodeURIComponent(slug)}`).then((res) =>
        res.ok ? (res.json() as Promise<ISpell>) : null
      ),
      fetch('/api/classes/options')
        .then((res) => (res.ok ? res.json() : null))
        // Sem os nomes, o detalhe cai no texto do fórum.
        .catch(() => null),
    ])
      .then(([spell, options]) => {
        if (!alive) return;
        setState({
          slug,
          spell,
          classNames: options
            ? Object.fromEntries(
                (options as { _id: string; name: string }[]).map((o) => [
                  o._id,
                  o.name,
                ])
              )
            : null,
          error: !spell,
        });
      })
      .catch(() => {
        if (alive) {
          setState({ slug, spell: null, classNames: null, error: true });
        }
      });
    return () => {
      alive = false;
    };
  }, [slug]);

  const current = state?.slug === slug ? state : null;
  return {
    spell: current?.spell ?? null,
    classNames: current?.classNames ?? null,
    loading: current === null,
    error: current?.error ?? false,
  };
}
