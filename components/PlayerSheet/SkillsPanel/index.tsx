import type { IPublicPlayer } from '@/db/players/publicFields';
import { useCssHandles } from '@/hooks/useCssHandles';
import { formatModifier, skillValue } from '@/lib/stats';
import Block from '../Block';
import Field from '../Field';
import TagList from '../TagList';
import {
  ATTRIBUTES,
  DASH,
  SKILL_GROUPS,
  attrFromName,
  cleanList,
  readAttribute,
  sameName,
} from '../sheetData';
import SkillsPanelHandles from './handles';

interface IProps {
  player: IPublicPlayer;
}

const SkillsPanel = ({ player }: IProps) => {
  const handles = useCssHandles(SkillsPanelHandles);
  const pb = player.proficiencyBonus ?? 0;
  const saveData = player.proficiencies?.savingThrows ?? [];
  const skillData = player.proficiencies?.skills ?? [];

  const modifiers = Object.fromEntries(
    ATTRIBUTES.map((a) => [a.key, readAttribute(player, a.key)?.modifier])
  );

  const known = new Set(SKILL_GROUPS.flatMap((g) => g.skills));
  const extra = skillData.filter(
    (s) => s.name && ![...known].some((k) => sameName(k, s.name))
  );

  const renderSkill = (
    name: string,
    value: number | undefined,
    proficient: boolean,
    bonus: number
  ) => (
    <div
      key={name}
      className={`${handles.sheetSkill}${
        proficient ? ` ${handles.sheetSkill}--prof` : ''
      }`}
    >
      <span className={handles.sheetSkillPip} aria-hidden="true" />
      <span>
        {name}
        {proficient && (
          <span className={handles.sheetSrOnly}> (proficiente)</span>
        )}
        {bonus !== 0 && (
          <span className={handles.sheetSkillBonus}>
            {formatModifier(bonus)}
          </span>
        )}
      </span>
      <span className={handles.sheetSkillValue}>
        {value !== undefined ? formatModifier(value) : DASH}
      </span>
    </div>
  );

  return (
    <>
      <Block title="Testes de Resistência">
        <div className={handles.sheetSaves}>
          {ATTRIBUTES.map((a) => {
            const entry = saveData.find(
              (s) => attrFromName(s.attribute) === a.key
            );
            const proficient = !!entry;
            const value = entry?.value ?? modifiers[a.key];
            return (
              <div
                key={a.key}
                className={`${handles.sheetSave}${
                  proficient ? ` ${handles.sheetSave}--prof` : ''
                }`}
                title={a.label}
              >
                <span className={handles.sheetCaption}>{a.abbr}</span>
                <span className={handles.sheetSaveValue}>
                  {value !== undefined ? formatModifier(value) : DASH}
                </span>
                {proficient && (
                  <span className={handles.sheetSrOnly}>proficiente</span>
                )}
              </div>
            );
          })}
        </div>
      </Block>

      <Block title="Perícias">
        <div className={handles.sheetSkillGroups}>
          {SKILL_GROUPS.map((group) => {
            const attr = ATTRIBUTES.find((a) => a.key === group.attr)!;
            const mod = modifiers[group.attr];
            return (
              <div key={group.attr} className={handles.sheetSkillGroup}>
                <div className={handles.sheetSkillGroupHead}>
                  <span className={handles.sheetSkillGroupName}>
                    {attr.label}
                  </span>
                  <span className={handles.sheetSkillGroupMod}>
                    {attr.abbr} {mod !== undefined ? formatModifier(mod) : DASH}
                  </span>
                </div>
                {group.skills.map((name) => {
                  const entry = skillData.find((s) => sameName(s.name, name));
                  const proficient = !!entry?.proficient;
                  const bonus = entry?.bonus ?? 0;
                  const value =
                    entry?.value ??
                    (mod !== undefined
                      ? skillValue(mod, proficient, pb, bonus)
                      : undefined);
                  return renderSkill(name, value, proficient, bonus);
                })}
              </div>
            );
          })}
          {extra.length > 0 && (
            <div className={handles.sheetSkillGroup}>
              <div className={handles.sheetSkillGroupHead}>
                <span className={handles.sheetSkillGroupName}>Outras</span>
              </div>
              {extra.map((s) =>
                renderSkill(s.name!, s.value, !!s.proficient, s.bonus ?? 0)
              )}
            </div>
          )}
        </div>
      </Block>

      <Block title="Proficiências">
        <div className={handles.sheetPairs}>
          <Field label="Armas">
            <TagList items={cleanList(player.proficiencies?.weapons)} />
          </Field>
          <Field label="Armaduras">
            <TagList items={cleanList(player.proficiencies?.armor)} />
          </Field>
          <Field label="Ferramentas">
            <TagList items={cleanList(player.proficiencies?.tools)} />
          </Field>
        </div>
      </Block>
    </>
  );
};

export default SkillsPanel;
