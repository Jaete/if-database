'use client';

import { useState } from 'react';
import { classFromPrompt, classPromptFields } from '@/db/l10n/classes';
import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import { useOptionalAuth } from '@/app/context/AuthContext';
import { DownloadIcon, LinkIcon, PlusIcon } from '../Icons';
import ClassCarousel from '../ClassCarousel';
import ClassData from '../ClassData';
import EmbedBackLink from '../EmbedBackLink';
import withClassEditors from '../ClassFieldEditors';
import PromptModal from '../PromptModal';
import {
  useClassGrid,
  type IClassEditTarget,
  type IClassOption,
} from './useClassGrid';
import ClassGridHandles from './handles';
import '@/styles/components/classGrid.scss';

interface IProps {
  initialClasses: IClassOption[];
  /** Onde moram as páginas das classes. O embed usa `/embed/classes`. */
  basePath?: string;
  /** Embed no fórum: sem subtítulo nem barra de ações, título e busca numa linha. */
  compact?: boolean;
  /** Esconde toda a edição, mesmo para quem pode editar. */
  readOnly?: boolean;
}

/**
 * O códice: o catálogo de classes.
 *
 * O modal edita só os campos escalares. Uma classe tem 20 níveis de progressão,
 * arquétipos e talentos — isso não cabe num modal, e vive na página de detalhe.
 * A importação do fórum é o caminho de autoria desse conteúdo.
 */
const ClassGrid = ({
  initialClasses,
  basePath = '/classes',
  compact = false,
  readOnly = false,
}: IProps) => {
  const handles = useCssHandles(ClassGridHandles);
  // O embed não tem AuthProvider: sem contexto, ninguém edita.
  const auth = useOptionalAuth();
  const canEdit = !readOnly && (auth?.canEdit ?? false);
  const {
    visible,
    isCompact,
    query,
    setQuery,
    feedback,
    busy,
    save,
    loadForEdit,
    viewing,
    openClass,
    closeClass,
    remove,
    importTopic,
    linkSpells,
    reload,
  } = useClassGrid(initialClasses);

  // `null` = fechado, `undefined` = classe nova.
  const [editing, setEditing] = useState<IClassEditTarget | undefined | null>(
    null
  );
  const [importing, setImporting] = useState(false);

  const openEditor = async (klass: IClassOption) => {
    const full = await loadForEdit(klass);
    if (full) setEditing(full);
  };

  const search = (
    <input
      className={handles.codexSearch}
      value={query}
      onChange={(event) => setQuery(event.target.value)}
      placeholder={compact ? 'Buscar classe...' : 'Buscar classe pelo nome...'}
      aria-label="Buscar classe pelo nome"
    />
  );

  return (
    <div
      className={`${handles.codex}${
        compact ? ` ${applyModifiers(handles.codex, 'compact')}` : ''
      }`}
    >
      {compact ? (
        <div className={handles.codexEmbedHead}>
          <EmbedBackLink />
          <h1 className={handles.codexTitle}>Classes</h1>
          {search}
        </div>
      ) : (
        <>
          <header className={handles.codexHeader}>
            <h1 className={handles.codexTitle}>CLASSES</h1>
            <p className={handles.codexSubtitle}>
              O que cada classe adquire a cada nível, e as magias que ela
              conjura.
            </p>
          </header>

          <div
            className={`${handles.codexTools}${
              isCompact
                ? ` ${applyModifiers(handles.codexTools, 'compact')}`
                : ''
            }`}
          >
            {search}
            {canEdit && (
              <div className={handles.codexActions}>
                {/* Só ícone: a barra acompanha a rolagem, e três rótulos em
                    caixa alta ocupariam a largura toda em tela estreita. O
                    nome de cada ação vive no `aria-label` e no `title`, que é
                    de onde sai a dica ao parar o ponteiro. */}
                <button
                  type="button"
                  className={handles.codexAction}
                  onClick={() => setImporting(true)}
                  disabled={busy}
                  aria-label="Importar classe do fórum"
                  title="Importar do fórum"
                >
                  <DownloadIcon />
                  <span className={handles.codexActionLabel}>
                    Importar do fórum
                  </span>
                </button>
                <button
                  type="button"
                  className={handles.codexAction}
                  onClick={linkSpells}
                  disabled={busy}
                  aria-label="Vincular magias às classes"
                  title="Vincular magias"
                >
                  <LinkIcon />
                  <span className={handles.codexActionLabel}>
                    Vincular magias
                  </span>
                </button>
                <button
                  type="button"
                  className={handles.codexAction}
                  onClick={() => setEditing(undefined)}
                  aria-label="Criar nova classe"
                  title="Nova classe"
                >
                  <PlusIcon />
                  <span className={handles.codexActionLabel}>Nova classe</span>
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {feedback && (
        <p
          className={`${handles.codexFeedback}${
            feedback.isError ? ` ${handles.codexFeedbackError}` : ''
          }`}
          role="status"
        >
          {feedback.text}
        </p>
      )}

      {visible.length === 0 ? (
        <p className={handles.codexEmpty}>Nenhuma classe encontrada.</p>
      ) : (
        // A chave é a busca: cada filtro remonta o trilho, que volta ao
        // primeiro resultado em foco.
        <ClassCarousel
          key={query}
          classes={visible}
          basePath={basePath}
          canEdit={canEdit}
          onEdit={openEditor}
          onOpen={openClass}
        />
      )}

      {viewing && (
        <div
          className={handles.codexOverlay}
          role="dialog"
          aria-modal="true"
          aria-label={viewing.name}
        >
          <ClassData
            // Outra classe aberta é outro estado de edição inteiro.
            key={viewing.slug}
            characterClass={viewing}
            takenBy={visible.find((c) => c.slug === viewing.slug)?.takenBy}
            basePath={basePath}
            compact={compact}
            readOnly={readOnly}
            onBack={() => {
              closeClass();
              // O que foi editado lá dentro (nome, papéis, PV) aparece no card.
              if (canEdit) reload();
            }}
          />
        </div>
      )}

      <PromptModal
        isOpen={editing !== null}
        onClose={() => setEditing(null)}
        title={editing ? 'Editar classe' : 'Nova classe'}
        confirmLabel={editing ? 'Salvar' : 'Adicionar'}
        fields={withClassEditors(classPromptFields(editing ?? undefined))}
        onDelete={editing ? () => remove(editing) : undefined}
        deleteLabel="Excluir classe"
        onSubmit={(values) =>
          save(classFromPrompt(values), editing ?? undefined)
        }
      />

      <PromptModal
        isOpen={importing}
        onClose={() => setImporting(false)}
        title="Importar classe do fórum"
        confirmLabel="Importar"
        fields={[
          {
            name: 'url',
            label: 'Link do tópico da classe',
            required: true,
            placeholder: 'https://isekaifantasy.forumbrasil.net/t245-druida',
          },
        ]}
        onSubmit={(values) => importTopic(values.url)}
      />
    </div>
  );
};

export default ClassGrid;
