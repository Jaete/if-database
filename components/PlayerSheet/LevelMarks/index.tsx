'use client';

import { useState } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import type { ILevelLock } from '@/lib/levelUp';
import { sheetSounds } from '@/lib/sheetSounds';
import { LockIcon, WaxSealIcon } from '../../Icons';
import { useLevelUp } from '../LevelUpContext';
import LevelMarksHandles from './handles';

const when = (iso: string) => new Date(iso).toLocaleDateString('pt-BR');

/**
 * Os marcos de nível da Crônica: cada nível alcançado, selado, reaberto ou
 * pendente. O admin edita as escolhas ou reabre (com motivo); o dono só lê.
 */
const LevelMarks = () => {
  const handles = useCssHandles(LevelMarksHandles);
  const {
    player,
    progress,
    access,
    startEdit,
    reopen,
    busy,
    error,
    clearError,
  } = useLevelUp();
  const [asking, setAsking] = useState<number | null>(null);
  const [reason, setReason] = useState('');

  const locks = (player.levelLocks ?? []) as ILevelLock[];
  const lockOf = (level: number) => locks.find((l) => l.level === level);

  const levels = Array.from(
    { length: progress.earned },
    (_, i) => progress.earned - i
  );
  const marks: React.ReactNode[] = [];
  for (const level of levels) {
    const lock = lockOf(level);
    if (level > progress.level) {
      const reopened = lock?.status === 'reopened' ? lock : null;
      marks.push(
        <div
          key={level}
          className={`${handles.sheetMark} ${handles.sheetMark}--open`}
        >
          <span className={handles.sheetMarkNumber}>{level}</span>
          <span className={handles.sheetMarkBody}>
            <b>
              Nível {level} · {reopened ? 'reaberto' : 'pendente'}
            </b>
            <span>
              {reopened
                ? `${reopened.summary}`
                : 'Alcançado com XP, esperando as escolhas do dono.'}
            </span>
            {reopened?.reopened && (
              <span>
                Reaberto por {reopened.reopened.byUsername} em{' '}
                {when(reopened.reopened.at)}: {reopened.reopened.reason}
              </span>
            )}
          </span>
          <span className={handles.sheetMarkActions}>
            <span
              className={`${handles.sheetMarkPill} ${handles.sheetMarkPill}--dash`}
            >
              {reopened ? 'esperando novo selo' : 'pendente'}
            </span>
          </span>
        </div>
      );
    } else if (lock?.status === 'sealed') {
      marks.push(
        <div key={level} className={handles.sheetMark}>
          <span className={handles.sheetMarkNumber}>
            {level}
            <span className={handles.sheetMarkLock}>
              <LockIcon width={10} height={10} />
            </span>
          </span>
          <span className={handles.sheetMarkBody}>
            <b>Nível {level} · selado</b>
            <span>{lock.summary}</span>
            <span>
              Selado por {lock.byUsername} em {when(lock.sealedAt)}
              {lock.hp.rollId ? ` · vida: dado rolado, auditável` : ''}
              {lock.editedBy
                ? ` · editado por ${lock.editedBy.byUsername}`
                : ''}
            </span>
          </span>
          <span className={handles.sheetMarkActions}>
            {access.isStaff ? (
              <>
                <button
                  type="button"
                  className={`${handles.sheetMarkBtn} ${handles.sheetMarkBtn}--ghost`}
                  onClick={() => void startEdit(level)}
                >
                  Editar escolhas
                </button>
                {level === progress.level && (
                  <button
                    type="button"
                    className={`${handles.sheetMarkBtn} ${handles.sheetMarkBtn}--secondary`}
                    onClick={() => {
                      sheetSounds.play('paperSlide');
                      setReason('');
                      clearError();
                      setAsking(level);
                    }}
                  >
                    Reabrir
                  </button>
                )}
              </>
            ) : (
              <span
                className={`${handles.sheetMarkPill} ${handles.sheetMarkPill}--muted`}
              >
                selado
              </span>
            )}
          </span>
        </div>
      );
    }
  }

  const firstSealed = locks.length
    ? Math.min(...locks.map((l) => l.level))
    : progress.level + 1;
  const legacyTo = Math.min(progress.level, firstSealed - 1);
  if (legacyTo >= 1) {
    marks.push(
      <div
        key="legacy"
        className={`${handles.sheetMark} ${handles.sheetMark}--old`}
      >
        <span className={handles.sheetMarkNumber}>
          {legacyTo === 1 ? 1 : `1–${legacyTo}`}
        </span>
        <span className={handles.sheetMarkBody}>
          <b>{legacyTo === 1 ? 'Nível 1' : `Níveis 1 a ${legacyTo}`}</b>
          <span>
            Subidos antes do selo de nível. Valem como estão na ficha.
          </span>
        </span>
        <span />
      </div>
    );
  }

  return (
    <>
      <div className={handles.sheetMarks}>{marks}</div>
      {access.isStaff && (
        <p className={handles.sheetMarkLegend}>
          O admin pode tudo: editar escolhas seladas ou reabrir um nível. Cada
          ação entra no histórico acima, como as correções de XP.
        </p>
      )}
      {asking !== null && (
        <div className={handles.sheetReopenVeil}>
          <div
            className={handles.sheetReopenDialog}
            role="alertdialog"
            aria-labelledby="reopen-title"
          >
            <WaxSealIcon width={86} height={86} />
            <h3 id="reopen-title">Reabrir o nível {asking}?</h3>
            <p>
              As escolhas do nível {asking} voltam a ficar abertas, e o dono
              pode refazê-las e selar de novo.
            </p>
            <p>
              A rolagem de vida não é refeita: o valor rolado continua gravado.
              A reabertura entra no histórico da ficha com o motivo.
            </p>
            <label>
              <span>Motivo</span>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ex.: pediu para trocar Aura do Medo por Mente Clara"
              />
            </label>
            {error && <p role="alert">{error}</p>}
            <div>
              <button type="button" onClick={() => setAsking(null)}>
                Cancelar
              </button>
              <button
                type="button"
                disabled={busy || !reason.trim()}
                onClick={async () => {
                  if (await reopen(asking, reason.trim())) setAsking(null);
                }}
              >
                Reabrir nível {asking}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LevelMarks;
