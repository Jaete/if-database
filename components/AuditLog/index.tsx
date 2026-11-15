'use client';

import { useCallback, useEffect, useState } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import type { IAuditEntryView } from '@/services/sheetAudit';
import AuditLogHandles from './handles';
import '@/styles/components/auditLog.scss';

interface IProps {
  /** `_id` da ficha (o slug também vale). */
  playerId: string;
}

const VIA: Record<string, string> = {
  'embed-edit': 'edição da staff',
  'app-edit': 'edição pelo app',
  'app-create': 'criação',
  'app-delete': 'exclusão',
  'creation-draft': 'rascunho',
  'creation-roll': 'rolagem',
  submit: 'envio',
  approve: 'aprovação',
  'approve-adjust': 'aprovação com ajustes',
  return: 'devolução',
  'level-up': 'subida de nível',
  reopen: 'reabertura de nível',
  'edit-level': 'edição de nível selado',
  xp: 'experiência',
};

const LIMIT = 140;

const show = (value: unknown): string => {
  if (value === null || value === undefined || value === '') return 'vazio';
  if (typeof value === 'string') return value;
  return JSON.stringify(value);
};

const when = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });

/** Um valor longo é cortado, com "ver tudo". */
const Value = ({ value, className }: { value: unknown; className: string }) => {
  const handles = useCssHandles(AuditLogHandles);
  const [all, setAll] = useState(false);
  const text = show(value);
  const long = text.length > LIMIT;
  return (
    <span className={className}>
      {all || !long ? text : `${text.slice(0, LIMIT)}…`}{' '}
      {long && (
        <button
          type="button"
          className={handles.auditToggle}
          aria-expanded={all}
          onClick={() => setAll((v) => !v)}
        >
          {all ? 'ver menos' : 'ver tudo'}
        </button>
      )}
    </span>
  );
};

/**
 * A auditoria da ficha: tudo o que mudou nela, por quem, por onde e quando, com
 * o campo antes → depois. Visível a todos (a API aplica as regras de
 * rascunho). Salvamentos de rascunho do mesmo autor já chegam fundidos.
 */
const AuditLog = ({ playerId }: IProps) => {
  const handles = useCssHandles(AuditLogHandles);
  const [entries, setEntries] = useState<IAuditEntryView[]>([]);
  const [next, setNext] = useState<string | undefined>();
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const load = useCallback(
    (cursor?: string) =>
      fetch(
        `/api/players/${playerId}/audit${cursor ? `?before=${encodeURIComponent(cursor)}` : ''}`
      )
        .then((res) => (res.ok ? res.json() : Promise.reject(new Error())))
        .then((data: { entries: IAuditEntryView[]; next?: string }) => {
          setEntries((prev) =>
            cursor ? [...prev, ...data.entries] : data.entries
          );
          setNext(data.next);
          setLoaded(true);
        })
        .catch(() => {
          setFailed(true);
          setLoaded(true);
        }),
    [playerId]
  );

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <section className={handles.auditLog} aria-label="Auditoria">
      <h3 className={handles.auditHead}>Auditoria</h3>
      {!loaded ? (
        <p className={handles.auditEmpty}>Carregando…</p>
      ) : failed ? (
        <p className={handles.auditEmpty}>
          Não foi possível carregar a auditoria.
        </p>
      ) : entries.length === 0 ? (
        <p className={handles.auditEmpty}>Nada registrado ainda.</p>
      ) : (
        <ol className={handles.auditList}>
          {entries.map((e) => (
            <li key={e.id} className={handles.auditEntry}>
              <details>
                <summary>
                  <span className={handles.auditWho}>
                    {e.actor.username}
                    {e.actor.isStaff
                      ? ' (staff)'
                      : e.actor.isOwner
                        ? ' (dona)'
                        : ''}
                  </span>{' '}
                  <span className={handles.auditVia}>
                    {VIA[e.via] ?? e.via}
                  </span>{' '}
                  <span className={handles.auditWhen}>
                    {when(e.at)}
                    {e.lastAt !== e.at && ` – ${when(e.lastAt)}`}
                  </span>
                  {e.changes.length > 0 && ` · ${e.changes.length} campo(s)`}
                </summary>
                {e.reason && <p className={handles.auditReason}>{e.reason}</p>}
                <ul className={handles.auditChanges}>
                  {e.changes.map((c) => (
                    <li key={c.path} className={handles.auditChange}>
                      <span className={handles.auditLabel}>{c.label}</span>
                      {c.path === 'review' ? null : (
                        <>
                          <Value
                            value={c.before}
                            className={handles.auditFrom}
                          />
                          <span aria-hidden="true">→</span>
                          <Value value={c.after} className={handles.auditTo} />
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          ))}
        </ol>
      )}
      {next && (
        <button
          type="button"
          className={handles.auditMore}
          onClick={() => void load(next)}
        >
          Carregar mais
        </button>
      )}
    </section>
  );
};

export default AuditLog;
