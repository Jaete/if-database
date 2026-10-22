'use client';

import { useCssHandles } from '@/hooks/useCssHandles';
import SaveBarHandles from './handles';

interface IProps {
  visible: boolean;
  count: number;
  isSaving: boolean;
  error?: string;
  onSave: () => void;
  onDiscard: () => void;
}

const SaveBar = ({
  visible,
  count,
  isSaving,
  error,
  onSave,
  onDiscard,
}: IProps) => {
  const handles = useCssHandles(SaveBarHandles);

  if (!visible) return null;

  return (
    <div className={handles.sheetSaveBar} role="region" aria-label="Alterações">
      <span className={handles.sheetSaveBarCount}>
        {count === 1 ? '1 campo alterado' : `${count} campos alterados`}
      </span>
      {error && <span className={handles.sheetSaveBarError}>{error}</span>}
      <div className={handles.sheetSaveBarActions}>
        <button
          type="button"
          className={handles.sheetSaveBarDiscard}
          onClick={onDiscard}
          disabled={isSaving}
        >
          Descartar
        </button>
        <button
          type="button"
          className={handles.sheetSaveBarSave}
          onClick={onSave}
          disabled={isSaving}
        >
          {isSaving ? 'Salvando...' : 'Salvar alterações'}
        </button>
      </div>
    </div>
  );
};

export default SaveBar;
