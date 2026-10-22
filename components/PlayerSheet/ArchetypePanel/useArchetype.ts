'use client';

import { useEffect, useMemo, useState } from 'react';
import { featureKey } from '@/db/l10n/classes';
import { useEditing } from '../EditingContext';

/** Um arquétipo como o catálogo da classe o devolve. */
export interface IArchetypeOption {
  name: string;
  slug: string;
  description?: string;
  features: { name: string; description?: string }[];
}

/** Uma habilidade de arquétipo pronta para a linha da lista. */
export interface IArchetypeRow {
  name: string;
  description?: string;
}

const PATH = 'archetype';

/**
 * O arquétipo de uma ficha ligada a uma classe.
 *
 * A tabela da classe diz em que nível se escolhe o arquétipo e quantas
 * habilidades dele o personagem já tem; o que a ficha guarda é só a escolha.
 * Este hook junta as duas pontas e é quem a tela edita.
 *
 * As linhas são montadas a partir da lista escolhida, e não das habilidades
 * que a leitura resolveu — mesmo motivo de `useSpellsPanel`: uma habilidade
 * escolhida agora ainda não passou por uma leitura, e sem isto só apareceria
 * na ficha depois de salvar.
 */
export const useArchetype = () => {
  const { editable, value, list, objects, setField } = useEditing();
  const [catalog, setCatalog] = useState<IArchetypeOption[] | null>(null);

  const classId = String(value('classId') ?? '');
  const storedSlug = String(value(`${PATH}.slug`) ?? '');
  const storedName = String(value(`${PATH}.name`) ?? '');
  const pickLevel = Number(value(`${PATH}.pickLevel`));
  const featureSlots = Number(value(`${PATH}.featureSlots`)) || 0;
  const level = Number(value('level')) || 0;
  const chosen = list(`${PATH}.features`);

  // Só a classe que tem arquétipo na tabela traz `pickLevel`; sem ele não há
  // bloco nenhum a mostrar, e a ficha segue como antes.
  const exists = Number.isFinite(pickLevel) && pickLevel > 0;
  const unlocked = exists && level >= pickLevel;

  // Buscado só em edição: quem apenas lê a ficha já recebe as habilidades
  // escolhidas resolvidas, e não precisa do catálogo inteiro do arquétipo.
  useEffect(() => {
    if (!editable || !exists || !classId || catalog) return;
    let active = true;
    fetch(`/api/classes/archetypes?classId=${classId}`)
      .then((res) => (res.ok ? res.json() : { archetypes: [] }))
      .then((data) => {
        if (active) setCatalog(data?.archetypes ?? []);
      })
      .catch(() => {
        if (active) setCatalog([]);
      });
    return () => {
      active = false;
    };
  }, [editable, exists, classId, catalog]);

  const current = catalog?.find((option) => option.slug === storedSlug);

  /**
   * Descrição de cada habilidade, por nome dobrado.
   *
   * Vem de duas fontes de propósito: a leitura da ficha, que já resolveu as
   * escolhidas, e o catálogo, que é o que conhece a escolhida agora mesmo.
   */
  const described = useMemo(() => {
    const index = new Map<string, string | undefined>();
    for (const ability of objects<{
      name?: string;
      description?: string;
      source?: string;
    }>('abilities')) {
      if (ability?.source === 'archetype' && ability.name) {
        index.set(featureKey(ability.name), ability.description);
      }
    }
    for (const feature of current?.features ?? []) {
      if (!index.get(featureKey(feature.name))) {
        index.set(featureKey(feature.name), feature.description);
      }
    }
    return index;
  }, [objects, current]);

  const rows: IArchetypeRow[] = chosen.map((name) => ({
    name,
    description: described.get(featureKey(name)),
  }));

  const taken = useMemo(
    () => new Set(chosen.map((name) => featureKey(name))),
    [chosen]
  );

  const remaining = Math.max(0, featureSlots - chosen.length);

  /** Trocar de arquétipo zera as habilidades: elas eram do arquétipo antigo. */
  const choose = (slug: string) => {
    if (slug === storedSlug) return;
    setField(`${PATH}.slug`, slug || undefined);
    setField(`${PATH}.features`, []);
  };

  const add = (name: string) => {
    if (taken.has(featureKey(name)) || remaining <= 0) return;
    setField(`${PATH}.features`, [...chosen, name]);
  };

  const remove = (name: string) =>
    setField(
      `${PATH}.features`,
      chosen.filter((item) => featureKey(item) !== featureKey(name))
    );

  return {
    exists,
    unlocked,
    pickLevel,
    featureSlots,
    remaining,
    classId,
    slug: storedSlug,
    name: current?.name ?? storedName,
    description: current?.description,
    options: catalog,
    features: current?.features ?? [],
    rows,
    taken,
    choose,
    add,
    remove,
  };
};
