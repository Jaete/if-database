import { useState, useRef } from 'react';
import type IMonster from '@/db/monsters/monster.d';
import type ICitizen from '@/db/citizens/citizen.d';
import { useCssHandles } from '@/hooks/useCssHandles';
import CreatureEditFormHandles from './handles';
import FormField from './sections/FormField';
import ArrayItemWrapper from './sections/ArrayItemWrapper';
import '@/styles/components/creatureEditForm.scss';
import { attrMapping, sensesMapping } from '@/db/l10n/attributesMapping';
import { useMonsters } from '@/app/context/MonstersContext';

interface IProps {
  creature: IMonster | ICitizen;
  onClose: () => void;
  mode?: 'create' | 'edit';
}

type IFormData = Partial<IMonster & ICitizen> & {
  abilities?: Array<{ name?: string; description?: string }>;
  traits?: Array<{ name?: string; description?: string }>;
  actions?: Array<{ name?: string; description?: string }>;
  legendaryActions?: Array<{ name?: string; description?: string }>;
  drops?: Array<{ item?: string; chance?: number }>;
  level?: string;
};
type ArrayItem = {
  name?: string;
  description?: string;
  item?: string;
  chance?: number;
};

const CreatureEditForm = ({ creature, onClose, mode = 'edit' }: IProps) => {
  const handles = useCssHandles(CreatureEditFormHandles);
  const { update, create } = useMonsters();

  const emptyMonster: IFormData = {
    slug: '',
    name: '',
    stats: {},
    combat: {},
    senses: {},
    proficiencies: {},
    defenses: {},
    languages: [],
    traits: [],
    actions: [],
    bonusActions: [],
    reactions: [],
    legendaryActions: [],
    spellcasting: {},
    source: {},
    drops: [],
  };

  const isCreate = mode === 'create';

  const initialType =
    'drops' in creature
      ? 'monster'
      : 'age' in creature || 'equipment' in creature
        ? 'citizen'
        : 'monster';

  const [creatureType] = useState<'monster' | 'citizen'>(
    isCreate ? 'monster' : initialType
  );
  const [formData, setFormData] = useState<IFormData>(
    isCreate ? emptyMonster : (creature as IFormData)
  );
  const fileInputMarkdownRef = useRef<HTMLInputElement>(null);
  const [isImportingMarkdown, setIsImportingMarkdown] = useState(false);

  const handleDownloadTemplate = () => {
    const a = document.createElement('a');
    a.href = '/api/template/markdown';
    a.download = 'ficha-modelo-monstro.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleMarkdownUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImportingMarkdown(true);
    try {
      const formDataObj = new FormData();
      formDataObj.append('file', file);

      const res = await fetch('/api/parse-markdown', {
        method: 'POST',
        body: formDataObj,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Erro ao importar arquivo');

      if (result.success && result.data) {
        setFormData((prev) => ({
          ...prev,
          ...result.data,
          stats: result.data.stats || {},
          combat: result.data.combat || {},
          senses: result.data.senses || {},
          traits: result.data.traits || [],
          actions: result.data.actions || [],
          bonusActions: result.data.bonusActions || [],
          reactions: result.data.reactions || [],
          legendaryActions: result.data.legendaryActions || [],
          drops: result.data.drops || [],
          spellcasting: result.data.spellcasting || {},
          source: result.data.source || {},
        }));
        alert(
          'Dados importados com sucesso! Revise os campos antes de salvar.'
        );
      }
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido';
      alert(errorMessage);
    } finally {
      setIsImportingMarkdown(false);
      if (fileInputMarkdownRef.current) {
        fileInputMarkdownRef.current.value = '';
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData(
      (prev) => ({ ...prev, [name as keyof IFormData]: value }) as IFormData
    );
  };

  const handleNestedChange = (
    parent: keyof IFormData,
    key: string,
    value: string
  ) => {
    const isNumeric =
      parent === 'stats' ||
      parent === 'senses' ||
      (parent === 'source' && key === 'page');
    const parsedValue = isNumeric ? parseInt(value, 10) || 0 : value;

    setFormData(
      (prev) =>
        ({
          ...prev,
          [parent]: {
            ...((prev[parent] as Record<string, unknown> | undefined) ||
              ({} as Record<string, unknown>)),
            [key]: parsedValue,
          },
        }) as IFormData
    );
  };

  const handleDoubleNestedChange = (
    parent: keyof IFormData,
    child: string,
    key: string,
    value: string | number
  ) => {
    setFormData((prev) => {
      const parentObj =
        (prev[parent] as Record<string, unknown> | undefined) || {};
      const childObj =
        (parentObj[child] as Record<string, unknown> | undefined) || {};
      return {
        ...prev,
        [parent]: {
          ...parentObj,
          [child]: {
            ...childObj,
            [key]: value,
          },
        },
      } as IFormData;
    });
  };

  type ArrayFieldKeys =
    | 'abilities'
    | 'traits'
    | 'actions'
    | 'legendaryActions'
    | 'drops';

  const handleArrayChange = (
    field: ArrayFieldKeys,
    index: number,
    key: string,
    value: string
  ) => {
    setFormData((prev) => {
      const arr = [...((prev[field] as ArrayItem[]) || [])];
      if (!arr[index]) arr[index] = {};
      const parsedValue = key === 'chance' ? parseInt(value, 10) || 0 : value;
      arr[index] = { ...arr[index], [key]: parsedValue } as ArrayItem;
      return { ...prev, [field]: arr } as IFormData;
    });
  };

  const addArrayItem = (field: ArrayFieldKeys) => {
    setFormData(
      (prev) =>
        ({
          ...prev,
          [field]: [...((prev[field] as ArrayItem[]) || []), {}],
        }) as IFormData
    );
  };

  const removeArrayItem = (field: ArrayFieldKeys, index: number) => {
    setFormData(
      (prev) =>
        ({
          ...prev,
          [field]: ((prev[field] as ArrayItem[]) || []).filter(
            (_, i) => i !== index
          ),
        }) as IFormData
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isCreate) {
      if (!formData.name) {
        alert('Nome é obrigatório para criar uma criatura.');
        return;
      }
      const slug =
        formData.slug ||
        formData.name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');

      try {
        await create({ ...formData, slug } as IMonster);
      } catch (err) {
        console.error('Erro ao criar monstro', err);
        return;
      }
    } else {
      if (!formData.slug) {
        return;
      }

      if (creatureType === 'monster') {
        try {
          await update(formData as IMonster);
        } catch (err) {
          console.error('Erro ao atualizar monstro', err);
          return;
        }
      }
    }

    onClose();
  };

  return (
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
            {isImportingMarkdown ? 'Importando...' : '📝 Importar Ficha'}
          </button>
          <button
            type="button"
            className={handles.downloadTemplateButton}
            onClick={handleDownloadTemplate}
          >
            📄 Baixar Modelo
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
              (creatureType === 'monster' ? formData.type : formData.race) || ''
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
              label="Grau de Desafio (CR)"
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
              label="Pontos de Experiência (XP)"
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
              label="Fonte (Livro)"
              id="source-book"
              value={formData.source?.book || ''}
              onChange={(e) =>
                handleNestedChange('source', 'book', e.target.value)
              }
            />
            <FormField
              label="Fonte (Página)"
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
            label="URL da Imagem"
            id="image"
            name="image"
            value={formData.image || ''}
            onChange={handleChange}
          />
          <FormField
            label="URL do Ícone"
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
              label="Família / Afiliação"
              id="family"
              name="family"
              value={formData.family || ''}
              onChange={handleChange}
            />
          </div>

          <h4
            className={handles.sectionTitle}
            style={{ marginTop: '1rem', fontSize: '1rem' }}
          >
            Equipamento
          </h4>
          <div className={handles.grid3}>
            {['head', 'torso', 'legs', 'feet', 'hand', 'offhand'].map((eq) => (
              <FormField
                key={eq}
                label={eq}
                value={
                  (formData.equipment as Record<string, string | undefined>)?.[
                    eq
                  ] || ''
                }
                onChange={(e) =>
                  handleNestedChange('equipment', eq, e.target.value)
                }
              />
            ))}
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
                label="Classe de Armadura (CA) - Valor"
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
                label="Classe de Armadura (CA) - Fórmula"
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
                label="Pontos de Vida (PV) - Valor"
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
                label="Pontos de Vida (PV) - Fórmula"
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
              className={handles.sectionTitle}
              style={{ marginTop: '1rem', fontSize: '1rem' }}
            >
              Velocidades de Deslocamento (em pés)
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
                label="Observações de Movimento"
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
              label="Tipo de Armadura"
              value={(formData.combat as Record<string, string>)?.type || ''}
              onChange={(e) =>
                handleNestedChange('combat', 'type', e.target.value)
              }
            />
            <FormField
              label="Classe de Armadura (AC)"
              value={(formData.combat as Record<string, string>)?.ac || ''}
              onChange={(e) =>
                handleNestedChange('combat', 'ac', e.target.value)
              }
            />
            <FormField
              label="Pontos de Vida (HP)"
              value={(formData.combat as Record<string, string>)?.hp || ''}
              onChange={(e) =>
                handleNestedChange('combat', 'hp', e.target.value)
              }
            />
            <FormField
              label="Deslocamento (Speed)"
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

      {/* Habilidades (Traits) */}
      <div className={handles.section}>
        <h3 className={handles.sectionTitle}>Habilidades Especiais</h3>
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
              label="Nome da Habilidade"
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
          + Adicionar Habilidade
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
              label="Nome da Ação"
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
          + Adicionar Ação
        </button>
      </div>

      {/* Drops (Apenas Monstro) */}
      {creatureType === 'monster' && (
        <div className={handles.section}>
          <h3 className={handles.sectionTitle}>Drops</h3>
          {(formData.drops as ArrayItem[])?.map((drop, index) => (
            <ArrayItemWrapper
              key={`drop-${index}`}
              onRemove={() => removeArrayItem('drops', index)}
            >
              <div className={handles.grid2}>
                <FormField
                  label="Chance (%)"
                  type="number"
                  value={drop.chance !== undefined ? String(drop.chance) : ''}
                  onChange={(e) =>
                    handleArrayChange('drops', index, 'chance', e.target.value)
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
            + Adicionar Drop
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
        <button type="submit" className={handles.submitButton}>
          {isCreate ? 'Criar Monstro' : 'Salvar Alterações'}
        </button>
      </div>
    </form>
  );
};

export default CreatureEditForm;
