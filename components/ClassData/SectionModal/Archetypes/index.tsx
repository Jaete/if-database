'use client';

import type ICharacterClass from '@/db/classes/class.d';
import { useCssHandles } from '@/hooks/useCssHandles';
import { PlusIcon } from '../../../Icons';
import Description from '../../Description';
import ClassDataHandles from '../../handles';
import ItemTools from '../ItemTools';
import SectionModalHandles from '../handles';
import type { ISectionActions } from '../types';

interface IProps {
  characterClass: ICharacterClass;
  actions: ISectionActions;
}

/** Os arquétipos, cada um com as características que concede. */
const Archetypes = ({ characterClass: k, actions }: IProps) => {
  const handles = useCssHandles(SectionModalHandles);
  const shared = useCssHandles(ClassDataHandles);
  const { canEdit } = actions;

  return (
    <>
      {(k.archetypes ?? []).length === 0 && (
        <p className={handles.clsModalEmpty}>Nenhum arquétipo ainda.</p>
      )}
      {k.archetypes?.map((archetype, ai) => (
        <article key={archetype.slug} className={handles.clsArch}>
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

          {(archetype.features?.length ?? 0) > 0 && (
            <ul className={handles.clsArchFeats}>
              {archetype.features?.map((feature, i) => (
                <li key={`${feature.name}-${i}`}>
                  <div className={handles.clsFeatHead}>
                    {feature.level !== undefined && (
                      <span className={handles.clsLvlPill}>
                        {feature.level}º
                      </span>
                    )}
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
                </li>
              ))}
            </ul>
          )}
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
    </>
  );
};

export default Archetypes;
