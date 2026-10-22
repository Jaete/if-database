'use client';

import { useState } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import { CloseIcon, EyeIcon } from '../../Icons';
import Modal from '@/components/Modal';
import ArchetypePicker from './ArchetypePicker';
import { useArchetype } from './useArchetype';
import { useEditing } from '../EditingContext';
import ArchetypePanelHandles from './handles';

/**
 * O arquétipo do personagem: a subclasse que ele escolheu e as habilidades
 * dela que foi pegando.
 *
 * Tem tela própria, e não um grupo dentro de Habilidades, porque é a única
 * parte da classe onde a ficha DECIDE em vez de receber — e porque o que ela
 * decide tem teto: a tabela da classe diz quantas habilidades cabem no nível
 * atual, e esse número precisa de um lugar onde apareça.
 *
 * A tela só existe para quem já alcançou o nível de escolha; quem a alcança é
 * o menu, em `buildMenu`.
 */
const ArchetypePanel = () => {
  const handles = useCssHandles(ArchetypePanelHandles);
  const { editable } = useEditing();
  const [picking, setPicking] = useState(false);
  const [reading, setReading] = useState<{
    name: string;
    description?: string;
  } | null>(null);
  const archetype = useArchetype();

  return (
    <div className={handles.sheetMasterList} data-listnav>
      <div
        className={handles.sheetMasterGroup}
        role="group"
        aria-label="Arquétipo"
      >
        <span className={handles.sheetCaption}>Arquétipo</span>

        {editable ? (
          <select
            className={handles.sheetArchetypeSelect}
            value={archetype.slug}
            onChange={(event) => archetype.choose(event.target.value)}
            aria-label="Arquétipo"
          >
            <option value="">Escolher arquétipo...</option>
            {(archetype.options ?? []).map((option) => (
              <option key={option.slug} value={option.slug}>
                {option.name}
              </option>
            ))}
            {/* O arquétipo já gravado precisa de uma opção enquanto o catálogo
                não chega, ou o select apareceria em branco e a primeira
                interação apagaria a escolha. */}
            {archetype.slug &&
              !(archetype.options ?? []).some(
                (option) => option.slug === archetype.slug
              ) && (
                <option value={archetype.slug}>
                  {archetype.name || archetype.slug}
                </option>
              )}
          </select>
        ) : (
          <div className={handles.sheetMasterRow}>
            <span className={handles.sheetMasterName}>
              {archetype.name || 'Nenhum arquétipo escolhido'}
            </span>
          </div>
        )}

        {archetype.description && (
          <p className={handles.sheetArchetypeNote}>{archetype.description}</p>
        )}
      </div>

      <div
        className={handles.sheetMasterGroup}
        role="group"
        aria-label="Habilidades do arquétipo"
      >
        <span className={handles.sheetCaption}>
          {`Habilidades · ${archetype.rows.length}/${archetype.featureSlots}`}
        </span>

        {archetype.rows.map((row) => (
          <div key={row.name} className={handles.sheetMasterRow}>
            <span className={handles.sheetMasterName}>{row.name}</span>
            <button
              type="button"
              className={handles.sheetMasterRead}
              data-opt
              onClick={() => setReading(row)}
              aria-label={`Ler ${row.name}`}
            >
              <EyeIcon />
            </button>
            {editable && (
              <button
                type="button"
                className={handles.sheetMasterEdit}
                onClick={() => archetype.remove(row.name)}
                aria-label={`Remover ${row.name}`}
              >
                <CloseIcon />
              </button>
            )}
          </div>
        ))}

        {archetype.rows.length === 0 && (
          <p className={handles.sheetEmpty}>
            {archetype.slug
              ? 'Nenhuma habilidade escolhida.'
              : 'Escolha um arquétipo para abrir as habilidades.'}
          </p>
        )}

        {/* Sem arquétipo escolhido não há de onde escolher habilidade. */}
        {editable && archetype.slug && (
          <button
            type="button"
            className={handles.sheetMasterAdd}
            onClick={() => setPicking(true)}
          >
            {`+ Escolher habilidade (${archetype.rows.length}/${archetype.featureSlots})`}
          </button>
        )}
      </div>

      <ArchetypePicker
        isOpen={picking}
        onClose={() => setPicking(false)}
        archetype={archetype.name}
        features={archetype.features}
        taken={archetype.taken}
        remaining={archetype.remaining}
        onPick={(name) => {
          archetype.add(name);
          setPicking(false);
        }}
      />

      <Modal
        isOpen={reading !== null}
        onClose={() => setReading(null)}
        title={reading?.name}
      >
        {reading && (
          <div className={handles.sheetReader}>
            <span className={handles.sheetReaderKicker}>
              {archetype.name || 'Arquétipo'}
            </span>
            <p className={handles.sheetReaderText}>
              {reading.description || 'Sem descrição.'}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ArchetypePanel;
