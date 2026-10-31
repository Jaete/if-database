'use client';

import type { IClassCatalog } from '@/db/classes/class.d';
import { useCssHandles } from '@/hooks/useCssHandles';
import { PlusIcon } from '../../../Icons';
import Description from '../../Description';
import ClassDataHandles from '../../handles';
import ItemTools from '../ItemTools';
import SectionModalHandles from '../handles';
import type { ISectionActions } from '../types';

interface IProps {
  catalog: IClassCatalog;
  /** Posição da lista em `catalogs`, para os editores. */
  index: number;
  actions: ISectionActions;
}

/** Uma lista própria da classe (ex.: Artes Divinas), no padrão dos arquétipos. */
const Catalog = ({ catalog, index, actions }: IProps) => {
  const handles = useCssHandles(SectionModalHandles);
  const shared = useCssHandles(ClassDataHandles);
  const { canEdit } = actions;

  return (
    <article className={handles.clsArch}>
      <div className={handles.clsFeatHead}>
        <h3 className={handles.clsArchName}>{catalog.name}</h3>
        {canEdit && (
          <ItemTools
            name={catalog.name}
            onEdit={() => actions.edit.catalog(index)}
            onRemove={() =>
              actions.ask({
                title: `Excluir a lista ${catalog.name}?`,
                message: `A lista sai da classe levando junto os ${catalog.items?.length ?? 0} itens dela.`,
                confirm: () => actions.remove.catalog(index),
              })
            }
          />
        )}
      </div>
      <Description text={catalog.description} />

      {(catalog.items?.length ?? 0) > 0 && (
        <ul className={handles.clsArchFeats}>
          {catalog.items?.map((item, i) => (
            <li key={`${item.name}-${i}`}>
              <div className={handles.clsFeatHead}>
                <h4 className={handles.clsFeatName}>{item.name}</h4>
                {canEdit && (
                  <ItemTools
                    name={item.name}
                    onEdit={() => actions.edit.catalogItem(index, i)}
                    onRemove={() =>
                      actions.ask({
                        title: `Excluir ${item.name}?`,
                        message: `O item sai da lista ${catalog.name}. A lista em si continua na classe.`,
                        confirm: () => actions.remove.catalogItem(index, i),
                      })
                    }
                  />
                )}
              </div>
              <Description text={item.description} tables={item.tables} />
            </li>
          ))}
        </ul>
      )}
      {canEdit && (
        <div className={handles.clsSecAdd}>
          <button
            type="button"
            className={shared.clsGhostBtn}
            onClick={() => actions.edit.catalogItem(index, -1)}
          >
            <PlusIcon />
            Item
          </button>
        </div>
      )}
    </article>
  );
};

export default Catalog;
