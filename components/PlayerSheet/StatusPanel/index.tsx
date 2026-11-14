'use client';

import type { IPublicPlayer } from '@/db/players/publicFields';
import { useCssHandles } from '@/hooks/useCssHandles';
import { abilityChips } from '@/lib/raceAbilityChips';
import { formatModifier, modifierOf } from '@/lib/stats';
import { useRaceChoice } from '../useRaceChoice';
import Block from '../Block';
import LineagePlate from '../LineagePlate';
import Field from '../Field';
import TagList from '../TagList';
import type { ScreenId } from '../sheetData';
import {
  ATTRIBUTES,
  formatMeters,
  IDENTITY_FIELDS,
  readAttribute,
  SENSE_FIELDS,
} from '../sheetData';
import { useEditing } from '../EditingContext';
import EditableText from '../EditableText';
import EditableTagList from '../EditableTagList';
import StatusPanelHandles from './handles';

interface IProps {
  player: IPublicPlayer;
  onOpenScreen: (id: ScreenId) => void;
}

const StatusPanel = ({ player, onOpenScreen }: IProps) => {
  const handles = useCssHandles(StatusPanelHandles);
  const { editable, value } = useEditing();
  const { lineage } = useRaceChoice();

  // Em leitura, só as linhas preenchidas. Em edição, todas — senão um campo
  // vazio nunca poderia ser preenchido a partir da ficha. Com a raça ligada ao
  // códice, a linha "Raça" sai: a placa acima é quem a mostra e a edita.
  const identity = IDENTITY_FIELDS.filter(
    (field) =>
      (editable || !!value(field.path)) && !(lineage && field.path === 'race')
  );

  // O que a raça sugere para a coluna "Raça". Só informa: o texto do tópico
  // pode ser "à escolha", então a ficha nunca preenche o número sozinha.
  const suggested =
    editable && lineage && !lineage.mixed
      ? lineage.abilityScoreIncrease.flatMap((text) => abilityChips(text))
      : [];
  const suggestedFixed = suggested
    .filter((chip) => chip.kind === 'fixed')
    .map((chip) => chip.label);
  const filled = ATTRIBUTES.flatMap(({ key, abbr }) => {
    const bonus = Number(value(`playerStats.${key}.raceBonus`) ?? 0);
    return bonus ? [`${abbr} ${formatModifier(bonus)}`] : [];
  });
  const mismatch =
    suggestedFixed.length > 0 &&
    [...suggestedFixed].sort().join('·') !== [...filled].sort().join('·');

  const attributes = ATTRIBUTES.map((a) => ({
    ...a,
    data: readAttribute(player, a.key),
  }));
  const hasAttributes = editable || attributes.some((a) => a.data);
  const hasBreakdown = attributes.some((a) => a.data && !a.data.flat);

  const senses = player.senses;
  const senseTags = [
    senses?.darkvision !== undefined &&
      `Visão no escuro ${formatMeters(senses.darkvision)}`,
    senses?.blindsight !== undefined &&
      `Visão às cegas ${formatMeters(senses.blindsight)}`,
    senses?.tremorsense !== undefined &&
      `Sentido sísmico ${formatMeters(senses.tremorsense)}`,
    senses?.truesight !== undefined &&
      `Visão verdadeira ${formatMeters(senses.truesight)}`,
    senses?.passivePerception !== undefined &&
      `Percepção passiva ${senses.passivePerception}`,
  ].filter((t): t is string => !!t);

  return (
    <div className={handles.sheetStatus}>
      <div className={handles.sheetStatusLineage}>
        <LineagePlate onOpenAbilities={() => onOpenScreen('habilidades')} />
      </div>

      {identity.length > 0 && (
        <div className={handles.sheetStatusIdent}>
          <Block title="Identidade">
            <dl className={handles.sheetIdentity}>
              {identity.map(({ path, label }) => (
                <div key={path} className={handles.sheetIdentityItem}>
                  <dt className={handles.sheetIdentityTerm}>{label}</dt>
                  <dd className={handles.sheetIdentityValue}>
                    <EditableText path={path} label={label}>
                      {value(path)}
                    </EditableText>
                  </dd>
                </div>
              ))}
            </dl>
          </Block>
        </div>
      )}

      {hasAttributes && (
        <div className={handles.sheetStatusAttrs}>
          <Block title="Atributos">
            <div className={handles.sheetAttrs}>
              {attributes.map(({ key, abbr, label, data }) => {
                // Em edição, o modificador e o total vêm do rascunho a cada
                // tecla, para o número grande acompanhar o que está sendo
                // digitado. O servidor recalcula os dois na gravação, de modo que
                // este cálculo é só apresentação.
                const live = editable
                  ? Number(value(`playerStats.${key}.base`) ?? 0) +
                    Number(value(`playerStats.${key}.raceBonus`) ?? 0) +
                    Number(value(`playerStats.${key}.classBonus`) ?? 0)
                  : null;

                return (
                  <div key={key} className={handles.sheetAttr} title={label}>
                    <span className={handles.sheetAttrAbbr}>{abbr}</span>
                    <span className={handles.sheetAttrLabel}>{label}</span>
                    <span className={handles.sheetAttrMod}>
                      {editable
                        ? formatModifier(modifierOf(live ?? 0))
                        : data
                          ? formatModifier(data.modifier)
                          : '—'}
                    </span>
                    <span className={handles.sheetAttrBreakdown}>
                      {editable ? (
                        <>
                          <EditableText
                            path={`playerStats.${key}.base`}
                            label={`${label}: valor`}
                            as="number"
                            placeholder="0"
                          >
                            {value(`playerStats.${key}.base`)}
                          </EditableText>{' '}
                          <EditableText
                            path={`playerStats.${key}.raceBonus`}
                            label={`${label}: bônus de raça`}
                            as="number"
                            placeholder="+0"
                          >
                            {value(`playerStats.${key}.raceBonus`)}
                          </EditableText>{' '}
                          <EditableText
                            path={`playerStats.${key}.classBonus`}
                            label={`${label}: bônus de classe`}
                            as="number"
                            placeholder="+0"
                          >
                            {value(`playerStats.${key}.classBonus`)}
                          </EditableText>{' '}
                          = <b>{live}</b>
                        </>
                      ) : data && !data.flat ? (
                        <>
                          {data.base} {formatModifier(data.raceBonus ?? 0)}{' '}
                          {formatModifier(data.classBonus ?? 0)} ={' '}
                          <b>{data.total}</b>
                        </>
                      ) : data ? (
                        <b>{data.total}</b>
                      ) : null}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className={handles.sheetLegend}>
              {hasBreakdown ? 'Valor + Raça + Classe = Total. ' : ''}O número
              grande é o modificador.
            </p>
            {editable && lineage && (
              <p className={handles.sheetLegend}>
                {lineage.mixed
                  ? 'Mestiço: o incremento segue o que o mestre combinar para a mistura. Preencha a coluna Raça à mão.'
                  : `${lineage.subrace ? `${lineage.name} · ${lineage.subrace.name}` : lineage.name} sugere ${
                      suggested.map((chip) => chip.label).join(' · ') || '—'
                    }.`}
                {mismatch && (
                  <span className={handles.sheetLegendWarn}>
                    {' '}
                    A coluna Raça soma {filled.join(' · ') || 'nada'}. Confira.
                  </span>
                )}
              </p>
            )}
          </Block>
        </div>
      )}

      <div className={handles.sheetStatusSenses}>
        <Block title="Sentidos e Idiomas">
          <div className={handles.sheetPairs}>
            {/* Em leitura os sentidos são tags já formatadas ("Visão no escuro
              18,0 m"); editar exige o número cru, então em edição cada um vira
              uma linha própria. Idiomas e defesas são listas de tamanho
              variável e continuam somente-leitura por enquanto. */}
            {editable ? (
              SENSE_FIELDS.map(({ path, label, meters }) => (
                <Field key={path} label={`${label}${meters ? ' (m)' : ''}`}>
                  <EditableText path={path} label={label} as="number">
                    {value(path)}
                  </EditableText>
                </Field>
              ))
            ) : (
              <Field label="Sentidos">
                <TagList items={senseTags} emptyLabel="Nenhum" />
              </Field>
            )}
            <Field label="Idiomas">
              <EditableTagList
                path="languages"
                label="Idiomas"
                emptyLabel="Nenhum"
              />
            </Field>
          </div>
        </Block>
      </div>

      <div className={handles.sheetStatusDefenses}>
        <Block title="Defesas">
          <div className={handles.sheetPairs}>
            <Field label="Resistências">
              <EditableTagList
                path="defenses.resistances"
                label="Resistências"
              />
            </Field>
            <Field label="Vulnerabilidades">
              <EditableTagList
                path="defenses.vulnerabilities"
                label="Vulnerabilidades"
              />
            </Field>
            <Field label="Imunidades a dano">
              <EditableTagList
                path="defenses.damageImmunities"
                label="Imunidades a dano"
              />
            </Field>
            <Field label="Imunidades a condição">
              <EditableTagList
                path="defenses.conditionImmunities"
                label="Imunidades a condição"
              />
            </Field>
          </div>
        </Block>
      </div>
    </div>
  );
};

export default StatusPanel;
