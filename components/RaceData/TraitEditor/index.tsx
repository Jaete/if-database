'use client';

import { useState } from 'react';
import type { IRaceTrait } from '@/db/races/race.d';
import { useCssHandles } from '@/hooks/useCssHandles';
import { TrashIcon } from '../../Icons';
import RaceField from '../../RaceField';
import RaceFieldHandles from '../../RaceField/handles';
import RaceGhostAdd from '../../RaceGhostAdd';
import RaceIconButton from '../../RaceIconButton';
import RaceModal from '../../RaceModal';
import { NUMERALS } from '../fields';
import TraitEditorHandles from './handles';

interface IProps {
  /** `null`: habilidade nova. */
  trait: IRaceTrait | null;
  /** Onde ela vale: "comum a todas as sub-raças", "só da raça base"… */
  where: string;
  error: string | null;
  onSave: (trait: IRaceTrait) => Promise<boolean>;
  onDelete?: () => void;
  onClose: () => void;
}

/** Cria ou edita uma habilidade racial, com as opções "Escolha uma". */
const TraitEditor = ({
  trait,
  where,
  error,
  onSave,
  onDelete,
  onClose,
}: IProps) => {
  const handles = useCssHandles(TraitEditorHandles);
  const fld = useCssHandles(RaceFieldHandles);
  const [name, setName] = useState(trait?.name ?? '');
  const [description, setDescription] = useState(trait?.description ?? '');
  const [options, setOptions] = useState<IRaceTrait[]>(trait?.options ?? []);
  const [missing, setMissing] = useState(false);

  const patchOption = (index: number, patch: Partial<IRaceTrait>) =>
    setOptions((prev) =>
      prev.map((o, i) => (i === index ? { ...o, ...patch } : o))
    );

  const save = async () => {
    if (!name.trim()) {
      setMissing(true);
      return false;
    }
    const kept = options
      .map((o) => ({ name: o.name.trim(), description: o.description.trim() }))
      .filter((o) => o.name);
    return onSave({
      name: name.trim(),
      description: description.trim(),
      ...(kept.length ? { options: kept } : {}),
    });
  };

  return (
    <RaceModal
      title={trait ? 'Editar habilidade' : 'Nova habilidade'}
      wide
      onClose={onClose}
      error={error ?? (missing ? 'Dê um nome à habilidade.' : null)}
      onSave={save}
      onDelete={onDelete}
      deleteLabel="Excluir habilidade"
    >
      <p className={handles.raceTraitLead}>Habilidade {where}.</p>
      <RaceField
        label="Nome"
        value={name}
        onChange={setName}
        placeholder="Ex.: Visão no Escuro"
        autoFocus
      />
      <RaceField
        label="Descrição"
        multiline
        rows={5}
        value={description}
        onChange={setDescription}
      />
      <fieldset className={fld.raceFieldset}>
        <legend>Opções · “Escolha uma”</legend>
        <small className={fld.raceFldHint}>
          Para habilidades que mandam escolher entre variantes. Sem opções, é
          uma habilidade simples.
        </small>
        <div className={handles.raceOptList}>
          {options.map((option, k) => (
            <div key={k} className={handles.raceOptEd}>
              <div className={handles.raceOptEdHead}>
                <span>Opção {NUMERALS[k] ?? k + 1}</span>
                <RaceIconButton
                  small
                  danger
                  label={`Remover opção ${k + 1}`}
                  icon={<TrashIcon />}
                  onClick={() =>
                    setOptions((prev) => prev.filter((_, i) => i !== k))
                  }
                />
              </div>
              <RaceField
                label="Nome"
                value={option.name}
                onChange={(next) => patchOption(k, { name: next })}
              />
              <RaceField
                label="Descrição"
                multiline
                value={option.description}
                onChange={(next) => patchOption(k, { description: next })}
              />
            </div>
          ))}
          <RaceGhostAdd
            label="Opção"
            onClick={() =>
              setOptions((prev) => [...prev, { name: '', description: '' }])
            }
          />
        </div>
      </fieldset>
    </RaceModal>
  );
};

export default TraitEditor;
