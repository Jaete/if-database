'use client';

import { useEffect, useRef, useState } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import {
  XP_CATEGORIES,
  XP_PRESETS,
  creatureXp,
  formatXp,
  raidXp,
  tournamentXp,
  xpProgress,
  xpToNext,
} from '@/lib/xp';
import { sheetSounds } from '@/lib/sheetSounds';
import { ArrowLeftIcon, CloseIcon, PlusIcon } from '../../Icons';
import LevelUpButton from '../LevelUpButton';
import { useLevelUp } from '../LevelUpContext';
import GrantXpLayerHandles from './handles';
import '@/styles/components/levelUp.scss';

interface ILine {
  line: string;
  value: number;
}

const signed = (n: number) => `${n < 0 ? '−' : '+'}${formatXp(Math.abs(n))}`;

/**
 * "Conceder XP": o recibo do admin. Fontes rápidas das tabelas do fórum, valor
 * livre (negativo corrige), motivo obrigatório, prévia da barra e uma segunda
 * tela de confirmação. Cobre a ficha inteira, como a camada do códice.
 */
const GrantXpLayer = () => {
  const handles = useCssHandles(GrantXpLayerHandles);
  const { player, progress, grantPrefill, grant, close, busy, error } =
    useLevelUp();
  const name = String(player.name);

  const [cat, setCat] = useState(
    grantPrefill?.reversalOf ? 'correcao' : 'missoes'
  );
  const [lines, setLines] = useState<ILine[]>(
    grantPrefill?.lines?.map((l) => ({ line: l.line, value: l.value })) ?? []
  );
  const [free, setFree] = useState('');
  const [reason, setReason] = useState(grantPrefill?.reason ?? '');
  const [touched, setTouched] = useState(!!grantPrefill?.reason);
  const [confirming, setConfirming] = useState(false);
  const [cre, setCre] = useState({ lvl: Math.max(1, progress.level), qty: 1 });
  const [raid, setRaid] = useState({ n: 4, days: 0 });
  const [tour, setTour] = useState({ r: 1, win: false });
  const rootRef = useRef<HTMLDivElement>(null);

  const total = lines.reduce((sum, l) => sum + l.value, 0);
  const autoReason = lines.map((l) => l.line).join(' + ');
  const finalReason = touched ? reason : autoReason;
  const canConfirm = total !== 0 && finalReason.trim().length > 0;

  const level = progress.level;
  const after = xpProgress(level, progress.pool + total);
  const ups = after.earned - progress.earned;

  useEffect(() => {
    rootRef.current?.focus({ preventScroll: true });
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return;
      event.preventDefault();
      if (confirming) setConfirming(false);
      else close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [confirming, close]);

  const add = (line: string, value: number) => {
    setLines((prev) => [...prev, { line, value }]);
    sheetSounds.play('coinsUi');
  };

  const stepper = (
    value: number,
    min: number,
    max: number,
    set: (n: number) => void,
    label: string
  ) => (
    <span className={handles.luGrantStep}>
      <button
        type="button"
        disabled={value <= min}
        aria-label={`Diminuir ${label}`}
        onClick={() => set(value - 1)}
      >
        −
      </button>
      <output>{value}</output>
      <button
        type="button"
        disabled={value >= max}
        aria-label={`Aumentar ${label}`}
        onClick={() => set(value + 1)}
      >
        +
      </button>
    </span>
  );

  const sourcePane = () => {
    const presets = XP_PRESETS[cat];
    if (presets) {
      return (
        <>
          <div className={handles.luGrantGrid}>
            {presets.map((p, i) => (
              <button
                key={i}
                type="button"
                className={`${handles.luGrantSrc}${p.big ? ` ${handles.luGrantSrc}--rank` : ''}`}
                onClick={() => add(p.line, p.value)}
              >
                <span>{p.kind}</span>
                <b>{p.big ?? p.name}</b>
                <em>+{formatXp(p.value)}</em>
                <i aria-hidden="true">+</i>
              </button>
            ))}
          </div>
          {cat === 'exploracao' && (
            <p className={handles.luGrantFormula}>
              Ruínas somam as criaturas à parte: use a aba Criaturas.
            </p>
          )}
          {cat === 'eventos' && (
            <div className={handles.luGrantCalc}>
              <h3>Torneio</h3>
              <div className={handles.luGrantRow}>
                <label className={handles.luGrantLabel}>
                  <span>Rodadas vencidas</span>
                  {stepper(
                    tour.r,
                    0,
                    30,
                    (r) => setTour({ ...tour, r }),
                    'rodadas'
                  )}
                </label>
                <label className={handles.luGrantCheck}>
                  <input
                    type="checkbox"
                    checked={tour.win}
                    onChange={(e) =>
                      setTour({ ...tour, win: e.target.checked })
                    }
                  />
                  Campeão (+1.000)
                </label>
              </div>
              <div className={handles.luGrantFormula}>
                250 × {tour.r}
                {tour.win ? ' + 1.000' : ''} ={' '}
                <b>{formatXp(tournamentXp(tour.r, tour.win))}</b>
              </div>
              <div>
                <LevelUpButton
                  disabled={tournamentXp(tour.r, tour.win) === 0}
                  onClick={() =>
                    add(
                      `Torneio: ${tour.r} rodadas${tour.win ? ', campeão' : ''}`,
                      tournamentXp(tour.r, tour.win)
                    )
                  }
                >
                  <PlusIcon width={14} height={14} />
                  Somar {formatXp(tournamentXp(tour.r, tour.win))} XP
                </LevelUpButton>
              </div>
            </div>
          )}
        </>
      );
    }
    if (cat === 'criaturas') {
      const each = creatureXp(cre.lvl, level);
      const diff = cre.lvl - level;
      return (
        <div className={handles.luGrantCalc}>
          <h3>Calculadora de criaturas</h3>
          <div className={handles.luGrantRow}>
            <label className={handles.luGrantLabel}>
              <span>Nível da criatura</span>
              {stepper(
                cre.lvl,
                1,
                30,
                (lvl) => setCre({ ...cre, lvl }),
                'nível da criatura'
              )}
            </label>
            <label className={handles.luGrantLabel}>
              <span>Quantidade</span>
              {stepper(
                cre.qty,
                1,
                20,
                (qty) => setCre({ ...cre, qty }),
                'quantidade'
              )}
            </label>
          </div>
          <div className={handles.luGrantFormula}>
            200 {diff >= 0 ? '+' : '−'} 50 × {Math.abs(diff)} (nível {cre.lvl}{' '}
            contra {name} {level}) = <b>{formatXp(each)}</b>
            {each === 20 ? ' (mínimo)' : ''} × {cre.qty} ={' '}
            <b>{formatXp(each * cre.qty)}</b>
          </div>
          <div>
            <LevelUpButton
              onClick={() =>
                add(
                  `${cre.qty > 1 ? `${cre.qty} criaturas` : 'Criatura'} nv ${cre.lvl}`,
                  each * cre.qty
                )
              }
            >
              <PlusIcon width={14} height={14} />
              Somar {formatXp(each * cre.qty)} XP
            </LevelUpButton>
          </div>
        </div>
      );
    }
    if (cat === 'raide') {
      const value = raidXp(raid.n, raid.days);
      return (
        <div className={handles.luGrantCalc}>
          <h3>Raide</h3>
          <div className={handles.luGrantRow}>
            <label className={handles.luGrantLabel}>
              <span>Participantes</span>
              {stepper(
                raid.n,
                1,
                30,
                (n) => setRaid({ ...raid, n }),
                'participantes'
              )}
            </label>
            <label className={handles.luGrantLabel}>
              <span>Dias no jogo</span>
              {stepper(
                raid.days,
                0,
                30,
                (days) => setRaid({ ...raid, days }),
                'dias'
              )}
            </label>
          </div>
          <div className={handles.luGrantFormula}>
            5.000 ÷ {raid.n} + 500 × {raid.days} = <b>{formatXp(value)}</b>
          </div>
          <div>
            <LevelUpButton
              onClick={() =>
                add(
                  `Raide (${raid.n} participantes, ${raid.days} ${raid.days === 1 ? 'dia' : 'dias'})`,
                  value
                )
              }
            >
              <PlusIcon width={14} height={14} />
              Somar {formatXp(value)} XP
            </LevelUpButton>
          </div>
        </div>
      );
    }
    // Correção: estornar uma concessão ou lançar valor livre negativo.
    return (
      <div className={handles.luGrantCalc}>
        <h3>Correção</h3>
        <p className={handles.luGrantFormula}>
          Corrige sem apagar o histórico. Use o valor livre com sinal negativo,
          por exemplo <b>−250</b>, ou estorne uma concessão no diário.{' '}
          <b>O nível nunca cai:</b> se a XP passar de zero para baixo, a barra
          fica negativa até as próximas concessões compensarem.
        </p>
      </div>
    );
  };

  if (confirming) {
    const next = xpProgress(level, progress.pool + total);
    return (
      <div
        ref={rootRef}
        tabIndex={-1}
        className={handles.luLayer}
        role="dialog"
        aria-modal="true"
        aria-label="Confirmar concessão"
      >
        <div className={handles.luLayerBar}>
          <button
            type="button"
            className={handles.luLayerBack}
            onClick={() => setConfirming(false)}
          >
            <ArrowLeftIcon width={16} height={16} />
            <span>Voltar ao recibo</span>
          </button>
          <span className={handles.luLayerFor}>
            <b>Conceder experiência</b>
            <span>para {name}</span>
          </span>
        </div>
        <div className={handles.luLayerBody}>
          <div className={handles.luGrantConfirm}>
            <h2>
              {total < 0
                ? `Corrigir ${formatXp(total)} XP de ${name}?`
                : `Conceder ${formatXp(total)} XP a ${name}?`}
            </h2>
            <dl>
              <dt>Motivo</dt>
              <dd>{finalReason}</dd>
              <dt>Fontes</dt>
              <dd>
                {lines.map((l) => `${l.line} (${signed(l.value)})`).join(', ')}
              </dd>
              <dt>Experiência</dt>
              <dd>
                {formatXp(progress.into)} →{' '}
                <span
                  className={
                    next.into < 0 ? `${handles.luGrantUpLine}--neg` : undefined
                  }
                >
                  {formatXp(next.into)}
                </span>{' '}
                / {formatXp(xpToNext(next.earned) ?? 0)}
              </dd>
              <dt>Nível</dt>
              <dd>
                {next.into < 0 ? (
                  <>
                    Continua no nível {next.earned}. A XP fica negativa e as
                    próximas concessões compensam. O nível nunca cai.
                  </>
                ) : ups > 0 ? (
                  <b>
                    Alcança o nível {next.earned} ({ups}{' '}
                    {ups === 1 ? 'nível' : 'níveis'}). A ficha libera a subida
                    para o dono.
                  </b>
                ) : (
                  <>Continua no nível {next.earned}.</>
                )}
              </dd>
            </dl>
            {error && (
              <p className={handles.luGrantError} role="alert">
                {error}
              </p>
            )}
            <div>
              <LevelUpButton onClick={() => setConfirming(false)}>
                Revisar
              </LevelUpButton>
              <LevelUpButton
                variant="primary"
                size="lg"
                disabled={busy}
                onClick={() =>
                  void grant({
                    amount: total,
                    reason: finalReason.trim(),
                    lines: lines.map((l) => ({ line: l.line, value: l.value })),
                    reversalOf: grantPrefill?.reversalOf,
                  })
                }
              >
                Confirmar concessão
              </LevelUpButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Prévia da barra: um segmento por nível coberto.
  const segN = Math.max(1, ups + 1);
  const segs: React.ReactNode[] = [];
  if (after.into < 0) {
    const cap = xpToNext(progress.earned) ?? 1;
    segs.push(
      <span
        key="neg"
        className={`${handles.luGrantSegs}--neg`}
        style={{ flex: 1 }}
      >
        <i style={{ width: `${Math.min(1, -after.into / cap) * 100}%` }} />
      </span>
    );
  } else {
    for (let i = 0; i < segN; i += 1) {
      const cap = xpToNext(progress.earned + i) ?? Math.max(1, after.into);
      const from = i === 0 ? progress.into : 0;
      const to = i === segN - 1 ? after.into : cap;
      segs.push(
        <span
          key={i}
          className={i > 0 ? `${handles.luGrantSegs}--up` : undefined}
          style={{ flex: segN > 3 ? 1 : cap }}
        >
          <i
            data-was
            style={{ width: `${(Math.max(0, from) / cap) * 100}%` }}
          />
          <i
            style={{
              left: `${(Math.max(0, from) / cap) * 100}%`,
              width: `${(Math.max(0, to - Math.max(0, from)) / cap) * 100}%`,
            }}
          />
        </span>
      );
    }
  }

  const needNow = xpToNext(progress.earned);
  return (
    <div
      ref={rootRef}
      tabIndex={-1}
      className={handles.luLayer}
      role="dialog"
      aria-modal="true"
      aria-label="Conceder experiência"
    >
      <div className={handles.luLayerBar}>
        <button type="button" className={handles.luLayerBack} onClick={close}>
          <ArrowLeftIcon width={16} height={16} />
          <span>Voltar à ficha</span>
        </button>
        <span className={handles.luLayerFor}>
          <b>Conceder experiência</b>
          <span>
            para {name} · {String(player.class ?? '')} {level}
            {progress.pending > 0 ? ` · já alcançou o ${progress.earned}` : ''}
          </span>
        </span>
        <span className={handles.luLayerEsc}>Esc volta à ficha</span>
      </div>
      <div className={handles.luLayerBody}>
        <div className={handles.luGrant}>
          <div className={handles.luGrantSource}>
            <h2>De onde vem a experiência</h2>
            <p>
              Toque numa fonte para somar ao recibo. Dá para juntar várias, por
              exemplo uma missão e o chefe que caiu nela.
            </p>
            <div
              className={handles.luGrantCats}
              role="tablist"
              aria-label="Fontes"
            >
              {XP_CATEGORIES.map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={cat === key}
                  onClick={() => {
                    setCat(key);
                    sheetSounds.play('pageTurn');
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            {sourcePane()}
          </div>
          <aside className={handles.luGrantReceipt} aria-label="Recibo">
            <div className={handles.luGrantReceiptIn}>
              <h3>Recibo</h3>
              <ul className={handles.luGrantLines}>
                {lines.length ? (
                  lines.map((l, i) => (
                    <li key={i}>
                      <span>{l.line}</span>
                      <b
                        className={
                          l.value < 0
                            ? `${handles.luGrantLines}--neg`
                            : undefined
                        }
                      >
                        {signed(l.value)}
                      </b>
                      <button
                        type="button"
                        aria-label={`Remover ${l.line}`}
                        onClick={() => {
                          setLines((prev) => prev.filter((_, at) => at !== i));
                          sheetSounds.play('crumple');
                        }}
                      >
                        <CloseIcon width={13} height={13} />
                      </button>
                    </li>
                  ))
                ) : (
                  <li data-empty>Nenhuma fonte ainda.</li>
                )}
              </ul>
              <label className={handles.luGrantLabel}>
                <span>Valor livre</span>
                <span className={handles.luGrantFree}>
                  <input
                    className={handles.luGrantField}
                    type="number"
                    inputMode="numeric"
                    placeholder="0"
                    value={free}
                    onChange={(e) => setFree(e.target.value)}
                  />
                  <LevelUpButton
                    onClick={() => {
                      const v = parseInt(free, 10);
                      if (!v) return;
                      add(v < 0 ? 'Correção' : 'Valor livre', v);
                      setFree('');
                    }}
                  >
                    Somar
                  </LevelUpButton>
                </span>
              </label>
              <div className={handles.luGrantTotal}>
                <span>Total</span>
                <b>{signed(total)}</b>
              </div>
              <label className={handles.luGrantLabel}>
                <span>Motivo · aparece no diário</span>
                <input
                  className={handles.luGrantField}
                  type="text"
                  placeholder="Ex.: Missão rank B — A Torre"
                  value={finalReason}
                  maxLength={300}
                  onChange={(e) => {
                    setTouched(true);
                    setReason(e.target.value);
                  }}
                />
              </label>
              <div className={handles.luGrantPreview} aria-live="polite">
                <div className={handles.luGrantPreviewTop}>
                  <span>Barra de XP</span>
                  <b>
                    {formatXp(progress.into)} → {formatXp(after.into)} /{' '}
                    {formatXp(xpToNext(after.earned) ?? 0)}
                  </b>
                </div>
                <div className={handles.luGrantSegs}>{segs}</div>
                <div className={handles.luGrantSegLabels}>
                  {Array.from({ length: segN }, (_, i) => (
                    <span
                      key={i}
                      style={{
                        flex:
                          segN > 3 ? 1 : (xpToNext(progress.earned + i) ?? 1),
                      }}
                    >
                      nv {progress.earned + i}
                    </span>
                  ))}
                </div>
                <div
                  className={`${handles.luGrantUpLine}${
                    after.into < 0
                      ? ` ${handles.luGrantUpLine}--neg`
                      : ups
                        ? ''
                        : ` ${handles.luGrantUpLine}--none`
                  }`}
                >
                  {after.into < 0
                    ? `A XP fica em ${formatXp(after.into)}. O nível ${progress.earned} não cai; as próximas concessões compensam.`
                    : needNow === null &&
                        after.earned >= progress.earned &&
                        ups === 0
                      ? 'Teto atual. A XP continua acumulando para níveis futuros.'
                      : ups
                        ? `→ sobe para o nível ${after.earned} (${ups} ${ups === 1 ? 'nível' : 'níveis'})`
                        : `Faltam ${formatXp((needNow ?? 0) - progress.into - total)} para o nível ${progress.earned + 1}.`}
                </div>
              </div>
            </div>
            <div className={handles.luGrantFoot}>
              <LevelUpButton
                variant="primary"
                size="lg"
                disabled={!canConfirm}
                onClick={() => {
                  sheetSounds.play('paperSlide');
                  setConfirming(true);
                }}
              >
                {total < 0
                  ? `Corrigir ${formatXp(total)} XP`
                  : `Conceder ${total ? `${formatXp(total)} XP` : 'XP'}`}
              </LevelUpButton>
              <small>
                {!total
                  ? 'Some ao menos uma fonte.'
                  : !finalReason.trim()
                    ? 'Escreva o motivo.'
                    : 'Você confirma na próxima tela.'}
              </small>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default GrantXpLayer;
