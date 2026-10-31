'use client';

import { useCssHandles } from '@/hooks/useCssHandles';
import { CloseIcon, PencilIcon } from '../../../Icons';
import ClassDataHandles from '../../handles';

interface IProps {
  name: string;
  onEdit: () => void;
  onRemove: () => void;
}

/** Lápis e X de um item, com o mesmo rótulo acessível em todas as seções. */
const ItemTools = ({ name, onEdit, onRemove }: IProps) => {
  const shared = useCssHandles(ClassDataHandles);
  return (
    <>
      <button
        type="button"
        className={`${shared.clsIconBtn} ${shared.clsIconBtn}--sm`}
        onClick={onEdit}
        aria-label={`Editar ${name}`}
      >
        <PencilIcon />
      </button>
      <button
        type="button"
        className={`${shared.clsIconBtn} ${shared.clsIconBtn}--sm ${shared.clsIconBtn}--danger`}
        onClick={onRemove}
        aria-label={`Excluir ${name}`}
      >
        <CloseIcon />
      </button>
    </>
  );
};

export default ItemTools;
