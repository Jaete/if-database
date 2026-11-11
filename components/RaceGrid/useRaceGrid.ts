'use client';

import { useState } from 'react';
import type { IRaceImage } from '@/db/races/race.d';

/** O que o card da listagem precisa — a projeção magra da raça. */
export interface IRaceOption {
  name: string;
  slug: string;
  unique: boolean;
  images: IRaceImage[];
  abilityScoreIncrease?: string;
  subraces: { name: string }[];
}

export type RaceFilter = 'all' | 'with' | 'without';

export const normalizeSearch = (text: string) =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/**
 * Estado da listagem: busca, filtro e a raça cuja capa forra o topo.
 *
 * A capa inicial chega da página (sorteada no servidor): sortear aqui faria
 * servidor e cliente renderizarem capas diferentes.
 */
export function useRaceGrid(races: IRaceOption[], initialCover?: string) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<RaceFilter>('all');
  const [coverSlug, setCoverSlug] = useState(initialCover);

  const needle = normalizeSearch(query.trim());
  const visible = races.filter((race) => {
    if (filter === 'with' && race.subraces.length === 0) return false;
    if (filter === 'without' && race.subraces.length > 0) return false;
    if (!needle) return true;
    return (
      normalizeSearch(race.name).includes(needle) ||
      race.subraces.some((s) => normalizeSearch(s.name).includes(needle))
    );
  });

  const cover = races.find((race) => race.slug === coverSlug && race.images[0]);

  /** Foco por hover/teclado: só raças com capa trocam o fundo. */
  const focusRace = (slug: string) => {
    if (races.some((race) => race.slug === slug && race.images[0])) {
      setCoverSlug(slug);
    }
  };

  return { query, setQuery, filter, setFilter, visible, cover, focusRace };
}
