'use client';

import { useEffect, useMemo, useState } from 'react';
import type {
  ICitizenRaceChoice,
  ICitizenTalent,
  IPlayerSpellRef,
} from '@/db/citizens/citizen.d';
import type ICharacterClass from '@/db/classes/class.d';
import type { IRaceCatalogEntry } from '@/db/races/race.d';
import type ISpell from '@/db/spells/spell.d';
import type {
  IArchetypeChoice,
  IClassChoice,
  IRaceChoice,
  IRaceDraft,
  ISpellChoice,
  ITalentChoice,
} from '@/lib/catalogChoice';
import {
  isMixedRace,
  raceChoiceIssues,
  raceLabelOf,
  resolveRaceTraits,
} from '@/services/raceTraits.service';
import type { ITalentOption } from '@/services/talentCatalog';
import type { IClassOption } from '../../ClassGrid/useClassGrid';
import type { IRaceView } from '../../RaceData/types';
import { loadRaceCatalog, loadTalentOptions, pickedSpells } from '../catalogs';
import { useEditing } from '../EditingContext';
import { talentProgress } from '../sheetData';
import { talentSlotsOf } from '@/services/talentSlots';
import { REFS_PATH } from '../SpellsPanel/useSpellsPanel';
import type { CatalogRequest, ICatalogScreen, ITrayInfo } from './types';
import { sheetSounds } from '@/lib/sheetSounds';

const fetchJson = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(url);
  return res.json();
};

interface IClassPick {
  _id: string;
  name: string;
  slug: string;
}

const TITLE: Record<CatalogRequest['kind'], string> = {
  race: 'Raça',
  class: 'Classe',
  archetype: 'Arquétipo',
  spells: 'Magias',
  talents: 'Talento',
};

/**
 * Estado da camada de escolha: o que cada catálogo precisa, a pilha de telas,
 * a bandeja (o rascunho da escolha) e o que "Aplicar à ficha" grava.
 *
 * Nada aqui grava no servidor. Aplicar chama `setField` do rascunho da ficha,
 * e a SaveBar continua sendo o único salvamento.
 */
export const useCatalogLayerState = (
  request: CatalogRequest,
  onClose: () => void
) => {
  const { value, read, objects, setField, isDirtyUnder } = useEditing();
  // A classe do rascunho difere da gravada: marcos e círculos vêm DELA, e não
  // da leitura da ficha (que ainda é da classe antiga).
  const classDirty = isDirtyUnder('classId');

  const playerId = String(read<string>('_id') ?? '');
  const classId = String(value('classId') ?? '');
  const level = Number(value('level')) || 0;
  const raceId = String(value('raceId') ?? '');
  const currentChoice = read<ICitizenRaceChoice>('raceChoice') ?? {};
  const talents = objects<ICitizenTalent>('talents').filter((t) => t?.key);
  const refs = objects<IPlayerSpellRef>(REFS_PATH);
  const archetypeSlug = String(value('archetype.slug') ?? '');
  const slotsRead =
    read<import('@/db/citizens/citizen.d').ITalentSlots>('talentSlots');
  const milestones =
    read<import('@/db/citizens/citizen.d').ITalentMilestone[]>(
      'talentMilestones'
    ) ?? [];
  const playerName = String(value('name') ?? '');

  // ── Dados dos catálogos (baixados ao abrir) ─────────────────────────────
  const [raceCatalog, setRaceCatalog] = useState<IRaceCatalogEntry[] | null>(
    null
  );
  const [raceViews, setRaceViews] = useState<Record<string, IRaceView>>({});
  const [classOptions, setClassOptions] = useState<IClassOption[] | null>(null);
  const [classDoc, setClassDoc] = useState<ICharacterClass | null>(null);
  const [spells, setSpells] = useState<ISpell[] | null>(null);
  const [talentOptions, setTalentOptions] = useState<ITalentOption[] | null>(
    null
  );
  const [failed, setFailed] = useState(false);

  const kind = request.kind;
  useEffect(() => {
    let active = true;
    const fail = () => {
      if (active) setFailed(true);
    };
    if (kind === 'race') {
      loadRaceCatalog({ fresh: true, forPlayer: playerId })
        .then((list) => active && setRaceCatalog(list))
        .catch(fail);
    }
    if (
      kind === 'class' ||
      kind === 'archetype' ||
      kind === 'spells' ||
      (kind === 'talents' && classDirty)
    ) {
      fetchJson<IClassOption[]>('/api/classes/options')
        .then((list) => active && setClassOptions(list))
        .catch(fail);
    }
    if (kind === 'spells') {
      fetchJson<ISpell[]>('/api/spells')
        .then((list) => active && setSpells(list))
        .catch(fail);
    }
    if (kind === 'talents') {
      loadTalentOptions(classId)
        .then((list) => active && setTalentOptions(list))
        .catch(fail);
    }
    return () => {
      active = false;
    };
  }, [kind, classId, classDirty, playerId]);

  // A classe completa: arquétipos (archetype) e tabela de círculos (spells).
  const currentClass = classOptions?.find((c) => String(c._id) === classId);
  const currentSlug = currentClass?.slug;
  useEffect(() => {
    const needsDoc =
      kind === 'archetype' ||
      kind === 'spells' ||
      (kind === 'talents' && classDirty);
    if (!needsDoc || !currentSlug) return;
    let active = true;
    fetchJson<ICharacterClass>(`/api/classes/${currentSlug}`)
      .then((doc) => active && setClassDoc(doc))
      .catch(() => active && setFailed(true));
    return () => {
      active = false;
    };
  }, [kind, currentSlug, classDirty]);

  // ── Rascunhos ───────────────────────────────────────────────────────────
  const currentRace = raceCatalog?.find((r) => r.id === raceId);
  const bySlug = useMemo(
    () => new Map((raceCatalog ?? []).map((r) => [r.slug, r])),
    [raceCatalog]
  );
  const currentRaceDraft: (IRaceDraft & { label: string }) | undefined =
    currentRace
      ? {
          slug: currentRace.slug,
          choice: currentChoice,
          label: raceLabelOf(currentRace, currentChoice, bySlug),
        }
      : undefined;

  const [raceDraft, setRaceDraft] = useState<IRaceDraft | undefined>(undefined);
  const [raceTouched, setRaceTouched] = useState(false);
  const draftRace: IRaceDraft | undefined = raceTouched
    ? raceDraft
    : currentRaceDraft && {
        slug: currentRaceDraft.slug,
        choice: currentRaceDraft.choice,
      };

  const [classDraft, setClassDraft] = useState<IClassPick | undefined>();
  const [archetypeDraft, setArchetypeDraft] = useState<string | undefined>();
  const [knownDraft, setKnownDraft] = useState<string[] | undefined>();
  const [talentPicks, setTalentPicks] = useState<ITalentOption[]>([]);
  const [confirmedRemoval, setConfirmedRemoval] = useState(false);

  const savedKnown = refs.map((r) => String(r.spellId));
  const known = knownDraft ?? savedKnown;

  // ── Telas empilhadas ────────────────────────────────────────────────────
  const [stack, setStack] = useState<ICatalogScreen[]>(() => {
    const root: ICatalogScreen = {
      id: 'root',
      label:
        request.kind === 'race'
          ? 'Raças'
          : request.kind === 'class'
            ? 'Classes'
            : request.kind === 'archetype'
              ? 'Arquétipos'
              : request.kind === 'spells'
                ? 'Grimório'
                : 'Talentos',
    };
    return [root];
  });

  // "Revisar mestiçagem" abre direto a página do Mestiço, quando o catálogo
  // chega. Feito uma vez, no render em que os dados aparecem.
  const [openedMixed, setOpenedMixed] = useState(false);
  if (request.kind === 'race' && request.focus && !openedMixed && raceCatalog) {
    const target =
      request.focus === 'mixed'
        ? raceCatalog.find((r) => isMixedRace(r))
        : raceCatalog.find((r) => r.id === raceId);
    setOpenedMixed(true);
    if (target) {
      setStack([
        { id: 'root', label: 'Raças' },
        {
          id: `race:${target.slug}`,
          label: target.name,
          slug: target.slug,
          mode: 'pick',
        },
      ]);
    }
  }

  const openRace = (slug: string, mode: 'pick' | 'origin') => {
    const name = bySlug.get(slug)?.name ?? slug;
    setStack((prev) => [
      ...prev,
      { id: `race:${slug}:${mode}`, label: name, slug, mode },
    ]);
  };

  const pop = () =>
    setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  const top = stack[stack.length - 1];
  // A página aberta pede o documento completo da raça.
  const topSlug = top.slug;
  const needsView = topSlug && !raceViews[topSlug];
  useEffect(() => {
    if (!needsView || !topSlug) return;
    let active = true;
    fetchJson<IRaceView>(`/api/races/${topSlug}`)
      .then(
        (doc) => active && setRaceViews((prev) => ({ ...prev, [topSlug]: doc }))
      )
      .catch(() => active && setFailed(true));
    return () => {
      active = false;
    };
  }, [needsView, topSlug]);

  // ── Props `choice` de cada catálogo ─────────────────────────────────────
  const raceChoice: IRaceChoice | undefined = raceCatalog
    ? {
        kind: 'race',
        catalog: raceCatalog,
        current: currentRaceDraft,
        draft: draftRace,
        mode: top.mode ?? 'pick',
        onChange: (next) => {
          setRaceDraft(next);
          setRaceTouched(true);
        },
        onOpen: openRace,
      }
    : undefined;

  const takenUnique: Record<string, string> = {};
  for (const klass of classOptions ?? []) {
    const holder = klass.takenBy;
    if (klass.isUnique && holder && holder.id !== playerId) {
      takenUnique[String(klass._id)] = holder.name;
    }
  }
  const classChoice: IClassChoice = {
    kind: 'class',
    currentId: classId || undefined,
    draftId: classDraft?._id ?? (classId || undefined),
    takenUnique,
    onPick: (klass) => {
      sheetSounds.play('quill');
      setClassDraft(klass._id === classId ? undefined : klass);
      setConfirmedRemoval(false);
    },
  };

  const archetypeChoice: IArchetypeChoice = {
    kind: 'archetype',
    classSlug: currentSlug ?? '',
    level,
    currentSlug: archetypeSlug || undefined,
    draftSlug: archetypeDraft,
    onPick: (slug) => {
      sheetSounds.play('quill');
      setArchetypeDraft(slug === archetypeSlug ? undefined : slug);
    },
  };

  // Limites por círculo: a tabela da classe (resolvida na leitura da ficha).
  const levelsRead = objects<{ level: number; slotsTotal: number }>(
    'playerSpellcasting.spellLevels'
  );
  let cantripsKnown = Number(value('playerSpellcasting.cantripsKnown')) || 0;
  let maxCircle = Number(value('playerSpellcasting.maxCircle')) || 0;
  const limits: number[] = [];
  if (classDirty && classDoc) {
    // Classe trocada no rascunho: a tabela é a da nova classe, no nível de hoje.
    const row = [...(classDoc.levels ?? [])]
      .filter((l) => l.level <= level)
      .sort((a, b) => b.level - a.level)[0];
    const table = row?.spellSlots ?? [];
    cantripsKnown = Number(row?.cantripsKnown) || 0;
    maxCircle = table.reduce((max, n, i) => (n > 0 ? i + 1 : max), 0);
    limits[0] = cantripsKnown;
    table.forEach((n, i) => {
      limits[i + 1] = Number(n) || 0;
    });
  } else {
    limits[0] = cantripsKnown;
    for (const row of levelsRead) {
      if (row.level > 0) limits[row.level] = row.slotsTotal;
    }
  }
  const opensAt: Record<number, number> = {};
  for (let circle = 1; circle <= 9; circle += 1) {
    const row = (classDoc?.levels ?? []).find(
      (l) => (l.spellSlots?.[circle - 1] ?? 0) > 0
    );
    if (row) opensAt[circle] = row.level;
  }
  const spellById = useMemo(
    () => new Map((spells ?? []).map((s) => [String(s._id), s])),
    [spells]
  );
  const counts: number[] = Array.from({ length: 10 }, () => 0);
  for (const id of known) {
    const circle = spellById.get(id)?.circle;
    if (circle !== undefined) counts[circle] += 1;
  }
  const spellChoice: ISpellChoice = {
    kind: 'spells',
    classId,
    known,
    saved: savedKnown,
    limits,
    counts,
    maxCircle,
    opensAt,
    onToggle: (spell) => {
      sheetSounds.play('quill');
      setKnownDraft((prev) => {
        const base = prev ?? savedKnown;
        return base.includes(spell._id)
          ? base.filter((id) => id !== spell._id)
          : [...base, spell._id];
      });
    },
  };

  const slots =
    classDirty && classDoc
      ? { ...talentSlotsOf(classDoc), className: classDoc.name }
      : slotsRead;
  const at = request.kind === 'talents' ? request.at : level;
  const withPicks: ICitizenTalent[] = [
    ...talents,
    ...talentPicks.map((o): ICitizenTalent => ({
      key: o.key,
      level: at,
      name: o.name,
      scope: o.scope,
      stackable: o.stackable,
    })),
  ];
  const progress = talentProgress(slots, withPicks, level, milestones);
  // Só as vagas do nível `at` entram: escolher aqui não gasta a de outro nível.
  const openNodes = progress.nodes.filter(
    (n) => n.state === 'open' && n.level === at
  );
  const takenCounts: Record<string, number> = {};
  for (const t of withPicks) takenCounts[t.key] = (takenCounts[t.key] ?? 0) + 1;
  const talentChoice: ITalentChoice | undefined =
    talentOptions && (!classDirty || classDoc)
      ? {
          kind: 'talents',
          options: talentOptions,
          level,
          className: slots?.className ?? '',
          slots,
          taken: takenCounts,
          open: {
            general: openNodes.filter((n) => n.kind === 'general').length,
            class: openNodes.filter((n) => n.kind === 'class').length,
          },
          at,
          onPick: (option) => {
            sheetSounds.play('quill');
            setTalentPicks((prev) => [...prev, option]);
          },
        }
      : undefined;

  // ── Bandeja ─────────────────────────────────────────────────────────────
  const tray: ITrayInfo = (() => {
    const base: ITrayInfo = {
      before: '',
      after: '',
      gains: [],
      removes: [],
      warnings: [],
      changed: false,
      canApply: false,
      applyLabel: 'Aplicar à ficha',
      confirmRemoval: false,
    };

    if (kind === 'race') {
      const race = draftRace ? bySlug.get(draftRace.slug) : undefined;
      if (!race || !draftRace) return base;
      const same =
        draftRace.slug === currentRaceDraft?.slug &&
        JSON.stringify(draftRace.choice) ===
          JSON.stringify(currentRaceDraft?.choice ?? {});
      const resolved = resolveRaceTraits(race, draftRace.choice, bySlug);
      const issues = raceChoiceIssues(race, draftRace.choice, bySlug);
      const taken = raceCatalog?.find((r) => r.slug === race.slug)?.takenBy;
      // O servidor já tira `takenBy` da raça que é desta própria ficha.
      const blocked = !!taken;
      return {
        ...base,
        before: currentRaceDraft?.label ?? 'Sem raça ligada ao códice',
        after: raceLabelOf(race, draftRace.choice, bySlug),
        gains: resolved.map((t) => ({
          text: t.chosen ? `${t.name} · ${t.chosen.name}` : t.name,
          hint:
            t.via === 'dominantBlood'
              ? 'sangue forte'
              : t.via === 'hybridHeritage'
                ? 'herança'
                : t.kind === 'sub'
                  ? t.subraceName
                  : t.kind === 'base'
                    ? 'raça base'
                    : 'raça',
        })),
        removes:
          currentRaceDraft && draftRace.slug !== currentRaceDraft.slug
            ? [
                {
                  text: 'Habilidades da raça anterior',
                  hint: currentRaceDraft.label,
                },
              ]
            : [],
        warnings: [
          ...issues.map((i) => `Falta: ${i.message}`),
          ...(blocked
            ? [`${race.name} é única e já é de ${taken?.name}.`]
            : []),
        ],
        changed: !same,
        canApply: !same && !blocked,
        applyLabel:
          issues.length > 0 ? 'Aplicar (incompleta)' : 'Aplicar à ficha',
      };
    }

    if (kind === 'class') {
      const next = classDraft;
      const removes = [];
      if (next) {
        if (archetypeSlug) {
          removes.push({
            text: 'Arquétipo',
            hint: String(value('archetype.name') ?? archetypeSlug),
          });
        }
        const classTalents = talents.filter((t) => t.scope === 'class').length;
        if (classTalents > 0) {
          removes.push({
            text: `${classTalents} ${classTalents === 1 ? 'talento' : 'talentos'} de classe`,
          });
        }
        if (refs.length > 0) {
          removes.push({
            text: `${refs.length} ${refs.length === 1 ? 'magia preparada' : 'magias preparadas'}`,
          });
        }
      }
      return {
        ...base,
        before: currentClass?.name ?? 'Sem classe ligada',
        after: next?.name ?? '',
        changed: !!next,
        removes,
        gains: next
          ? [{ text: 'Características, magias e marcos da nova classe' }]
          : [],
        canApply: !!next && (removes.length === 0 || confirmedRemoval),
        confirmRemoval: !!next && removes.length > 0 && !confirmedRemoval,
        applyLabel: 'Aplicar à ficha',
      };
    }

    if (kind === 'archetype') {
      const next = classDoc?.archetypes?.find((a) => a.slug === archetypeDraft);
      return {
        ...base,
        before: String(value('archetype.name') ?? '') || 'Nenhum',
        after: next?.name ?? '',
        changed: !!next,
        canApply: !!next,
        removes:
          next && archetypeSlug
            ? [{ text: 'Habilidades do arquétipo anterior' }]
            : [],
        gains: next
          ? (next.features ?? [])
              .filter((f) => (f.level ?? 0) <= level)
              .map((f) => ({ text: f.name, hint: `nv. ${f.level ?? '—'}` }))
          : [],
      };
    }

    if (kind === 'spells') {
      const added = known.filter((id) => !savedKnown.includes(id));
      const removed = savedKnown.filter((id) => !known.includes(id));
      const label = (id: string) => spellById.get(id)?.name ?? 'Magia';
      return {
        ...base,
        before: `${savedKnown.length} preparadas`,
        after: `${known.length} preparadas`,
        changed: added.length + removed.length > 0,
        canApply: added.length + removed.length > 0,
        gains: added.map((id) => ({ text: label(id) })),
        removes: removed.map((id) => ({ text: label(id) })),
      };
    }

    // talents
    const picks = talentPicks;
    return {
      ...base,
      before: `${talents.length} ${talents.length === 1 ? 'talento' : 'talentos'}`,
      after: `${withPicks.length} ${withPicks.length === 1 ? 'talento' : 'talentos'}`,
      changed: picks.length > 0,
      canApply: picks.length > 0,
      gains: picks.map((o) => ({
        text: o.name,
        hint: `${o.scope === 'class' ? 'classe' : 'geral'} · nv. ${at}`,
      })),
      warnings: picks
        .filter((o) => o.prerequisites)
        .map((o) => `${o.name}: ${o.prerequisites}`),
    };
  })();

  const undo = () => {
    sheetSounds.play('crumple');
    setRaceTouched(false);
    setRaceDraft(undefined);
    setClassDraft(undefined);
    setArchetypeDraft(undefined);
    setKnownDraft(undefined);
    setTalentPicks([]);
    setConfirmedRemoval(false);
  };

  const apply = () => {
    sheetSounds.play('stampLight');
    if (kind === 'race' && draftRace) {
      const race = bySlug.get(draftRace.slug);
      if (!race) return;
      setField('raceId', race.id);
      setField('raceChoice', draftRace.choice);
    } else if (kind === 'class' && classDraft) {
      setField('classId', classDraft._id);
      setField('class', classDraft.name);
      setField('archetype', { features: [] });
      // Os marcos gerais são os da classe nova, que a ficha ainda não conhece.
      setField('talentMilestones', []);
      setField(
        'talents',
        talents.filter((t) => t.scope !== 'class')
      );
      setField(REFS_PATH, []);
    } else if (kind === 'archetype' && archetypeDraft) {
      setField('archetype.slug', archetypeDraft);
      setField('archetype.features', []);
    } else if (kind === 'spells' && knownDraft) {
      for (const id of knownDraft) {
        const spell = spellById.get(id);
        if (spell) {
          pickedSpells.set(id, {
            name: spell.name,
            circle: spell.circle,
            school: spell.school,
            classes: spell.classes,
          });
        }
      }
      setField(
        REFS_PATH,
        knownDraft.map(
          (spellId) =>
            refs.find((r) => String(r.spellId) === spellId) ?? {
              spellId,
              prepared: true,
            }
        )
      );
    } else if (kind === 'talents' && talentPicks.length > 0) {
      setField('talents', withPicks);
      // O marco geral que ganhou talento deixa de constar como "atributos".
      const spent = new Set(
        progress.nodes
          .filter((n) => n.kind === 'general' && n.talent)
          .map((n) => n.level)
      );
      if (milestones.some((m) => spent.has(m.level))) {
        setField(
          'talentMilestones',
          milestones.filter((m) => !spent.has(m.level))
        );
      }
    }
    onClose();
  };

  return {
    title: TITLE[kind],
    playerName,
    stack,
    top,
    pop,
    failed,
    raceCatalog,
    raceViews,
    raceChoice,
    classOptions,
    classDoc,
    classChoice,
    archetypeChoice,
    spells,
    spellsReady: !!spells && !!classDoc,
    spellChoice,
    talentOptions,
    talentChoice,
    tray,
    undo,
    apply,
    confirmRemoval: () => setConfirmedRemoval(true),
  };
};
