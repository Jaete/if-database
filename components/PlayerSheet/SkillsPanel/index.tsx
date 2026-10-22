'use client';

import { useState } from 'react';

import type { IPublicPlayer } from '@/db/players/publicFields';
import type { IBonus, ISavingThrow, ISkill } from '@/db/creatures/creatures';
import { useCssHandles } from '@/hooks/useCssHandles';
import { formatModifier, skillValue } from '@/lib/stats';
import Block from '../Block';
import Field from '../Field';
import {
  ATTRIBUTES,
  DASH,
  SKILL_GROUPS,
  attrFromName,
  readAttribute,
  readBonuses,
  sameName,
  sumBonuses,
} from '../sheetData';
import type { AttrKey } from '../sheetData';
import SkillsPanelHandles from './handles';
import EditableTagList from '../EditableTagList';
import { useEditing } from '../EditingContext';
import PromptModal from '@/components/PromptModal';

interface IProps {
  player: IPublicPlayer;
}

const SAVES_PATH = 'proficiencies.savingThrows';
const SKILLS_PATH = 'proficiencies.skills';

const SkillsPanel = ({ player }: IProps) => {
  const handles = useCssHandles(SkillsPanelHandles);
  // Qual perícia está com o modal de bônus aberto, e o modificador do atributo
  // que a governa — preciso dele para recalcular o valor ao confirmar.
  const [bonusFor, setBonusFor] = useState<{
    name: string;
    mod?: number;
  } | null>(null);
  const { editable, objects, setField } = useEditing();
  const pb = player.proficiencyBonus ?? 0;

  // Lidos pelo contexto, e não direto do jogador, para a bolinha refletir o
  // rascunho na hora do clique.
  const saveData = objects<ISavingThrow>(SAVES_PATH);
  const skillData = objects<ISkill>(SKILLS_PATH);

  const modifiers = Object.fromEntries(
    ATTRIBUTES.map((a) => [a.key, readAttribute(player, a.key)?.modifier])
  );

  // `value` é derivado (modificador do atributo + proficiência + bônus), mas
  // fica gravado, e a leitura dá preferência ao gravado — então toda edição
  // precisa regravá-lo, senão o número contradiz a bolinha ao lado.
  //
  // Com o atributo conhecido dá para recalcular do zero. Nas perícias fora da
  // lista padrão não há atributo, então resta aplicar a DIFERENÇA sobre o valor
  // que já estava lá: tira a proficiência e o bônus antigos, põe os novos.
  const recalc = (
    mod: number | undefined,
    entry: ISkill | undefined,
    proficient: boolean,
    bonus: number
  ) => {
    if (mod !== undefined) return skillValue(mod, proficient, pb, bonus);
    const wasProficient = !!entry?.proficient;
    return (
      (entry?.value ?? 0) -
      (entry?.bonus ?? 0) -
      (wasProficient ? pb : 0) +
      bonus +
      (proficient ? pb : 0)
    );
  };

  /** Regrava uma perícia mantendo `bonus` como a soma de `bonuses`. */
  const writeSkill = (
    name: string,
    mod: number | undefined,
    change: { proficient?: boolean; bonuses?: IBonus[] }
  ) => {
    const at = skillData.findIndex((s) => sameName(s.name, name));
    const entry = at >= 0 ? skillData[at] : undefined;
    const proficient = change.proficient ?? !!entry?.proficient;
    const bonuses = change.bonuses ?? readBonuses(entry);
    const bonus = sumBonuses(bonuses);
    const next: ISkill = {
      ...entry,
      name: entry?.name ?? name,
      proficient,
      bonuses,
      bonus,
      value: recalc(mod, entry, proficient, bonus),
    };
    setField(
      SKILLS_PATH,
      at >= 0
        ? skillData.map((s, i) => (i === at ? next : s))
        : [...skillData, next]
    );
  };

  const toggleSkill = (name: string, mod: number | undefined) => {
    const entry = skillData.find((s) => sameName(s.name, name));
    writeSkill(name, mod, { proficient: !entry?.proficient });
  };

  const changeBonuses = (
    name: string,
    mod: number | undefined,
    bonuses: IBonus[]
  ) => writeSkill(name, mod, { bonuses });

  // No teste de resistência a proficiência é implícita: estar na lista é ser
  // proficiente. Alternar, portanto, é entrar ou sair dela.
  const toggleSave = (key: AttrKey, label: string) => {
    const at = saveData.findIndex((s) => attrFromName(s.attribute) === key);
    setField(
      SAVES_PATH,
      at >= 0
        ? saveData.filter((_, i) => i !== at)
        : [...saveData, { attribute: label, value: (modifiers[key] ?? 0) + pb }]
    );
  };

  const known = new Set(SKILL_GROUPS.flatMap((g) => g.skills));
  const extra = skillData.filter(
    (s) => s.name && ![...known].some((k) => sameName(k, s.name))
  );

  const renderSkill = (
    name: string,
    value: number | undefined,
    proficient: boolean,
    bonuses: IBonus[],
    mod?: number
  ) => (
    <div
      key={name}
      className={`${handles.sheetSkill}${
        proficient ? ` ${handles.sheetSkill}--prof` : ''
      }`}
    >
      {editable ? (
        <button
          type="button"
          className={`${handles.sheetSkillPip} ${handles.sheetSkillPip}--button`}
          onClick={() => toggleSkill(name, mod)}
          aria-pressed={proficient}
          aria-label={`${name}: ${proficient ? 'remover' : 'marcar'} proficiência`}
        />
      ) : (
        <span className={handles.sheetSkillPip} aria-hidden="true" />
      )}
      <span>
        {name}
        {proficient && (
          <span className={handles.sheetSrOnly}> (proficiente)</span>
        )}
        {bonuses.map((b, i) => (
          <span
            key={`${b.source ?? ''}:${i}`}
            className={handles.sheetSkillBonus}
            // O popover é CSS puro; `title` cobre quem não usa ponteiro.
            title={b.source || undefined}
            tabIndex={b.source ? 0 : undefined}
          >
            {formatModifier(b.value)}
            {b.source && (
              <span className={handles.sheetBonusPop} role="tooltip">
                {b.source}
              </span>
            )}
            {editable && (
              <button
                type="button"
                className={handles.sheetBonusRemove}
                onClick={() =>
                  changeBonuses(
                    name,
                    mod,
                    bonuses.filter((_, at) => at !== i)
                  )
                }
                aria-label={`${name}: remover bônus ${formatModifier(b.value)}`}
              >
                &times;
              </button>
            )}
          </span>
        ))}
        {editable && (
          <button
            type="button"
            className={handles.sheetBonusAdd}
            onClick={() => setBonusFor({ name, mod })}
          >
            + Bônus
          </button>
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
                {editable ? (
                  <button
                    type="button"
                    className={`${handles.sheetSkillPip} ${handles.sheetSkillPip}--button`}
                    onClick={() => toggleSave(a.key, a.label)}
                    aria-pressed={proficient}
                    aria-label={`${a.label}: ${
                      proficient ? 'remover' : 'marcar'
                    } proficiência`}
                  />
                ) : (
                  // Em leitura o pip só aparece quando há proficiência: é o
                  // "símbolo de habilitado", não um espaço vazio a preencher.
                  proficient && (
                    <span
                      className={handles.sheetSkillPip}
                      aria-hidden="true"
                    />
                  )
                )}
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
                  const bonuses = readBonuses(entry);
                  const value =
                    entry?.value ??
                    (mod !== undefined
                      ? skillValue(mod, proficient, pb, sumBonuses(bonuses))
                      : undefined);
                  return renderSkill(name, value, proficient, bonuses, mod);
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
                renderSkill(s.name!, s.value, !!s.proficient, readBonuses(s))
              )}
            </div>
          )}
        </div>
      </Block>

      <Block title="Proficiências">
        <div className={handles.sheetPairs}>
          <Field label="Armas">
            <EditableTagList path="proficiencies.weapons" label="Armas" />
          </Field>
          <Field label="Armaduras">
            <EditableTagList path="proficiencies.armor" label="Armaduras" />
          </Field>
          <Field label="Ferramentas">
            <EditableTagList path="proficiencies.tools" label="Ferramentas" />
          </Field>
        </div>
      </Block>

      <PromptModal
        isOpen={bonusFor !== null}
        onClose={() => setBonusFor(null)}
        title={`Bônus — ${bonusFor?.name ?? ''}`}
        confirmLabel="Adicionar bônus"
        fields={[
          {
            name: 'value',
            label: 'Valor do bônus',
            type: 'number',
            placeholder: 'ex.: 2 ou -1',
          },
          {
            name: 'source',
            label: 'Origem do bônus',
            placeholder: 'ex.: Manto élfico',
            required: false,
          },
        ]}
        onSubmit={(values) => {
          if (!bonusFor) return;
          const value = Number(values.value);
          if (!Number.isFinite(value) || value === 0) return;
          changeBonuses(bonusFor.name, bonusFor.mod, [
            ...readBonuses(
              skillData.find((s) => sameName(s.name, bonusFor.name))
            ),
            { value, source: values.source || undefined },
          ]);
        }}
      />
    </>
  );
};

export default SkillsPanel;
