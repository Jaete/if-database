'use client';

import { useState } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import { sheetSounds } from '@/lib/sheetSounds';
import { parseGilFormula } from '@/lib/creation';
import { LockIcon } from '../../../Icons';
import LevelUpButton from '../../LevelUpButton';
import LevelUpDetail from '../../LevelUpDetail';
import LevelUpViewHandles from '../../LevelUpView/handles';
import CreationViewHandles from '../handles';
import { useStep } from '../useStep';

/**
 * Equipamento (texto livre, recomendado) e o gil inicial: rolado no servidor,
 * uma vez, com a fórmula da classe. Depois de rolado não há volta.
 */
const EquipmentStep = () => {
  const lu = useCssHandles(LevelUpViewHandles);
  const handles = useCssHandles(CreationViewHandles);
  const { creation, data, player, d } = useStep();
  const [text, setText] = useState<string | null>(null);
  const [ack, setAck] = useState(false);
  const [asking, setAsking] = useState(false);
  const k = d.klass;
  const formula = parseGilFormula(k?.startingGil);
  // O gil vale por classe: a rolagem é a da classe atual.
  const roll = data.rolls.find(
    (r) => r.kind === 'gil' && r.classSlug === k?.slug
  );
  const gil = Number(player.equipment?.gil) || 0;

  const doRoll = async () => {
    setAsking(false);
    setAck(false);
    sheetSounds.die(0.8);
    const result = await creation.rollGil();
    if (result) sheetSounds.play('dieBell');
  };

  return (
    <div className={lu.luContent}>
      <div className={lu.luPane}>
        <div className={lu.luPaneHead}>
          <h3>Equipamento e gil</h3>
          <p>Recomendado. Descreva o que o personagem leva.</p>
        </div>
        <label className={handles.crField}>
          <span>Equipamento e mochila</span>
          <textarea
            className={handles.crTextarea}
            rows={8}
            value={text ?? String(player.equipment?.backpack ?? '')}
            maxLength={20000}
            disabled={!creation.canEdit}
            onChange={(e) => {
              setText(e.target.value);
              creation.patch({
                fields: { equipment: { backpack: e.target.value } },
              });
            }}
          />
        </label>
        <div className={lu.luPaneHead}>
          <h3>Gil inicial</h3>
          <p>
            {k
              ? formula
                ? `${k.name}: ${k.startingGil}. A rolagem é do servidor, definitiva e gravada.`
                : `${k.name} não tem fórmula de gil inicial. A staff define.`
              : 'Escolha a classe primeiro.'}
          </p>
        </div>
        {roll ? (
          <div className={lu.luHpReveal}>
            <div>
              <span>Gil inicial</span>
              <div>
                <b>{gil}</b>
              </div>
            </div>
            <div className={lu.luHpMath}>
              {roll.sets[0].join(' + ')}
              {roll.formula ? ` (${roll.formula})` : ''} = <b>{gil}</b>
              <span className={lu.luAudit}>
                <LockIcon width={11} height={11} />
                Rolado em{' '}
                {new Date(roll.at).toLocaleString('pt-BR', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                })}{' '}
                · auditável <small>{roll.rollId}</small>
              </span>
            </div>
          </div>
        ) : (
          formula && (
            <div>
              <LevelUpButton
                variant="secondary"
                disabled={!creation.canEdit || creation.busy}
                onClick={() => setAsking(true)}
              >
                Rolar {k?.startingGil}
              </LevelUpButton>
            </div>
          )
        )}
        {asking && (
          <div
            className={lu.luNote}
            role="alertdialog"
            aria-label="Rolar o gil"
          >
            <b>A rolagem é definitiva.</b> Fica gravada com data e hora, e não
            há segunda rolagem.
            <label className={lu.luCheck}>
              <input
                type="checkbox"
                checked={ack}
                onChange={(e) => setAck(e.target.checked)}
              />
              Entendi que o resultado é definitivo
            </label>
            <div className={lu.luDialogActs}>
              <LevelUpButton onClick={() => setAsking(false)}>
                Cancelar
              </LevelUpButton>
              <LevelUpButton
                variant="primary"
                disabled={!ack}
                onClick={() => void doRoll()}
              >
                Rolar
              </LevelUpButton>
            </div>
          </div>
        )}
      </div>
      <LevelUpDetail
        kind="Gil"
        title={roll ? `${gil} gil` : 'Ainda não rolado'}
        body="O gil inicial vem da classe: simples, médio ou nobre, conforme a vida que o personagem levava."
      />
    </div>
  );
};

export default EquipmentStep;
