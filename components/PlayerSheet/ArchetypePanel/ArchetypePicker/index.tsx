'use client';

import { useMemo, useState } from 'react';
import { featureKey } from '@/db/l10n/classes';
import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import Modal from '@/components/Modal';
import ArchetypePickerHandles from './handles';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  /** Nome do arquétipo, para o título dizer de onde a lista saiu. */
  archetype: string;
  /** Tudo o que o arquétipo oferece — bem mais do que cabe na ficha. */
  features: readonly { name: string; description?: string }[];
  /** Nomes dobrados já escolhidos: aparecem marcados em vez de sumir. */
  taken: ReadonlySet<string>;
  /** Quantas ainda cabem no nível atual. */
  remaining: number;
  onPick: (name: string) => void;
}

/**
 * Escolhe uma habilidade entre as que o arquétipo oferece.
 *
 * É aqui que a build se monta: a Invocadora de Espectros tem 32 habilidades
 * para as cinco vagas que um necromante de nível 20 chega a ter, e o que
 * distingue dois necromantes do mesmo arquétipo é exatamente esta escolha.
 */
const ArchetypePicker = ({
  isOpen,
  onClose,
  archetype,
  features,
  taken,
  remaining,
  onPick,
}: IProps) => {
  const handles = useCssHandles(ArchetypePickerHandles);
  const [query, setQuery] = useState('');

  const close = () => {
    setQuery('');
    onClose();
  };

  const options = useMemo(() => {
    const needle = featureKey(query);
    return features.filter(
      (feature) => !needle || featureKey(feature.name).includes(needle)
    );
  }, [features, query]);

  return (
    <Modal isOpen={isOpen} onClose={close} title={`Habilidade — ${archetype}`}>
      {/* O Modal mantém o conteúdo montado quando fechado; sem esta guarda a
          busca e as opções continuariam tabuláveis por cima da ficha. */}
      {!isOpen ? null : (
        <div className={handles.sheetPicker}>
          <p className={handles.sheetPickerNote}>
            {remaining > 0
              ? `Ainda cabem ${remaining}.`
              : 'Nenhuma vaga livre: remova uma habilidade para trocar.'}
          </p>
          <input
            className={handles.sheetPickerSearch}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar pelo nome..."
            aria-label="Buscar habilidade pelo nome"
          />
          <ul className={handles.sheetPickerList}>
            {options.length === 0 && (
              <li className={handles.sheetPickerNote}>
                {features.length === 0
                  ? 'Este arquétipo não tem habilidades cadastradas no códice.'
                  : 'Nenhuma habilidade com esse nome.'}
              </li>
            )}
            {options.map((feature) => {
              const already = taken.has(featureKey(feature.name));
              return (
                <li key={feature.name}>
                  <button
                    type="button"
                    className={`${handles.sheetPickerOption} ${applyModifiers(
                      handles.sheetPickerOption,
                      'stacked'
                    )}`}
                    disabled={already || remaining <= 0}
                    onClick={() => {
                      setQuery('');
                      onPick(feature.name);
                    }}
                  >
                    <span className={handles.sheetPickerHead}>
                      <span className={handles.sheetPickerName}>
                        {feature.name}
                      </span>
                      {already && (
                        <span className={handles.sheetPickerTaken}>
                          escolhida
                        </span>
                      )}
                    </span>
                    {/* Cortada por CSS, e não no texto: um corte por número de
                        caracteres parte a palavra no meio, e some com o
                        reticências que diz que há mais para ler. */}
                    {feature.description && (
                      <span className={handles.sheetPickerDesc}>
                        {feature.description}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </Modal>
  );
};

export default ArchetypePicker;
