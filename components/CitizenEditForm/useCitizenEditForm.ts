'use client';

import { useState, useRef, useEffect } from 'react';
import type ICitizen from '@/db/citizens/citizen.d';
import type {
  ICitizenArchetype,
  IPlayerSpell,
  IPlayerSpellLevel,
  IPlayerSpellRef,
} from '@/db/citizens/citizen.d';
import { splitList } from '@/lib/listValues';
import SKILLS, { findSkill } from '@/db/l10n/skills';
import { modifierOf, skillValue } from '@/lib/stats';

export type FormDataType = Partial<ICitizen> & {
  // Campos de jogador. Ficam aqui, e não num tipo separado, porque o mesmo
  // formulário serve às duas entidades e o `variant` decide se são gravados.
  ownerUsername?: string;
  ownerForumUserId?: number;
  forumTopicUrl?: string;
  // A magia inteira, não só o nome: a ficha guarda escola, componentes,
  // descrição e o resto, e editar só o nome apagaria tudo isso ao salvar.
  spells: IPlayerSpell[];
  cantrips: IPlayerSpell[];
  // Magias ligadas ao grimório: só o id e o estado de quem conjura. O resto da
  // magia (inclusive o círculo) mora na coleção `spells`.
  spellRefs: IPlayerSpellRef[];
  profSavingThrows: Array<{ attribute: string; value: number }>;
  profSkills: Array<{
    name: string;
    value: number;
    proficient?: boolean;
    bonus?: number;
  }>;
  spellSlots: Array<{ level: number; slotsTotal: number; slotsUsed: number }>;
  subProfessions: string[];
  backpackText: string;
};

export const emptyCitizen: FormDataType = {
  slug: '',
  name: '',
  race: '',
  gender: '',
  class: '',
  classId: undefined as string | undefined,
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
  spellRefs: [],
  profSavingThrows: [],
  profSkills: [],
  spellSlots: [],
  subProfessions: [],
  backpackText: '',
};

/** Chave de comparação de nome de magia, tolerante a acento e caixa. */
const spellKey = (name: string) =>
  name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

/**
 * Reconstrói os círculos de magia a partir do que o formulário edita: as
 * listas de nomes e a tabela de espaços.
 *
 * O que a magia tem além do nome — escola, componentes, uso, descrição — não
 * tem campo no formulário, então vem da ficha carregada e é reaproveitado por
 * nome. Sem isso, salvar aqui apagaria tudo o que a importação leu.
 *
 * Fora deste arquivo por ser pura: é a parte do formulário que dá para
 * verificar sem montar a tela.
 */
export const buildSpellLevels = (formData: {
  spells?: IPlayerSpell[];
  cantrips?: IPlayerSpell[];
  spellSlots?: Array<{ level: number; slotsTotal: number; slotsUsed: number }>;
  playerSpellcasting?: { spellLevels?: IPlayerSpellLevel[] };
}): IPlayerSpellLevel[] => {
  const known = new Map<string, { level: number; spell: IPlayerSpell }>();
  for (const level of formData.playerSpellcasting?.spellLevels ?? []) {
    for (const spell of level.spells ?? []) {
      if (spell?.name) {
        known.set(spellKey(spell.name), { level: level.level, spell });
      }
    }
  }

  const slots = (formData.spellSlots || []).filter((s) => s.level > 0);
  // Magia sem origem conhecida (digitada aqui) vai para o menor círculo com
  // espaços, em vez de ser copiada para todos eles.
  const fallbackLevel = slots.length
    ? Math.min(...slots.map((s) => s.level))
    : 1;

  const byLevel = new Map<number, IPlayerSpell[]>();
  const place = (spell: IPlayerSpell, defaultLevel: number) => {
    // O formulário edita a magia inteira; da ficha carregada só aproveitamos
    // em que círculo ela estava, que é o que o formulário não guarda.
    const hit = known.get(spellKey(spell.name));
    let level = hit ? hit.level : defaultLevel;
    // Círculo que perdeu os espaços no formulário não pode levar a magia
    // junto para fora da ficha.
    if (level > 0 && !slots.some((s) => s.level === level)) {
      level = defaultLevel;
    }
    const list = byLevel.get(level) ?? [];
    list.push(spell);
    byLevel.set(level, list);
  };

  (formData.spells || [])
    .filter((s) => s?.name)
    .forEach((spell) => place(spell, fallbackLevel));
  (formData.cantrips || [])
    .filter((s) => s?.name)
    .forEach((spell) => place(spell, 0));

  const spellLevels: IPlayerSpellLevel[] = slots.map((slot) => ({
    level: slot.level,
    slotsTotal: slot.slotsTotal || 0,
    slotsUsed: slot.slotsUsed || 0,
    spells: byLevel.get(slot.level) ?? [],
  }));

  const cantripSpells = byLevel.get(0) ?? [];
  if (cantripSpells.length > 0) {
    spellLevels.unshift({
      level: 0,
      slotsTotal: 0,
      slotsUsed: 0,
      spells: cantripSpells,
    });
  }

  return spellLevels;
};

export const citizenToFormData = (citizen: ICitizen) => {
  const spellRefs: IPlayerSpellRef[] =
    citizen.playerSpellcasting?.spellRefs ?? [];
  const spells: IPlayerSpell[] = [];
  const cantrips: IPlayerSpell[] = [];
  const sl = citizen.playerSpellcasting?.spellLevels || [];
  sl.forEach((level) => {
    const target = level.level === 0 ? cantrips : spells;
    (level.spells || []).forEach((s) => {
      if (
        s.name &&
        !target.some((t) => spellKey(t.name) === spellKey(s.name))
      ) {
        target.push(s);
      }
    });
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
    spellRefs,
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

export type EditFormVariant = 'citizen' | 'player';

/**
 * A persistência entra por prop em vez de sair de `useCitizens()` aqui dentro:
 * o mesmo formulário roda na página de cidadãos e na de jogadores, e cada uma
 * tem o seu provider. Chamar o hook errado quebraria a outra tela.
 */
/**
 * Os campos que o schema marca como `required` — em cidadão e em jogador, que
 * exigem os mesmos quatro.
 *
 * Esta lista é a cópia frontend de `db/citizens/schema.ts`. Se um campo virar
 * obrigatório lá, precisa entrar aqui também; o preço de não ter a lista é
 * devolver um 500 a quem clicou em salvar.
 */
const REQUIRED_FIELDS: readonly { name: keyof FormDataType; label: string }[] =
  [
    { name: 'name', label: 'Nome' },
    { name: 'race', label: 'Raça' },
    { name: 'gender', label: 'Gênero' },
    { name: 'class', label: 'Classe' },
  ];

export interface IEditFormPersistence {
  create: (data: ICitizen) => Promise<unknown>;
  update: (data: ICitizen) => Promise<unknown>;
}

interface IUseCitizenEditFormProps {
  citizen?: ICitizen;
  onClose: () => void;
  mode?: 'create' | 'edit';
  variant?: EditFormVariant;
  persist: IEditFormPersistence;
  externalFormData?: FormDataType;
  onFormDataChange?: (data: FormDataType) => void;
}

export const useCitizenEditForm = ({
  citizen,
  onClose,
  mode = 'edit',
  variant = 'citizen',
  persist,
  externalFormData,
  onFormDataChange,
}: IUseCitizenEditFormProps) => {
  const { update, create } = persist;
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
        const spells: IPlayerSpell[] = [];
        const cantrips: IPlayerSpell[] = [];

        const sl = d.playerSpellcasting?.spellLevels || [];
        sl.forEach((level: IPlayerSpellLevel) => {
          const target = level.level === 0 ? cantrips : spells;
          (level.spells || []).forEach((s) => {
            if (
              s.name &&
              !target.some((t) => spellKey(t.name) === spellKey(s.name))
            ) {
              target.push(s);
            }
          });
        });

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

  /**
   * O modificador final do atributo que governa a perícia. Usa o total já
   * calculado em `playerStats` quando existe; senão deriva do valor base.
   */
  const attributeModifier = (attribute: string): number => {
    const detail = (
      formData.playerStats as Record<string, { modifier?: number }> | undefined
    )?.[attribute];
    if (detail?.modifier !== undefined) return detail.modifier;

    const score = (formData.stats as Record<string, number> | undefined)?.[
      attribute
    ];
    return modifierOf(score);
  };

  // A lista de perícias é fixa; o que o usuário edita é a proficiência e o
  // bônus extra. O valor sai dos dois mais o modificador do atributo.
  const skillRows = SKILLS.map((skill) => {
    const stored = (formData.profSkills || []).find(
      (row) => findSkill(row.name)?.name === skill.name
    );
    const proficient = stored?.proficient ?? false;
    const bonus = stored?.bonus ?? 0;

    return {
      ...skill,
      proficient,
      bonus,
      value: skillValue(
        attributeModifier(skill.attribute),
        proficient,
        formData.proficiencyBonus ?? 0,
        bonus
      ),
    };
  });

  /**
   * Reescreve a lista inteira a cada mudança. É a forma mais simples de manter
   * os valores coerentes: qualquer edição — check, bônus, ou um atributo que
   * mudou em outra seção — recalcula tudo a partir das mesmas entradas.
   */
  const updateSkill = (
    name: string,
    patch: { proficient?: boolean; bonus?: number }
  ) => {
    setFormData((prev) => {
      const rows = SKILLS.map((skill) => {
        const stored = (prev.profSkills || []).find(
          (row) => findSkill(row.name)?.name === skill.name
        );
        const isTarget = skill.name === name;

        const proficient = isTarget
          ? (patch.proficient ?? stored?.proficient ?? false)
          : (stored?.proficient ?? false);
        const bonus = isTarget
          ? (patch.bonus ?? stored?.bonus ?? 0)
          : (stored?.bonus ?? 0);

        const detail = (
          prev.playerStats as Record<string, { modifier?: number }> | undefined
        )?.[skill.attribute];
        const modifier =
          detail?.modifier ??
          modifierOf(
            (prev.stats as Record<string, number> | undefined)?.[
              skill.attribute
            ]
          );

        return {
          name: skill.name,
          proficient,
          bonus,
          value: skillValue(
            modifier,
            proficient,
            prev.proficiencyBonus ?? 0,
            bonus
          ),
        };
      });

      return { ...prev, profSkills: rows };
    });
  };

  const toggleSkillProficiency = (name: string, proficient: boolean) =>
    updateSkill(name, { proficient });

  const handleSkillBonusChange = (name: string, raw: string) =>
    updateSkill(name, { bonus: parseInt(raw, 10) || 0 });

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

  // Um par de operações só, para truques e magias: as duas listas guardam o
  // mesmo tipo e o que muda é só em qual delas a magia entra.
  type SpellList = 'spells' | 'cantrips';

  const setSpellAt = (list: SpellList, index: number, spell: IPlayerSpell) => {
    setFormData((prev) => {
      const arr = [...(prev[list] || [])];
      if (index < 0) arr.push(spell);
      else arr[index] = spell;
      return { ...prev, [list]: arr } as typeof prev;
    });
  };

  // A classe grava os dois campos juntos: o vínculo e o nome desnormalizado
  // que a ficha exibe.
  const setCharacterClass = (next: { classId?: string; class: string }) =>
    setFormData((prev) => ({
      ...prev,
      classId: next.classId,
      class: next.class,
      // O arquétipo é de uma classe só: mantê-lo ao trocar deixaria a ficha
      // apontando para uma subclasse que a classe nova não tem.
      archetype: prev.classId === next.classId ? prev.archetype : undefined,
    }));

  const setArchetype = (archetype: ICitizenArchetype | undefined) =>
    setFormData((prev) => ({ ...prev, archetype }));

  const setSpellRefs = (spellRefs: IPlayerSpellRef[]) =>
    setFormData((prev) => ({ ...prev, spellRefs }));

  const removeSpellAt = (list: SpellList, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [list]: (prev[list] || []).filter((_, i) => i !== index),
    }));
  };

  const handleDefensesChange = (category: string, value: string) => {
    const items = splitList(value);
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
    const spellLevels = buildSpellLevels(formData);

    const playerSpellcasting = {
      ...formData.playerSpellcasting,
      spellLevels,
      spellRefs: formData.spellRefs ?? [],
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
      // `|| undefined`, nunca `|| ''`: string vazia num caminho ObjectId é
      // erro de cast no Mongoose, e o formulário mostraria uma falha opaca.
      classId: formData.classId || undefined,
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
      // Só a escolha; o nome do arquétipo e o teto de habilidades são
      // derivados da tabela da classe a cada leitura.
      archetype: formData.archetype?.slug
        ? {
            slug: formData.archetype.slug,
            features: formData.archetype.features ?? [],
          }
        : undefined,
      professions,
      actions: formData.actions || undefined,
      playerSpellcasting,
      equipment: { ...eq, backpack: backpackText, gil: eq.gil || 0 },
      appearance: formData.appearance || undefined,
      backstory: formData.backstory || undefined,
      // Só a variante de jogador grava vínculo e procedência; em cidadão estes
      // campos nem existem no schema e seriam descartados.
      ...(variant === 'player'
        ? {
            ownerUsername: formData.ownerUsername || undefined,
            ownerForumUserId: formData.ownerForumUserId ?? undefined,
            forumTopicUrl: formData.forumTopicUrl || undefined,
          }
        : {}),
    } as ICitizen;
  };

  // ─── Jogador ─────────────────────────────────────────
  const [isImportingSheet, setIsImportingSheet] = useState(false);

  const handleOwnerChange = (username: string, forumUserId?: number) => {
    setFormData((prev) => ({
      ...prev,
      ownerUsername: username || undefined,
      ownerForumUserId: forumUserId,
    }));
  };

  const handleTopicUrlChange = (url: string) => {
    setFormData((prev) => ({ ...prev, forumTopicUrl: url }));
  };

  // Preenche o formulário a partir do tópico, sem salvar: o usuário revisa
  // antes, igual ao import de markdown.
  const handleImportSheet = async () => {
    if (!formData.forumTopicUrl) return;
    setIsImportingSheet(true);

    try {
      const res = await fetch('/api/players/import-forum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: formData.forumTopicUrl }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Erro ao importar ficha');

      setFormData((prev) => ({
        ...prev,
        ...(citizenToFormData(result.data as ICitizen) as FormDataType),
        // O que o usuário já escolheu aqui não é sobrescrito pela ficha.
        ownerUsername: prev.ownerUsername,
        ownerForumUserId: prev.ownerForumUserId,
        forumTopicUrl: prev.forumTopicUrl,
      }));
      setAlertMsg('Ficha importada. Revise os campos antes de salvar.');
    } catch (err) {
      setAlertMsg(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsImportingSheet(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // O que o schema exige. Conferido aqui porque a alternativa é o servidor
    // recusar com 500 depois do formulário já ter fechado — e aí a ficha
    // inteira, que pode ter levado meia hora para ser preenchida, se perde.
    // O `slug` não entra: é derivado do nome logo abaixo.
    const missing = REQUIRED_FIELDS.filter(
      (field) => !String(formData[field.name] ?? '').trim()
    );

    if (missing.length > 0) {
      const subject = variant === 'player' ? 'o personagem' : 'o cidadão';
      const labels = missing.map((field) => field.label);
      setAlertMsg(
        `Para salvar ${subject}, ${
          labels.length === 1 ? 'falta preencher' : 'faltam preencher'
        }: ${labels.join(', ')}.`
      );
      setIsSubmitting(false);
      return;
    }

    const citizenData = buildCitizenData();

    try {
      const saved = isCreate
        ? await create(citizenData)
        : await update(citizenData);

      // Fechar só com a gravação confirmada. A persistência devolve vazio
      // quando o servidor recusa, e fechar nesse caso é perder tudo o que
      // está na tela.
      if (!saved) {
        setAlertMsg(
          'O servidor recusou a gravação. A ficha continua aberta — confira os campos e tente de novo.'
        );
        return;
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

  return {
    isCreate,
    variant,
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
    handleSkillChange,
    addSkill,
    removeSkill,
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
    removeSpellAt,
    setSpellRefs,
    setCharacterClass,
    setArchetype,
    handleDefensesChange,
    handleLanguagesChange,
    isImportingSheet,
    handleOwnerChange,
    handleTopicUrlChange,
    handleImportSheet,
    handleSubmit,
  };
};
