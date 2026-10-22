'use client';

import { useState } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import type { IClassOption } from '../../ClassGrid/useClassGrid';
import ClassSelectHandles from './handles';

interface IProps {
  classId?: string;
  /** O nome da classe gravado na ficha. */
  value: string;
  /**
   * O personagem sendo editado. É o que permite a ele continuar vendo a
   * própria classe única na lista, que para todos os outros está escondida.
   */
  holderId?: string;
  onChange: (next: { classId?: string; class: string }) => void;
}

const FREE_TEXT = '__livre__';

/**
 * Escolhe a classe do personagem no códice.
 *
 * Grava os dois campos de uma vez: o `classId` e o nome. O nome é
 * desnormalizado de propósito — a ficha mostra só ele, e resolver a referência
 * em toda leitura pagaria o preço do padrão sem nenhum benefício.
 *
 * O modo de texto livre continua existindo para fichas antigas e para classes
 * que ainda não foram cadastradas; escolhê-lo desliga o vínculo, em vez de
 * deixá-lo apontando para uma classe que não é mais a da ficha.
 */
const ClassSelect = ({ classId, value, holderId, onChange }: IProps) => {
  const handles = useCssHandles(ClassSelectHandles);
  const [options, setOptions] = useState<IClassOption[] | null>(null);

  // O catálogo só é buscado quando o campo recebe foco: a maioria das edições
  // de ficha não encosta na classe.
  const load = () => {
    if (options) return;
    fetch(
      `/api/classes/options${holderId ? `?holder=${encodeURIComponent(holderId)}` : ''}`
    )
      .then((res) => (res.ok ? res.json() : []))
      .then(setOptions)
      .catch(() => setOptions([]));
  };

  const freeText = !classId;

  return (
    <div className={handles.fieldGroup}>
      <label className={handles.label} htmlFor="classId">
        Classe
      </label>
      <select
        id="classId"
        className={handles.select}
        value={classId ?? FREE_TEXT}
        onFocus={load}
        onChange={(event) => {
          const next = event.target.value;
          if (next === FREE_TEXT) {
            onChange({ classId: undefined, class: value });
            return;
          }
          const chosen = (options ?? []).find((o) => String(o._id) === next);
          onChange({ classId: next, class: chosen?.name ?? value });
        }}
      >
        {/* Sem o catálogo carregado só existe o nome gravado; a lista aparece
            assim que o campo recebe foco. */}
        {classId && !options && <option value={classId}>{value}</option>}
        {(options ?? []).map((option) => (
          <option key={String(option._id)} value={String(option._id)}>
            {option.name}
          </option>
        ))}
        <option value={FREE_TEXT}>— Outra (texto livre) —</option>
      </select>

      {freeText && (
        <>
          <input
            className={handles.input}
            name="class"
            value={value}
            onChange={(event) =>
              onChange({ classId: undefined, class: event.target.value })
            }
            placeholder="ex.: Druida"
          />
          <p className={handles.classSelectHint}>
            Esta ficha usa a classe em texto livre, sem vínculo com o códice.
          </p>
        </>
      )}
    </div>
  );
};

export default ClassSelect;
