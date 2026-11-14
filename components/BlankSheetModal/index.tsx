'use client';

import { useEffect, useState } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import { fichaTag } from '@/lib/forumTag';
import Modal from '../Modal';
import CopyFichaTag from '../CopyFichaTag';
import BlankSheetModalHandles from './handles';
import '@/styles/components/blankSheet.scss';

interface IProps {
  isOpen: boolean;
  /** Fecha o modal; `created` diz se uma ficha nasceu (a lista recarrega). */
  onClose: (created: boolean) => void;
}

interface IOwner {
  username: string;
  forumUserId: number;
  sheets: { id: string; name: string; status: string; class?: string }[];
}

const STATUS_LABEL: Record<string, string> = {
  blank: 'em branco',
  draft: 'em criação',
  submitted: 'aguardando aprovação',
  returned: 'devolvida',
  approved: 'aprovada',
};

/**
 * "Criar ficha vazia": a staff escolhe a conta do fórum que será dona da ficha
 * (a única informação pedida) e recebe a etiqueta `[ficha=<id>]` para colar no
 * post. A dona preenche o resto, no post.
 */
const BlankSheetModal = ({ isOpen, onClose }: IProps) => {
  const handles = useCssHandles(BlankSheetModalHandles);
  const [owners, setOwners] = useState<IOwner[] | null>(null);
  const [query, setQuery] = useState('');
  const [chosen, setChosen] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [created, setCreated] = useState<{
    id: string;
    ownerUsername: string;
  } | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    let alive = true;
    fetch('/api/players/owners')
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error())))
      .then((list: IOwner[]) => alive && setOwners(list))
      .catch(() => alive && setError('Não foi possível carregar as contas.'));
    return () => {
      alive = false;
    };
  }, [isOpen]);

  const close = () => {
    onClose(!!created);
    setCreated(null);
    setChosen(null);
    setQuery('');
    setError('');
  };

  const create = async () => {
    if (chosen === null || busy) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/players/blank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ownerForumUserId: chosen }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? 'Não foi possível criar.');
      setCreated(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Não foi possível criar.');
    } finally {
      setBusy(false);
    }
  };

  const shown = (owners ?? []).filter((o) =>
    o.username.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <Modal isOpen={isOpen} onClose={close} title="Criar ficha vazia">
      <div className={handles.bsBody}>
        {created ? (
          <div className={handles.bsDone}>
            <p>
              Ficha vazia criada para <b>{created.ownerUsername}</b>. O card já
              entra na lista como rascunho.
            </p>
            <code className={handles.bsTag}>{fichaTag(created.id)}</code>
            <CopyFichaTag playerId={created.id} />
            <ol className={handles.bsSteps}>
              <li>Copie a etiqueta acima.</li>
              <li>
                Cole num post do fórum (a ficha aparece no lugar da etiqueta).
              </li>
              <li>
                {created.ownerUsername} abre o post, clica em &ldquo;Começar
                minha ficha&rdquo; e preenche. Quando enviar, você revisa e
                aprova.
              </li>
            </ol>
            <div className={handles.bsActions}>
              <button type="button" onClick={close}>
                Concluir
              </button>
            </div>
          </div>
        ) : (
          <>
            <p>
              Escolha a conta do fórum que será dona da ficha. Só isso: o resto
              a própria dona preenche.
            </p>
            <input
              className={handles.bsSearch}
              type="search"
              placeholder="Buscar conta…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Buscar conta do fórum"
            />
            <ul
              className={handles.bsList}
              role="radiogroup"
              aria-label="Contas"
            >
              {owners === null && !error && <li>Carregando…</li>}
              {shown.map((o) => (
                <li key={o.forumUserId}>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={chosen === o.forumUserId}
                    className={handles.bsOwner}
                    onClick={() => setChosen(o.forumUserId)}
                  >
                    <span className={handles.bsOwnerName}>{o.username}</span>
                    <span className={handles.bsOwnerSheets}>
                      {o.sheets.length === 0
                        ? 'sem fichas'
                        : o.sheets.map((s) => (
                            <span key={s.id} className={handles.bsSheetTag}>
                              {s.name || 'sem nome'} ·{' '}
                              {STATUS_LABEL[s.status] ?? s.status}
                            </span>
                          ))}
                    </span>
                  </button>
                </li>
              ))}
              {owners && shown.length === 0 && (
                <li>Nenhuma conta encontrada.</li>
              )}
            </ul>
            {error && (
              <p role="alert" className={handles.bsError}>
                {error}
              </p>
            )}
            <div className={handles.bsActions}>
              <button type="button" onClick={close}>
                Cancelar
              </button>
              <button
                type="button"
                disabled={chosen === null || busy}
                onClick={() => void create()}
              >
                Criar ficha vazia
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default BlankSheetModal;
