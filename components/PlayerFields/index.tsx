'use client';

import { useCssHandles } from '@/hooks/useCssHandles';
import FormField from '../FormField';
import { useOwnerOptions } from './usePlayerFields';
import PlayerFieldsHandles from './handles';
import '@/styles/components/playerFields.scss';

interface IProps {
  ownerUsername?: string;
  forumTopicUrl?: string;
  onOwnerChange: (username: string, forumUserId?: number) => void;
  onTopicUrlChange: (url: string) => void;
  onImport: () => void;
  isImporting: boolean;
}

const PlayerFields = ({
  ownerUsername,
  forumTopicUrl,
  onOwnerChange,
  onTopicUrlChange,
  onImport,
  isImporting,
}: IProps) => {
  const handles = useCssHandles(PlayerFieldsHandles);
  const { owners, error } = useOwnerOptions();

  return (
    <div className={handles.playerFields}>
      <div>
        <label className="label" htmlFor="player-owner">
          Jogador (dono do personagem)
        </label>
        <select
          id="player-owner"
          className={handles.playerOwnerSelect}
          value={ownerUsername ?? ''}
          onChange={(e) => {
            const username = e.target.value;
            const owner = owners.find((o) => o.username === username);
            onOwnerChange(username, owner?.forumUserId);
          }}
        >
          <option value="">— sem dono —</option>
          {owners.map((owner) => (
            <option key={owner.username} value={owner.username}>
              {owner.username}
            </option>
          ))}
        </select>
        {error && <span className={handles.playerImportHint}>{error}</span>}
      </div>

      <div className={handles.playerImportRow}>
        <FormField
          label="Ficha no fórum (URL do tópico)"
          value={forumTopicUrl ?? ''}
          onChange={(e) => onTopicUrlChange(e.target.value)}
        />
        <button
          type="button"
          className={handles.playerImportButton}
          onClick={onImport}
          disabled={isImporting || !forumTopicUrl}
        >
          {isImporting ? 'Importando...' : 'Importar ficha'}
        </button>
      </div>
      <span className={handles.playerImportHint}>
        Importar preenche o formulário com a ficha do tópico. Nada é salvo até
        você revisar e confirmar.
      </span>
    </div>
  );
};

export default PlayerFields;
