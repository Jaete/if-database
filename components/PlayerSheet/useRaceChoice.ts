'use client';

import { useEffect, useState } from 'react';
import type {
  ICitizenAbility,
  ICitizenRaceChoice,
  IPlayerLineage,
} from '@/db/citizens/citizen.d';
import type { IRaceCatalogEntry } from '@/db/races/race.d';
import { buildLineage, raceAbility } from '@/services/raceLineage';
import { resolveRaceTraits } from '@/services/raceTraits.service';
import { loadRaceCatalog } from './catalogs';
import { useEditing } from './EditingContext';

/**
 * A raça de uma ficha ligada ao códice.
 *
 * A leitura da ficha já traz a linhagem e as habilidades resolvidas, e é só
 * isso que quem apenas lê precisa. Em edição, o seletor grava `raceId` e
 * `raceChoice` no rascunho, e a placa e a lista de habilidades têm de mostrar
 * a escolha antes do save: então, com o rascunho tocado, o mesmo cálculo que o
 * servidor faz roda aqui, sobre o catálogo (baixado só em edição).
 */
export const useRaceChoice = () => {
  const { editable, value, read, objects, isFieldDirty } = useEditing();
  const [catalog, setCatalog] = useState<IRaceCatalogEntry[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!editable || catalog) return;
    let active = true;
    loadRaceCatalog()
      .then((races) => {
        if (active) setCatalog(races);
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, [editable, catalog]);

  const raceId = String(value('raceId') ?? '');
  const choice: ICitizenRaceChoice =
    read<ICitizenRaceChoice>('raceChoice') ?? {};
  const stored = read<IPlayerLineage>('lineage');
  const dirty = isFieldDirty('raceId') || isFieldDirty('raceChoice');

  const bySlug = catalog ? new Map(catalog.map((r) => [r.slug, r])) : null;
  const race = catalog?.find((r) => r.id === raceId);

  const live =
    dirty && race && bySlug
      ? (() => {
          const traits = resolveRaceTraits(race, choice, bySlug);
          return {
            lineage: buildLineage(race, choice, bySlug, traits),
            abilities: traits.map(raceAbility),
          };
        })()
      : null;

  const lineage = live?.lineage ?? stored;
  const abilities: ICitizenAbility[] =
    live?.abilities ??
    objects<ICitizenAbility>('abilities').filter((a) => a?.source === 'race');

  return {
    /** A ficha está ligada a uma raça do códice. */
    linked: !!lineage,
    lineage,
    abilities,
    /** O texto livre de `race`, para a ficha ainda sem vínculo. */
    freeText: String(value('race') ?? ''),
    /** A escolha em vigor (rascunho incluído). */
    choice,
    catalog,
    bySlug,
    failed,
  };
};
