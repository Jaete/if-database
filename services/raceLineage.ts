import type {
  ICitizenAbility,
  ICitizenRaceChoice,
  IPlayerLineage,
} from '../db/citizens/citizen.d';
import type { IRaceCatalogEntry } from '../db/races/race.d';
import type {
  ICitizenRaceTraitOption,
  ICitizenRaceTraitRef,
} from '../db/citizens/citizen.d';
import {
  hybridPoolOfParents,
  isMixedRace,
  raceChoiceIssues,
  raceLabelOf,
  resolveRaceTraits,
  traitMatchesRef,
  type IResolvedRaceTrait,
} from './raceTraits.service';

/**
 * O que a ficha mostra de uma raça e da escolha feita nela: a habilidade como
 * entrada da lista e a placa de linhagem.
 *
 * Puro, sem banco: o servidor o usa para resolver a ficha na leitura, e o
 * cliente para refletir uma escolha ainda não salva — a placa e as habilidades
 * precisam acompanhar o rascunho, e o texto sai do mesmo cálculo nos dois.
 */

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

const shortString = (value: unknown, max = 200) =>
  typeof value === 'string' && value.length > 0 && value.length <= max
    ? value
    : undefined;

const imageOf = (race?: Pick<IRaceCatalogEntry, 'images'>) => {
  const image = race?.images?.[0];
  return image?.url ? { url: image.url, focus: image.focus } : undefined;
};

/** O rótulo curto da etiqueta de origem de uma habilidade racial. */
const originTagOf = (trait: IResolvedRaceTrait) =>
  trait.via === 'dominantBlood'
    ? 'sangue forte'
    : trait.via === 'hybridHeritage'
      ? 'herança híbrida'
      : trait.kind === 'sub'
        ? (trait.subraceName ?? 'sub-raça')
        : trait.kind === 'base'
          ? 'raça base'
          : 'raça';

/** A habilidade racial como entrada da lista de habilidades da ficha. */
export function raceAbility(trait: IResolvedRaceTrait): ICitizenAbility {
  const text = [trait.description];
  if (trait.options?.length) {
    text.push(
      trait.chosen
        ? `Opção escolhida: ${trait.chosen.name}\n${trait.chosen.description}`
        : `Opções: ${trait.options.map((o) => o.name).join(' ou ')}.`
    );
  }
  return {
    name: trait.name,
    description: text.filter(Boolean).join('\n\n'),
    source: 'race',
    origin: trait.origin,
    ...(trait.via ? { via: trait.via } : {}),
    originTag: originTagOf(trait),
    ...(trait.chosen ? { option: trait.chosen.name } : {}),
  };
}

export function buildLineage(
  race: IRaceCatalogEntry,
  choice: ICitizenRaceChoice,
  bySlug: Map<string, IRaceCatalogEntry>,
  traits: IResolvedRaceTrait[]
): IPlayerLineage {
  const mixed = isMixedRace(race);
  const subrace = mixed
    ? undefined
    : race.subraces.find((s) => s.slug === choice.subrace);
  const issues = raceChoiceIssues(race, choice, bySlug);
  const hybrid = race.choiceRules?.find((r) => r.kind === 'hybridHeritage');

  // Sub-raça que preenche um campo vence o da raça; vazio herda.
  const pick = (field: 'speed' | 'size' | 'languages') =>
    subrace?.[field]?.trim() || race[field]?.trim() || undefined;

  const parents = mixed
    ? [...(choice.parents ?? [])]
        .sort(
          (a, b) =>
            Number(b === choice.dominantParent) -
            Number(a === choice.dominantParent)
        )
        .flatMap((slug) => {
          const parent = bySlug.get(slug);
          return parent
            ? [
                {
                  slug,
                  name: parent.name,
                  dominant: slug === choice.dominantParent,
                  image: imageOf(parent),
                },
              ]
            : [];
        })
    : [];

  return {
    slug: race.slug,
    name: race.name,
    label: raceLabelOf(race, choice, bySlug),
    unique: race.unique,
    mixed,
    ...(subrace ? { subrace: { slug: subrace.slug, name: subrace.name } } : {}),
    hasSubraces: race.subraces.length > 0,
    abilityScoreIncrease: [
      race.abilityScoreIncrease,
      subrace?.abilityScoreIncrease,
    ].filter((text): text is string => !!text?.trim()),
    speed: pick('speed'),
    size: pick('size'),
    languages: pick('languages'),
    image: imageOf(race),
    parents,
    traitCount: traits.length,
    issues: issues.map((issue) => issue.message),
    ...(issues[0] ? { issueStep: issues[0].step } : {}),
    ...(mixed && hybrid
      ? {
          hybridPicked: choice.hybridTraits?.length ?? 0,
          hybridCount: hybrid.count ?? 2,
          hybridNames: traits
            .filter((trait) => trait.via === 'hybridHeritage')
            .map((trait) => trait.name),
        }
      : {}),
  };
}

const refOf = (value: unknown): ICitizenRaceTraitRef | undefined => {
  if (!isRecord(value)) return undefined;
  const race = shortString(value.race, 80);
  const name = shortString(value.name, 200);
  if (!race || !name) return undefined;
  const subrace = shortString(value.subrace, 80);
  return { race, ...(subrace ? { subrace } : {}), name };
};

/**
 * Reduz o que chegou a uma escolha que a raça admite.
 *
 * O que não existe na raça (sub-raça de outra, origem desconhecida, habilidade
 * que não está no conjunto, opção que a habilidade não tem) é descartado em
 * vez de gravado: a escolha gravada nunca aponta para o vazio. O que FALTA não
 * é erro — a ficha aceita escolha incompleta e a mostra como tal.
 */
export function sanitizeRaceChoice(
  race: IRaceCatalogEntry,
  raw: unknown,
  bySlug: Map<string, IRaceCatalogEntry>
): ICitizenRaceChoice {
  const input = isRecord(raw) ? raw : {};
  const out: ICitizenRaceChoice = {};

  if (!isMixedRace(race)) {
    const subrace = shortString(input.subrace, 80);
    if (subrace && race.subraces.some((s) => s.slug === subrace)) {
      out.subrace = subrace;
    }
  } else {
    const parents = [
      ...new Set(
        (Array.isArray(input.parents) ? input.parents : [])
          .map((slug) => shortString(slug, 80))
          .filter((slug): slug is string => {
            if (!slug || slug === race.slug) return false;
            const parent = bySlug.get(slug);
            return !!parent && !isMixedRace(parent);
          })
      ),
    ];
    if (parents.length > 0) out.parents = parents;

    const dominant = shortString(input.dominantParent, 80);
    if (
      dominant &&
      parents.includes(dominant) &&
      race.choiceRules?.some((r) => r.kind === 'dominantBlood')
    ) {
      out.dominantParent = dominant;
    }

    const hybrid = race.choiceRules?.find((r) => r.kind === 'hybridHeritage');
    if (hybrid) {
      const pool = hybridPoolOfParents(parents, bySlug);
      const taken = new Set<IResolvedRaceTrait>();
      for (const item of Array.isArray(input.hybridTraits)
        ? input.hybridTraits
        : []) {
        const ref = refOf(item);
        const entry = ref && pool.find((t) => traitMatchesRef(t, ref));
        if (entry) taken.add(entry);
      }
      // A referência gravada é a canônica da entrada, o que a mantém igual
      // qualquer que seja o alias que o cliente mandou.
      const refs = [...taken].slice(0, hybrid.count ?? 2).map((e) => e.ref);
      if (refs.length > 0) out.hybridTraits = refs;
    }
  }

  const resolved = resolveRaceTraits(race, out, bySlug);
  const options: ICitizenRaceTraitOption[] = [];
  for (const item of Array.isArray(input.traitOptions)
    ? input.traitOptions
    : []) {
    if (!isRecord(item)) continue;
    const ref = refOf(item.ref);
    const option = shortString(item.option, 200);
    const trait = ref && resolved.find((t) => traitMatchesRef(t, ref));
    if (!trait || !option) continue;
    if (!trait.options?.some((o) => o.name === option)) continue;
    if (options.some((o) => traitMatchesRef(trait, o.ref))) continue;
    options.push({ ref: trait.ref, option });
  }
  if (options.length > 0) out.traitOptions = options;

  return out;
}
