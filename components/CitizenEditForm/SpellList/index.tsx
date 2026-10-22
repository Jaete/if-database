'use client';

import { useState } from 'react';
import type { IPlayerSpell } from '@/db/citizens/citizen.d';
import {
  SPELL_FIELDS,
  spellFromPrompt,
  spellPromptFields,
} from '@/db/l10n/spells';
import { useCssHandles } from '@/hooks/useCssHandles';
import { PencilIcon } from '../../Icons';
import ArrayItemWrapper from '../../ArrayItemWrapper';
import PromptModal from '../../PromptModal';
import SpellListHandles from './handles';

interface IProps {
  spells: IPlayerSpell[];
  /** Índice -1 acrescenta ao fim da lista. */
  onChange: (index: number, spell: IPlayerSpell) => void;
  onRemove: (index: number) => void;
  /** "Magia" ou "Truque": nomeia a linha sem nome e o rótulo do lápis. */
  noun: string;
  /** Títulos do modal, passados prontos por causa do gênero das palavras. */
  newTitle: string;
  editTitle: string;
  emptyLabel: string;
  addLabel: string;
}

/**
 * Lista de magias do formulário completo, editadas por modal.
 *
 * Uma magia tem onze campos; enfileirá-los no formulário afogaria o resto da
 * ficha, e editar só o nome (como era antes) apagava o resto ao salvar. O
 * modal é o mesmo do editor embutido, pelos mesmos campos.
 */
const SpellList = ({
  spells,
  onChange,
  onRemove,
  noun,
  newTitle,
  editTitle,
  emptyLabel,
  addLabel,
}: IProps) => {
  const handles = useCssHandles(SpellListHandles);
  // Índice em edição; -1 é uma magia nova, null é o modal fechado.
  const [editing, setEditing] = useState<number | null>(null);

  const current =
    editing !== null && editing >= 0 ? spells[editing] : undefined;

  // Resumo de uma linha, para a lista dizer o que já está preenchido sem
  // precisar abrir cada uma.
  const summary = (spell: IPlayerSpell) =>
    SPELL_FIELDS.map((field) => spell[field.name])
      .filter((value): value is string => !!value)
      .join(' · ');

  return (
    <>
      {spells.length === 0 && (
        <p className={handles.spellEmpty}>{emptyLabel}</p>
      )}
      {spells.map((spell, i) => (
        <ArrayItemWrapper key={i} onRemove={() => onRemove(i)}>
          <div className={handles.spellRow}>
            <div>
              <span className={handles.spellRowName}>
                {spell.name || `${noun} sem nome`}
              </span>
              {summary(spell) && (
                <span className={handles.spellRowMeta}>{summary(spell)}</span>
              )}
            </div>
            <button
              type="button"
              className={handles.spellRowEdit}
              onClick={() => setEditing(i)}
              aria-label={`Editar ${spell.name || noun}`}
            >
              <PencilIcon />
            </button>
          </div>
        </ArrayItemWrapper>
      ))}
      <button
        type="button"
        className="addButton"
        onClick={() => setEditing(-1)}
      >
        {addLabel}
      </button>

      <PromptModal
        isOpen={editing !== null}
        onClose={() => setEditing(null)}
        title={current ? editTitle : newTitle}
        confirmLabel={current ? 'Salvar' : 'Adicionar'}
        fields={spellPromptFields(current)}
        onSubmit={(values) => {
          if (editing === null) return;
          onChange(editing, spellFromPrompt(values, current));
        }}
      />
    </>
  );
};

export default SpellList;
