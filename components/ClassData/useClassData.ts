'use client';

import { useCallback, useState } from 'react';
import type ICharacterClass from '@/db/classes/class.d';
import type {
  IArchetype,
  IClassCatalog,
  IClassCatalogItem,
  IClassFeature,
  IClassLevel,
  ITalent,
} from '@/db/classes/class.d';
import {
  classSlug,
  featureKey,
  parseGrants,
  parseSlotCell,
} from '@/db/l10n/classes';

/**
 * O próximo nível a criar: um acima do maior que existe.
 *
 * Pelo maior, e não pelo tamanho da lista, porque uma tabela importada pela
 * metade pode ter buracos — e aí `levels.length + 1` cairia em cima de um
 * nível que já existe.
 */
export function nextLevelNumber(levels: IClassLevel[] | undefined): number {
  return (levels ?? []).reduce((max, l) => Math.max(max, l.level), 0) + 1;
}

/**
 * Edição da classe na própria página de detalhe.
 *
 * A classe não cabe num modal de uma vez — são vinte e tantos níveis,
 * características,
 * arquétipos e talentos. Então cada peça é editada onde está, e a gravação
 * manda só a subárvore tocada.
 */
export function useClassData(initial: ICharacterClass) {
  const [characterClass, setCharacterClass] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const save = useCallback(
    async (patch: Partial<ICharacterClass>) => {
      setSaving(true);
      setError(null);
      const res = await fetch(`/api/classes/${initial.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      setSaving(false);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? 'Não consegui salvar.');
        return;
      }
      setCharacterClass((prev) => ({ ...prev, ...patch }) as ICharacterClass);
    },
    [initial.slug]
  );

  /** Grava um nível da progressão, relendo os campos que são derivados. */
  const saveLevel = useCallback(
    (index: number, values: Record<string, string>, columns: string[]) => {
      const levels = [...(characterClass.levels ?? [])];
      // Índice negativo é o nível novo, na mesma convenção dos outros
      // editores desta página.
      const creating = index < 0;
      const current = creating ? undefined : levels[index];
      if (!creating && !current) return;

      const number = current?.level ?? nextLevelNumber(levels);

      const next: IClassLevel = { level: number };

      const proficiency = Number(
        values.proficiencyBonus.replace(/[^\d-]/g, '')
      );
      if (Number.isFinite(proficiency) && values.proficiencyBonus.trim()) {
        next.proficiencyBonus = proficiency;
      }
      if (values.cantripsKnown.trim()) {
        next.cantripsKnown = Number(values.cantripsKnown) || 0;
      }
      if (values.spellSlotsRaw.trim()) {
        next.spellSlotsRaw = values.spellSlotsRaw;
        // Derivado do texto, como na importação: um só lugar define a regra.
        next.spellSlots = parseSlotCell(values.spellSlotsRaw);
      }
      if (values.grants.trim()) {
        const grants = parseGrants(values.grants);
        next.grants = grants;
        next.features = grants
          .flatMap((g) => g.options.map((o) => o.name))
          .filter((name) => !/em (um|dois) atributos?/i.test(name));
        if (/em (um|dois) atributos?/i.test(values.grants)) {
          next.abilityScoreIncrease = values.grants;
        }
      }

      const extras: Record<string, string> = {};
      for (const label of columns) {
        if (values[`col:${label}`]?.trim()) {
          extras[label] = values[`col:${label}`];
        }
      }
      if (Object.keys(extras).length > 0) next.columns = extras;

      if (creating) levels.push(next);
      else levels[index] = next;
      // Ordenado sempre: um nível criado fora de ordem apareceria no fim da
      // tabela em vez do degrau dele.
      levels.sort((a, b) => a.level - b.level);
      return save({ levels });
    },
    [characterClass.levels, save]
  );

  /**
   * Tira um nível da progressão.
   *
   * Não renumera os que ficam: os níveis acima continuam com o número que
   * tinham, e a tabela mostra o buraco. Renumerar seria reescrever em silêncio
   * uma progressão inteira por causa de um clique — e o número do nível é o
   * que liga a tabela à ficha de quem já está naquele nível.
   */
  const removeLevel = useCallback(
    (index: number) => {
      const levels = [...(characterClass.levels ?? [])];
      if (!levels[index]) return;
      levels.splice(index, 1);
      return save({ levels });
    },
    [characterClass.levels, save]
  );

  /**
   * Move o candidato para a classe.
   *
   * Aceitar é mover, não converter: o candidato já tem a forma das listas
   * publicadas. O que é acrescentado é só o que ainda não existe pelo nome —
   * reimportar e aceitar duas vezes não duplica.
   */
  const applyCandidate = useCallback(() => {
    const candidate = characterClass.candidate;
    if (!candidate) return;

    const merge = <T extends { name: string }>(
      current: T[] | undefined,
      incoming: T[] | undefined
    ): T[] => {
      const have = new Set(
        (current ?? []).map((item) => featureKey(item.name))
      );
      return [
        ...(current ?? []),
        ...(incoming ?? []).filter((item) => !have.has(featureKey(item.name))),
      ];
    };

    return save({
      features: merge(characterClass.features, candidate.features),
      archetypes: merge(characterClass.archetypes, candidate.archetypes),
      talents: merge(characterClass.talents, candidate.talents),
      candidate: null,
    } as Partial<ICharacterClass>);
  }, [characterClass, save]);

  /** Joga o candidato fora. O texto cru continua em `unparsedSections`. */
  const discardCandidate = useCallback(
    () => save({ candidate: null } as Partial<ICharacterClass>),
    [save]
  );

  /** Grava os campos de cabeçalho: nome, descrição, PV, proficiências e equipamento. */
  const saveOverview = useCallback(
    (values: Record<string, string>) => {
      const proficiencies = {
        armor: values.armor || undefined,
        weapons: values.weapons || undefined,
        tools: values.tools || undefined,
        savingThrows: values.savingThrows || undefined,
        skills: values.skills || undefined,
        raw: characterClass.proficiencies?.raw,
      };
      return save({
        name: values.name,
        description: values.description || undefined,
        hitDie: values.hitDie || undefined,
        hpAtFirstLevel: values.hpAtFirstLevel || undefined,
        hpPerLevel: values.hpPerLevel || undefined,
        proficiencies,
        // Um item por linha, a mesma notação de lista usada nas descrições.
        startingEquipment: values.startingEquipment
          .split('\n')
          .map((item) => item.replace(/^[-*•]\s*/, '').trim())
          .filter(Boolean),
        aliases: values.aliases
          .split(',')
          .map((alias) => alias.trim())
          .filter(Boolean),
      } as Partial<ICharacterClass>);
    },
    [characterClass.proficiencies?.raw, save]
  );

  const saveArchetype = useCallback(
    (index: number, values: Record<string, string>) => {
      const archetypes = [...(characterClass.archetypes ?? [])];
      const current = archetypes[index];
      const next: IArchetype = {
        name: values.name,
        slug: classSlug(values.name),
        description: values.description || undefined,
        features: current?.features ?? [],
      };
      if (index < 0) archetypes.push(next);
      else archetypes[index] = next;
      return save({ archetypes });
    },
    [characterClass.archetypes, save]
  );

  const removeArchetype = useCallback(
    (index: number) => {
      const archetypes = [...(characterClass.archetypes ?? [])];
      archetypes.splice(index, 1);
      return save({ archetypes });
    },
    [characterClass.archetypes, save]
  );

  /** Grava uma característica DE arquétipo. `featureIndex` -1 acrescenta. */
  const saveArchetypeFeature = useCallback(
    (
      archetypeIndex: number,
      featureIndex: number,
      values: Record<string, string>
    ) => {
      const archetypes = [...(characterClass.archetypes ?? [])];
      const archetype = archetypes[archetypeIndex];
      if (!archetype) return;

      const features = [...(archetype.features ?? [])];
      const current = features[featureIndex];
      const next: IClassFeature = {
        name: values.name,
        level: values.level.trim() ? Number(values.level) : undefined,
        description: values.description || undefined,
        tables: current?.tables,
      };
      if (featureIndex < 0) features.push(next);
      else features[featureIndex] = next;

      archetypes[archetypeIndex] = { ...archetype, features };
      return save({ archetypes });
    },
    [characterClass.archetypes, save]
  );

  const removeArchetypeFeature = useCallback(
    (archetypeIndex: number, featureIndex: number) => {
      const archetypes = [...(characterClass.archetypes ?? [])];
      const archetype = archetypes[archetypeIndex];
      if (!archetype) return;
      const features = [...(archetype.features ?? [])];
      features.splice(featureIndex, 1);
      archetypes[archetypeIndex] = { ...archetype, features };
      return save({ archetypes });
    },
    [characterClass.archetypes, save]
  );

  const saveFeature = useCallback(
    (index: number, values: Record<string, string>) => {
      const features = [...(characterClass.features ?? [])];
      const current = features[index];
      const next: IClassFeature = {
        name: values.name,
        level: values.level.trim() ? Number(values.level) : undefined,
        description: values.description || undefined,
        // As tabelas vêm da importação e são referenciadas por marcador no
        // texto; a edição preserva as que já existem.
        tables: current?.tables,
      };
      if (index < 0) features.push(next);
      else features[index] = next;
      return save({ features });
    },
    [characterClass.features, save]
  );

  const removeFeature = useCallback(
    (index: number) => {
      const features = [...(characterClass.features ?? [])];
      features.splice(index, 1);
      return save({ features });
    },
    [characterClass.features, save]
  );

  const saveCatalog = useCallback(
    (index: number, values: Record<string, string>) => {
      const catalogs = [...(characterClass.catalogs ?? [])];
      const current = catalogs[index];
      const next: IClassCatalog = {
        name: values.name,
        slug: classSlug(values.name),
        description: values.description || undefined,
        items: current?.items ?? [],
      };
      if (index < 0) catalogs.push(next);
      else catalogs[index] = next;
      return save({ catalogs });
    },
    [characterClass.catalogs, save]
  );

  const removeCatalog = useCallback(
    (index: number) => {
      const catalogs = [...(characterClass.catalogs ?? [])];
      catalogs.splice(index, 1);
      return save({ catalogs });
    },
    [characterClass.catalogs, save]
  );

  const saveCatalogItem = useCallback(
    (
      catalogIndex: number,
      itemIndex: number,
      values: Record<string, string>
    ) => {
      const catalogs = [...(characterClass.catalogs ?? [])];
      const catalog = catalogs[catalogIndex];
      if (!catalog) return;

      const items = [...(catalog.items ?? [])];
      const current = items[itemIndex];
      const next: IClassCatalogItem = {
        name: values.name,
        description: values.description || undefined,
        tables: current?.tables,
      };
      if (itemIndex < 0) items.push(next);
      else items[itemIndex] = next;

      catalogs[catalogIndex] = { ...catalog, items };
      return save({ catalogs });
    },
    [characterClass.catalogs, save]
  );

  const removeCatalogItem = useCallback(
    (catalogIndex: number, itemIndex: number) => {
      const catalogs = [...(characterClass.catalogs ?? [])];
      const catalog = catalogs[catalogIndex];
      if (!catalog) return;
      const items = [...(catalog.items ?? [])];
      items.splice(itemIndex, 1);
      catalogs[catalogIndex] = { ...catalog, items };
      return save({ catalogs });
    },
    [characterClass.catalogs, save]
  );

  const saveTalent = useCallback(
    (index: number, values: Record<string, string>) => {
      const talents = [...(characterClass.talents ?? [])];
      const current = talents[index];
      const next: ITalent = {
        name: values.name,
        requirement: values.requirement || undefined,
        description: values.description || undefined,
        tables: current?.tables,
      };
      if (index < 0) talents.push(next);
      else talents[index] = next;
      return save({ talents });
    },
    [characterClass.talents, save]
  );

  const removeTalent = useCallback(
    (index: number) => {
      const talents = [...(characterClass.talents ?? [])];
      talents.splice(index, 1);
      return save({ talents });
    },
    [characterClass.talents, save]
  );

  return {
    characterClass,
    error,
    saving,
    saveOverview,
    saveArchetype,
    removeArchetype,
    saveArchetypeFeature,
    removeArchetypeFeature,
    saveLevel,
    removeLevel,
    applyCandidate,
    discardCandidate,
    saveFeature,
    removeFeature,
    saveCatalog,
    removeCatalog,
    saveCatalogItem,
    removeCatalogItem,
    saveTalent,
    removeTalent,
  };
}
