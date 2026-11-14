'use client';

import { useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import type ISpell from '@/db/spells/spell.d';
import type { ISpellChoice } from '@/lib/catalogChoice';
import {
  circleLabel,
  circleTitle,
  grimoireSpellFields,
  grimoireSpellFromPrompt,
} from '@/db/l10n/spells';
import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import { useOptionalAuth } from '@/app/context/AuthContext';
import {
  CheckIcon,
  DownloadIcon,
  LockIcon,
  PlusIcon,
  SearchIcon,
} from '../Icons';
import ChoiceTag from '../ChoiceTag';
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
  /** Slug da magia a abrir de cara (o `?magia=` da URL). */
  initialSlug?: string;
  /**
   * Seletor da ficha: a lista vira a da classe (com o grimório inteiro à
   * parte, desativado), cada linha ganha o botão de preparar e os círculos
   * mostram n/limite.
   */
  choice?: ISpellChoice;
}

const countLabel = (count: number) =>
  `${count} ${count === 1 ? 'magia' : 'magias'}`;

type SpellState =
  | { kind: 'known' }
  | { kind: 'open' }
  | { kind: 'full' }
  | { kind: 'locked'; opensAt?: number }
  | { kind: 'outside' };

/** Em que pé a magia está para a ficha: preparada, livre, cheio, trancada. */
function spellState(choice: ISpellChoice, spell: ISpell): SpellState {
  if (!(spell.classIds ?? []).map(String).includes(choice.classId)) {
    return { kind: 'outside' };
  }
  const id = String(spell._id);
  if (choice.known.includes(id)) return { kind: 'known' };
  if (spell.circle > choice.maxCircle) {
    return { kind: 'locked', opensAt: choice.opensAt[spell.circle] };
  }
  // Truque tem o limite dele; as demais dividem UM limite: o total de espaços.
  const used =
    spell.circle === 0 ? countKnownIn(choice, 0) : choice.preparedCount;
  const limit =
    spell.circle === 0 ? (choice.limits[0] ?? 0) : choice.preparedLimit;
  return used >= limit ? { kind: 'full' } : { kind: 'open' };
}

// Quantas das magias preparadas estão neste círculo: o catálogo é a única
// fonte do círculo de cada id, então o cálculo usa o que a camada já mediu.
function countKnownIn(choice: ISpellChoice, circle: number) {
  return choice.counts[circle] ?? 0;
}

function circleCounter(choice: ISpellChoice, circle: number) {
  if (circle > choice.maxCircle) {
    const at = choice.opensAt[circle];
    return at ? `a partir do nível ${at}` : 'ainda não conjura';
  }
  // Truques: n/limite. Os demais círculos só contam, porque o limite é o total.
  return circle === 0
    ? `${choice.counts[0] ?? 0}/${choice.limits[0] ?? 0}`
    : countLabel(choice.counts[circle] ?? 0);
}

const SpellToggle = ({
  state,
  spell,
  choice,
  labelled = false,
}: {
  state: SpellState;
  spell: ISpell;
  choice: ISpellChoice;
  labelled?: boolean;
}) => {
  const handles = useCssHandles(SpellGridHandles);
  if (state.kind === 'outside') return null;
  if (state.kind === 'locked') {
    return (
      <span className={handles.spellbookChoiceTag}>
        <ChoiceTag kind="blocked">
          {state.opensAt ? `Nível ${state.opensAt}` : 'Trancada'}
        </ChoiceTag>
      </span>
    );
  }
  const known = state.kind === 'known';
  const full = state.kind === 'full';
  const swapOnly = full;
  const text = known
    ? 'Preparada'
    : swapOnly
      ? 'Limite de preparadas: troque'
      : 'Preparar';
  return (
    <button
      type="button"
      className={`${handles.spellbookChoiceToggle}${
        known ? ` ${applyModifiers(handles.spellbookChoiceToggle, 'on')}` : ''
      }`}
      aria-pressed={known}
      disabled={swapOnly}
      title={
        swapOnly
          ? 'Você já preparou o total de espaços. Desmarque uma magia para trocar.'
          : undefined
      }
      onClick={() =>
        choice.onToggle({
          _id: String(spell._id),
          name: spell.name,
          circle: spell.circle,
        })
      }
    >
      {known && <CheckIcon />}
      {swapOnly && <LockIcon />}
      {labelled || known || swapOnly ? text : 'Preparar'}
    </button>
  );
};

const SpellGrid = ({
  initialSpells,
  compact = false,
  readOnly = false,
  initialSlug,
  choice,
}: IProps) => {
  const handles = useCssHandles(SpellGridHandles);
  // O embed não tem AuthProvider: sem contexto, ninguém edita. A guarda de
  // verdade é a da rota; esta é a afordância.
  const auth = useOptionalAuth();
  const canEdit = !readOnly && !choice && (auth?.canEdit ?? false);
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
  } = useSpellGrid(initialSpells, initialSlug);

  // `null` = fechado, `undefined` = magia nova.
  const [editing, setEditing] = useState<ISpell | undefined | null>(null);
  const [importing, setImporting] = useState(false);
  // Fora da lista da classe, só para consulta (nada a preparar).
  const [wholeBook, setWholeBook] = useState(false);
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

  const shownGroups = choice
    ? groups
        .map((group) => ({
          ...group,
          spells: group.spells.filter(
            (spell) =>
              wholeBook ||
              (spell.classIds ?? []).map(String).includes(choice.classId)
          ),
        }))
        .filter((group) => group.spells.length > 0)
    : groups;

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

        {choice && (
          <p
            className={handles.spellbookChoiceTotal}
            role="status"
            aria-live="polite"
          >
            Preparadas: <b>{choice.preparedCount}</b> / {choice.preparedLimit}
          </p>
        )}

        {choice && (
          <label className={handles.spellbookChoiceWhole}>
            <input
              type="checkbox"
              checked={wholeBook}
              onChange={(e) => setWholeBook(e.target.checked)}
            />
            Grimório inteiro (as de fora da classe só para consulta)
          </label>
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
            {shownGroups.length === 0 && (
              <p className={handles.spellbookEmpty}>
                {spells.length === 0 && canEdit
                  ? 'Nenhuma magia encontrada. Importe um tópico do fórum para começar.'
                  : 'Nenhuma magia encontrada.'}
              </p>
            )}
            {shownGroups.map((group) => (
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
                    {choice
                      ? circleCounter(choice, group.circle)
                      : countLabel(group.spells.length)}
                  </span>
                </div>
                <ul className={handles.spellbookList}>
                  {group.spells.map((spell) => {
                    const row = (
                      <SpellRow
                        spell={spell}
                        isCurrent={spell.slug === currentSlug}
                        onOpen={openSpell}
                      />
                    );
                    if (!choice) return <li key={spell.slug}>{row}</li>;
                    const state = spellState(choice, spell);
                    return (
                      <li
                        key={spell.slug}
                        className={handles.spellbookChoiceItem}
                      >
                        {row}
                        <SpellToggle
                          state={state}
                          spell={spell}
                          choice={choice}
                        />
                      </li>
                    );
                  })}
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
          action={
            choice && (
              <SpellToggle
                state={spellState(choice, viewing)}
                spell={viewing}
                choice={choice}
                labelled
              />
            )
          }
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
