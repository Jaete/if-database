'use client';

import { useCssHandles } from '@/hooks/useCssHandles';
import { sheetSounds } from '@/lib/sheetSounds';
import { ATTRIBUTE_LABELS } from '@/lib/levelUp';
import type { AttributeKey } from '@/lib/stats';
import { useCatalogRequest } from '../../CatalogLayerContext';
import LevelUpButton from '../../LevelUpButton';
import LevelUpDetail from '../../LevelUpDetail';
import LevelUpPill from '../../LevelUpPill';
import LevelUpViewHandles from '../../LevelUpView/handles';
import CreationViewHandles from '../handles';
import { useStep } from '../useStep';

const KEYS: AttributeKey[] = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

/**
 * Raça pelo códice: a escolha feita vira uma placa com os bônus, e "Abrir o
 * códice" abre o catálogo de raças em modo escolha (com o Mestiço em três
 * passos e as raças únicas já bloqueadas).
 */
const RaceStep = () => {
  const lu = useCssHandles(LevelUpViewHandles);
  const handles = useCssHandles(CreationViewHandles);
  const { creation, player, d } = useStep();
  const catalog = useCatalogRequest();
  const lineage = player.lineage;
  const rule = d.rule;

  const bonusChips = [
    ...KEYS.filter((k) => d.spec.fixed[k]).map(
      (k) => `${ATTRIBUTE_LABELS[k][0]} +${d.spec.fixed[k]}`
    ),
    ...d.spec.free.map((n) => `+${n} à escolha`),
  ];

  const note =
    rule?.mode === 'auto'
      ? `Sem escolher variante, vale a variante comum.`
      : rule?.mode === 'optional'
        ? `Sem sub-raça você é ${rule.label}.`
        : rule?.mode === 'required'
          ? 'Esta raça exige uma sub-raça.'
          : rule?.mode === 'mixed'
            ? 'Mestiço: origens, sangue forte e herança híbrida.'
            : '';

  return (
    <div className={lu.luContent}>
      <div className={lu.luPane}>
        <div className={lu.luPaneHead}>
          <h3>Raça</h3>
          <p>
            A raça vem do códice. Raça e sub-raça somam as habilidades; os bônus
            de atributo aparecem no passo <b>Atributos</b>.
          </p>
        </div>
        <div className={handles.crPlate}>
          <div
            className={handles.crPlateArt}
            style={
              lineage?.image
                ? {
                    backgroundImage: `url(${lineage.image.url})`,
                    backgroundPosition: lineage.image.focus,
                  }
                : undefined
            }
            aria-hidden="true"
          />
          <div className={handles.crPlateBody}>
            <span className={handles.crPlateName}>
              {d.race
                ? rule?.mode === 'optional' && !lineage?.subrace
                  ? rule.label
                  : String(player.race ?? d.race.name)
                : 'Nenhuma raça escolhida'}
            </span>
            {d.race && (
              <span className={handles.crChips}>
                {bonusChips.length > 0 ? (
                  bonusChips.map((c, i) => (
                    <span key={`${c}-${i}`} className={handles.crChip}>
                      {c}
                    </span>
                  ))
                ) : (
                  <span className={handles.crChip}>sem bônus de atributo</span>
                )}
                {d.race.unique && (
                  <LevelUpPill tone="warn">raça única</LevelUpPill>
                )}
              </span>
            )}
            {note && <small className={handles.crRule}>{note}</small>}
            {lineage?.issues?.map((issue) => (
              <small key={issue} className={handles.crRule} role="status">
                {issue}
              </small>
            ))}
          </div>
        </div>
        <div>
          <LevelUpButton
            variant="primary"
            size="lg"
            disabled={!creation.canEdit}
            onClick={() => {
              sheetSounds.play('paperSlide');
              catalog.open({ kind: 'race' });
            }}
          >
            {d.race ? 'Trocar no códice' : 'Abrir o códice de raças'}
          </LevelUpButton>
        </div>
        {d.race && (
          <div className={lu.luNote}>
            Idiomas da raça (já incluídos):{' '}
            <b>{d.locked.join(', ') || 'Comum'}</b>.
          </div>
        )}
      </div>
      <LevelUpDetail
        kind="Raça"
        title={
          d.race ? String(player.race ?? d.race.name) : 'Escolha no códice'
        }
        body={
          lineage
            ? [lineage.size, lineage.speed].filter(Boolean).join('\n')
            : 'O códice mostra as habilidades de cada raça e sub-raça antes de aplicar.'
        }
      />
    </div>
  );
};

export default RaceStep;
