'use client';

import { useState } from 'react';
import type ITalentDoc from '@/db/talents/talent.d';
import {
  talentFromPrompt,
  talentPromptFields,
  talentSummary,
} from '@/db/l10n/talents';
import { useCssHandles } from '@/hooks/useCssHandles';
import { useAuth } from '@/app/context/AuthContext';
import PromptModal from '../PromptModal';
import { useTalentGrid } from './useTalentGrid';
import TalentGridHandles from './handles';
import '@/styles/components/spellGrid.scss';
import '@/styles/components/talentGrid.scss';

/**
 * O catálogo de talentos GERAIS — os que qualquer personagem pode pegar.
 *
 * Os talentos de classe não aparecem aqui: eles vêm no tópico da própria
 * classe e moram no documento dela, onde a página de classes já os mostra.
 * Quem soma as duas listas é a ficha, na hora de escolher.
 *
 * Mesma forma do grimório, e de propósito: é o mesmo objeto de tela, uma lista
 * buscável de entradas que cabem num modal.
 */
interface IProps {
  initialTalents: ITalentDoc[];
}

const TalentGrid = ({ initialTalents }: IProps) => {
  const handles = useCssHandles(TalentGridHandles);
  // Sem isto, quem só lê vê os botões de escrita e leva 403 ao clicar. A
  // guarda de verdade é a da rota; esta é a afordância.
  const { canEdit } = useAuth();
  const {
    talents,
    visible,
    categories,
    query,
    setQuery,
    category,
    setCategory,
    feedback,
    save,
    remove,
    importTopic,
  } = useTalentGrid(initialTalents);

  // `null` = fechado, `undefined` = talento novo.
  const [editing, setEditing] = useState<ITalentDoc | undefined | null>(null);
  const [importing, setImporting] = useState(false);

  return (
    <div className={handles.grimoire}>
      <header className={handles.grimoireHeader}>
        <h1 className={handles.grimoireTitle}>TALENTOS</h1>
        <p className={handles.grimoireSubtitle}>
          Talentos gerais de Terralém. Os de classe ficam no códice da classe e
          se somam a estes na hora de escolher.
        </p>
      </header>

      <div className={handles.grimoireTools}>
        <input
          className={handles.grimoireSearch}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar talento pelo nome..."
          aria-label="Buscar talento pelo nome"
        />
        <select
          className={handles.talentFilter}
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          aria-label="Filtrar por categoria"
        >
          <option value="">Todas as categorias</option>
          {categories.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
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
              NOVO TALENTO
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
        {`${visible.length} de ${talents.length} talento(s)`}
      </p>

      <ul className={handles.grimoireList}>
        {visible.length === 0 && (
          <li className={handles.grimoireEmpty}>
            Nenhum talento encontrado. Importe o tópico do fórum para começar.
          </li>
        )}
        {visible.map((talent) => (
          <li key={talent.slug}>
            <button
              type="button"
              className={handles.grimoireRow}
              onClick={() => canEdit && setEditing(talent)}
            >
              <span className={handles.talentCategory}>
                {talent.category ?? '—'}
              </span>
              <span className={handles.grimoireName}>{talent.name}</span>
              <span className={handles.grimoireMeta}>
                {talentSummary(talent)}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <PromptModal
        isOpen={editing !== null}
        onClose={() => setEditing(null)}
        title={editing ? 'Editar talento' : 'Novo talento'}
        confirmLabel={editing ? 'Salvar' : 'Adicionar'}
        fields={talentPromptFields(editing ?? undefined)}
        onDelete={editing ? () => remove(editing) : undefined}
        deleteLabel="Excluir do catálogo"
        onSubmit={(values) =>
          save(talentFromPrompt(values), editing ?? undefined)
        }
      />

      <PromptModal
        isOpen={importing}
        onClose={() => setImporting(false)}
        title="Importar talentos do fórum"
        confirmLabel="Importar"
        fields={[
          {
            name: 'url',
            label: 'Link do tópico de talentos',
            required: true,
            placeholder: 'https://isekaifantasy.forumbrasil.net/t302-talentos',
          },
        ]}
        onSubmit={(values) => importTopic(values.url)}
      />
    </div>
  );
};

export default TalentGrid;
