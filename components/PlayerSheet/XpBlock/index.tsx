'use client';

import { useRef } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import { formatXp } from '@/lib/xp';
import { sheetSounds } from '@/lib/sheetSounds';
import { LevelUpIcon, PlusIcon } from '../../Icons';
import { useLevelUp } from '../LevelUpContext';
import type { ScreenId } from '../sheetData';
import XpBlockHandles from './handles';

interface IProps {
  ownerName?: string;
  onOpenScreen: (id: ScreenId) => void;
}

/**
 * A experiência no cabeçalho: texto, barra e, para quem pode agir, o botão de
 * conceder (admin) ou o de subir de nível (dono). A XP nunca é editada aqui:
 * só entra por "Conceder XP".
 */
const XpBlock = ({ ownerName, onOpenScreen }: IProps) => {
  const handles = useCssHandles(XpBlockHandles);
  const { access, progress, openGrant, openRite } = useLevelUp();
  const lastHarp = useRef(0);

  const { earned, pending, into, needed, level } = progress;
  const negative = into < 0;
  const capped = needed === null;
  const ready = access.isOwner && pending > 0;

  // O glissando de harpa no botão, no máximo uma vez a cada 4 s.
  const shimmer = () => {
    const now = Date.now();
    if (now - lastHarp.current < 4000) return;
    lastHarp.current = now;
    sheetSounds.play('harp');
  };

  const ratio = capped
    ? 1
    : pending > 0
      ? 1
      : negative
        ? Math.min(1, -into / needed)
        : Math.min(1, into / needed);

  const label = capped ? (
    <>
      <span className={handles.sheetXpLabelText}>
        Experiência <span className={handles.sheetXpPill}>teto atual</span>
      </span>
      <b>
        Nível {earned} · {formatXp(into)} XP acumulados
      </b>
    </>
  ) : negative ? (
    <>
      <span className={handles.sheetXpLabelText}>
        Experiência{' '}
        <span className={`${handles.sheetXpPill} ${handles.sheetXpPill}--warn`}>
          XP negativa
        </span>
      </span>
      <b className={`${handles.sheetXpBlock}--negative`}>
        {formatXp(into)} / {formatXp(needed)}
      </b>
    </>
  ) : pending > 0 ? (
    <>
      <span className={handles.sheetXpLabelText}>
        Experiência{' '}
        {!access.isOwner && (
          <span
            className={`${handles.sheetXpPill} ${handles.sheetXpPill}--dash`}
          >
            nível pendente
          </span>
        )}
      </span>
      <b>
        Nível {earned} alcançado · {formatXp(into)} / {formatXp(needed)}
      </b>
    </>
  ) : (
    <>
      <span className={handles.sheetXpLabelText}>Experiência</span>
      <b>
        {formatXp(into)} / {formatXp(needed)}
      </b>
    </>
  );

  return (
    <div className={handles.sheetXpBlock}>
      <div className={handles.sheetXpLabel}>{label}</div>
      <div
        className={`${handles.sheetXpBar}${pending > 0 ? ` ${handles.sheetXpBar}--full` : ''}${
          negative ? ` ${handles.sheetXpBar}--negative` : ''
        }`}
        role="progressbar"
        aria-label={`Experiência para o nível ${earned + 1}`}
        aria-valuemin={Math.min(0, into)}
        aria-valuemax={needed ?? into}
        aria-valuenow={into}
      >
        <i style={{ transform: `scaleX(${ratio})` }} />
      </div>
      {negative && (
        <div
          className={`${handles.sheetXpNote} ${handles.sheetXpNote}--negative`}
        >
          Faltam {formatXp(-into)} para zerar. As próximas concessões compensam,
          e o nível não cai.
        </div>
      )}
      <div className={handles.sheetXpActions}>
        <button
          type="button"
          className={handles.sheetXpLink}
          onClick={() => onOpenScreen('cronica')}
        >
          Diário de experiência
        </button>
        {access.isAdmin && (
          <button
            type="button"
            className={handles.sheetXpGrant}
            onClick={() => {
              sheetSounds.play('paperSlide');
              openGrant();
            }}
          >
            <PlusIcon width={14} height={14} />
            Conceder XP
          </button>
        )}
      </div>
      {ready && (
        <button
          type="button"
          className={handles.sheetLevelCta}
          onClick={openRite}
          onMouseEnter={shimmer}
          onFocus={shimmer}
        >
          <span className={handles.sheetLevelCtaIcon}>
            <LevelUpIcon />
          </span>
          <span className={handles.sheetLevelCtaText}>
            <b>Subir de nível</b>
            <small>
              {pending === 1
                ? `O nível ${level + 1} está pronto para você.`
                : `${pending} níveis para subir · começa pelo ${level + 1}`}
            </small>
          </span>
          <span className={handles.sheetLevelCtaRange}>
            {level} → {earned}
          </span>
        </button>
      )}
      {!ready && access.isAdmin && pending > 0 && (
        <div className={handles.sheetXpActions}>
          <span className={handles.sheetPendingHint}>
            <i />
            Aguardando {ownerName ?? 'o dono'} subir{' '}
            {pending === 1 ? '1 nível' : `${pending} níveis`}
          </span>
          <button
            type="button"
            className={handles.sheetXpLink}
            onClick={openRite}
          >
            Subir por ele
          </button>
        </div>
      )}
    </div>
  );
};

export default XpBlock;
