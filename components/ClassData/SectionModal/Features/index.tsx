'use client';

import { useEffect, useRef } from 'react';
import type ICharacterClass from '@/db/classes/class.d';
import { useCssHandles } from '@/hooks/useCssHandles';
import { PlusIcon } from '../../../Icons';
import Description from '../../Description';
import ClassDataHandles from '../../handles';
import { groupFeaturesByLevel, type IFeatureEntry } from '../../featureLookup';
import { flashTarget } from '../flashTarget';
import ItemTools from '../ItemTools';
import SectionModalHandles from '../handles';
import type { ISectionActions } from '../types';

interface IProps {
  characterClass: ICharacterClass;
  actions: ISectionActions;
  /** Característica a rolar até (com brilho rápido); `nonce` repete o pedido. */
  focus: { index: number; nonce: number } | null;
}

const levelLabel = (level: number) => (level ? `${level}º` : '—');

/**
 * As características, agrupadas por nível, com a régua de níveis ao lado.
 * Opções que a tabela liga com "ou" no mesmo nível ficam juntas numa moldura
 * "Escolha uma".
 */
const Features = ({ characterClass: k, actions, focus }: IProps) => {
  const handles = useCssHandles(SectionModalHandles);
  const shared = useCssHandles(ClassDataHandles);
  const contentRef = useRef<HTMLDivElement>(null);
  const groups = groupFeaturesByLevel(k);
  const { canEdit } = actions;

  useEffect(() => {
    if (!focus) return;
    // Espera o quadro: o modal acabou de trocar de seção e a altura final
    // da lista só existe depois do layout.
    const frame = requestAnimationFrame(() =>
      flashTarget(
        contentRef.current,
        `[data-feature="${focus.index}"]`,
        handles.clsFeat
      )
    );
    return () => cancelAnimationFrame(frame);
  }, [focus, handles.clsFeat]);

  const flash = (index: number) =>
    flashTarget(
      contentRef.current,
      `[data-feature="${index}"]`,
      handles.clsFeat
    );

  const flashLevel = (level: number) =>
    flashTarget(
      contentRef.current,
      `[data-level="${level}"]`,
      handles.clsLvlGroup
    );

  const renderFeature = ({ feature, index }: IFeatureEntry) => (
    <article key={index} className={handles.clsFeat} data-feature={index}>
      <div className={handles.clsFeatHead}>
        <h3 className={handles.clsFeatName}>{feature.name}</h3>
        {canEdit && (
          <ItemTools
            name={feature.name}
            onEdit={() => actions.edit.feature(index)}
            onRemove={() =>
              actions.ask({
                title: `Excluir ${feature.name}?`,
                message:
                  'A característica sai da classe com a descrição e as tabelas dela. A tabela de progressão continua citando o nome, porque quem concede a característica é o nível.',
                confirm: () => actions.remove.feature(index),
              })
            }
          />
        )}
      </div>
      <Description text={feature.description} tables={feature.tables} />
    </article>
  );

  return (
    <>
      {groups.length > 0 && (
        <nav className={handles.clsRail} aria-label="Características por nível">
          <ol>
            {groups.map((group) => (
              <li key={group.level}>
                <button
                  type="button"
                  className={`${handles.clsRailLevel} ${handles.clsRailHead}`}
                  onClick={() => flashLevel(group.level)}
                >
                  {group.level ? `${group.level}º nível` : 'Sem nível'}
                </button>
                {group.blocks
                  .flatMap((block) => block.entries)
                  .map(({ feature, index }) => (
                    <button
                      key={index}
                      type="button"
                      className={handles.clsRailLink}
                      onClick={() => flash(index)}
                    >
                      {feature.name}
                    </button>
                  ))}
              </li>
            ))}
          </ol>
        </nav>
      )}
      <div className={handles.clsModalContent} ref={contentRef}>
        {groups.length === 0 && (
          <p className={handles.clsModalEmpty}>Nenhuma característica ainda.</p>
        )}
        {groups.map((group) => (
          <section
            key={group.level}
            className={handles.clsLvlGroup}
            data-level={group.level}
          >
            <div className={handles.clsLvlSeal}>
              <b>{levelLabel(group.level)}</b>
              <small>nível</small>
            </div>
            <div className={handles.clsLvlItems}>
              {group.blocks.map((block) =>
                block.choice ? (
                  <div
                    key={block.entries[0].index}
                    className={handles.clsChoice}
                  >
                    <span className={handles.clsChoiceTag}>Escolha uma</span>
                    {block.entries.map((entry, i) => (
                      <div key={entry.index}>
                        {i > 0 && <div className={handles.clsChoiceOr}>ou</div>}
                        {renderFeature(entry)}
                      </div>
                    ))}
                  </div>
                ) : (
                  renderFeature(block.entries[0])
                )
              )}
            </div>
          </section>
        ))}
        {canEdit && (
          <div className={handles.clsSecAdd}>
            <button
              type="button"
              className={shared.clsGhostBtn}
              onClick={() => actions.edit.feature(-1)}
            >
              <PlusIcon />
              Característica
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Features;
