import type {
  IRaceChoiceRule,
  IRaceData,
  IRaceTrait,
} from '../db/races/race.d';
import type {
  ICitizenRaceChoice,
  ICitizenRaceTraitRef,
} from '../db/citizens/citizen.d';

/**
 * Que habilidades raciais um personagem tem, a partir da raça e da escolha.
 *
 * Sem banco e sem `'use server'`: recebe as raças já carregadas, para a ficha
 * poder usar o mesmo cálculo no cliente enquanto o jogador escolhe.
 *
 * As regras:
 *   - Raça comum: as habilidades em comum da raça SOMAM às da sub-raça. Sem
 *     sub-raça, as em comum mais as da raça base (`baseOnlyTraits`).
 *   - Raça mista (Mestiço): a raça não concede habilidade própria. Ganha as
 *     em comum da raça dominante (Sangue Forte) e as escolhidas entre as das
 *     raças de origem (Herança Híbrida).
 */

type RaceLike = Pick<
  IRaceData,
  'name' | 'slug' | 'traits' | 'baseOnlyTraits' | 'subraces' | 'choiceRules'
>;

/** Uma habilidade concedida, com a origem para a ficha mostrar de onde veio. */
export interface IResolvedRaceTrait extends IRaceTrait {
  ref: ICitizenRaceTraitRef;
  /** "Elfos", "Elfos · Drows". */
  origin: string;
  /** Por qual regra veio, numa raça mista. */
  via?: IRaceChoiceRule['kind'];
}

export const isMixedRace = (race: Pick<RaceLike, 'choiceRules'>) =>
  (race.choiceRules?.length ?? 0) > 0;

const ruleOf = (race: RaceLike, kind: IRaceChoiceRule['kind']) =>
  race.choiceRules?.find((rule) => rule.kind === kind);

const tag = (
  traits: IRaceTrait[] | undefined,
  race: RaceLike,
  subrace?: { slug: string; name: string }
): IResolvedRaceTrait[] =>
  (traits ?? []).map((trait) => ({
    ...trait,
    ref: {
      race: race.slug,
      ...(subrace ? { subrace: subrace.slug } : {}),
      name: trait.name,
    },
    origin: subrace ? `${race.name} · ${subrace.name}` : race.name,
  }));

/** As habilidades em comum — as que valem para todas as sub-raças. */
export const commonTraitsOf = (race: RaceLike) => tag(race.traits, race);

/**
 * Tudo o que a Herança Híbrida deixa escolher numa raça de origem: as em
 * comum, as da raça base e as de cada sub-raça.
 */
export function hybridPoolOf(race: RaceLike): IResolvedRaceTrait[] {
  return [
    ...tag(race.traits, race),
    ...tag(race.baseOnlyTraits, race),
    ...race.subraces.flatMap((subrace) => tag(subrace.traits, race, subrace)),
  ];
}

const sameRef = (a: ICitizenRaceTraitRef, b: ICitizenRaceTraitRef) =>
  a.race === b.race &&
  (a.subrace ?? '') === (b.subrace ?? '') &&
  a.name === b.name;

/**
 * O que está errado numa escolha, em pt-BR para a ficha mostrar. Vazio quando
 * a escolha está completa e válida.
 */
export function validateRaceChoice(
  race: RaceLike,
  choice: ICitizenRaceChoice | undefined,
  racesBySlug: Map<string, RaceLike>
): string[] {
  const problems: string[] = [];

  if (!isMixedRace(race)) {
    if (
      choice?.subrace &&
      !race.subraces.some((subrace) => subrace.slug === choice.subrace)
    ) {
      problems.push(`"${choice.subrace}" não é sub-raça de ${race.name}.`);
    }
    return problems;
  }

  const parents = choice?.parents ?? [];
  if (parents.length < 2) {
    problems.push('Escolha as raças de origem (pelo menos duas).');
  }
  for (const slug of parents) {
    const parent = racesBySlug.get(slug);
    if (!parent) problems.push(`Raça de origem desconhecida: "${slug}".`);
    else if (isMixedRace(parent) || slug === race.slug) {
      problems.push(`${parent.name} não pode ser raça de origem.`);
    }
  }

  if (ruleOf(race, 'dominantBlood')) {
    if (!choice?.dominantParent) {
      problems.push('Escolha a raça dominante (Sangue Forte).');
    } else if (!parents.includes(choice.dominantParent)) {
      problems.push('A raça dominante precisa ser uma das raças de origem.');
    }
  }

  const hybrid = ruleOf(race, 'hybridHeritage');
  if (hybrid) {
    const picked = choice?.hybridTraits ?? [];
    const count = hybrid.count ?? 2;
    if (picked.length !== count) {
      problems.push(`Escolha ${count} habilidades (Herança Híbrida).`);
    }
    const pool = parents.flatMap((slug) => {
      const parent = racesBySlug.get(slug);
      return parent ? hybridPoolOf(parent) : [];
    });
    for (const ref of picked) {
      if (!pool.some((trait) => sameRef(trait.ref, ref))) {
        problems.push(`"${ref.name}" não é habilidade das raças de origem.`);
      }
    }
    if (
      picked.some((ref, i) => picked.findIndex((o) => sameRef(o, ref)) !== i)
    ) {
      problems.push('A mesma habilidade foi escolhida duas vezes.');
    }
    const dominant = choice?.dominantParent
      ? racesBySlug.get(choice.dominantParent)
      : undefined;
    if (dominant && ruleOf(race, 'dominantBlood')) {
      const inherited = commonTraitsOf(dominant);
      for (const ref of picked) {
        if (inherited.some((trait) => sameRef(trait.ref, ref))) {
          problems.push(`"${ref.name}" já vem pelo Sangue Forte.`);
        }
      }
    }
  }

  return problems;
}

/**
 * As habilidades raciais que o personagem tem.
 *
 * Escolha incompleta não é erro aqui: concede o que já dá para conceder. Quem
 * precisa saber se está completa chama `validateRaceChoice`.
 */
export function resolveRaceTraits(
  race: RaceLike,
  choice: ICitizenRaceChoice | undefined,
  racesBySlug: Map<string, RaceLike>
): IResolvedRaceTrait[] {
  if (!isMixedRace(race)) {
    const subrace = race.subraces.find((s) => s.slug === choice?.subrace);
    return subrace
      ? [...tag(race.traits, race), ...tag(subrace.traits, race, subrace)]
      : [...tag(race.traits, race), ...tag(race.baseOnlyTraits, race)];
  }

  const resolved: IResolvedRaceTrait[] = [];
  const dominant = choice?.dominantParent
    ? racesBySlug.get(choice.dominantParent)
    : undefined;
  if (dominant && ruleOf(race, 'dominantBlood')) {
    resolved.push(
      ...commonTraitsOf(dominant).map((trait) => ({
        ...trait,
        via: 'dominantBlood' as const,
      }))
    );
  }

  if (ruleOf(race, 'hybridHeritage')) {
    for (const ref of choice?.hybridTraits ?? []) {
      const parent = racesBySlug.get(ref.race);
      const trait = parent
        ? hybridPoolOf(parent).find((t) => sameRef(t.ref, ref))
        : undefined;
      // Uma habilidade escolhida pela Herança Híbrida que também veio pelo
      // Sangue Forte não conta duas vezes na ficha.
      if (trait && !resolved.some((r) => sameRef(r.ref, trait.ref))) {
        resolved.push({ ...trait, via: 'hybridHeritage' });
      }
    }
  }

  return resolved;
}
