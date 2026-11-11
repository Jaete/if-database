'use client';

import { useState } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import RaceButton from '../../RaceButton';
import RaceField from '../../RaceField';
import RaceFieldHandles from '../../RaceField/handles';
import RaceModal from '../../RaceModal';
import { clip, paragraphs } from '../fields';
import type { IRaceView } from '../types';

interface IProps {
  race: IRaceView;
  error: string | null;
  onSave: (summary: string) => Promise<boolean>;
  onClose: () => void;
}

/** O resumo do topo: texto próprio, ou vazio para usar a História. */
const SummaryEditor = ({ race, error, onSave, onClose }: IProps) => {
  const fld = useCssHandles(RaceFieldHandles);
  const [summary, setSummary] = useState(race.summary ?? '');
  const fallback = paragraphs(race.history ?? '')[0];
  const length = summary.trim().length;

  return (
    <RaceModal
      title="Resumo do topo"
      onClose={onClose}
      error={error}
      onSave={() => onSave(summary.trim())}
    >
      <RaceField
        label="Resumo"
        multiline
        rows={5}
        value={summary}
        onChange={setSummary}
        autoFocus
        pill={
          <span className={fld.racePill} aria-live="polite">
            {length} {length === 1 ? 'caractere' : 'caracteres'}
          </span>
        }
        hint={
          summary.trim()
            ? 'O topo mostra as 4 primeiras linhas; o resto abre em “Ver mais”.'
            : fallback
              ? `Vazio: usa o 1º parágrafo da História: “${clip(fallback, 120)}”`
              : 'Vazio e sem História: o topo não mostra resumo.'
        }
      />
      <div>
        <RaceButton
          variant="ghost"
          disabled={!summary}
          onClick={() => setSummary('')}
        >
          Limpar (voltar ao automático)
        </RaceButton>
      </div>
    </RaceModal>
  );
};

export default SummaryEditor;
