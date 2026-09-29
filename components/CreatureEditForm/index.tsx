'use client';

import type IMonster from '@/db/monsters/monster.d';
import type ICitizen from '@/db/citizens/citizen.d';
import type { PerkType } from '@/db/monsters/monster.d';
import { useCssHandles } from '@/hooks/useCssHandles';
import {
  useCreatureEditForm,
  type IFormData,
  type ArrayItem,
} from './useCreatureEditForm';
import CreatureEditFormHandles from './handles';
import FormField from '../FormField';
import { DownloadIcon, FilePlusIcon } from '../Icons';
import ArrayItemWrapper from '../ArrayItemWrapper';
import '@/styles/components/creatureEditForm.scss';
import { attrMapping, sensesMapping } from '@/db/l10n/attributesMapping';
import AlertModal from '../AlertModal';
import DefensesFields from '../DefensesFields';

export { emptyMonster } from './useCreatureEditForm';
export type { IFormData } from './useCreatureEditForm';

interface IProps {
  creature: IMonster | ICitizen;
  onClose: () => void;
  mode?: 'create' | 'edit';
  externalFormData?: IFormData;
  onFormDataChange?: (data: IFormData) => void;
}

const CreatureEditForm = ({
  creature,
  onClose,
  mode = 'edit',
  externalFormData,
  onFormDataChange,
}: IProps) => {
  const handles = useCssHandles(CreatureEditFormHandles);
  const {
    isCreate,
    creatureType,
    formData,
    setFormData,
    fileInputMarkdownRef,
    isImportingMarkdown,
    isSubmitting,
    alertMsg,
    setAlertMsg,
    handleDownloadTemplate,
    handleMarkdownUpload,
    handleChange,
    handleNestedChange,
    handleDoubleNestedChange,
    handleLanguagesChange,
    handleDefensesChange,
    handleArrayChange,
    addArrayItem,
    removeArrayItem,
    addLevel,
    removeLevel,
    handleLevelNumberChange,
    addPerk,
    removePerk,
    handlePerkChange,
    handleSubmit,
  } = useCreatureEditForm({
    creature,
    onClose,
    mode,
    externalFormData,
    onFormDataChange,
  });

  return (
    <>
      <form className={handles.creatureEditForm} onSubmit={handleSubmit}>
        {/* Header Actions */}
        {creatureType === 'monster' && (
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
              {isImportingMarkdown ? 'Importando...' : 'Importar Ficha'}
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
        )}

        {/* Informações Básicas */}
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
              label="Subtítulo"
              id="subtitle"
              name="subtitle"
              value={formData.subtitle || ''}
              onChange={handleChange}
            />
          </div>

          <FormField
            label="Descrição"
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            isTextarea
          />

          <div className={handles.grid3}>
            <FormField
              label={creatureType === 'monster' ? 'Tipo' : 'Raça'}
              id={creatureType === 'monster' ? 'type' : 'race'}
              name={creatureType === 'monster' ? 'type' : 'race'}
              value={
                (creatureType === 'monster' ? formData.type : formData.race) ||
                ''
              }
              onChange={handleChange}
            />
            <FormField
              label="Alinhamento"
              id="alignment"
              name="alignment"
              value={formData.alignment || ''}
              onChange={handleChange}
            />
            {creatureType === 'monster' ? (
              <FormField
                label="ND (CR)"
                id="cr"
                name="cr"
                value={formData.cr || ''}
                onChange={handleChange}
              />
            ) : (
              <FormField
                label="Nível"
                id="level"
                name="level"
                value={formData.level || ''}
                onChange={handleChange}
              />
            )}
          </div>

          <div className={handles.grid3}>
            <FormField
              label="Raridade"
              id="rarity"
              name="rarity"
              value={formData.rarity || ''}
              onChange={handleChange}
            />
            <FormField
              label="Tamanho"
              id="size"
              name="size"
              value={formData.size || ''}
              onChange={handleChange}
            />
            {creatureType === 'citizen' && (
              <FormField
                label="Classe"
                id="class"
                name="class"
                value={formData.class || ''}
                onChange={handleChange}
              />
            )}
          </div>

          {creatureType === 'monster' && (
            <div className={handles.grid3}>
              <FormField
                label="EXP (XP)"
                id="xp"
                name="xp"
                type="number"
                value={formData.xp !== undefined ? String(formData.xp) : ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    xp: parseInt(e.target.value) || 0,
                  }))
                }
              />
              <FormField
                label="Fonte"
                id="source-book"
                value={formData.source?.book || ''}
                onChange={(e) =>
                  handleNestedChange('source', 'book', e.target.value)
                }
              />
              <FormField
                label="Página"
                id="source-page"
                type="number"
                value={
                  formData.source?.page !== undefined
                    ? String(formData.source?.page)
                    : ''
                }
                onChange={(e) =>
                  handleNestedChange('source', 'page', e.target.value)
                }
              />
            </div>
          )}

          <div className={handles.grid2}>
            <FormField
              label="Imagem"
              id="image"
              name="image"
              value={formData.image || ''}
              onChange={handleChange}
            />
            <FormField
              label="Ícone"
              id="icon"
              name="icon"
              value={formData.icon || ''}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Condicional Cidadão */}
        {creatureType === 'citizen' && (
          <div className={handles.section}>
            <h3 className={handles.sectionTitle}>Detalhes do Cidadão</h3>
            <div className={handles.grid2}>
              <FormField
                label="Idade"
                id="age"
                name="age"
                value={formData.age || ''}
                onChange={handleChange}
              />
              <FormField
                label="Família"
                id="family"
                name="family"
                value={formData.family || ''}
                onChange={handleChange}
              />
            </div>

            <h4
              className={`${handles.sectionTitle} ${handles.sectionSubheading}`}
            >
              Equipamento
            </h4>
            <div className={handles.grid3}>
              {['head', 'torso', 'legs', 'feet', 'hand', 'offhand'].map(
                (eq) => {
                  const eqLabels: Record<string, string> = {
                    head: 'Cabeça',
                    torso: 'Tronco',
                    legs: 'Pernas',
                    feet: 'Pés',
                    hand: 'Mão',
                    offhand: 'Secundária',
                  };
                  return (
                    <FormField
                      key={eq}
                      label={eqLabels[eq]}
                      value={
                        (
                          formData.equipment as Record<
                            string,
                            string | undefined
                          >
                        )?.[eq] || ''
                      }
                      onChange={(e) =>
                        handleNestedChange('equipment', eq, e.target.value)
                      }
                    />
                  );
                }
              )}
            </div>
          </div>
        )}

        {/* Atributos (Stats) */}
        <div className={handles.section}>
          <h3 className={handles.sectionTitle}>Atributos</h3>
          <div className={handles.grid6}>
            {Object.keys(attrMapping).map((stat) => (
              <FormField
                key={stat}
                label={attrMapping[stat as keyof typeof attrMapping]}
                type="number"
                value={
                  (formData.stats as Record<string, number | undefined>)?.[
                    stat
                  ] !== undefined
                    ? String(
                        (formData.stats as Record<string, number | undefined>)[
                          stat
                        ]
                      )
                    : ''
                }
                onChange={(e) =>
                  handleNestedChange('stats', stat, e.target.value)
                }
              />
            ))}
          </div>
        </div>

        {/* Combate */}
        <div className={handles.section}>
          <h3 className={handles.sectionTitle}>Combate</h3>
          {creatureType === 'monster' ? (
            <>
              <div className={handles.grid2}>
                <FormField
                  label="CA - Valor"
                  type="number"
                  value={
                    formData.combat?.ac?.value !== undefined
                      ? String(formData.combat.ac.value)
                      : ''
                  }
                  onChange={(e) =>
                    handleDoubleNestedChange(
                      'combat',
                      'ac',
                      'value',
                      parseInt(e.target.value) || 0
                    )
                  }
                />
                <FormField
                  label="CA - Fórmula"
                  value={formData.combat?.ac?.formula || ''}
                  onChange={(e) =>
                    handleDoubleNestedChange(
                      'combat',
                      'ac',
                      'formula',
                      e.target.value
                    )
                  }
                />
              </div>
              <div className={handles.grid2}>
                <FormField
                  label="PV - Valor"
                  type="number"
                  value={
                    formData.combat?.hp?.value !== undefined
                      ? String(formData.combat.hp.value)
                      : ''
                  }
                  onChange={(e) =>
                    handleDoubleNestedChange(
                      'combat',
                      'hp',
                      'value',
                      parseInt(e.target.value) || 0
                    )
                  }
                />
                <FormField
                  label="PV - Fórmula"
                  value={formData.combat?.hp?.formula || ''}
                  onChange={(e) =>
                    handleDoubleNestedChange(
                      'combat',
                      'hp',
                      'formula',
                      e.target.value
                    )
                  }
                />
              </div>
              <h4
                className={`${handles.sectionTitle} ${handles.sectionSubheading}`}
              >
                Deslocamentos
              </h4>
              <div className={handles.grid3}>
                <FormField
                  label="Caminhar"
                  type="number"
                  value={
                    formData.combat?.speed?.walk !== undefined
                      ? String(formData.combat.speed.walk)
                      : ''
                  }
                  onChange={(e) =>
                    handleDoubleNestedChange(
                      'combat',
                      'speed',
                      'walk',
                      parseInt(e.target.value) || 0
                    )
                  }
                />
                <FormField
                  label="Voar"
                  type="number"
                  value={
                    formData.combat?.speed?.fly !== undefined
                      ? String(formData.combat.speed.fly)
                      : ''
                  }
                  onChange={(e) =>
                    handleDoubleNestedChange(
                      'combat',
                      'speed',
                      'fly',
                      parseInt(e.target.value) || 0
                    )
                  }
                />
                <FormField
                  label="Nadar"
                  type="number"
                  value={
                    formData.combat?.speed?.swim !== undefined
                      ? String(formData.combat.speed.swim)
                      : ''
                  }
                  onChange={(e) =>
                    handleDoubleNestedChange(
                      'combat',
                      'speed',
                      'swim',
                      parseInt(e.target.value) || 0
                    )
                  }
                />
              </div>
              <div className={handles.grid3}>
                <FormField
                  label="Escalar"
                  type="number"
                  value={
                    formData.combat?.speed?.climb !== undefined
                      ? String(formData.combat.speed.climb)
                      : ''
                  }
                  onChange={(e) =>
                    handleDoubleNestedChange(
                      'combat',
                      'speed',
                      'climb',
                      parseInt(e.target.value) || 0
                    )
                  }
                />
                <FormField
                  label="Cavar"
                  type="number"
                  value={
                    formData.combat?.speed?.burrow !== undefined
                      ? String(formData.combat.speed.burrow)
                      : ''
                  }
                  onChange={(e) =>
                    handleDoubleNestedChange(
                      'combat',
                      'speed',
                      'burrow',
                      parseInt(e.target.value) || 0
                    )
                  }
                />
                <FormField
                  label="Notas de Mov."
                  value={formData.combat?.speed?.note || ''}
                  onChange={(e) =>
                    handleDoubleNestedChange(
                      'combat',
                      'speed',
                      'note',
                      e.target.value
                    )
                  }
                />
              </div>
            </>
          ) : (
            <div className={handles.grid2}>
              <FormField
                label="Armadura"
                value={(formData.combat as Record<string, string>)?.type || ''}
                onChange={(e) =>
                  handleNestedChange('combat', 'type', e.target.value)
                }
              />
              <FormField
                label="CA (AC)"
                value={(formData.combat as Record<string, string>)?.ac || ''}
                onChange={(e) =>
                  handleNestedChange('combat', 'ac', e.target.value)
                }
              />
              <FormField
                label="PV (HP)"
                value={(formData.combat as Record<string, string>)?.hp || ''}
                onChange={(e) =>
                  handleNestedChange('combat', 'hp', e.target.value)
                }
              />
              <FormField
                label="Deslocamento"
                value={(formData.combat as Record<string, string>)?.speed || ''}
                onChange={(e) =>
                  handleNestedChange('combat', 'speed', e.target.value)
                }
              />
            </div>
          )}
        </div>

        {/* Sentidos (Senses) */}
        <div className={handles.section}>
          <h3 className={handles.sectionTitle}>Sentidos</h3>
          <div className={handles.grid3}>
            {Object.entries(sensesMapping).map(([key, value]) => (
              <FormField
                key={key}
                label={value}
                type="number"
                value={
                  (formData.senses as Record<string, number | undefined>)?.[
                    key
                  ] !== undefined
                    ? String(
                        (formData.senses as Record<string, number | undefined>)[
                          key
                        ]
                      )
                    : ''
                }
                onChange={(e) =>
                  handleNestedChange('senses', key, e.target.value)
                }
              />
            ))}
          </div>
        </div>

        {/* Defesas (Defenses) */}
        <div className={handles.section}>
          <h3 className={handles.sectionTitle}>Defesas</h3>
          <DefensesFields
            defenses={(formData.defenses || {}) as Record<string, string[]>}
            onChange={handleDefensesChange}
          />
        </div>

        {/* Idiomas (Languages) */}
        <div className={handles.section}>
          <h3 className={handles.sectionTitle}>Idiomas</h3>
          <FormField
            label="Idiomas (separados por vírgula)"
            value={(formData.languages || []).join(', ')}
            onChange={(e) => handleLanguagesChange(e.target.value)}
          />
        </div>

        {/* Habilidades (Traits) */}
        <div className={handles.section}>
          <h3 className={handles.sectionTitle}>Habilidades</h3>
          {(
            (creatureType === 'monster'
              ? formData.traits
              : formData.abilities) as ArrayItem[]
          )?.map((ability, index) => (
            <ArrayItemWrapper
              key={`ability-${index}`}
              onRemove={() =>
                removeArrayItem(
                  creatureType === 'monster' ? 'traits' : 'abilities',
                  index
                )
              }
            >
              <FormField
                label="Habilidade"
                value={ability.name ?? ''}
                onChange={(e) =>
                  handleArrayChange(
                    creatureType === 'monster' ? 'traits' : 'abilities',
                    index,
                    'name',
                    e.target.value
                  )
                }
              />
              <FormField
                label="Descrição"
                isTextarea
                value={ability.description ?? ''}
                onChange={(e) =>
                  handleArrayChange(
                    creatureType === 'monster' ? 'traits' : 'abilities',
                    index,
                    'description',
                    e.target.value
                  )
                }
              />
            </ArrayItemWrapper>
          ))}
          <button
            type="button"
            className={handles.addButton}
            onClick={() =>
              addArrayItem(creatureType === 'monster' ? 'traits' : 'abilities')
            }
          >
            Adicionar Habilidade
          </button>
        </div>

        {/* Ações */}
        <div className={handles.section}>
          <h3 className={handles.sectionTitle}>Ações</h3>
          {(formData.actions as ArrayItem[])?.map((action, index) => (
            <ArrayItemWrapper
              key={`action-${index}`}
              onRemove={() => removeArrayItem('actions', index)}
            >
              <FormField
                label="Ação"
                value={action.name ?? ''}
                onChange={(e) =>
                  handleArrayChange('actions', index, 'name', e.target.value)
                }
              />
              <FormField
                label="Descrição"
                isTextarea
                value={action.description ?? ''}
                onChange={(e) =>
                  handleArrayChange(
                    'actions',
                    index,
                    'description',
                    e.target.value
                  )
                }
              />
            </ArrayItemWrapper>
          ))}
          <button
            type="button"
            className={handles.addButton}
            onClick={() => addArrayItem('actions')}
          >
            Adicionar Ação
          </button>
        </div>

        {/* Ações Bônus */}
        <div className={handles.section}>
          <h3 className={handles.sectionTitle}>Ações Bônus</h3>
          {(formData.bonusActions as ArrayItem[])?.map((action, index) => (
            <ArrayItemWrapper
              key={`bonusAction-${index}`}
              onRemove={() => removeArrayItem('bonusActions', index)}
            >
              <FormField
                label="Ação Bônus"
                value={action.name ?? ''}
                onChange={(e) =>
                  handleArrayChange(
                    'bonusActions',
                    index,
                    'name',
                    e.target.value
                  )
                }
              />
              <FormField
                label="Descrição"
                isTextarea
                value={action.description ?? ''}
                onChange={(e) =>
                  handleArrayChange(
                    'bonusActions',
                    index,
                    'description',
                    e.target.value
                  )
                }
              />
            </ArrayItemWrapper>
          ))}
          <button
            type="button"
            className={handles.addButton}
            onClick={() => addArrayItem('bonusActions')}
          >
            Adicionar Ação Bônus
          </button>
        </div>

        {/* Reações */}
        <div className={handles.section}>
          <h3 className={handles.sectionTitle}>Reações</h3>
          {(formData.reactions as ArrayItem[])?.map((action, index) => (
            <ArrayItemWrapper
              key={`reaction-${index}`}
              onRemove={() => removeArrayItem('reactions', index)}
            >
              <FormField
                label="Reação"
                value={action.name ?? ''}
                onChange={(e) =>
                  handleArrayChange('reactions', index, 'name', e.target.value)
                }
              />
              <FormField
                label="Descrição"
                isTextarea
                value={action.description ?? ''}
                onChange={(e) =>
                  handleArrayChange(
                    'reactions',
                    index,
                    'description',
                    e.target.value
                  )
                }
              />
            </ArrayItemWrapper>
          ))}
          <button
            type="button"
            className={handles.addButton}
            onClick={() => addArrayItem('reactions')}
          >
            Adicionar Reação
          </button>
        </div>

        {/* Drops (Apenas Monstro) */}
        {creatureType === 'monster' && (
          <div className={handles.section}>
            <h3 className={handles.sectionTitle}>Drops</h3>
            <div className={handles.grid2}>
              <FormField
                label="Dado (ex: 1d4, 1d6, 1d20)"
                value={formData.dice ?? ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, dice: e.target.value }))
                }
              />
              <div />
            </div>
            {(formData.drops as ArrayItem[])?.map((drop, index) => (
              <ArrayItemWrapper
                key={`drop-${index}`}
                onRemove={() => removeArrayItem('drops', index)}
              >
                <div className={handles.grid2}>
                  <FormField
                    label="Range (ex: 1~2)"
                    value={drop.range ?? ''}
                    onChange={(e) =>
                      handleArrayChange('drops', index, 'range', e.target.value)
                    }
                  />
                  <FormField
                    label="Item"
                    value={drop.item ?? ''}
                    onChange={(e) =>
                      handleArrayChange('drops', index, 'item', e.target.value)
                    }
                  />
                </div>
              </ArrayItemWrapper>
            ))}
            <button
              type="button"
              className={handles.addButton}
              onClick={() => addArrayItem('drops')}
            >
              Adicionar Drop
            </button>
          </div>
        )}

        {/* Níveis de Evolução */}
        {creatureType === 'monster' && (
          <div className={handles.section}>
            <h3 className={handles.sectionTitle}>Níveis de Evolução</h3>

            {(formData.levels || []).map((levelEntry, levelIndex) => (
              <div key={levelIndex} className={handles.arrayItem}>
                <button
                  type="button"
                  className={handles.removeButton}
                  onClick={() => removeLevel(levelIndex)}
                >
                  &times;
                </button>

                <div className={handles.levelRow}>
                  <FormField
                    label="Nível"
                    type="number"
                    id={`level-num-${levelIndex}`}
                    value={String(levelEntry.level || '')}
                    onChange={(e) =>
                      handleLevelNumberChange(
                        levelIndex,
                        parseInt(e.target.value) || 1
                      )
                    }
                  />
                </div>

                {levelEntry.acquiredPerks.map((perk, perkIndex) => (
                  <div key={perkIndex} className={handles.perkItem}>
                    <button
                      type="button"
                      className={`${handles.removeButton} ${handles.perkRemoveButton}`}
                      onClick={() => removePerk(levelIndex, perkIndex)}
                    >
                      &times;
                    </button>

                    <div className={handles.fieldGroup}>
                      <label className={handles.label}>Tipo</label>
                      <select
                        className={handles.select}
                        value={perk.type}
                        onChange={(e) =>
                          handlePerkChange(
                            levelIndex,
                            perkIndex,
                            'type',
                            e.target.value as PerkType
                          )
                        }
                      >
                        <option value="atributo">Aumento de Atributo</option>
                        <option value="habilidade">Nova Habilidade</option>
                        <option value="acao">Nova Ação</option>
                        <option value="classe">Melhoria de Classe</option>
                      </select>
                    </div>

                    {perk.type === 'atributo' && (
                      <div className={handles.grid2}>
                        <div className={handles.fieldGroup}>
                          <label className={handles.label}>Atributo</label>
                          <select
                            className={handles.select}
                            value={perk.attribute || 'str'}
                            onChange={(e) =>
                              handlePerkChange(
                                levelIndex,
                                perkIndex,
                                'attribute',
                                e.target.value
                              )
                            }
                          >
                            {Object.entries(attrMapping).map(([key, label]) => (
                              <option key={key} value={key}>
                                {label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <FormField
                          label="Valor"
                          type="number"
                          value={String(perk.value ?? '')}
                          onChange={(e) =>
                            handlePerkChange(
                              levelIndex,
                              perkIndex,
                              'value',
                              parseInt(e.target.value) || 0
                            )
                          }
                        />
                      </div>
                    )}

                    {(perk.type === 'habilidade' ||
                      perk.type === 'acao' ||
                      perk.type === 'classe') && (
                      <>
                        <FormField
                          label={
                            perk.type === 'habilidade'
                              ? 'Nome da Habilidade'
                              : perk.type === 'acao'
                                ? 'Nome da Ação'
                                : 'Nome da Melhoria'
                          }
                          value={perk.name ?? ''}
                          onChange={(e) =>
                            handlePerkChange(
                              levelIndex,
                              perkIndex,
                              'name',
                              e.target.value
                            )
                          }
                        />
                        <FormField
                          label="Descrição"
                          isTextarea
                          value={perk.description ?? ''}
                          onChange={(e) =>
                            handlePerkChange(
                              levelIndex,
                              perkIndex,
                              'description',
                              e.target.value
                            )
                          }
                        />
                      </>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  className={handles.addButton}
                  onClick={() => addPerk(levelIndex)}
                >
                  Adicionar Perk
                </button>
              </div>
            ))}

            <button
              type="button"
              className={handles.addButton}
              onClick={addLevel}
            >
              Adicionar Nível
            </button>
          </div>
        )}

        {/* Botões de Ação Final */}
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
            {isSubmitting ? (
              <>
                <span className={handles.spinner} />
                Salvando...
              </>
            ) : isCreate ? (
              'Criar Monstro'
            ) : (
              'Salvar Alterações'
            )}
          </button>
        </div>
      </form>

      <AlertModal
        isOpen={!!alertMsg}
        message={alertMsg ?? ''}
        onClose={() => setAlertMsg(null)}
      />
    </>
  );
};

export default CreatureEditForm;
