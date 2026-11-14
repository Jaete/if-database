'use client';

import { useCssHandles } from '@/hooks/useCssHandles';
import { formatModifier } from '@/lib/stats';
import { sheetSounds } from '@/lib/sheetSounds';
import { D10Icon, LockIcon } from '../../../Icons';
import LevelUpViewHandles from '../handles';
import type { IStepProps } from '../types';
import { conModOf, hpBaseOf, hpGainFor } from '../useLevelDraft';

interface IProps extends IStepProps {
  /** Abre o aviso de que a rolagem é definitiva. */
  onAskRoll: () => void;
  locked: boolean;
}

const fmtAt = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });

/**
 * Vida: escolher ANTES de rolar. Valor fixo é imediato; rolar pede o aviso e
 * a rolagem é do servidor, gravada na hora. Depois de rolado, não há volta.
 */
const HpStep = ({ plan, draft, patch, onAskRoll, locked }: IProps) => {
  const handles = useCssHandles(LevelUpViewHandles);
  const hp = plan.hp;
  const con = conModOf(plan, draft);
  const rolled = draft.hpMode === 'roll' && !!hp.roll;
  const fixed = draft.hpMode === 'fixed';
  const gain = hpGainFor(plan, draft);
  const base = hpBaseOf(plan, draft);

  if (hp.mode === 'manual') {
    return (
      <div className={`${handles.luContent} ${handles.luContent}--single`}>
        <div className={handles.luPane}>
          <div className={handles.luPaneHead}>
            <h3>Vida</h3>
            <p>
              A tabela desta classe não diz quanto de vida o nível dá. Escreva a
              vida que este nível acrescenta, como o mestre combinou (de 1 a{' '}
              {hp.manualMax}). Um admin confere no selo.
            </p>
          </div>
          <label className={handles.luHpInput}>
            <span>Vida ganha neste nível</span>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={hp.manualMax}
              value={draft.manualHp}
              placeholder="0"
              onChange={(e) => patch({ manualHp: e.target.value })}
            />
          </label>
          {gain !== null && (
            <div className={handles.luHpReveal}>
              <div>
                <span>Vida máxima</span>
                <div>
                  <s>{hp.current}</s> → {hp.current + gain}
                </div>
              </div>
              <div className={handles.luHpMath}>
                <b>+{gain}</b> neste nível
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`${handles.luContent} ${handles.luContent}--single`}>
      <div className={handles.luPane}>
        <div className={handles.luPaneHead}>
          <h3>Vida</h3>
          <p>
            {plan.className}: <b>{hp.formula || `1d${hp.die}`}</b>. Escolha
            antes de rolar. O modificador de CON ({formatModifier(con)}) entra
            só na vida deste nível.
          </p>
        </div>
        <div
          className={handles.luHpStage}
          role="radiogroup"
          aria-label="Como ganhar vida"
        >
          <button
            type="button"
            className={handles.luHpOpt}
            role="radio"
            aria-checked={fixed}
            disabled={rolled || locked}
            onClick={() => {
              patch({ hpMode: 'fixed' });
              sheetSounds.play('pick');
            }}
          >
            <span data-k>Valor fixo</span>
            <span data-v>{hp.fixed}</span>
            <span data-sum>
              +{Math.max(1, (hp.fixed ?? 0) + con)} PV com CON
            </span>
            <p>
              {fixed
                ? 'Escolhido. Dá para trocar até selar, enquanto nada for rolado.'
                : 'Seguro. A média do dado, arredondada para cima.'}
            </p>
          </button>
          <button
            type="button"
            className={handles.luHpOpt}
            role="radio"
            aria-checked={rolled}
            disabled={rolled || locked}
            onClick={onAskRoll}
          >
            <span data-k>{rolled ? 'Rolado' : 'Rolar o dado'}</span>
            <span className={handles.luDie}>
              <D10Icon />
              <b>{rolled ? hp.roll?.result : `d${hp.die}`}</b>
            </span>
            <span data-sum>
              {rolled
                ? `+${Math.max(1, (hp.roll?.result ?? 0) + con)} PV com CON`
                : `de +${Math.max(1, 1 + con)} a +${Math.max(1, (hp.die ?? 0) + con)} PV com CON`}
            </span>
            <p>
              {rolled
                ? 'Resultado final.'
                : 'Pede confirmação antes. O resultado é final e fica gravado.'}
            </p>
          </button>
        </div>
        {gain !== null && base !== null ? (
          <div className={handles.luHpReveal}>
            <div>
              <span>Vida máxima</span>
              <div>
                <s>{hp.current}</s> → <b>{hp.current + gain}</b>
              </div>
            </div>
            <div className={handles.luHpMath}>
              {base} ({rolled ? `d${hp.die} rolado` : 'fixo'}) + <b>{con}</b>{' '}
              CON = <b>+{gain}</b>
              {rolled && hp.roll && (
                <span className={handles.luAudit}>
                  <LockIcon width={11} height={11} />
                  Rolado em {fmtAt(hp.roll.at)} · auditável{' '}
                  <small>{hp.roll.rollId}</small>
                </span>
              )}
            </div>
            <div className={handles.luHpBar}>
              <i style={{ flex: hp.current }} />
              <i data-add style={{ flex: gain }} />
            </div>
          </div>
        ) : (
          <div className={handles.luNote}>
            Nada foi rolado ainda. Escolha um dos dois.
          </div>
        )}
      </div>
    </div>
  );
};

export default HpStep;
