'use client';

import { useState } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import LevelUpDetail from '../../LevelUpDetail';
import LevelUpViewHandles from '../../LevelUpView/handles';
import CreationViewHandles from '../handles';
import { useStep } from '../useStep';

const FIELDS = [
  { key: 'appearance', label: 'Aparência', rows: 5 },
  { key: 'backstory', label: 'História', rows: 9 },
  {
    key: 'narrationStyle',
    label: 'Preferências de narração',
    rows: 4,
    hint: 'Como você gosta que o mestre narre as cenas do personagem.',
  },
] as const;

/** Aparência, passado e narração: tudo texto livre, tudo recomendado. */
const HistoryStep = () => {
  const lu = useCssHandles(LevelUpViewHandles);
  const handles = useCssHandles(CreationViewHandles);
  const { creation, player } = useStep();
  const [local, setLocal] = useState<Record<string, string>>({});
  const read = (key: string) =>
    local[key] ?? String((player as Record<string, unknown>)[key] ?? '');

  return (
    <div className={lu.luContent}>
      <div className={lu.luPane}>
        <div className={lu.luPaneHead}>
          <h3>História</h3>
          <p>
            Recomendado, não obrigatório: a staff pode devolver a ficha se achar
            pouco.
          </p>
        </div>
        {FIELDS.map((f) => (
          <label key={f.key} className={handles.crField}>
            <span>{f.label}</span>
            <textarea
              className={handles.crTextarea}
              rows={f.rows}
              value={read(f.key)}
              maxLength={20000}
              disabled={!creation.canEdit}
              onChange={(e) => {
                setLocal((prev) => ({ ...prev, [f.key]: e.target.value }));
                creation.patch({ fields: { [f.key]: e.target.value } });
              }}
            />
            {'hint' in f && <small className={handles.crHint}>{f.hint}</small>}
          </label>
        ))}
      </div>
      <LevelUpDetail
        kind="Recomendado"
        title="Uma ficha viva"
        body="Quem lê a ficha no fórum vê isto na Crônica. Dá para voltar e escrever depois, mesmo depois de enviar."
      />
    </div>
  );
};

export default HistoryStep;
