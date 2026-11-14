'use client';

import { useState } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import ImageField from '../../../ImageField';
import LevelUpDetail from '../../LevelUpDetail';
import LevelUpViewHandles from '../../LevelUpView/handles';
import CreationViewHandles from '../handles';
import { useStep } from '../useStep';

const FIELDS = [
  { key: 'name', label: 'Nome do personagem', required: true },
  { key: 'subtitle', label: 'Epíteto', hint: 'A frase sob o nome.' },
  { key: 'gender', label: 'Gênero' },
  { key: 'age', label: 'Idade' },
  { key: 'height', label: 'Altura' },
] as const;

/** Nome e retrato. O resto da identidade sai da raça e da classe. */
const IdentityStep = () => {
  const lu = useCssHandles(LevelUpViewHandles);
  const handles = useCssHandles(CreationViewHandles);
  const { creation, player } = useStep();
  // Cada campo é do usuário enquanto digita: o rascunho do servidor só volta
  // depois, e sobrescrever a digitação a cada resposta faria o cursor pular.
  const [local, setLocal] = useState<Record<string, string>>({});
  const read = (key: string) =>
    local[key] ?? String((player as Record<string, unknown>)[key] ?? '');

  const write = (key: string, value: string) => {
    setLocal((prev) => ({ ...prev, [key]: value }));
    creation.patch({ fields: { [key]: value } });
  };

  return (
    <div className={lu.luContent}>
      <div className={lu.luPane}>
        <div className={lu.luPaneHead}>
          <h3>Identidade</h3>
          <p>
            Só o <b>nome</b> é obrigatório. Cada campo é salvo sozinho.
          </p>
        </div>
        {FIELDS.map((f) => (
          <label key={f.key} className={handles.crField}>
            <span>
              {f.label}
              {'required' in f && f.required ? ' *' : ''}
            </span>
            <input
              className={handles.crInput}
              value={read(f.key)}
              maxLength={120}
              disabled={!creation.canEdit}
              onChange={(e) => write(f.key, e.target.value)}
            />
            {'hint' in f && <small className={handles.crHint}>{f.hint}</small>}
          </label>
        ))}
        <div className={handles.crField}>
          <span>Retrato (recomendado)</span>
          <ImageField
            value={read('image')}
            onChange={(url) => write('image', url)}
            hint="Envie um arquivo de imagem (links externos não são aceitos)."
          />
        </div>
      </div>
      <LevelUpDetail
        kind="Identidade"
        title={read('name') || 'Sem nome ainda'}
        body="O nome define o endereço da ficha no app. A etiqueta do fórum não muda: ela usa o código da ficha."
      />
    </div>
  );
};

export default IdentityStep;
