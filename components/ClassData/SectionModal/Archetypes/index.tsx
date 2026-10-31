'use client';

import { useRef } from 'react';
import type ICharacterClass from '@/db/classes/class.d';
import type { IClassFeature } from '@/db/classes/class.d';
import { useCssHandles } from '@/hooks/useCssHandles';
import { PlusIcon } from '../../../Icons';
import Description from '../../Description';
import ClassDataHandles from '../../handles';
import { flashTarget } from '../flashTarget';
import ItemTools from '../ItemTools';
import SectionModalHandles from '../handles';
import type { ISectionActions } from '../types';

interface IProps {
  characterClass: ICharacterClass;
  actions: ISectionActions;
}

interface ILevelGroup {
  /** 0 = habilidade sem nível. */
  level: number;
  entries: { feature: IClassFeature; index: number }[];
}

/**
 * As habilidades do arquétipo agrupadas por nível, na ordem dos níveis.
 * `index` é a posição original, que é o que edição e exclusão endereçam.
 */
function groupByLevel(features: IClassFeature[] | undefined): ILevelGroup[] {
  const groups = new Map<number, ILevelGroup>();
  (features ?? []).forEach((feature, index) => {
    const level = feature.level ?? 0;
    if (!groups.has(level)) groups.set(level, { level, entries: [] });
    groups.get(level)!.entries.push({ feature, index });
  });
  return [...groups.values()].sort((a, b) => a.level - b.level);
}

/**
 * Os arquétipos, cada um com as características que concede, e a régua ao
 * lado: um grupo por arquétipo, com as habilidades dele na ordem de nível.
 */
const Archetypes = ({ characterClass: k, actions }: IProps) => {
  const handles = useCssHandles(SectionModalHandles);
  const shared = useCssHandles(ClassDataHandles);
  const contentRef = useRef<HTMLDivElement>(null);
  const { canEdit } = actions;
  const archetypes = k.archetypes ?? [];

  const flashArchetype = (ai: number) =>
    flashTarget(
      contentRef.current,
      `[data-archetype="${ai}"]`,
      handles.clsArch
    );

  const flashFeature = (ai: number, i: number) =>
    flashTarget(
      contentRef.current,
      `[data-archetype-feature="${ai}-${i}"]`,
      handles.clsFeat
    );

  return (
    <>
      {archetypes.length > 0 && (
        <nav className={handles.clsRail} aria-label="Arquétipos e habilidades">
          <ol>
            {archetypes.map((archetype, ai) => (
              <li key={archetype.slug}>
                <button
                  type="button"
                  className={`${handles.clsRailLevel} ${handles.clsRailHead}`}
                  onClick={() => flashArchetype(ai)}
                >
                  {archetype.name}
                </button>
                {archetype.features?.map((feature, i) => (
                  <button
                    key={`${feature.name}-${i}`}
                    type="button"
                    className={handles.clsRailLink}
                    onClick={() => flashFeature(ai, i)}
                  >
                    {feature.level !== undefined && `${feature.level}º · `}
                    {feature.name}
                  </button>
                ))}
              </li>
            ))}
          </ol>
        </nav>
      )}
      <div className={handles.clsModalContent} ref={contentRef}>
        {archetypes.length === 0 && (
          <p className={handles.clsModalEmpty}>Nenhum arquétipo ainda.</p>
        )}
        {archetypes.map((archetype, ai) => (
          <article
            key={archetype.slug}
            className={handles.clsArch}
            data-archetype={ai}
          >
            <span className={handles.clsArchTag}>Arquétipo</span>
            <div className={handles.clsFeatHead}>
              <h3 className={handles.clsArchName}>{archetype.name}</h3>
              {canEdit && (
                <ItemTools
                  name={archetype.name}
                  onEdit={() => actions.edit.archetype(ai)}
                  onRemove={() =>
                    actions.ask({
                      title: `Excluir o arquétipo ${archetype.name}?`,
                      message: `O arquétipo sai da classe levando junto as ${archetype.features?.length ?? 0} características que ele concede.`,
                      confirm: () => actions.remove.archetype(ai),
                    })
                  }
                />
              )}
            </div>
            <Description text={archetype.description} />

            {groupByLevel(archetype.features).map((group) => (
              <section key={group.level} className={handles.clsLvlGroup}>
                <div className={handles.clsLvlSeal}>
                  <b>{group.level ? `${group.level}º` : '—'}</b>
                  <small>nível</small>
                </div>
                <div className={handles.clsLvlItems}>
                  {group.entries.map(({ feature, index: i }) => (
                    <article
                      key={`${feature.name}-${i}`}
                      className={handles.clsFeat}
                      data-archetype-feature={`${ai}-${i}`}
                    >
                      <div className={handles.clsFeatHead}>
                        <h4 className={handles.clsFeatName}>{feature.name}</h4>
                        {canEdit && (
                          <ItemTools
                            name={feature.name}
                            onEdit={() => actions.edit.archetypeFeature(ai, i)}
                            onRemove={() =>
                              actions.ask({
                                title: `Excluir ${feature.name}?`,
                                message: `A característica sai do arquétipo ${archetype.name}. O arquétipo em si continua na classe.`,
                                confirm: () =>
                                  actions.remove.archetypeFeature(ai, i),
                              })
                            }
                          />
                        )}
                      </div>
                      <Description
                        text={feature.description}
                        tables={feature.tables}
                      />
                    </article>
                  ))}
                </div>
              </section>
            ))}
            {canEdit && (
              <div className={handles.clsSecAdd}>
                <button
                  type="button"
                  className={shared.clsGhostBtn}
                  onClick={() => actions.edit.archetypeFeature(ai, -1)}
                >
                  <PlusIcon />
                  Característica
                </button>
              </div>
            )}
          </article>
        ))}
        {canEdit && (
          <div className={handles.clsSecAdd}>
            <button
              type="button"
              className={shared.clsGhostBtn}
              onClick={() => actions.edit.archetype(-1)}
            >
              <PlusIcon />
              Arquétipo
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Archetypes;
