import type { IPublicPlayer } from '@/db/players/publicFields';
import { useCssHandles } from '@/hooks/useCssHandles';
import { formatModifier } from '@/lib/stats';
import Block from '../Block';
import Field from '../Field';
import TagList from '../TagList';
import {
  ATTRIBUTES,
  cleanList,
  formatMeters,
  readAttribute,
} from '../sheetData';
import StatusPanelHandles from './handles';

interface IProps {
  player: IPublicPlayer;
}

const StatusPanel = ({ player }: IProps) => {
  const handles = useCssHandles(StatusPanelHandles);

  const identity = [
    ['Idade', player.age],
    ['Altura', player.height],
    ['Tamanho', player.size],
    ['Gênero', player.gender],
    ['Raça', player.race],
    ['Tipo', player.type],
    ['Classe', player.class],
    ['Alinhamento', player.alignment],
    ['Família', player.family],
    ['Clã', player.clan],
    ['Reino', player.kingdom],
    ['Adoração', player.deity],
  ].filter((row): row is [string, string] => !!row[1]);

  const attributes = ATTRIBUTES.map((a) => ({
    ...a,
    data: readAttribute(player, a.key),
  }));
  const hasAttributes = attributes.some((a) => a.data);
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

  const defenses = player.defenses;

  return (
    <>
      {identity.length > 0 && (
        <Block title="Identidade">
          <dl className={handles.sheetIdentity}>
            {identity.map(([term, value]) => (
              <div key={term} className={handles.sheetIdentityItem}>
                <dt className={handles.sheetIdentityTerm}>{term}</dt>
                <dd className={handles.sheetIdentityValue}>{value}</dd>
              </div>
            ))}
          </dl>
        </Block>
      )}

      {hasAttributes && (
        <Block title="Atributos">
          <div className={handles.sheetAttrs}>
            {attributes.map(({ key, abbr, label, data }) => (
              <div key={key} className={handles.sheetAttr} title={label}>
                <span className={handles.sheetAttrAbbr}>{abbr}</span>
                <span className={handles.sheetAttrMod}>
                  {data ? formatModifier(data.modifier) : '—'}
                </span>
                <span className={handles.sheetAttrBreakdown}>
                  {data && !data.flat ? (
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
            ))}
          </div>
          <p className={handles.sheetLegend}>
            {hasBreakdown ? 'Valor + Raça + Classe = Total. ' : ''}O número
            grande é o modificador.
          </p>
        </Block>
      )}

      <Block title="Sentidos e Idiomas">
        <div className={handles.sheetPairs}>
          <Field label="Sentidos">
            <TagList items={senseTags} emptyLabel="Nenhum" />
          </Field>
          <Field label="Idiomas">
            <TagList items={cleanList(player.languages)} emptyLabel="Nenhum" />
          </Field>
        </div>
      </Block>

      <Block title="Defesas">
        <div className={handles.sheetPairs}>
          <Field label="Resistências">
            <TagList items={cleanList(defenses?.resistances)} />
          </Field>
          <Field label="Vulnerabilidades">
            <TagList items={cleanList(defenses?.vulnerabilities)} />
          </Field>
          <Field label="Imunidades a dano">
            <TagList items={cleanList(defenses?.damageImmunities)} />
          </Field>
          <Field label="Imunidades a condição">
            <TagList items={cleanList(defenses?.conditionImmunities)} />
          </Field>
        </div>
      </Block>
    </>
  );
};

export default StatusPanel;
