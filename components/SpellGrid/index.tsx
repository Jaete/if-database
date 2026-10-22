'use client';

import { useState } from 'react';
import type ISpell from '@/db/spells/spell.d';
import {
  SPELL_FIELDS,
  grimoireSpellFields,
  grimoireSpellFromPrompt,
} from '@/db/l10n/spells';
import { useCssHandles } from '@/hooks/useCssHandles';
import { useAuth } from '@/app/context/AuthContext';
import PromptModal from '../PromptModal';
import { useSpellGrid } from './useSpellGrid';
import SpellGridHandles from './handles';
import '@/styles/components/spellGrid.scss';

/**
 * O grimório: o catálogo de magias, separado das fichas.
 *
 * Não usa o `EntityGrid` genérico de propósito. Aquele pressupõe cartão,
 * painel de dados e um formulário em aba — três peças que uma magia não tem,
 * já que ela cabe inteira num modal e a lista não é categorizada nem ordenada
 * por nada além do nome.
 */
interface IProps {
  initialSpells: ISpell[];
}

const SpellGrid = ({ initialSpells }: IProps) => {
  const handles = useCssHandles(SpellGridHandles);
  // Sem isto, quem só lê vê os botões de escrita e leva 403 ao clicar. A
  // guarda de verdade é a da rota; esta é a afordância.
  const { canEdit } = useAuth();
  const {
    spells,
    visible,
    query,
    setQuery,
    feedback,
    save,
    remove,
    importTopic,
  } = useSpellGrid(initialSpells);

  // `null` = fechado, `undefined` = magia nova.
  const [editing, setEditing] = useState<ISpell | undefined | null>(null);
  const [importing, setImporting] = useState(false);

  // Resumo de uma linha: o que estiver preenchido, para dar para reconhecer a
  // magia sem abrir.
  const summary = (spell: ISpell) =>
    SPELL_FIELDS.map((field) => spell[field.name as keyof ISpell])
      .filter((value): value is string => typeof value === 'string' && !!value)
      .join(' · ');

  return (
    <div className={handles.grimoire}>
      <header className={handles.grimoireHeader}>
        <h1 className={handles.grimoireTitle}>GRIMÓRIO</h1>
        <p className={handles.grimoireSubtitle}>
          Catálogo de magias de Terralém, compartilhado por todas as fichas.
        </p>
      </header>

      <div className={handles.grimoireTools}>
        <input
          className={handles.grimoireSearch}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar magia pelo nome..."
          aria-label="Buscar magia pelo nome"
        />
        {canEdit && (
          <div className={handles.grimoireActions}>
            <button
              type="button"
              className={handles.grimoireImport}
              onClick={() => setImporting(true)}
            >
              IMPORTAR DO FÓRUM
            </button>
            <button
              type="button"
              className={handles.grimoireButton}
              onClick={() => setEditing(undefined)}
            >
              NOVA MAGIA
            </button>
          </div>
        )}
      </div>

      {feedback && (
        <p
          className={`${handles.grimoireFeedback}${
            feedback.isError ? ` ${handles.grimoireFeedbackError}` : ''
          }`}
          role="status"
        >
          {feedback.text}
        </p>
      )}

      <p className={handles.grimoireCount}>
        {`${visible.length} de ${spells.length} magia(s)`}
      </p>

      <ul className={handles.grimoireList}>
        {visible.length === 0 && (
          <li className={handles.grimoireEmpty}>
            Nenhuma magia encontrada. Importe um tópico do fórum para começar.
          </li>
        )}
        {visible.map((spell) => (
          <li key={spell.slug}>
            <button
              type="button"
              className={handles.grimoireRow}
              onClick={() => canEdit && setEditing(spell)}
            >
              <span className={handles.grimoireCircle}>
                {spell.circle === 0 ? 'T' : spell.circle}
              </span>
              <span className={handles.grimoireName}>{spell.name}</span>
              <span className={handles.grimoireMeta}>{summary(spell)}</span>
            </button>
          </li>
        ))}
      </ul>

      <PromptModal
        isOpen={editing !== null}
        onClose={() => setEditing(null)}
        title={editing ? 'Editar magia' : 'Nova magia'}
        confirmLabel={editing ? 'Salvar' : 'Adicionar'}
        fields={grimoireSpellFields(editing ?? undefined)}
        onDelete={editing ? () => remove(editing) : undefined}
        deleteLabel="Excluir do grimório"
        onSubmit={(values) =>
          save(grimoireSpellFromPrompt(values), editing ?? undefined)
        }
      />

      <PromptModal
        isOpen={importing}
        onClose={() => setImporting(false)}
        title="Importar magias do fórum"
        confirmLabel="Importar"
        fields={[
          {
            name: 'url',
            label: 'Link do tópico',
            required: true,
            placeholder: 'https://isekaifantasy.forumbrasil.net/t241-...',
          },
          {
            name: 'circle',
            label: 'Círculo de todas as magias deste tópico',
            type: 'number',
            required: true,
            initialValue: '1',
            placeholder: '0 para truques',
          },
        ]}
        onSubmit={(values) => importTopic(values.url, Number(values.circle))}
      />
    </div>
  );
};

export default SpellGrid;
