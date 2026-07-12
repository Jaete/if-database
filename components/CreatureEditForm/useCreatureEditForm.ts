'use client';

import { useState, useRef, useEffect } from 'react';
import type IMonster from '@/db/monsters/monster.d';
import type ICitizen from '@/db/citizens/citizen.d';
import type { PerkType, ILevelPerk } from '@/db/monsters/monster.d';
import { useMonsters } from '@/app/context/MonstersContext';

export type IFormData = Partial<IMonster & ICitizen> & {
  abilities?: Array<{ name?: string; description?: string }>;
  traits?: Array<{ name?: string; description?: string }>;
  actions?: Array<{ name?: string; description?: string }>;
  legendaryActions?: Array<{ name?: string; description?: string }>;
  drops?: Array<{ item?: string; range?: string }>;
  level?: string;
};

export type ArrayItem = {
  name?: string;
  description?: string;
  item?: string;
  range?: string;
};

export const emptyMonster: IFormData = {
  slug: '',
  name: '',
  dice: '',
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
  levels: [],
};

export type ArrayFieldKeys =
  | 'abilities'
  | 'traits'
  | 'actions'
  | 'bonusActions'
  | 'reactions'
  | 'legendaryActions'
  | 'drops';

interface IUseCreatureEditFormProps {
  creature: IMonster | ICitizen;
  onClose: () => void;
  mode?: 'create' | 'edit';
  externalFormData?: IFormData;
  onFormDataChange?: (data: IFormData) => void;
}

export const useCreatureEditForm = ({
  creature,
  onClose,
  mode = 'edit',
  externalFormData,
  onFormDataChange,
}: IUseCreatureEditFormProps) => {
  const { update, create } = useMonsters();

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
    externalFormData
      ? externalFormData
      : isCreate
        ? emptyMonster
        : (creature as IFormData)
  );

  // ─── Tab sync ────────────────────────────────────────
  const lastSyncedRef = useRef<IFormData>(formData);

  useEffect(() => {
    if (externalFormData && externalFormData !== lastSyncedRef.current) {
      lastSyncedRef.current = externalFormData;
      setFormData(externalFormData);
    }
  }, [externalFormData]);

  useEffect(() => {
    if (onFormDataChange && formData !== lastSyncedRef.current) {
      lastSyncedRef.current = formData;
      onFormDataChange(formData);
    }
  }, [formData, onFormDataChange]);
  const fileInputMarkdownRef = useRef<HTMLInputElement>(null);
  const [isImportingMarkdown, setIsImportingMarkdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  const handleDownloadTemplate = () => {
    const a = document.createElement('a');
    if (creatureType === 'citizen') {
      a.href = '/api/template/markdown-citizen';
      a.download = 'ficha-modelo-cidadao.md';
    } else {
      a.href = '/api/template/markdown';
      a.download = 'ficha-modelo-monstro.md';
    }
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

      const endpoint =
        creatureType === 'citizen'
          ? '/api/parse-markdown-citizen'
          : '/api/parse-markdown';

      const res = await fetch(endpoint, {
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
        setAlertMsg(
          'Dados importados com sucesso! Revise os campos antes de salvar.'
        );
      }
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido';
      setAlertMsg(errorMessage);
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

  const handleArrayChange = (
    field: ArrayFieldKeys,
    index: number,
    key: string,
    value: string
  ) => {
    setFormData((prev) => {
      const arr = [...((prev[field] as ArrayItem[]) || [])];
      if (!arr[index]) arr[index] = {};
      arr[index] = { ...arr[index], [key]: value } as ArrayItem;
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

  // === Level handlers ===

  const addLevel = () => {
    const levels = formData.levels || [];
    const nextLevel = levels.length + 1;
    setFormData((prev) => ({
      ...prev,
      levels: [...(prev.levels || []), { level: nextLevel, acquiredPerks: [] }],
    }));
  };

  const removeLevel = (levelIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      levels: (prev.levels || []).filter((_, i) => i !== levelIndex),
    }));
  };

  const handleLevelNumberChange = (levelIndex: number, value: number) => {
    setFormData((prev) => {
      const levels = [...(prev.levels || [])];
      if (!levels[levelIndex])
        levels[levelIndex] = { level: 1, acquiredPerks: [] };
      levels[levelIndex] = { ...levels[levelIndex], level: value };
      return { ...prev, levels };
    });
  };

  const addPerk = (levelIndex: number) => {
    setFormData((prev) => {
      const levels = [...(prev.levels || [])];
      if (!levels[levelIndex])
        levels[levelIndex] = { level: 1, acquiredPerks: [] };
      levels[levelIndex] = {
        ...levels[levelIndex],
        acquiredPerks: [
          ...(levels[levelIndex].acquiredPerks || []),
          { type: 'atributo' as PerkType },
        ],
      };
      return { ...prev, levels };
    });
  };

  const removePerk = (levelIndex: number, perkIndex: number) => {
    setFormData((prev) => {
      const levels = [...(prev.levels || [])];
      if (!levels[levelIndex]) return prev;
      levels[levelIndex] = {
        ...levels[levelIndex],
        acquiredPerks: (levels[levelIndex].acquiredPerks || []).filter(
          (_, i) => i !== perkIndex
        ),
      };
      return { ...prev, levels };
    });
  };

  const handlePerkChange = (
    levelIndex: number,
    perkIndex: number,
    key: keyof ILevelPerk,
    value: string | number
  ) => {
    setFormData((prev) => {
      const levels = [...(prev.levels || [])];
      if (!levels[levelIndex]) return prev;
      const perks = [...(levels[levelIndex].acquiredPerks || [])];
      if (!perks[perkIndex])
        perks[perkIndex] = { type: 'atributo' as PerkType };
      perks[perkIndex] = { ...perks[perkIndex], [key]: value } as ILevelPerk;
      levels[levelIndex] = { ...levels[levelIndex], acquiredPerks: perks };
      return { ...prev, levels };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (isCreate) {
      if (!formData.name) {
        setAlertMsg('Nome e obrigatorio para criar uma criatura.');
        setIsSubmitting(false);
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
        setIsSubmitting(false);
        return;
      }
    } else {
      if (!formData.slug) {
        setIsSubmitting(false);
        return;
      }

      if (creatureType === 'monster') {
        try {
          await update(formData as IMonster);
        } catch (err) {
          console.error('Erro ao atualizar monstro', err);
          setIsSubmitting(false);
          return;
        }
      }
    }

    onClose();
    setIsSubmitting(false);
  };

  return {
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
  };
};
