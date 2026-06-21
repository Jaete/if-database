'use client';

import { useState, useRef, useEffect } from 'react';
import type ICitizen from '@/db/citizens/citizen.d';
import type { IPlayerSpellLevel } from '@/db/citizens/citizen.d';
import { useCssHandles } from '@/hooks/useCssHandles';
import CitizenEditFormHandles from './handles';
import FormField from '../CreatureEditForm/sections/FormField';
import { attrMapping } from '@/db/l10n/attributesMapping';
import { useCitizens } from '@/app/context/CitizensContext';
import AlertModal from '../AlertModal';
import '@/styles/components/citizenEditForm.scss';

interface IProps {
  citizen?: ICitizen;
  onClose: () => void;
  mode?: 'create' | 'edit';
  externalFormData?: FormDataType;
  onFormDataChange?: (data: FormDataType) => void;
}

export type FormDataType = Partial<ICitizen> & {
  spells: string[];
  cantrips: string[];
  profSavingThrows: Array<{ attribute: string; value: number }>;
  profSkills: Array<{ name: string; value: number }>;
  spellSlots: Array<{ level: number; slotsTotal: number; slotsUsed: number }>;
  subProfessions: string[];
  backpackText: string;
};

const STAT_KEYS = ['str', 'dex', 'con', 'int', 'wis', 'cha'] as const;

export const emptyCitizen: FormDataType = {
  slug: '',
  name: '',
  race: '',
  gender: '',
  class: '',
  age: '',
  height: '',
  alignment: '',
  family: '',
  kingdom: '',
  clan: '',
  deity: '',
  image: '',
  icon: '',
  level: undefined,
  experience: { current: 0, nextLevel: 0 },
  combat: { ac: {}, hp: {}, speed: {} },
  chi: { current: 0, max: 0 },
  proficiencyBonus: undefined,
  stats: {},
  playerStats: {},
  proficiencies: {},
  defenses: {
    vulnerabilities: [],
    resistances: [],
    damageImmunities: [],
    conditionImmunities: [],
  },
  senses: {},
  languages: [],
  abilities: [],
  professions: [],
  playerSpellcasting: {
    ability: '',
    saveDC: 0,
    attackBonus: 0,
    casterLevel: 0,
  },
  equipment: {
    head: '',
    torso: '',
    legs: '',
    feet: '',
    hand: '',
    offhand: '',
    gil: 0,
    backpack: '',
  },
  appearance: '',
  backstory: '',
  // UI-only fields (not sent to API)
  spells: [],
  cantrips: [],
  profSavingThrows: [],
  profSkills: [],
  spellSlots: [],
  subProfessions: [],
  backpackText: '',
};

export const citizenToFormData = (citizen: ICitizen) => {
  const spells: string[] = [];
  const cantrips: string[] = [];
  const sl = citizen.playerSpellcasting?.spellLevels || [];
  sl.forEach((level) => {
    if (level.level === 0) {
      (level.spells || []).forEach((s) => {
        if (s.name && !cantrips.includes(s.name)) cantrips.push(s.name);
      });
    } else {
      (level.spells || []).forEach((s) => {
        if (s.name && !spells.includes(s.name)) spells.push(s.name);
      });
    }
  });

  // Extract professions sub-names
  const subProfessions: string[] = [];
  (citizen.professions || []).forEach((p) => {
    (p.subProfessions || []).forEach((sp) => {
      if (sp.name && !subProfessions.includes(sp.name))
        subProfessions.push(sp.name);
    });
  });

  const backpackText = Array.isArray(citizen.equipment?.backpack)
    ? (citizen.equipment.backpack as Array<string | { name?: string }>)
        .map((i) => (typeof i === 'string' ? i : i.name || ''))
        .join(', ')
    : (citizen.equipment?.backpack as string) || '';

  return {
    ...citizen,
    spells,
    cantrips,
    profSavingThrows: (citizen.proficiencies?.savingThrows ||
      []) as FormDataType['profSavingThrows'],
    profSkills: (citizen.proficiencies?.skills ||
      []) as FormDataType['profSkills'],
    spellSlots: (citizen.playerSpellcasting?.spellLevels || [])
      .filter((l) => l.level > 0)
      .map((l) => ({
        level: l.level,
        slotsTotal: l.slotsTotal,
        slotsUsed: l.slotsUsed,
      })),
    subProfessions,
    backpackText,
  };
};

const CitizenEditForm = ({
  citizen,
  onClose,
  mode = 'edit',
  externalFormData,
  onFormDataChange,
}: IProps) => {
  const handles = useCssHandles(CitizenEditFormHandles);
  const { update, create } = useCitizens();
  const isCreate = mode === 'create';

  const [formData, setFormData] = useState<FormDataType>(
    externalFormData
      ? externalFormData
      : isCreate
        ? emptyCitizen
        : (citizenToFormData(citizen!) as FormDataType)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  // ─── Tab sync ────────────────────────────────────────
  const lastSyncedRef = useRef<FormDataType>(formData);

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

  // ─── Markdown Import ──────────────────────────────────

  const handleDownloadTemplate = () => {
    const a = document.createElement('a');
    a.href = '/api/template/markdown-citizen';
    a.download = 'ficha-modelo-cidadao.md';
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

      const res = await fetch('/api/parse-markdown-citizen', {
        method: 'POST',
        body: formDataObj,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Erro ao importar arquivo');

      if (result.success && result.data) {
        const d = result.data;

        // Extract spell list for UI
        const spells: string[] = [];
        const cantrips: string[] = [];

        const sl = d.playerSpellcasting?.spellLevels || [];
        sl.forEach((level: IPlayerSpellLevel) => {
          if (level.level === 0) {
            (level.spells || []).forEach((s) => {
              if (s.name && !cantrips.includes(s.name)) cantrips.push(s.name);
            });
          } else {
            (level.spells || []).forEach((s) => {
              if (s.name && !spells.includes(s.name)) spells.push(s.name);
            });
          }
        });
        if (d.playerSpellcasting?.preparedSpells) {
          (d.playerSpellcasting.preparedSpells as string[]).forEach(
            (name: string) => {
              if (!spells.includes(name)) spells.push(name);
            }
          );
        }

        // Sub-professions from profession objects
        const subProfessions: string[] = [];
        (d.professions || []).forEach(
          (p: { subProfessions?: Array<{ name: string }> }) => {
            (p.subProfessions || []).forEach((sp) => {
              if (sp.name && !subProfessions.includes(sp.name))
                subProfessions.push(sp.name);
            });
          }
        );

        // Backpack (string or legacy array)
        const backpackText = Array.isArray(d.equipment?.backpack)
          ? (d.equipment.backpack as Array<string | { name?: string }>)
              .map((i: string | { name?: string }) =>
                typeof i === 'string' ? i : i.name || ''
              )
              .join(', ')
          : (d.equipment?.backpack as string) || '';

        setFormData((prev) => ({
          ...prev,
          ...d,
          stats: d.stats || {},
          playerStats: d.playerStats || {},
          combat: d.combat || {},
          senses: d.senses || {},
          defenses: d.defenses || {},
          proficiencies: d.proficiencies || {},
          abilities: d.abilities || [],
          professions: d.professions || [],
          playerSpellcasting: d.playerSpellcasting || {},
          equipment: d.equipment || {},
          experience: d.experience || undefined,
          chi: d.chi || undefined,
          languages: d.languages || [],
          // UI fields
          spells,
          cantrips,
          spellSlots: sl
            .filter((l: IPlayerSpellLevel) => l.level > 0)
            .map((l: IPlayerSpellLevel) => ({
              level: l.level,
              slotsTotal: l.slotsTotal,
              slotsUsed: l.slotsUsed,
            })),
          profSavingThrows: d.proficiencies?.savingThrows || [],
          profSkills: d.proficiencies?.skills || [],
          subProfessions,
          backpackText,
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

  // ─── Change Handlers ──────────────────────────────────

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (
    parent: string,
    key: string,
    value: string | number
  ) => {
    setFormData((prev) => {
      const parentObj = (prev as Record<string, unknown>)[parent] || {};
      return {
        ...prev,
        [parent]: {
          ...(typeof parentObj === 'object' ? parentObj : {}),
          [key]: value,
        },
      } as typeof prev;
    });
  };

  const handleStatChange = (
    stat: string,
    field: 'base' | 'raceBonus' | 'classBonus',
    value: string
  ) => {
    const numVal = value === '' ? 0 : parseInt(value, 10) || 0;
    setFormData((prev) => {
      const ps = {
        ...((prev.playerStats || {}) as Record<string, Record<string, number>>),
      };
      const current = ps[stat] || {
        base: 0,
        raceBonus: 0,
        classBonus: 0,
        total: 0,
        modifier: 0,
      };
      current[field] = numVal;
      current.total =
        (current.base || 0) +
        (current.raceBonus || 0) +
        (current.classBonus || 0);
      current.modifier = Math.floor((current.total - 10) / 2);
      ps[stat] = current;

      // Also sync simple stats
      const simpleStats = { ...((prev.stats || {}) as Record<string, number>) };
      simpleStats[stat] = current.total;

      return { ...prev, playerStats: ps, stats: simpleStats } as typeof prev;
    });
  };

  const handleSavingThrowChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setFormData((prev) => {
      const arr = [...(prev.profSavingThrows || [])];
      if (!arr[index]) arr[index] = { attribute: '', value: 0 };
      arr[index] = {
        ...arr[index],
        [field]: field === 'value' ? parseInt(value, 10) || 0 : value,
      };
      return { ...prev, profSavingThrows: arr } as typeof prev;
    });
  };

  const addSavingThrow = () => {
    setFormData((prev) => ({
      ...prev,
      profSavingThrows: [
        ...(prev.profSavingThrows || []),
        { attribute: '', value: 0 },
      ],
    }));
  };

  const removeSavingThrow = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      profSavingThrows: (prev.profSavingThrows || []).filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleSkillChange = (index: number, field: string, value: string) => {
    setFormData((prev) => {
      const arr = [...(prev.profSkills || [])];
      if (!arr[index]) arr[index] = { name: '', value: 0 };
      arr[index] = {
        ...arr[index],
        [field]: field === 'value' ? parseInt(value, 10) || 0 : value,
      };
      return { ...prev, profSkills: arr } as typeof prev;
    });
  };

  const addSkill = () => {
    setFormData((prev) => ({
      ...prev,
      profSkills: [...(prev.profSkills || []), { name: '', value: 0 }],
    }));
  };

  const removeSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      profSkills: (prev.profSkills || []).filter((_, i) => i !== index),
    }));
  };

  const handleAbilityChange = (index: number, field: string, value: string) => {
    setFormData((prev) => {
      const arr = [...(prev.abilities || [])];
      if (!arr[index]) arr[index] = { name: '', description: '' };
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, abilities: arr } as typeof prev;
    });
  };

  const addAbility = () => {
    setFormData((prev) => ({
      ...prev,
      abilities: [...(prev.abilities || []), { name: '', description: '' }],
    }));
  };

  const removeAbility = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      abilities: (prev.abilities || []).filter((_, i) => i !== index),
    }));
  };

  const handleProfessionChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setFormData((prev) => {
      const arr = [...(prev.professions || [])];
      if (!arr[index]) arr[index] = { name: '', subProfessions: [] };
      if (field === 'name') {
        arr[index] = { ...arr[index], name: value };
      }
      return { ...prev, professions: arr } as typeof prev;
    });
  };

  const addProfession = () => {
    setFormData((prev) => ({
      ...prev,
      professions: [
        ...(prev.professions || []),
        { name: '', subProfessions: [] },
      ],
    }));
  };

  const removeProfession = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      professions: (prev.professions || []).filter((_, i) => i !== index),
    }));
  };

  const handleSpellSlotChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setFormData((prev) => {
      const arr = [...(prev.spellSlots || [])];
      const numVal = parseInt(value, 10) || 0;
      if (!arr[index])
        arr[index] = { level: index + 1, slotsTotal: 0, slotsUsed: 0 };
      arr[index] = { ...arr[index], [field]: numVal };
      return { ...prev, spellSlots: arr } as typeof prev;
    });
  };

  const addSpellSlot = () => {
    setFormData((prev) => {
      const arr = [...(prev.spellSlots || [])];
      const nextLevel = arr.length > 0 ? arr[arr.length - 1].level + 1 : 1;
      arr.push({ level: nextLevel, slotsTotal: 0, slotsUsed: 0 });
      return { ...prev, spellSlots: arr } as typeof prev;
    });
  };

  const removeSpellSlot = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      spellSlots: (prev.spellSlots || []).filter((_, i) => i !== index),
    }));
  };

  const addSpell = () => {
    setFormData((prev) => ({
      ...prev,
      spells: [...(prev.spells || []), ''],
    }));
  };

  const handleSpellChange = (index: number, value: string) => {
    setFormData((prev) => {
      const arr = [...(prev.spells || [])];
      arr[index] = value;
      return { ...prev, spells: arr } as typeof prev;
    });
  };

  const removeSpell = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      spells: (prev.spells || []).filter((_, i) => i !== index),
    }));
  };

  const addCantrip = () => {
    setFormData((prev) => ({
      ...prev,
      cantrips: [...(prev.cantrips || []), ''],
    }));
  };

  const handleCantripChange = (index: number, value: string) => {
    setFormData((prev) => {
      const arr = [...(prev.cantrips || [])];
      arr[index] = value;
      return { ...prev, cantrips: arr } as typeof prev;
    });
  };

  const removeCantrip = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      cantrips: (prev.cantrips || []).filter((_, i) => i !== index),
    }));
  };

  const handleDefensesChange = (category: string, value: string) => {
    const items = value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    setFormData((prev) => {
      const defenses = {
        ...((prev.defenses || {}) as Record<string, string[]>),
      };
      defenses[category] = items;
      return { ...prev, defenses } as typeof prev;
    });
  };

  const handleLanguagesChange = (value: string) => {
    const langs = value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    setFormData((prev) => ({ ...prev, languages: langs }) as typeof prev);
  };

  // ─── Submit ────────────────────────────────────────────

  const buildCitizenData = () => {
    // Build playerSpellcasting from spellSlots + spells + cantrips
    const spellLevels = (formData.spellSlots || [])
      .filter((s) => s.level > 0)
      .map((slot) => {
        const levelSpells = (formData.spells || [])
          .filter(Boolean)
          .map((name) => ({ name, prepared: true }));
        return {
          level: slot.level,
          slotsTotal: slot.slotsTotal || 0,
          slotsUsed: slot.slotsUsed || 0,
          spells: levelSpells,
        };
      });

    // Add cantrips as level 0 entry if any exist
    const cantripSpells = (formData.cantrips || [])
      .filter(Boolean)
      .map((name) => ({ name, prepared: true }));
    if (cantripSpells.length > 0) {
      spellLevels.unshift({
        level: 0,
        slotsTotal: 0,
        slotsUsed: 0,
        spells: cantripSpells,
      });
    }

    const playerSpellcasting = {
      ...formData.playerSpellcasting,
      spellLevels,
    };
    if (playerSpellcasting.ability === '' && playerSpellcasting.saveDC === 0) {
      delete (playerSpellcasting as Record<string, unknown>).spellLevels;
    }

    // Build professions with subProfessions
    const professions = (formData.professions || []).map((p) => ({
      name: p.name,
      subProfessions: (formData.subProfessions || [])
        .filter(Boolean)
        .map((name: string) => ({ name })),
    }));

    // Build equipment — backpack is now a free-form string
    const eq = formData.equipment || {};
    const backpackText = formData.backpackText || '';

    // Build proficiencies
    const proficiencies = {
      ...formData.proficiencies,
      savingThrows: formData.profSavingThrows || [],
      skills: formData.profSkills || [],
    };

    const slug =
      formData.slug ||
      (formData.name || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    return {
      slug,
      name: formData.name || '',
      race: formData.race || '',
      gender: formData.gender || '',
      class: formData.class || '',
      age: formData.age || undefined,
      height: formData.height || undefined,
      family: formData.family || undefined,
      kingdom: formData.kingdom || undefined,
      clan: formData.clan || undefined,
      deity: formData.deity || undefined,
      alignment: formData.alignment || undefined,
      image: formData.image || undefined,
      icon: formData.icon || undefined,
      level: formData.level || undefined,
      experience: formData.experience || undefined,
      combat: formData.combat || undefined,
      chi: formData.chi || undefined,
      proficiencyBonus: formData.proficiencyBonus || undefined,
      stats: formData.stats || undefined,
      playerStats: formData.playerStats || undefined,
      proficiencies,
      defenses: formData.defenses || undefined,
      senses: formData.senses || undefined,
      languages: formData.languages || undefined,
      abilities: formData.abilities || undefined,
      professions,
      actions: formData.actions || undefined,
      playerSpellcasting,
      equipment: { ...eq, backpack: backpackText, gil: eq.gil || 0 },
      appearance: formData.appearance || undefined,
      backstory: formData.backstory || undefined,
    } as ICitizen;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.name) {
      setAlertMsg('Nome é obrigatório para criar um cidadão.');
      setIsSubmitting(false);
      return;
    }

    const citizenData = buildCitizenData();

    try {
      if (isCreate) {
        await create(citizenData);
      } else {
        await update(citizenData);
      }
      onClose();
    } catch (err) {
      console.error('Erro ao salvar cidadão:', err);
      const detail =
        err instanceof TypeError
          ? `Erro de serialização: ${err.message}`
          : err instanceof Error
            ? err.message
            : 'Erro desconhecido';
      setAlertMsg(detail);
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
            {isImportingMarkdown ? 'Importando...' : 'Importar Ficha (.md)'}
          </button>
          <button
            type="button"
            className={handles.downloadTemplateButton}
            onClick={handleDownloadTemplate}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Baixar Modelo
          </button>
        </div>

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
            <FormField
              label="Classe"
              id="class"
              name="class"
              value={formData.class || ''}
              onChange={handleChange}
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
          <h4
            style={{
              marginTop: '1rem',
              marginBottom: '0.5rem',
              fontSize: '1rem',
            }}
          >
            Truques
          </h4>
          {(formData.cantrips || []).map((cantrip, i) => (
            <div key={i} className={handles.arrayItem}>
              <button
                type="button"
                className={handles.removeButton}
                onClick={() => removeCantrip(i)}
              >
                &times;
              </button>
              <FormField
                label={`Truque ${i + 1}`}
                value={cantrip}
                onChange={(e) => handleCantripChange(i, e.target.value)}
              />
            </div>
          ))}
          <button
            type="button"
            className={handles.addButton}
            onClick={addCantrip}
          >
            + Adicionar Truque
          </button>

          {/* Spell Slots - Dynamic Array */}
          <h4
            style={{
              marginTop: '1rem',
              marginBottom: '0.5rem',
              fontSize: '1rem',
            }}
          >
            Slots de Magia
          </h4>
          <div className={handles.slotTable}>
            {(formData.spellSlots || []).length === 0 && (
              <p
                style={{
                  opacity: 0.5,
                  fontStyle: 'italic',
                  fontSize: '0.85rem',
                }}
              >
                Nenhum círculo adicionado. Clique em &quot;+ Adicionar
                Círculo&quot; para começar.
              </p>
            )}
            {(formData.spellSlots || []).map((slot, idx) => (
              <div key={idx} className={handles.arrayItem}>
                <button
                  type="button"
                  className={handles.removeButton}
                  onClick={() => removeSpellSlot(idx)}
                >
                  &times;
                </button>
                <div className={handles.inlineFields}>
                  <span
                    style={{
                      minWidth: '3rem',
                      fontWeight: 600,
                      alignSelf: 'center',
                    }}
                  >
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
              </div>
            ))}
            <button
              type="button"
              className={handles.addButton}
              onClick={addSpellSlot}
            >
              + Adicionar Círculo
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
                  <span style={{ fontWeight: 600 }}>
                    {detail.total ?? '--'}
                  </span>
                  <span style={{ fontWeight: 600 }}>
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

          <h4
            style={{
              marginTop: '1rem',
              marginBottom: '0.5rem',
              fontSize: '1rem',
            }}
          >
            Testes de Resistência
          </h4>
          {(formData.profSavingThrows || []).map((st, i) => (
            <div key={i} className={handles.arrayItem}>
              <button
                type="button"
                className={handles.removeButton}
                onClick={() => removeSavingThrow(i)}
              >
                &times;
              </button>
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
            </div>
          ))}
          <button
            type="button"
            className={handles.addButton}
            onClick={addSavingThrow}
          >
            + Adicionar Resistência
          </button>

          <h4
            style={{
              marginTop: '1rem',
              marginBottom: '0.5rem',
              fontSize: '1rem',
            }}
          >
            Perícias
          </h4>
          {(formData.profSkills || []).map((sk, i) => (
            <div key={i} className={handles.arrayItem}>
              <button
                type="button"
                className={handles.removeButton}
                onClick={() => removeSkill(i)}
              >
                &times;
              </button>
              <div className={handles.inlineFields}>
                <FormField
                  label="Nome"
                  value={sk.name}
                  onChange={(e) => handleSkillChange(i, 'name', e.target.value)}
                />
                <FormField
                  label="Valor"
                  type="number"
                  value={String(sk.value || '')}
                  onChange={(e) =>
                    handleSkillChange(i, 'value', e.target.value)
                  }
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            className={handles.addButton}
            onClick={addSkill}
          >
            + Adicionar Perícia
          </button>
        </div>

        {/* ── Habilidades ──────────────────────────────── */}
        <div className={handles.section}>
          <h3 className={handles.sectionTitle}>
            Habilidades e Características
          </h3>
          {(formData.abilities || []).map((ab, i) => (
            <div key={i} className={handles.arrayItem}>
              <button
                type="button"
                className={handles.removeButton}
                onClick={() => removeAbility(i)}
              >
                &times;
              </button>
              <FormField
                label="Nome"
                value={ab.name || ''}
                onChange={(e) => handleAbilityChange(i, 'name', e.target.value)}
              />
              <FormField
                label="Descrição"
                isTextarea
                value={ab.description || ''}
                onChange={(e) =>
                  handleAbilityChange(i, 'description', e.target.value)
                }
              />
            </div>
          ))}
          <button
            type="button"
            className={handles.addButton}
            onClick={addAbility}
          >
            + Adicionar Habilidade
          </button>
        </div>

        {/* ── Profissões ───────────────────────────────── */}
        <div className={handles.section}>
          <h3 className={handles.sectionTitle}>Profissões</h3>
          {(formData.professions || []).map((prof, i) => (
            <div key={i} className={handles.arrayItem}>
              <button
                type="button"
                className={handles.removeButton}
                onClick={() => removeProfession(i)}
              >
                &times;
              </button>
              <FormField
                label="Nome da Profissão"
                value={prof.name || ''}
                onChange={(e) =>
                  handleProfessionChange(i, 'name', e.target.value)
                }
              />
            </div>
          ))}
          <button
            type="button"
            className={handles.addButton}
            onClick={addProfession}
          >
            + Adicionar Profissão
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

          <h4
            style={{
              marginTop: '1rem',
              marginBottom: '0.5rem',
              fontSize: '1rem',
            }}
          >
            Magias Preparadas
          </h4>
          {(formData.spells || []).map((spell, i) => (
            <div key={i} className={handles.arrayItem}>
              <button
                type="button"
                className={handles.removeButton}
                onClick={() => removeSpell(i)}
              >
                &times;
              </button>
              <FormField
                label={`Magia ${i + 1}`}
                value={spell}
                onChange={(e) => handleSpellChange(i, e.target.value)}
              />
            </div>
          ))}
          <button
            type="button"
            className={handles.addButton}
            onClick={addSpell}
          >
            + Adicionar Magia
          </button>
        </div>

        {/* ── Equipamento ──────────────────────────────── */}
        <div className={handles.section}>
          <h3 className={handles.sectionTitle}>Equipamento</h3>
          <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Slots</h4>
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
          <h4
            style={{
              marginTop: '1rem',
              marginBottom: '0.5rem',
              fontSize: '1rem',
            }}
          >
            Inventário
          </h4>
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
            isTextarea
            value={formData.backstory || ''}
            onChange={handleChange}
          />
        </div>

        {/* ── Defesas ──────────────────────────────────── */}
        <div className={handles.section}>
          <h3 className={handles.sectionTitle}>Defesas</h3>
          <div className={handles.grid2}>
            {(
              [
                'vulnerabilities',
                'resistances',
                'damageImmunities',
                'conditionImmunities',
              ] as const
            ).map((cat) => {
              const labels: Record<string, string> = {
                vulnerabilities: 'Vulnerabilidades',
                resistances: 'Resistências',
                damageImmunities: 'Imunidades a Dano',
                conditionImmunities: 'Imunidades a Condição',
              };
              const defenses = (formData.defenses || {}) as Record<
                string,
                string[]
              >;
              return (
                <FormField
                  key={cat}
                  label={labels[cat]}
                  value={(defenses[cat] || []).join(', ')}
                  onChange={(e) => handleDefensesChange(cat, e.target.value)}
                />
              );
            })}
          </div>
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
          <button
            type="button"
            className={handles.cancelButton}
            onClick={onClose}
          >
            Cancelar
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
