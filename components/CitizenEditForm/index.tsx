'use client';

import type ICitizen from '@/db/citizens/citizen.d';
import type {
  EditFormVariant,
  FormDataType,
  IEditFormPersistence,
} from './useCitizenEditForm';
import { useCitizenEditForm } from './useCitizenEditForm';
import { useCssHandles } from '@/hooks/useCssHandles';
import CitizenEditFormHandles from './handles';
import FormField from '../FormField';
import { DownloadIcon, FilePlusIcon } from '../Icons';
import SpellList from './SpellList';
import SpellLinkList from './SpellLinkList';
import ArchetypeSelect from './ArchetypeSelect';
import ClassSelect from './ClassSelect';
import ArrayItemWrapper from '../ArrayItemWrapper';
import { attrMapping } from '@/db/l10n/attributesMapping';
import AlertModal from '../AlertModal';
import DefensesFields from '../DefensesFields';
import { formatModifier } from '@/lib/stats';
import PlayerFields from '../PlayerFields';
import '@/styles/components/citizenEditForm.scss';

export {
  citizenToFormData,
  emptyCitizen,
  type FormDataType,
} from './useCitizenEditForm';

interface IProps {
  citizen?: ICitizen;
  onClose: () => void;
  mode?: 'create' | 'edit';
  // 'player' acrescenta a seção de vínculo e grava os campos de jogador.
  variant?: EditFormVariant;
  persist: IEditFormPersistence;
  externalFormData?: FormDataType;
  onFormDataChange?: (data: FormDataType) => void;
}

const STAT_KEYS = ['str', 'dex', 'con', 'int', 'wis', 'cha'] as const;

const CitizenEditForm = ({
  citizen,
  onClose,
  mode = 'edit',
  variant = 'citizen',
  persist,
  externalFormData,
  onFormDataChange,
}: IProps) => {
  const handles = useCssHandles(CitizenEditFormHandles);
  const {
    isCreate,
    formData,
    setFormData,
    isSubmitting,
    alertMsg,
    setAlertMsg,
    fileInputMarkdownRef,
    isImportingMarkdown,
    handleDownloadTemplate,
    handleMarkdownUpload,
    handleChange,
    handleNestedChange,
    handleStatChange,
    handleSavingThrowChange,
    addSavingThrow,
    removeSavingThrow,
    skillRows,
    toggleSkillProficiency,
    handleSkillBonusChange,
    handleAbilityChange,
    addAbility,
    removeAbility,
    handleProfessionChange,
    addProfession,
    removeProfession,
    handleSpellSlotChange,
    addSpellSlot,
    removeSpellSlot,
    setSpellAt,
    setSpellRefs,
    setCharacterClass,
    setArchetype,
    removeSpellAt,
    handleDefensesChange,
    handleLanguagesChange,
    isImportingSheet,
    handleOwnerChange,
    handleTopicUrlChange,
    handleImportSheet,
    handleSubmit,
  } = useCitizenEditForm({
    citizen,
    onClose,
    mode,
    variant,
    persist,
    externalFormData,
    onFormDataChange,
  });

  return (
    <>
      <form className={handles.citizenEditForm} onSubmit={handleSubmit}>
        {/* Header Actions */}
        <div className={handles.headerActions}>
          <input
            type="file"
            accept=".md,.docx"
            className={handles.fileInputMarkdown}
            ref={fileInputMarkdownRef}
            onChange={handleMarkdownUpload}
          />
          <button
            type="button"
            className={handles.importMarkdownButton}
            onClick={() => fileInputMarkdownRef.current?.click()}
            disabled={isImportingMarkdown}
          >
            <FilePlusIcon />
            {isImportingMarkdown ? 'Importando...' : 'Importar Ficha (.md)'}
          </button>
          <button
            type="button"
            className={handles.downloadTemplateButton}
            onClick={handleDownloadTemplate}
          >
            <DownloadIcon />
            Baixar Modelo
          </button>
        </div>

        {variant === 'player' && (
          <div className={handles.section}>
            <h3 className={handles.sectionTitle}>Jogador</h3>
            <PlayerFields
              ownerUsername={formData.ownerUsername}
              forumTopicUrl={formData.forumTopicUrl}
              onOwnerChange={handleOwnerChange}
              onTopicUrlChange={handleTopicUrlChange}
              onImport={handleImportSheet}
              isImporting={isImportingSheet}
            />
          </div>
        )}

        {/* ── Informações Básicas ──────────────────────── */}
        <div className={handles.section}>
          <h3 className={handles.sectionTitle}>Informações Básicas</h3>
          <div className={handles.grid2}>
            <FormField
              label="Nome"
              id="name"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              required
            />
            <FormField
              label="Imagem (URL)"
              id="image"
              name="image"
              value={formData.image || ''}
              onChange={handleChange}
            />
          </div>
          <div className={handles.grid2}>
            <FormField
              label="Ícone (URL)"
              id="icon"
              name="icon"
              value={formData.icon || ''}
              onChange={handleChange}
            />
          </div>
          <div className={handles.grid2}>
            <FormField
              label="Raça"
              id="race"
              name="race"
              value={formData.race || ''}
              onChange={handleChange}
            />
            <ClassSelect
              classId={formData.classId}
              value={formData.class || ''}
              holderId={citizen?._id ? String(citizen._id) : undefined}
              onChange={setCharacterClass}
            />
          </div>
          <div className={handles.grid4}>
            <FormField
              label="Idade"
              id="age"
              name="age"
              value={formData.age || ''}
              onChange={handleChange}
            />
            <FormField
              label="Altura"
              id="height"
              name="height"
              value={formData.height || ''}
              onChange={handleChange}
            />
            <FormField
              label="Gênero"
              id="gender"
              name="gender"
              value={formData.gender || ''}
              onChange={handleChange}
            />
            <FormField
              label="Alinhamento"
              id="alignment"
              name="alignment"
              value={formData.alignment || ''}
              onChange={handleChange}
            />
          </div>
          <div className={handles.grid3}>
            <FormField
              label="Família"
              id="family"
              name="family"
              value={formData.family || ''}
              onChange={handleChange}
            />
            <FormField
              label="Reino"
              id="kingdom"
              name="kingdom"
              value={formData.kingdom || ''}
              onChange={handleChange}
            />
            <FormField
              label="Clã"
              id="clan"
              name="clan"
              value={formData.clan || ''}
              onChange={handleChange}
            />
          </div>
          <div className={handles.grid3}>
            <FormField
              label="Adoração"
              id="deity"
              name="deity"
              value={formData.deity || ''}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* ── Progressão ───────────────────────────────── */}
        <div className={handles.section}>
          <h3 className={handles.sectionTitle}>Progressão</h3>
          <div className={handles.grid3}>
            <FormField
              label="Nível"
              id="level"
              name="level"
              type="number"
              value={formData.level !== undefined ? String(formData.level) : ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  level: e.target.value
                    ? parseInt(e.target.value, 10)
                    : undefined,
                }))
              }
            />
            <FormField
              label="XP Atual"
              id="exp-current"
              type="number"
              value={
                formData.experience?.current !== undefined
                  ? String(formData.experience.current)
                  : ''
              }
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  experience: {
                    current: parseInt(e.target.value, 10) || 0,
                    nextLevel: prev.experience?.nextLevel || 0,
                  },
                }))
              }
            />
            <FormField
              label="XP Próximo Nível"
              id="exp-next"
              type="number"
              value={
                formData.experience?.nextLevel !== undefined
                  ? String(formData.experience.nextLevel)
                  : ''
              }
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  experience: {
                    current: prev.experience?.current || 0,
                    nextLevel: parseInt(e.target.value, 10) || 0,
                  },
                }))
              }
            />
          </div>
        </div>

        {/* ── Recursos Principais ──────────────────────── */}
        <div className={handles.section}>
          <h3 className={handles.sectionTitle}>Recursos Principais</h3>
          <div className={handles.grid4}>
            <FormField
              label="HP"
              id="hp"
              type="number"
              value={
                formData.combat?.hp?.value !== undefined
                  ? String(formData.combat.hp.value)
                  : ''
              }
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  combat: {
                    ...(prev.combat || {}),
                    hp: {
                      value: parseInt(e.target.value, 10) || 0,
                      formula: e.target.value,
                    },
                  },
                }))
              }
            />
            <FormField
              label="CA"
              id="ac"
              type="number"
              value={
                formData.combat?.ac?.value !== undefined
                  ? String(formData.combat.ac.value)
                  : ''
              }
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  combat: {
                    ...(prev.combat || {}),
                    ac: {
                      value: parseInt(e.target.value, 10) || 0,
                      formula: e.target.value,
                    },
                  },
                }))
              }
            />
            <FormField
              label="Chi Máximo"
              id="chi-max"
              type="number"
              value={
                formData.chi?.max !== undefined ? String(formData.chi.max) : ''
              }
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  chi: {
                    current: parseInt(e.target.value, 10) || 0,
                    max: parseInt(e.target.value, 10) || 0,
                  },
                }))
              }
            />
            <FormField
              label="Bônus de Proficiência"
              id="proficiencyBonus"
              type="number"
              value={
                formData.proficiencyBonus !== undefined
                  ? String(formData.proficiencyBonus)
                  : ''
              }
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  proficiencyBonus: parseInt(e.target.value, 10) || 0,
                }))
              }
            />
          </div>
          <FormField
            label="Velocidade"
            id="speed"
            value={
              typeof formData.combat?.speed === 'object' &&
              formData.combat?.speed !== null
                ? String(
                    (formData.combat.speed as { walk?: number }).walk || ''
                  )
                : ''
            }
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                combat: {
                  ...(prev.combat || {}),
                  speed: {
                    walk: parseInt(e.target.value, 10) || 0,
                  },
                },
              }))
            }
          />

          {/* Truques (Cantrips) - Level 0 */}
          <h4 className={handles.sectionSubheading}>Truques</h4>
          <SpellList
            spells={formData.cantrips || []}
            onChange={(i, spell) => setSpellAt('cantrips', i, spell)}
            onRemove={(i) => removeSpellAt('cantrips', i)}
            noun="Truque"
            newTitle="Novo truque"
            editTitle="Editar truque"
            emptyLabel="Nenhum truque registrado."
            addLabel="Adicionar Truque"
          />

          {/* Spell Slots - Dynamic Array */}
          <h4 className={handles.sectionSubheading}>Slots de Magia</h4>
          <div className={handles.slotTable}>
            {(formData.spellSlots || []).length === 0 && (
              <p className={handles.slotTableEmpty}>
                Nenhum círculo adicionado. Clique em &quot;+ Adicionar
                Círculo&quot; para começar.
              </p>
            )}
            {(formData.spellSlots || []).map((slot, idx) => (
              <ArrayItemWrapper key={idx} onRemove={() => removeSpellSlot(idx)}>
                <div className={handles.inlineFields}>
                  <span className={handles.slotLevelLabel}>
                    {slot.level}º Círculo
                  </span>
                  <div className={handles.slotTableInput}>
                    <label>Total</label>
                    <input
                      type="number"
                      className={handles.input}
                      value={slot.slotsTotal || 0}
                      onChange={(e) =>
                        handleSpellSlotChange(idx, 'slotsTotal', e.target.value)
                      }
                    />
                  </div>
                  <div className={handles.slotTableInput}>
                    <label>Usados</label>
                    <input
                      type="number"
                      className={handles.input}
                      value={slot.slotsUsed || 0}
                      onChange={(e) =>
                        handleSpellSlotChange(idx, 'slotsUsed', e.target.value)
                      }
                    />
                  </div>
                </div>
              </ArrayItemWrapper>
            ))}
            <button
              type="button"
              className={handles.addButton}
              onClick={addSpellSlot}
            >
              Adicionar Círculo
            </button>
          </div>
        </div>

        {/* ── Atributos ────────────────────────────────── */}
        <div className={handles.section}>
          <h3 className={handles.sectionTitle}>Atributos</h3>
          <div className={handles.statTable}>
            <div className={handles.statTableRow}>
              <span>Atributo</span>
              <span>Base</span>
              <span>+Raça</span>
              <span>+Classe</span>
              <span>Total</span>
              <span>Mod</span>
            </div>
            {STAT_KEYS.map((stat) => {
              const ps = (formData.playerStats || {}) as Record<
                string,
                {
                  base?: number;
                  raceBonus?: number;
                  classBonus?: number;
                  total?: number;
                  modifier?: number;
                }
              >;
              const detail = ps[stat] || {};
              return (
                <div key={stat} className={handles.statTableRow}>
                  <span>{attrMapping[stat as keyof typeof attrMapping]}</span>
                  <input
                    type="number"
                    className={handles.input}
                    value={detail.base ?? ''}
                    onChange={(e) =>
                      handleStatChange(stat, 'base', e.target.value)
                    }
                  />
                  <input
                    type="number"
                    className={handles.input}
                    value={detail.raceBonus ?? ''}
                    onChange={(e) =>
                      handleStatChange(stat, 'raceBonus', e.target.value)
                    }
                  />
                  <input
                    type="number"
                    className={handles.input}
                    value={detail.classBonus ?? ''}
                    onChange={(e) =>
                      handleStatChange(stat, 'classBonus', e.target.value)
                    }
                  />
                  <span className={handles.statTableValue}>
                    {detail.total ?? '--'}
                  </span>
                  <span className={handles.statTableValue}>
                    {detail.modifier ?? '--'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Proficiências ────────────────────────────── */}
        <div className={handles.section}>
          <h3 className={handles.sectionTitle}>Proficiências</h3>
          <div className={handles.grid3}>
            <FormField
              label="Armas"
              id="weapons"
              value={(
                (formData.proficiencies as Record<string, string[]>)?.weapons ||
                []
              ).join(', ')}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  proficiencies: {
                    ...(prev.proficiencies || {}),
                    weapons: e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean),
                  },
                }))
              }
            />
            <FormField
              label="Armaduras"
              id="armor"
              value={(
                (formData.proficiencies as Record<string, string[]>)?.armor ||
                []
              ).join(', ')}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  proficiencies: {
                    ...(prev.proficiencies || {}),
                    armor: e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean),
                  },
                }))
              }
            />
            <FormField
              label="Ferramentas"
              id="tools"
              value={(
                (formData.proficiencies as Record<string, string[]>)?.tools ||
                []
              ).join(', ')}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  proficiencies: {
                    ...(prev.proficiencies || {}),
                    tools: e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean),
                  },
                }))
              }
            />
          </div>

          <h4 className={handles.sectionSubheading}>Testes de Resistência</h4>
          {(formData.profSavingThrows || []).map((st, i) => (
            <ArrayItemWrapper key={i} onRemove={() => removeSavingThrow(i)}>
              <div className={handles.inlineFields}>
                <FormField
                  label="Atributo"
                  value={st.attribute}
                  onChange={(e) =>
                    handleSavingThrowChange(i, 'attribute', e.target.value)
                  }
                />
                <FormField
                  label="Valor"
                  type="number"
                  value={String(st.value || '')}
                  onChange={(e) =>
                    handleSavingThrowChange(i, 'value', e.target.value)
                  }
                />
              </div>
            </ArrayItemWrapper>
          ))}
          <button
            type="button"
            className={handles.addButton}
            onClick={addSavingThrow}
          >
            Adicionar Resistência
          </button>

          <h4 className={handles.sectionSubheading}>Perícias</h4>
          {/* A lista é fixa e o valor é calculado: o usuário escolhe a
              proficiência e o bônus extra. Dividida em duas metades para o
              cabeçalho se repetir em cada coluna. */}
          <div className={handles.skillColumns}>
            {[
              skillRows.slice(0, Math.ceil(skillRows.length / 2)),
              skillRows.slice(Math.ceil(skillRows.length / 2)),
            ].map((column, columnIndex) => (
              <ul key={columnIndex} className={handles.skillList}>
                <li className={handles.skillHeader} aria-hidden="true">
                  <span>Prof.</span>
                  <span>Perícia</span>
                  <span>Bônus</span>
                  <span>Total</span>
                </li>
                {column.map((skill) => (
                  <li key={skill.name} className={handles.skillRow}>
                    <input
                      type="checkbox"
                      id={`skill-${skill.name}`}
                      className={handles.skillCheckbox}
                      checked={skill.proficient}
                      onChange={(e) =>
                        toggleSkillProficiency(skill.name, e.target.checked)
                      }
                    />
                    <label
                      className={handles.skillLabel}
                      htmlFor={`skill-${skill.name}`}
                    >
                      {skill.name}
                    </label>
                    <input
                      type="number"
                      className={handles.skillBonus}
                      aria-label={`Bônus extra em ${skill.name}`}
                      value={skill.bonus || ''}
                      placeholder="0"
                      onChange={(e) =>
                        handleSkillBonusChange(skill.name, e.target.value)
                      }
                      onWheel={(e) => (e.target as HTMLInputElement).blur()}
                    />
                    <span className={handles.skillValue}>
                      {formatModifier(skill.value)}
                    </span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>

        {/* ── Habilidades ──────────────────────────────── */}
        {/*
          Só para cidadão. Na ficha de jogador este campo virou redundante: o
          que a classe concede é derivado do vínculo a cada leitura (ver
          services/classFeatures.service.ts) e o que é manual — traço de raça,
          antecedente — se edita na própria ficha embutida, que tem o painel
          completo. Editar nos dois lugares era convidar as duas listas a
          divergirem.

          O cidadão fica: ele não tem vínculo de classe resolvido nem ficha
          embutida, então este é o único lugar onde as habilidades dele podem
          ser escritas. O campo continua indo no payload do jogador sem ser
          tocado, então nada do que já existe se perde.
        */}
        {variant !== 'player' && (
          <div className={handles.section}>
            <h3 className={handles.sectionTitle}>
              Habilidades e Características
            </h3>
            {(formData.abilities || []).map((ab, i) => (
              <ArrayItemWrapper key={i} onRemove={() => removeAbility(i)}>
                <FormField
                  label="Nome"
                  value={ab.name || ''}
                  onChange={(e) =>
                    handleAbilityChange(i, 'name', e.target.value)
                  }
                />
                <FormField
                  label="Descrição"
                  isTextarea
                  value={ab.description || ''}
                  onChange={(e) =>
                    handleAbilityChange(i, 'description', e.target.value)
                  }
                />
              </ArrayItemWrapper>
            ))}
            <button
              type="button"
              className={handles.addButton}
              onClick={addAbility}
            >
              Adicionar Habilidade
            </button>
          </div>
        )}

        {/* ── Arquétipo ────────────────────────────────────
            Só jogador, pela mesma razão da seção acima: é o vínculo de classe
            que dá sentido à escolha, e só a ficha de jogador o resolve. O
            componente se esconde sozinho enquanto o nível não alcança o que a
            tabela da classe exige. */}
        {variant === 'player' && (
          <ArchetypeSelect
            classId={formData.classId}
            level={formData.level}
            value={formData.archetype}
            onChange={setArchetype}
          />
        )}

        {/* ── Profissões ───────────────────────────────── */}
        <div className={handles.section}>
          <h3 className={handles.sectionTitle}>Profissões</h3>
          {(formData.professions || []).map((prof, i) => (
            <ArrayItemWrapper key={i} onRemove={() => removeProfession(i)}>
              <FormField
                label="Nome da Profissão"
                value={prof.name || ''}
                onChange={(e) =>
                  handleProfessionChange(i, 'name', e.target.value)
                }
              />
            </ArrayItemWrapper>
          ))}
          <button
            type="button"
            className={handles.addButton}
            onClick={addProfession}
          >
            Adicionar Profissão
          </button>
          <FormField
            label="Sub-profissões (separadas por vírgula)"
            value={(formData.subProfessions || []).join(', ')}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                subProfessions: e.target.value
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean),
              }))
            }
          />
        </div>

        {/* ── Conjuração ───────────────────────────────── */}
        <div className={handles.section}>
          <h3 className={handles.sectionTitle}>Conjuração de Magias</h3>
          <div className={handles.grid4}>
            <FormField
              label="Atributo de Conjuração"
              id="spell-ability"
              value={formData.playerSpellcasting?.ability || ''}
              onChange={(e) =>
                handleNestedChange(
                  'playerSpellcasting',
                  'ability',
                  e.target.value
                )
              }
            />
            <FormField
              label="CD de Resistência"
              id="spell-save"
              type="number"
              value={
                formData.playerSpellcasting?.saveDC
                  ? String(formData.playerSpellcasting.saveDC)
                  : ''
              }
              onChange={(e) =>
                handleNestedChange(
                  'playerSpellcasting',
                  'saveDC',
                  parseInt(e.target.value, 10) || 0
                )
              }
            />
            <FormField
              label="Bônus de Ataque"
              id="spell-attack"
              type="number"
              value={
                formData.playerSpellcasting?.attackBonus
                  ? String(formData.playerSpellcasting.attackBonus)
                  : ''
              }
              onChange={(e) =>
                handleNestedChange(
                  'playerSpellcasting',
                  'attackBonus',
                  parseInt(e.target.value, 10) || 0
                )
              }
            />
            <FormField
              label="Nível de Conjurador"
              id="spell-level"
              type="number"
              value={
                formData.playerSpellcasting?.casterLevel
                  ? String(formData.playerSpellcasting.casterLevel)
                  : ''
              }
              onChange={(e) =>
                handleNestedChange(
                  'playerSpellcasting',
                  'casterLevel',
                  parseInt(e.target.value, 10) || 0
                )
              }
            />
          </div>

          <h4 className={handles.sectionSubheading}>Magias Preparadas</h4>
          <SpellList
            spells={formData.spells || []}
            onChange={(i, spell) => setSpellAt('spells', i, spell)}
            onRemove={(i) => removeSpellAt('spells', i)}
            noun="Magia"
            newTitle="Nova magia"
            editTitle="Editar magia"
            emptyLabel="Nenhuma magia registrada."
            addLabel="Adicionar Magia"
          />

          <h4 className={handles.sectionSubheading}>Grimório</h4>
          <SpellLinkList
            refs={formData.spellRefs || []}
            onChange={setSpellRefs}
          />
        </div>

        {/* ── Equipamento ──────────────────────────────── */}
        <div className={handles.section}>
          <h3 className={handles.sectionTitle}>Equipamento</h3>
          <h4
            className={`${handles.sectionSubheading} ${handles.sectionSubheading}--flush`}
          >
            Slots
          </h4>
          <div className={handles.grid3}>
            {(
              [
                'head',
                'torso',
                'legs',
                'feet',
                'hand',
                'offhand',
                'accessory1',
                'accessory2',
              ] as const
            ).map((eq) => {
              const labels: Record<string, string> = {
                head: 'Cabeça',
                torso: 'Tronco',
                legs: 'Pernas',
                feet: 'Pés',
                hand: 'Mão',
                offhand: 'Secundária',
                accessory1: 'Acessório 1',
                accessory2: 'Acessório 2',
              };
              return (
                <FormField
                  key={eq}
                  label={labels[eq]}
                  value={
                    (((formData.equipment || {}) as Record<string, unknown>)[
                      eq
                    ] as string) || ''
                  }
                  onChange={(e) =>
                    handleNestedChange('equipment', eq, e.target.value)
                  }
                />
              );
            })}
          </div>
          <h4 className={handles.sectionSubheading}>Inventário</h4>
          <FormField
            label="Mochila"
            id="backpack"
            isTextarea
            value={formData.backpackText || ''}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                backpackText: e.target.value,
              }))
            }
          />
          <div className={handles.gilField}>
            <label className={handles.label} htmlFor="gil">
              Gil
            </label>
            <input
              className={handles.input}
              type="number"
              id="gil"
              value={
                formData.equipment?.gil !== undefined
                  ? String(formData.equipment.gil)
                  : ''
              }
              onChange={(e) =>
                handleNestedChange(
                  'equipment',
                  'gil',
                  parseInt(e.target.value, 10) || 0
                )
              }
            />
          </div>
        </div>

        {/* ── Aparência ────────────────────────────────── */}
        <div className={handles.section}>
          <h3 className={handles.sectionTitle}>Aparência</h3>
          <FormField
            label="Descrição da Aparência"
            id="appearance"
            name="appearance"
            isTextarea
            value={formData.appearance || ''}
            onChange={handleChange}
          />
        </div>

        {/* ── História ─────────────────────────────────── */}
        <div className={handles.section}>
          <h3 className={handles.sectionTitle}>História</h3>
          <FormField
            label="História / Background"
            id="backstory"
            name="backstory"
            isTextarea
            value={formData.backstory || ''}
            onChange={handleChange}
          />
        </div>

        {/* ── Defesas ──────────────────────────────────── */}
        <div className={handles.section}>
          <h3 className={handles.sectionTitle}>Defesas</h3>
          <DefensesFields
            defenses={(formData.defenses || {}) as Record<string, string[]>}
            onChange={handleDefensesChange}
          />
        </div>

        {/* ── Sentidos ─────────────────────────────────── */}
        <div className={handles.section}>
          <h3 className={handles.sectionTitle}>Sentidos</h3>
          <div className={handles.grid3}>
            <FormField
              label="Percepção Passiva"
              type="number"
              value={
                formData.senses?.passivePerception !== undefined
                  ? String(formData.senses.passivePerception)
                  : ''
              }
              onChange={(e) =>
                handleNestedChange(
                  'senses',
                  'passivePerception',
                  parseInt(e.target.value, 10) || 0
                )
              }
            />
            <FormField
              label="Visão no Escuro"
              type="number"
              value={
                formData.senses?.darkvision !== undefined
                  ? String(formData.senses.darkvision)
                  : ''
              }
              onChange={(e) =>
                handleNestedChange(
                  'senses',
                  'darkvision',
                  parseInt(e.target.value, 10) || 0
                )
              }
            />
            <FormField
              label="Sentido Cego"
              type="number"
              value={
                formData.senses?.blindsight !== undefined
                  ? String(formData.senses.blindsight)
                  : ''
              }
              onChange={(e) =>
                handleNestedChange(
                  'senses',
                  'blindsight',
                  parseInt(e.target.value, 10) || 0
                )
              }
            />
          </div>
        </div>

        {/* ── Idiomas ──────────────────────────────────── */}
        <div className={handles.section}>
          <h3 className={handles.sectionTitle}>Idiomas</h3>
          <FormField
            label="Idiomas (separados por vírgula)"
            value={(formData.languages || []).join(', ')}
            onChange={(e) => handleLanguagesChange(e.target.value)}
          />
        </div>

        {/* ── Actions ──────────────────────────────────── */}
        <div className={handles.actions}>
          <button
            type="button"
            className={handles.cancelButton}
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className={handles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Salvando...'
              : isCreate
                ? 'Criar Cidadão'
                : 'Salvar Alterações'}
          </button>
        </div>
      </form>

      {alertMsg && (
        <AlertModal
          isOpen={!!alertMsg}
          message={alertMsg}
          onClose={() => setAlertMsg(null)}
        />
      )}
    </>
  );
};

export default CitizenEditForm;
