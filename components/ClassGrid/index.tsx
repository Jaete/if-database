'use client';

import { useState } from 'react';
import Link from 'next/link';
import { classFromPrompt, classPromptFields } from '@/db/l10n/classes';
import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import { useAuth } from '@/app/context/AuthContext';
import {
  DownloadIcon,
  LinkIcon,
  PlusIcon,
  SpellbookIcon,
  SwordIcon,
} from '../Icons';
import PromptModal from '../PromptModal';
import { useClassGrid, type IClassOption } from './useClassGrid';
import ClassGridHandles from './handles';
import '@/styles/components/classGrid.scss';

interface IProps {
  initialClasses: IClassOption[];
}

/**
 * O códice: o catálogo de classes.
 *
 * O modal edita só os campos escalares. Uma classe tem 20 níveis de progressão,
 * arquétipos e talentos — isso não cabe num modal, e vive na página de detalhe.
 * A importação do fórum é o caminho de autoria desse conteúdo.
 */
const ClassGrid = ({ initialClasses }: IProps) => {
  const handles = useCssHandles(ClassGridHandles);
  const { canEdit } = useAuth();
  const {
    classes,
    visible,
    isCompact,
    query,
    setQuery,
    feedback,
    busy,
    save,
    remove,
    importTopic,
    linkSpells,
  } = useClassGrid(initialClasses);

  // `null` = fechado, `undefined` = classe nova.
  const [editing, setEditing] = useState<IClassOption | undefined | null>(null);
  const [importing, setImporting] = useState(false);

  return (
    <div className={handles.codex}>
      <header className={handles.codexHeader}>
        <h1 className={handles.codexTitle}>CLASSES</h1>
        <p className={handles.codexSubtitle}>
          O que cada classe adquire a cada nível, e as magias que ela conjura.
        </p>
      </header>

      <div
        className={`${handles.codexTools}${
          isCompact ? ` ${applyModifiers(handles.codexTools, 'compact')}` : ''
        }`}
      >
        <input
          className={handles.codexSearch}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar classe pelo nome..."
          aria-label="Buscar classe pelo nome"
        />
        {canEdit && (
          <div className={handles.codexActions}>
            {/* Só ícone: a barra acompanha a rolagem, e três rótulos em caixa
                alta ocupariam a largura toda em tela estreita. O nome de cada
                ação vive no `aria-label` e no `title`, que é de onde sai a
                dica ao parar o ponteiro. */}
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
              <span className={handles.codexActionLabel}>Vincular magias</span>
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

      <p className={handles.codexCount}>
        {`${visible.length} de ${classes.length} classe(s)`}
      </p>

      <ul className={handles.codexList}>
        {visible.length === 0 && (
          <li className={handles.codexEmpty}>
            Nenhuma classe encontrada. Importe um tópico do fórum para começar.
          </li>
        )}
        {visible.map((klass) => (
          <li key={klass.slug}>
            <div className={handles.codexRow}>
              {/* O selo carrega a única informação que distingue as duas
                  metades do códice, então o ícone precisa de nome: sem o
                  rótulo, quem usa leitor de tela ouviria um <span> vazio onde
                  antes havia um "M". */}
              <span
                className={handles.codexBadge}
                role="img"
                aria-label={
                  klass.isSpellcaster ? 'Classe mágica' : 'Classe marcial'
                }
                title={klass.isSpellcaster ? 'Classe mágica' : 'Classe marcial'}
              >
                {klass.isSpellcaster ? <SpellbookIcon /> : <SwordIcon />}
              </span>
              {/* Nome e selo dividem a mesma célula da grade: a linha tem
                  quatro colunas fixas, e um filho a mais quebraria para baixo
                  em vez de ficar ao lado. */}
              <span className={handles.codexNameCell}>
                <Link
                  href={`/classes/${klass.slug}`}
                  className={handles.codexName}
                  prefetch={false}
                >
                  {klass.name}
                </Link>
                {klass.isUnique && (
                  <span
                    className={handles.codexUnique}
                    title={
                      klass.takenBy
                        ? `Classe única, com ${klass.takenBy.name}`
                        : 'Classe única, sem dono no momento'
                    }
                  >
                    {klass.takenBy ? `única · ${klass.takenBy.name}` : 'única'}
                  </span>
                )}
              </span>
              <span className={handles.codexMeta}>{klass.hitDie ?? ''}</span>
              {canEdit && (
                <button
                  type="button"
                  className={handles.codexButton}
                  onClick={() => setEditing(klass)}
                >
                  EDITAR
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      <PromptModal
        isOpen={editing !== null}
        onClose={() => setEditing(null)}
        title={editing ? 'Editar classe' : 'Nova classe'}
        confirmLabel={editing ? 'Salvar' : 'Adicionar'}
        fields={classPromptFields(editing ?? undefined)}
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
