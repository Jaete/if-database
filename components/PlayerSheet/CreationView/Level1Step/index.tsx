'use client';

import { useState } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import { sheetSounds } from '@/lib/sheetSounds';
import { formatModifier, modifierOf } from '@/lib/stats';
import LevelUpChoice from '../../LevelUpChoice';
import LevelUpDetail from '../../LevelUpDetail';
import LevelUpViewHandles from '../../LevelUpView/handles';
import CreationViewHandles from '../handles';
import { useStep } from '../useStep';

/**
 * Nível 1: a vida é automática (o máximo do dado de vida mais o modificador de
 * CON, já com a raça), sem dado nem escolha. O que sobra é escolher entre as
 * características "uma OU outra" do nível.
 */
const Level1Step = () => {
  const lu = useCssHandles(LevelUpViewHandles);
  const handles = useCssHandles(CreationViewHandles);
  const { creation, data, d } = useStep();
  const k = d.klass;
  const [hover, setHover] = useState<string | null>(null);

  if (!k) {
    return (
      <div className={`${lu.luContent} ${lu.luContent}--single`}>
        <div className={lu.luPane}>
          <div className={lu.luNote}>Escolha a classe primeiro.</div>
        </div>
      </div>
    );
  }
  const con = d.totals.con;
  const picks = data.creation.featureChoices ?? [];
  const options = k.featureChoices.flatMap((g) => g.options);
  const focus = hover ?? picks.find(Boolean) ?? options[0] ?? k.autoFeatures[0];

  return (
    <div className={lu.luContent}>
      <div className={lu.luPane}>
        <div className={lu.luPaneHead}>
          <h3>Vida e características</h3>
          <p>
            No 1º nível a vida é o <b>máximo do dado</b> mais o modificador de
            CON. Sem rolagem e sem escolha.
          </p>
        </div>
        <div className={lu.luHpReveal}>
          <div>
            <span>Vida máxima</span>
            <div>
              <s>0</s> →{' '}
              <b>{d.hp !== null ? d.hp : k.hitDie ? '?' : 'a definir'}</b>
            </div>
          </div>
          <div className={lu.luHpMath}>
            {k.hitDie ? (
              d.placed ? (
                <>
                  {k.hitDie} (d{k.hitDie} máximo) +{' '}
                  <b>{modifierOf(con.total)}</b> CON ({formatModifier(con.mod)})
                  = <b>{d.hp}</b>
                </>
              ) : (
                <>
                  {k.hitDie} (d{k.hitDie} máximo) + CON. Atribua os atributos
                  para ver o total.
                </>
              )
            ) : (
              'Esta classe não tem dado de vida: a staff define a vida na revisão.'
            )}
          </div>
        </div>
        {k.hpAtFirstLevel && (
          <small className={handles.crHint}>
            O tópico da classe diz &ldquo;{k.hpAtFirstLevel}&rdquo;; vale o
            máximo do dado.
          </small>
        )}
        {k.autoFeatures.length > 0 && (
          <div className={handles.crAuto}>
            <b>Concedidas pelo nível 1</b>
            <span>{k.autoFeatures.join(' · ')}</span>
          </div>
        )}
        {k.featureChoices.map((group, gi) => (
          <div key={gi} className={lu.luPane}>
            <div className={lu.luPaneHead}>
              <h3>Escolha uma característica</h3>
              <p>É uma opção ou a outra: destas, fica uma.</p>
            </div>
            <div className={lu.luChoices} role="radiogroup">
              {group.options.map((name) => (
                <LevelUpChoice
                  key={name}
                  name={name}
                  description={k.featureText[name]}
                  selected={picks[gi] === name}
                  onHover={() => setHover(name)}
                  onSelect={() => {
                    if (!creation.canEdit) return;
                    const next = [...picks];
                    next[gi] = name;
                    creation.patch({ creation: { featureChoices: next } });
                    sheetSounds.play('pick');
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      {focus && (
        <LevelUpDetail
          kind="Característica · nível 1"
          title={focus}
          body={k.featureText[focus]}
        />
      )}
    </div>
  );
};

export default Level1Step;
