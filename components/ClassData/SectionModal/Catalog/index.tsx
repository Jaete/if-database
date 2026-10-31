'use client';

import { useRef, useState } from 'react';
import type { IClassCatalog } from '@/db/classes/class.d';
import { useCssHandles } from '@/hooks/useCssHandles';
import { ChevronRightIcon, PlusIcon } from '../../../Icons';
import Description from '../../Description';
import ClassDataHandles from '../../handles';
import { flashTarget } from '../flashTarget';
import ItemTools from '../ItemTools';
import SpellPeek from '../../SpellPeek';
import SectionModalHandles from '../handles';
import type { ISectionActions } from '../types';

interface IProps {
  catalog: IClassCatalog;
  /** Posição da lista em `catalogs`, para os editores. */
  index: number;
  actions: ISectionActions;
}

/**
 * Uma lista própria da classe (ex.: Artes Divinas), no padrão dos arquétipos,
 * com a régua ao lado: o nome da lista leva ao topo, e cada item ao seu texto.
 */
const Catalog = ({ catalog, index, actions }: IProps) => {
  const handles = useCssHandles(SectionModalHandles);
  const shared = useCssHandles(ClassDataHandles);
  const contentRef = useRef<HTMLDivElement>(null);
  // A magia aberta por cima da lista, e o botão que a abriu (o foco volta a
  // ele ao fechar).
  const [peek, setPeek] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  // Sem useCallback: o React Compiler já estabiliza a função.
  const closePeek = () => {
    setPeek(null);
    triggerRef.current?.focus({ preventScroll: true });
  };
  const { canEdit } = actions;
  const items = catalog.items ?? [];

  const flashTop = () =>
    flashTarget(contentRef.current, '[data-catalog]', handles.clsArch);

  const flashItem = (i: number) =>
    flashTarget(
      contentRef.current,
      `[data-catalog-item="${i}"]`,
      handles.clsCatalogItem
    );

  return (
    <>
      {items.length > 0 && (
        <nav
          className={handles.clsRail}
          aria-label={`Itens de ${catalog.name}`}
        >
          <ol>
            <li>
              <button
                type="button"
                className={`${handles.clsRailLevel} ${handles.clsRailHead}`}
                onClick={flashTop}
              >
                {catalog.name}
              </button>
              {items.map((item, i) => (
                <button
                  key={`${item.name}-${i}`}
                  type="button"
                  className={handles.clsRailLink}
                  onClick={() => flashItem(i)}
                >
                  {item.name}
                </button>
              ))}
            </li>
          </ol>
        </nav>
      )}
      <div className={handles.clsModalContent} ref={contentRef}>
        <article className={handles.clsArch} data-catalog>
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
                <li
                  key={`${item.name}-${i}`}
                  className={handles.clsCatalogItem}
                  data-catalog-item={i}
                >
                  <div className={handles.clsFeatHead}>
                    <h4 className={handles.clsFeatName}>
                      {item.spell ? (
                        <button
                          type="button"
                          className={handles.clsSpellLink}
                          aria-haspopup="dialog"
                          onClick={(event) => {
                            triggerRef.current = event.currentTarget;
                            setPeek(item.spell ?? null);
                          }}
                        >
                          {item.name}
                          <ChevronRightIcon />
                          <span className={handles.clsSrOnly}>
                            {' '}
                            (ler a magia)
                          </span>
                        </button>
                      ) : (
                        item.name
                      )}
                    </h4>
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
      </div>
      {peek && <SpellPeek slug={peek} onClose={closePeek} />}
    </>
  );
};

export default Catalog;
