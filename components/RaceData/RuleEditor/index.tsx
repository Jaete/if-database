'use client';

import { useState } from 'react';
import type { IRaceChoiceRule } from '@/db/races/race.d';
import { useCssHandles } from '@/hooks/useCssHandles';
import RaceField from '../../RaceField';
import RaceFieldHandles from '../../RaceField/handles';
import RaceModal from '../../RaceModal';
import { RULE_KINDS } from '../fields';

interface IProps {
  /** `null`: regra nova. */
  rule: IRaceChoiceRule | null;
  error: string | null;
  onSave: (rule: IRaceChoiceRule) => Promise<boolean>;
  onDelete?: () => void;
  onClose: () => void;
}

/** Cria ou edita uma regra de escolha da raça mista. */
const RuleEditor = ({ rule, error, onSave, onDelete, onClose }: IProps) => {
  const fld = useCssHandles(RaceFieldHandles);
  const [kind, setKind] = useState<IRaceChoiceRule['kind']>(
    rule?.kind ?? 'hybridHeritage'
  );
  const [name, setName] = useState(rule?.name ?? '');
  const [count, setCount] = useState(String(rule?.count ?? 2));
  const [description, setDescription] = useState(rule?.description ?? '');

  const save = () =>
    onSave({
      kind,
      name: name.trim() || RULE_KINDS[kind].split(' · ')[0],
      description: description.trim(),
      ...(kind === 'hybridHeritage'
        ? { count: Math.max(1, parseInt(count, 10) || 2) }
        : {}),
    });

  return (
    <RaceModal
      title={rule ? 'Editar regra de escolha' : 'Nova regra de escolha'}
      onClose={onClose}
      error={error}
      onSave={save}
      onDelete={onDelete}
      deleteLabel="Excluir regra"
    >
      <label className={fld.raceFld}>
        <span className={fld.raceFldLabel}>Tipo</span>
        <select
          className={fld.raceInp}
          value={kind}
          onChange={(e) => setKind(e.target.value as IRaceChoiceRule['kind'])}
        >
          {Object.entries(RULE_KINDS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <small className={fld.raceFldHint}>
          Define o que o seletor da ficha pede. O texto abaixo é só o do tópico.
        </small>
      </label>
      <RaceField
        label="Nome"
        value={name}
        onChange={setName}
        placeholder="Como o tópico chama"
      />
      {kind === 'hybridHeritage' && (
        <RaceField
          label="Quantas habilidades escolher"
          type="number"
          min={1}
          max={6}
          value={count}
          onChange={setCount}
        />
      )}
      <RaceField
        label="Texto do tópico"
        multiline
        rows={5}
        value={description}
        onChange={setDescription}
      />
    </RaceModal>
  );
};

export default RuleEditor;
