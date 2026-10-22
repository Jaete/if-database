'use client';

import { useEffect, useState } from 'react';
import type { ICitizenArchetype } from '@/db/citizens/citizen.d';
import { featureKey } from '@/db/l10n/classes';
import { useCssHandles } from '@/hooks/useCssHandles';
import ArchetypeSelectHandles from './handles';

interface IArchetypeOption {
  name: string;
  slug: string;
  description?: string;
  features: { name: string; description?: string }[];
}

interface ICatalog {
  pickLevel: number | null;
  /** Níveis em que a tabela da classe abre uma vaga de habilidade. */
  featureLevels: number[];
  archetypes: IArchetypeOption[];
}

interface IProps {
  classId?: string;
  /** Nível do personagem no formulário — muda enquanto se edita. */
  level?: number;
  value?: ICitizenArchetype;
  onChange: (next: ICitizenArchetype | undefined) => void;
}

/**
 * Escolhe o arquétipo e as habilidades dele, no editor do app.
 *
 * O mesmo que a ficha embutida faz, mas aqui o formulário trabalha sobre o
 * documento CRU: não há `pickLevel` nem `featureSlots` resolvidos, então a
 * progressão vem do catálogo e a contagem é feita contra o nível que está no
 * formulário agora — que é editável na mesma tela.
 *
 * Não renderiza nada enquanto a ficha não é elegível. Um druida de nível 1
 * escolhe arquétipo no 3; mostrar o campo vazio até lá só ofereceria uma
 * decisão que a regra ainda não permite.
 */
const ArchetypeSelect = ({ classId, level, value, onChange }: IProps) => {
  const handles = useCssHandles(ArchetypeSelectHandles);
  // Guardado junto da classe que o pediu: trocar de classe no formulário
  // precisa invalidar o catálogo, e sem a chave o da classe anterior ficaria
  // valendo até a resposta nova chegar.
  const [loaded, setLoaded] = useState<{
    classId: string;
    catalog: ICatalog | null;
  } | null>(null);

  useEffect(() => {
    if (!classId) return;
    let active = true;
    fetch(`/api/classes/archetypes?classId=${classId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active) setLoaded({ classId, catalog: data });
      })
      .catch(() => {
        if (active) setLoaded({ classId, catalog: null });
      });
    return () => {
      active = false;
    };
  }, [classId]);

  const catalog = loaded && loaded.classId === classId ? loaded.catalog : null;
  const pickLevel = catalog?.pickLevel ?? null;
  const at = Number(level) || 0;
  if (!classId || pickLevel === null || at < pickLevel) return null;

  const slots = (catalog?.featureLevels ?? []).filter((l) => l <= at).length;
  const chosen = (value?.features ?? []).slice(0, slots);
  const current = catalog?.archetypes.find((a) => a.slug === value?.slug);
  const taken = new Set(chosen.map((name) => featureKey(name)));
  const remaining = Math.max(0, slots - chosen.length);

  const write = (next: ICitizenArchetype) =>
    onChange(next.slug ? next : undefined);

  return (
    <div className={handles.section}>
      <h3 className={handles.sectionTitle}>Arquétipo</h3>

      <div className={handles.fieldGroup}>
        <label className={handles.label} htmlFor="archetypeSlug">
          Arquétipo
        </label>
        <select
          id="archetypeSlug"
          className={handles.select}
          value={value?.slug ?? ''}
          // Trocar de arquétipo zera as habilidades: elas eram do outro.
          onChange={(event) =>
            write({ slug: event.target.value || undefined, features: [] })
          }
        >
          <option value="">— Nenhum —</option>
          {(catalog?.archetypes ?? []).map((option) => (
            <option key={option.slug} value={option.slug}>
              {option.name}
            </option>
          ))}
        </select>
        {catalog?.archetypes.length === 0 && (
          <p className={handles.archetypeHint}>
            Esta classe ainda não tem arquétipos cadastrados no códice.
          </p>
        )}
      </div>

      {value?.slug && (
        <div className={handles.fieldGroup}>
          <label className={handles.label} htmlFor="archetypeFeature">
            {`Habilidades do arquétipo (${chosen.length}/${slots})`}
          </label>

          {chosen.length > 0 && (
            <ul className={handles.archetypeList}>
              {chosen.map((name) => (
                <li key={name} className={handles.archetypeItem}>
                  {name}
                  <button
                    type="button"
                    className={handles.archetypeRemove}
                    onClick={() =>
                      write({
                        ...value,
                        features: chosen.filter((item) => item !== name),
                      })
                    }
                    aria-label={`Remover ${name}`}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Volta sempre ao rótulo depois de escolher: é um botão de
              adicionar com cara de select, não o estado de um campo. */}
          <select
            id="archetypeFeature"
            className={handles.select}
            value=""
            disabled={remaining <= 0}
            onChange={(event) => {
              const name = event.target.value;
              if (!name) return;
              write({ ...value, features: [...chosen, name] });
            }}
          >
            <option value="">
              {remaining > 0
                ? `+ Adicionar habilidade (cabem ${remaining})`
                : 'Nenhuma vaga livre neste nível'}
            </option>
            {(current?.features ?? [])
              .filter((feature) => !taken.has(featureKey(feature.name)))
              .map((feature) => (
                <option key={feature.name} value={feature.name}>
                  {feature.name}
                </option>
              ))}
          </select>

          <p className={handles.archetypeHint}>
            {`A classe escolhe arquétipo no nível ${pickLevel}; o nível ${at} dá ${slots} ${
              slots === 1 ? 'habilidade' : 'habilidades'
            }.`}
          </p>
        </div>
      )}
    </div>
  );
};

export default ArchetypeSelect;
