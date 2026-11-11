'use client';

import { useCssHandles } from '@/hooks/useCssHandles';
import { SyncIcon, TrashIcon } from '../../Icons';
import RaceButton from '../../RaceButton';
import AdminStripHandles from './handles';

interface IProps {
  sourceUrl?: string;
  onReimport: () => void;
  onDelete: () => void;
}

/** A faixa do modo admin: de onde veio a raça, reimportar e excluir. */
const AdminStrip = ({ sourceUrl, onReimport, onDelete }: IProps) => {
  const handles = useCssHandles(AdminStripHandles);

  return (
    <div className={handles.raceAdminStrip}>
      <div className={handles.raceAdminStripIn}>
        <p>
          <strong>Modo admin</strong> Cada seção salva sozinha no seu lápis.{' '}
          {sourceUrl ? (
            <>
              Importada de{' '}
              <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
                {sourceUrl.replace(/^https?:\/\//, '')}
              </a>
              .
            </>
          ) : (
            'Criada à mão, sem tópico de origem.'
          )}
        </p>
        <div className={handles.raceAdminActs}>
          {sourceUrl && (
            <RaceButton small icon={<SyncIcon />} onClick={onReimport}>
              Reimportar do fórum
            </RaceButton>
          )}
          <RaceButton
            small
            variant="danger"
            icon={<TrashIcon />}
            onClick={onDelete}
          >
            Excluir raça
          </RaceButton>
        </div>
      </div>
    </div>
  );
};

export default AdminStrip;
