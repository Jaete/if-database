'use client';

import type { CatalogKind } from '@/db/classes/class.d';
import { useCssHandles } from '@/hooks/useCssHandles';
import Modal from '../../Modal';
import { HaloSwordIcon, ScrollIcon, SpellbookIcon } from '../../Icons';
import CatalogKindPickerHandles from './handles';
import '@/styles/components/catalogKindPicker.scss';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  onPick: (kind: CatalogKind) => void;
}

/** Primeiro passo de "+ Lista": o tipo decide o editor e a tela dos itens. */
const CatalogKindPicker = ({ isOpen, onClose, onPick }: IProps) => {
  const handles = useCssHandles(CatalogKindPickerHandles);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nova lista">
      <p className={handles.kindIntro}>
        Que tipo de lista esta classe precisa?
      </p>
      <div className={handles.kindGrid}>
        <button
          type="button"
          className={handles.kindCard}
          onClick={() => onPick('magias')}
        >
          <span className={handles.kindIcon}>
            <SpellbookIcon />
          </span>
          <span className={handles.kindName}>Lista de Magias</span>
          <span className={handles.kindDesc}>
            Itens vinculados a magias do grimório
          </span>
        </button>
        <button
          type="button"
          className={handles.kindCard}
          onClick={() => onPick('habilidades')}
        >
          <span className={handles.kindIcon}>
            <ScrollIcon />
          </span>
          <span className={handles.kindName}>Lista de Habilidades</span>
          <span className={handles.kindDesc}>
            Itens com nome e descrição própria
          </span>
        </button>
        <button
          type="button"
          className={handles.kindCard}
          onClick={() => onPick('relacao')}
        >
          <span className={handles.kindIcon}>
            <HaloSwordIcon />
          </span>
          <span className={handles.kindName}>Tabela de Relação</span>
          <span className={handles.kindDesc}>
            Duas entidades com relação cruzada
          </span>
        </button>
      </div>
    </Modal>
  );
};

export default CatalogKindPicker;
