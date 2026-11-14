'use client';

import { useState } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import { formatXp } from '@/lib/xp';
import { useLevelUp } from '../LevelUpContext';
import XpLogHandles from './handles';

const KIND_LABEL: Record<string, string> = {
  correction: 'correção',
  reopen: 'reabertura',
  seal: 'selo',
  edit: 'edição',
  create: 'criação',
  submit: 'envio',
  approve: 'aprovação',
  return: 'devolução',
};

const when = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

/**
 * O histórico da ficha: concessões de XP, correções, selos e reaberturas, do
 * mais novo para o mais velho. Só inclusão — corrigir é lançar de novo.
 */
const XpLog = () => {
  const handles = useCssHandles(XpLogHandles);
  const { history: first, access, openGrant, player } = useLevelUp();
  const [older, setOlder] = useState<typeof first>([]);
  const [more, setMore] = useState(first.length >= 60);
  const [loading, setLoading] = useState(false);
  const seen = new Set(first.map((e) => e.id));
  const history = [...first, ...older.filter((e) => !seen.has(e.id))];

  const loadMore = async () => {
    const last = history[history.length - 1];
    if (!last || loading) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/embed/players/${player._id}/xp?before=${encodeURIComponent(last.at)}`
      );
      if (res.ok) {
        const data = await res.json();
        setOlder((prev) => [...prev, ...data.history]);
        setMore(!!data.hasMore);
      }
    } finally {
      setLoading(false);
    }
  };

  if (history.length === 0) {
    return <p className={handles.sheetXpLogEmpty}>Nenhum lançamento ainda.</p>;
  }

  return (
    <ul className={handles.sheetXpLog}>
      {history.map((e, i) => {
        const older = history.slice(i + 1).find((x) => x.earnedAfter);
        const reached =
          e.earnedAfter &&
          older?.earnedAfter &&
          e.earnedAfter > older.earnedAfter
            ? `→ nível ${e.earnedAfter}`
            : '';
        const amount = e.amount;
        return (
          <li key={e.id} className={handles.sheetXpLogItem}>
            <span
              className={`${handles.sheetXpLogAmount}${
                amount !== undefined && amount < 0
                  ? ` ${handles.sheetXpLogAmount}--negative`
                  : ''
              }`}
            >
              {amount === undefined
                ? '—'
                : `${amount < 0 ? '−' : '+'}${formatXp(Math.abs(amount))}`}
            </span>
            <span className={handles.sheetXpLogWhy}>{e.reason}</span>
            {reached || KIND_LABEL[e.kind] ? (
              <span className={handles.sheetXpLogTag}>
                {reached || KIND_LABEL[e.kind]}
              </span>
            ) : access.isStaff && e.kind === 'grant' && !e.reversed ? (
              <span className={handles.sheetXpLogAct}>
                <button
                  type="button"
                  onClick={() =>
                    openGrant({
                      amount: -(amount ?? 0),
                      reason: `Estorno de ${when(e.at)}: ${e.reason}`,
                      lines: [
                        { line: `Estorno: ${e.reason}`, value: -(amount ?? 0) },
                      ],
                      reversalOf: e.id,
                    })
                  }
                >
                  Estornar
                </button>
              </span>
            ) : (
              <span />
            )}
            <span className={handles.sheetXpLogMeta}>
              {when(e.at)} ·{' '}
              {e.kind === 'grant' || e.kind === 'correction'
                ? 'concedido'
                : 'feito'}{' '}
              por {e.byUsername}
            </span>
          </li>
        );
      })}
      {more && (
        <li className={handles.sheetXpLogMore}>
          <button
            type="button"
            onClick={() => void loadMore()}
            disabled={loading}
          >
            {loading ? 'Carregando…' : 'Carregar mais'}
          </button>
        </li>
      )}
    </ul>
  );
};

export default XpLog;
