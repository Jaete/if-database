'use client';

import { useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import type ISpell from '@/db/spells/spell.d';
import {
  circleLabel,
  circleTitle,
  grimoireSpellFields,
  grimoireSpellFromPrompt,
} from '@/db/l10n/spells';
import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import { useOptionalAuth } from '@/app/context/AuthContext';
import { DownloadIcon, PlusIcon, SearchIcon } from '../Icons';
import EmbedBackLink from '../EmbedBackLink';
import ImageField from '../ImageField';
import PromptModal from '../PromptModal';
import SpellDetail from '../SpellDetail';
import SpellRow from '../SpellRow';
import { useSpellGrid } from './useSpellGrid';
import SpellGridHandles from './handles';
import '@/styles/components/spellGrid.scss';

/**
 * O grimório: o catálogo de magias, separado das fichas.
 *
 * Não usa o `EntityGrid` genérico de propósito. Aquele pressupõe cartão,
 * painel de dados e um formulário em aba — três peças que uma magia não tem.
 * Aqui a lista é agrupada por círculo, e o clique abre o detalhe para todos;
 * a edição fica atrás do "Editar" do detalhe.
 */
interface IProps {
  initialSpells: ISpell[];
  /** Embed no fórum: título e busca numa linha, sem subtítulo nem ações. */
  compact?: boolean;
  /** Esconde toda a edição, mesmo para quem pode editar. */
  readOnly?: boolean;
}

const countLabel = (count: number) =>
  `${count} ${count === 1 ? 'magia' : 'magias'}`;

const SpellGrid = ({
  initialSpells,
  compact = false,
  readOnly = false,
}: IProps) => {
  const handles = useCssHandles(SpellGridHandles);
  // O embed não tem AuthProvider: sem contexto, ninguém edita. A guarda de
  // verdade é a da rota; esta é a afordância.
  const auth = useOptionalAuth();
  const canEdit = !readOnly && (auth?.canEdit ?? false);
  const {
    spells,
    visible,
    groups,
    query,
    setQuery,
    activeCircle,
    jumpToCircle,
    viewing,
    currentSlug,
    classNames,
    openSpell,
    closeSpell,
    feedback,
    save,
    remove,
    importTopic,
  } = useSpellGrid(initialSpells);

  // `null` = fechado, `undefined` = magia nova.
  const [editing, setEditing] = useState<ISpell | undefined | null>(null);
  const [importing, setImporting] = useState(false);
  const groupsRef = useRef<HTMLDivElement>(null);

  // ↑/↓ andam entre as linhas, sem sair do grupo de teclado da lista.
  const onListKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    const rows = Array.from(
      groupsRef.current?.querySelectorAll<HTMLElement>('[data-slug]') ?? []
    );
    const index = rows.indexOf(document.activeElement as HTMLElement);
    if (index < 0) return;
    event.preventDefault();
    const next = index + (event.key === 'ArrowDown' ? 1 : -1);
    rows[Math.max(0, Math.min(rows.length - 1, next))].focus();
  };

  const search = (
    <span className={handles.spellbookSearchWrap}>
      <SearchIcon className={handles.spellbookSearchIcon} />
      <input
        className={handles.spellbookSearch}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={compact ? 'Buscar magia...' : 'Buscar magia pelo nome...'}
        aria-label="Buscar magia pelo nome"
      />
    </span>
  );

  const count = (
    <p className={handles.spellbookCount}>
      {query
        ? `${visible.length} de ${spells.length} magias`
        : countLabel(spells.length)}
    </p>
  );

  const newSpell = canEdit && (
    <div className={handles.spellbookActions}>
      <button
        type="button"
        className={`${handles.spellbookButton} ${handles.spellbookImport}`}
        onClick={() => setImporting(true)}
      >
        <DownloadIcon />
        Importar do fórum
      </button>
      <button
        type="button"
        className={handles.spellbookButton}
        onClick={() => setEditing(undefined)}
      >
        <PlusIcon />
        Nova magia
      </button>
    </div>
  );

  return (
    <div
      className={`${handles.spellbook}${
        compact ? ` ${applyModifiers(handles.spellbook, 'compact')}` : ''
      }`}
    >
      <div className={handles.spellbookInner}>
        {compact ? (
          <div className={handles.spellbookEmbedHead}>
            <EmbedBackLink />
            <h1 className={handles.spellbookTitle}>Grimório</h1>
            {search}
            {count}
          </div>
        ) : (
          <>
            <header className={handles.spellbookHeader}>
              <h1 className={handles.spellbookTitle}>GRIMÓRIO</h1>
              <p className={handles.spellbookSubtitle}>
                Catálogo de magias de Terralém, compartilhado por todas as
                fichas.
              </p>
            </header>
            <div className={handles.spellbookTools}>
              {search}
              {newSpell}
            </div>
            {count}
          </>
        )}

        {feedback && (
          <p
            className={`${handles.spellbookFeedback}${
              feedback.isError ? ` ${handles.spellbookFeedbackError}` : ''
            }`}
            role="status"
          >
            {feedback.text}
          </p>
        )}

        <div className={handles.spellbookBody}>
          <nav
            className={handles.spellbookIndex}
            aria-label="Ir para o círculo"
          >
            {Array.from({ length: 10 }, (_, circle) => (
              <button
                key={circle}
                type="button"
                className={handles.spellbookIndexItem}
                disabled={!groups.some((group) => group.circle === circle)}
                aria-current={circle === activeCircle || undefined}
                aria-label={circleTitle(circle)}
                title={circleTitle(circle)}
                onClick={() => jumpToCircle(circle)}
              >
                {circleLabel(circle)}
              </button>
            ))}
          </nav>

          <div
            ref={groupsRef}
            className={handles.spellbookGroups}
            onKeyDown={onListKeyDown}
          >
            {groups.length === 0 && (
              <p className={handles.spellbookEmpty}>
                {spells.length === 0 && canEdit
                  ? 'Nenhuma magia encontrada. Importe um tópico do fórum para começar.'
                  : 'Nenhuma magia encontrada.'}
              </p>
            )}
            {groups.map((group) => (
              <section
                key={group.circle}
                id={`spellbook-group-${group.circle}`}
                className={handles.spellbookGroup}
                aria-labelledby={`spellbook-group-title-${group.circle}`}
              >
                <div className={handles.spellbookGroupHead}>
                  <h2
                    id={`spellbook-group-title-${group.circle}`}
                    className={handles.spellbookGroupTitle}
                  >
                    {circleTitle(group.circle)}
                  </h2>
                  <span className={handles.spellbookGroupRule} />
                  <span className={handles.spellbookGroupCount}>
                    {countLabel(group.spells.length)}
                  </span>
                </div>
                <ul className={handles.spellbookList}>
                  {group.spells.map((spell) => (
                    <li key={spell.slug}>
                      <SpellRow
                        spell={spell}
                        isCurrent={spell.slug === currentSlug}
                        onOpen={openSpell}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </div>

      {viewing && (
        <SpellDetail
          // Outra magia aberta é outro estado inteiro (foco, rolagem).
          key={viewing.slug}
          spell={viewing}
          classNames={classNames}
          canEdit={canEdit}
          compact={compact}
          onClose={closeSpell}
          onEdit={setEditing}
        />
      )}

      <PromptModal
        isOpen={editing !== null}
        onClose={() => setEditing(null)}
        title={editing ? 'Editar magia' : 'Nova magia'}
        confirmLabel={editing ? 'Salvar' : 'Adicionar'}
        fields={grimoireSpellFields(editing ?? undefined).map((field) =>
          field.name === 'image'
            ? {
                ...field,
                render: (value: string, onChange: (next: string) => void) => (
                  <ImageField
                    value={value}
                    onChange={onChange}
                    aspect="landscape"
                    hint="Paisagem, ~16:9. A linha mostra a faixa central; o detalhe, a imagem inteira. Vazio volta ao astrolábio."
                  />
                ),
              }
            : field
        )}
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
