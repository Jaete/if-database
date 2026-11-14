'use client';

import { useEffect, useRef, useState } from 'react';
import { modifierOf } from '@/lib/stats';
import { sheetSounds } from '@/lib/sheetSounds';
import {
  ATTRIBUTE_KEYS,
  hpGainOf,
  type ILevelPlan,
  type ISealChoices,
} from '@/lib/levelUp';
import type { AttributeKey } from '@/lib/stats';

export type StepId =
  | 'ganhos'
  | 'carac'
  | 'arquetipo'
  | 'talento'
  | 'marco'
  | 'truques'
  | 'magias'
  | 'vida'
  | 'revisao'
  // Uma lista de escolha da classe com escolhas neste nível: `cat:<slug>`.
  | `cat:${string}`;

export interface IStep {
  id: StepId;
  title: string;
  required: boolean;
}

export interface IDraft {
  features: (string | null)[];
  archetypeSlug: string | null;
  archetypeFeatures: string[];
  classTalentKeys: string[];
  milestoneUse: 'attribute' | 'talent';
  points: Partial<Record<AttributeKey, number>>;
  milestoneTalent: string | null;
  spellIds: string[];
  cantripIds: string[];
  /** Itens escolhidos em cada lista da classe, por slug da lista. */
  catalogPicks: Record<string, string[]>;
  hpMode: 'fixed' | 'roll' | 'manual' | null;
  manualHp: string;
  seenGains: boolean;
}

/** Os passos saem do plano do nível: só aparece o que a tabela da classe pede. */
/** O arquétipo que vale agora: o que este nível escolhe, ou o que a ficha já tem. */
const archetypeNow = (plan: ILevelPlan, d: IDraft | null) =>
  plan.archetype?.pickSlug
    ? (d?.archetypeSlug ?? null)
    : (plan.archetypeSlug ?? plan.archetype?.currentSlug ?? null);

/** As listas de escolha com escolhas a fazer (as que exigem arquétipo só com ele). */
export const activeCatalogs = (plan: ILevelPlan, d: IDraft | null) =>
  plan.catalogPicks.filter(
    (c) =>
      c.need > 0 &&
      (!c.requiresArchetype || c.requiresArchetype === archetypeNow(plan, d))
  );

export function stepsOf(plan: ILevelPlan, d: IDraft | null = null): IStep[] {
  const steps: IStep[] = [{ id: 'ganhos', title: 'Ganhos', required: false }];
  if (plan.featureChoices.length > 0) {
    steps.push({ id: 'carac', title: 'Característica', required: true });
  }
  if (plan.archetype) {
    steps.push({ id: 'arquetipo', title: 'Arquétipo', required: true });
  }
  const classTalents = plan.talentOptions.some(
    (t) => t.scope === 'class' && t.ok
  );
  if (plan.classTalentSlots > 0 && classTalents) {
    steps.push({ id: 'talento', title: 'Talento', required: true });
  }
  if (plan.milestone)
    steps.push({ id: 'marco', title: 'Atributos', required: true });
  if (plan.cantrips.need > 0) {
    steps.push({ id: 'truques', title: 'Truques', required: true });
  }
  if (plan.spells.adds.length > 0) {
    steps.push({
      id: 'magias',
      title: 'Magias',
      required: plan.spells.need > 0,
    });
  }
  for (const c of activeCatalogs(plan, d)) {
    steps.push({ id: `cat:${c.slug}`, title: c.name, required: true });
  }
  steps.push({ id: 'vida', title: 'Vida', required: true });
  steps.push({ id: 'revisao', title: 'Revisão', required: false });
  return steps;
}

const archetypePool = (plan: ILevelPlan, slug: string | null) => {
  const a = plan.archetype;
  if (!a) return [];
  const chosen = a.archetypes.find(
    (x) => x.slug === (a.pickSlug ? slug : a.currentSlug)
  );
  return (chosen?.features ?? []).filter((f) => !a.taken.includes(f.name));
};

export const pointsSum = (d: IDraft) =>
  Object.values(d.points).reduce<number>((s, v) => s + (v ?? 0), 0);

/** O modificador de CON depois dos pontos deste nível: vale só para a vida dele. */
export const conModOf = (plan: ILevelPlan, d: IDraft) =>
  modifierOf(
    plan.attributes.con.total +
      (plan.milestone && d.milestoneUse === 'attribute'
        ? (d.points.con ?? 0)
        : 0)
  );

export const hpBaseOf = (plan: ILevelPlan, d: IDraft): number | null => {
  if (d.hpMode === 'roll') return plan.hp.roll?.result ?? null;
  if (d.hpMode === 'fixed') return plan.hp.fixed;
  return null;
};

export const hpGainFor = (plan: ILevelPlan, d: IDraft): number | null => {
  if (plan.hp.mode === 'manual') {
    // Sem dado: o valor informado é o ganho do nível.
    const v = Number(d.manualHp);
    return Number.isInteger(v) && v > 0 ? v : null;
  }
  const base = hpBaseOf(plan, d);
  return base === null ? null : hpGainOf(base, conModOf(plan, d));
};

export function stepDone(plan: ILevelPlan, d: IDraft, id: StepId): boolean {
  switch (id) {
    case 'ganhos':
      return d.seenGains;
    case 'carac':
      return d.features.every(Boolean);
    case 'arquetipo': {
      const a = plan.archetype!;
      if (a.pickSlug && !d.archetypeSlug) return false;
      const want = Math.min(
        a.featureSlots,
        archetypePool(plan, d.archetypeSlug).length
      );
      return d.archetypeFeatures.length === want;
    }
    case 'talento':
      return d.classTalentKeys.length === plan.classTalentSlots;
    case 'marco':
      return d.milestoneUse === 'attribute'
        ? pointsSum(d) === 2
        : !!d.milestoneTalent;
    case 'truques':
      return d.cantripIds.length === plan.cantrips.need;
    case 'magias':
      return d.spellIds.length === plan.spells.need;
    case 'vida':
      return hpGainFor(plan, d) !== null;
    default: {
      if (id.startsWith('cat:')) {
        const cat = plan.catalogPicks.find((c) => `cat:${c.slug}` === id);
        return !!cat && (d.catalogPicks[cat.slug] ?? []).length === cat.need;
      }
      return false;
    }
  }
}

export function buildChoices(plan: ILevelPlan, d: IDraft): ISealChoices {
  const points: Partial<Record<AttributeKey, number>> = {};
  for (const key of ATTRIBUTE_KEYS)
    if (d.points[key]) points[key] = d.points[key];
  return {
    features: d.features.filter((f): f is string => !!f),
    archetypeSlug: plan.archetype?.pickSlug
      ? (d.archetypeSlug ?? undefined)
      : undefined,
    archetypeFeatures: plan.archetype ? d.archetypeFeatures : [],
    classTalentKeys: d.classTalentKeys,
    milestone: plan.milestone
      ? d.milestoneUse === 'attribute'
        ? { use: 'attribute', points }
        : { use: 'talent', talentKey: d.milestoneTalent ?? '' }
      : undefined,
    spellIds: d.spellIds,
    cantripIds: d.cantripIds,
    catalogPicks: activeCatalogs(plan, d).flatMap((c) =>
      (d.catalogPicks[c.slug] ?? []).map((item) => ({ catalog: c.slug, item }))
    ),
    hp:
      plan.hp.mode === 'manual'
        ? { mode: 'manual', manual: Number(d.manualHp) }
        : { mode: d.hpMode === 'roll' ? 'roll' : 'fixed' },
  };
}

function initialDraft(plan: ILevelPlan, saved: Partial<IDraft> | null): IDraft {
  const base: IDraft = {
    features: plan.featureChoices.map(() => null),
    archetypeSlug: null,
    archetypeFeatures: [],
    classTalentKeys: [],
    milestoneUse: 'attribute',
    points: {},
    milestoneTalent: null,
    spellIds: [],
    cantripIds: [],
    catalogPicks: {},
    hpMode: null,
    manualHp: '',
    seenGains: false,
    ...(saved ?? {}),
  };
  const sealed = plan.sealed?.choices;
  if (sealed) {
    base.features = plan.featureChoices.map(
      (_, i) => sealed.features[i] ?? null
    );
    base.archetypeSlug = sealed.archetypeSlug ?? null;
    base.archetypeFeatures = sealed.archetypeFeatures ?? [];
    base.classTalentKeys = sealed.classTalentKeys ?? [];
    if (sealed.milestone?.use === 'talent') {
      base.milestoneUse = 'talent';
      base.milestoneTalent = sealed.milestone.talentKey;
    } else if (sealed.milestone?.use === 'attribute') {
      base.points = sealed.milestone.points;
    }
    base.spellIds = sealed.spellIds ?? [];
    base.cantripIds = sealed.cantripIds ?? [];
    base.catalogPicks = {};
    for (const pick of sealed.catalogPicks ?? []) {
      (base.catalogPicks[pick.catalog] ??= []).push(pick.item);
    }
    base.hpMode = sealed.hp.mode;
    base.manualHp = sealed.hp.manual ? String(sealed.hp.manual) : '';
    base.seenGains = true;
  }
  // A rolagem gravada vale sempre: recarregar a página não a refaz.
  if (plan.hp.roll) base.hpMode = 'roll';
  if (base.hpMode === 'roll' && !plan.hp.roll) base.hpMode = null;
  return base;
}

const draftKey = (plan: ILevelPlan, playerId: string) =>
  `ifdb-levelup-draft:${playerId}:${plan.level}`;

/**
 * O rascunho do nível: só local. O que vai para o servidor antes do selo é a
 * rolagem de vida, e nada além dela. Sai da tela, o rascunho fica no
 * navegador; no selo, ele é apagado.
 */
export function useLevelDraft(
  plan: ILevelPlan,
  playerId: string,
  editing: boolean
) {
  const [draft, setDraft] = useState<IDraft>(() => {
    let saved: Partial<IDraft> | null = null;
    if (!editing) {
      try {
        const raw = localStorage.getItem(draftKey(plan, playerId));
        saved = raw ? (JSON.parse(raw) as Partial<IDraft>) : null;
      } catch {
        saved = null;
      }
    }
    return initialDraft(plan, saved);
  });

  useEffect(() => {
    if (editing) return;
    try {
      localStorage.setItem(draftKey(plan, playerId), JSON.stringify(draft));
    } catch {
      // Sem armazenamento: o rascunho vale só enquanto a tela está aberta.
    }
  }, [draft, plan, playerId, editing]);

  const clear = () => {
    try {
      localStorage.removeItem(draftKey(plan, playerId));
    } catch {
      // Nada a limpar.
    }
  };

  const steps = stepsOf(plan, draft);
  const required = steps.filter((s) => s.required);
  const doneCount = required.filter((s) => stepDone(plan, draft, s.id)).length;

  // Um passo que ganha ✓ toca o alaúde (dedilhado em quinta).
  const prev = useRef(doneCount);
  useEffect(() => {
    if (doneCount > prev.current) sheetSounds.play('lute');
    prev.current = doneCount;
  }, [doneCount]);

  const patch = (next: Partial<IDraft>) => setDraft((d) => ({ ...d, ...next }));
  return {
    draft,
    patch,
    steps,
    required,
    doneCount,
    clear,
    allDone: doneCount === required.length,
  };
}
