'use client';

import { useCssHandles } from '@/hooks/useCssHandles';
import { sheetSounds } from '@/lib/sheetSounds';
import { ATTRIBUTE_LABELS } from '@/lib/levelUp';
import { useCatalogRequest } from '../../CatalogLayerContext';
import LevelUpButton from '../../LevelUpButton';
import LevelUpDetail from '../../LevelUpDetail';
import LevelUpViewHandles from '../../LevelUpView/handles';
import CreationViewHandles from '../handles';
import { useStep } from '../useStep';

/** Classe pelo códice: classes únicas já tomadas aparecem bloqueadas lá. */
const ClassStep = () => {
  const lu = useCssHandles(LevelUpViewHandles);
  const handles = useCssHandles(CreationViewHandles);
  const { creation, d } = useStep();
  const catalog = useCatalogRequest();
  const k = d.klass;

  return (
    <div className={lu.luContent}>
      <div className={lu.luPane}>
        <div className={lu.luPaneHead}>
          <h3>Classe</h3>
          <p>
            A classe define vida, perícias, magias e o gil inicial. Trocar de
            classe depois zera o que dependia dela (perícias, escolhas e
            magias).
          </p>
        </div>
        <div className={handles.crPlate}>
          <div className={handles.crPlateBody}>
            <span className={handles.crPlateName}>
              {k?.name ?? 'Nenhuma classe escolhida'}
            </span>
            {k && (
              <span className={handles.crChips}>
                <span className={handles.crChip}>
                  {k.hitDie ? `dado de vida d${k.hitDie}` : 'sem dado de vida'}
                </span>
                {k.savingThrows.map((s) => (
                  <span key={s} className={handles.crChip}>
                    resist. {ATTRIBUTE_LABELS[s][0]}
                  </span>
                ))}
                {k.spellcastingAbility && (
                  <span className={handles.crChip}>
                    conjura com {ATTRIBUTE_LABELS[k.spellcastingAbility][0]}
                  </span>
                )}
              </span>
            )}
          </div>
        </div>
        <div>
          <LevelUpButton
            variant="primary"
            size="lg"
            disabled={!creation.canEdit}
            onClick={() => {
              sheetSounds.play('paperSlide');
              catalog.open({ kind: 'class' });
            }}
          >
            {k ? 'Trocar no códice' : 'Abrir o códice de classes'}
          </LevelUpButton>
        </div>
        {k && k.autoFeatures.length > 0 && (
          <div className={lu.luNote}>
            Características do nível 1: <b>{k.autoFeatures.join(', ')}</b>.
          </div>
        )}
      </div>
      <LevelUpDetail
        kind="Classe"
        title={k?.name ?? 'Escolha no códice'}
        body={
          k
            ? [
                k.hpAtFirstLevel && `Vida no 1º nível: ${k.hpAtFirstLevel}.`,
                k.startingGil && `Gil inicial: ${k.startingGil}.`,
              ]
                .filter(Boolean)
                .join('\n')
            : 'O códice mostra cada classe por inteiro antes de aplicar.'
        }
      />
    </div>
  );
};

export default ClassStep;
