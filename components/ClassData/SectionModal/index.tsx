'use client';

import type ICharacterClass from '@/db/classes/class.d';
import { useCssHandles } from '@/hooks/useCssHandles';
import Modal from '../../Modal';
import { nextLevelNumber } from '../useClassData';
import { CATALOG_PREFIX, type ISectionNode } from '../sections';
import Archetypes from './Archetypes';
import Catalog from './Catalog';
import Features from './Features';
import Progression from './Progression';
import Talents from './Talents';
import SectionModalHandles from './handles';
import type { ISectionActions } from './types';
import '@/styles/components/classSection.scss';

interface IProps {
  characterClass: ICharacterClass;
  nodes: ISectionNode[];
  /** A seção aberta; `null` é o modal fechado. */
  openId: string | null;
  actions: ISectionActions;
  onClose: () => void;
  /** Troca de seção sem fechar o modal. */
  onSwitch: (id: string) => void;
  /** Abre Características rolada até a característica. */
  onGoto: (id: string, featureIndex?: number) => void;
  focus: { index: number; nonce: number } | null;
}

/**
 * O modal das seções da classe. Um só modal para todas: o cabeçalho tem o nome
 * da classe, o título da seção e uma linha com os mesmos nós da roda, para ir
 * de uma seção a outra sem fechar.
 */
const SectionModal = ({
  characterClass: k,
  nodes,
  openId,
  actions,
  onClose,
  onSwitch,
  onGoto,
  focus,
}: IProps) => {
  const handles = useCssHandles(SectionModalHandles);
  const node = nodes.find((n) => n.id === openId);

  const extraColumns = [
    ...new Set(
      (k.levels ?? []).flatMap((level) => Object.keys(level.columns ?? {}))
    ),
  ];
  const available = new Set(nodes.map((n) => n.id));

  let body = null;
  if (openId === 'caracteristicas') {
    body = <Features characterClass={k} actions={actions} focus={focus} />;
  } else if (openId) {
    let section = null;
    if (openId === 'progressao') {
      section = (
        <Progression
          characterClass={k}
          actions={actions}
          available={available}
          onGoto={onGoto}
          extraColumns={extraColumns}
          nextLevel={nextLevelNumber(k.levels)}
        />
      );
    } else if (openId === 'arquetipos') {
      section = <Archetypes characterClass={k} actions={actions} />;
    } else if (openId === 'talentos') {
      section = <Talents characterClass={k} actions={actions} />;
    } else if (openId.startsWith(CATALOG_PREFIX)) {
      const index = (k.catalogs ?? []).findIndex(
        (catalog) => `${CATALOG_PREFIX}${catalog.slug}` === openId
      );
      const catalog = k.catalogs?.[index];
      if (catalog) {
        section = <Catalog catalog={catalog} index={index} actions={actions} />;
      }
    }
    body = <div className={handles.clsModalContent}>{section}</div>;
  }

  return (
    <Modal
      isOpen={openId !== null}
      onClose={onClose}
      title={node?.label ?? ''}
      eyebrow={k.name}
      variant="sheet"
      className={handles.clsModalShell}
      headerExtra={
        <nav className={handles.clsSwitch} aria-label="Trocar de seção">
          {nodes.map((n) => {
            const Icon = n.icon;
            return (
              <button
                key={n.id}
                type="button"
                className={handles.clsSwitchBtn}
                aria-current={n.id === openId}
                onClick={() => onSwitch(n.id)}
              >
                <Icon />
                {n.label}
                <small className={handles.clsSwitchCount}>{n.count}</small>
              </button>
            );
          })}
        </nav>
      }
    >
      <div className={handles.clsModalBody}>{body}</div>
    </Modal>
  );
};

export default SectionModal;
