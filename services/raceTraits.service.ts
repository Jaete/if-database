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
 *   - Habilidade com `options[]` ("Chamado da Constelação"): a ficha guarda a
 *     opção escolhida em `traitOptions`; sem ela a escolha está incompleta.
 *   - Na Herança Híbrida, a mesma habilidade em lugares diferentes ("Voar" na
 *     raça base e nos Pixies das Fadas) com a MESMA descrição é uma entrada só
 *     no conjunto: escolher conta uma vez. Descrição diferente ("Sentidos
 *     Aguçados" dos Moogles e dos Yokais Caninos) são entradas separadas. A
 *     entrada guarda todas as `aliases`, e qualquer uma delas serve de
 *     referência — o que mantém estáveis as escolhas já gravadas.
 */

type RaceLike = Pick<
  IRaceData,
  'name' | 'slug' | 'traits' | 'baseOnlyTraits' | 'subraces' | 'choiceRules'
>;

/** Uma habilidade concedida, com a origem para a ficha mostrar de onde veio. */
export interface IResolvedRaceTrait extends IRaceTrait {
  /** A referência canônica: a primeira ocorrência do conjunto. */
  ref: ICitizenRaceTraitRef;
  /** Toda referência que aponta para esta mesma habilidade, `ref` incluída. */
  aliases: ICitizenRaceTraitRef[];
  /** "Elfos", "Elfos · Drows". */
  origin: string;
  /** Os outros lugares onde ela aparece com o mesmo texto. */
  alsoOrigins: string[];
  /** Onde mora na raça: em comum, só da raça base ou de uma sub-raça. */
  kind: 'common' | 'base' | 'sub';
  /** Nome da sub-raça, quando `kind` é `sub`. */
  subraceName?: string;
  /** Por qual regra veio, numa raça mista. */
  via?: IRaceChoiceRule['kind'];
  /** A opção escolhida, nas habilidades com `options[]`. */
  chosen?: IRaceTrait;
}

export const isMixedRace = (race: Pick<RaceLike, 'choiceRules'>) =>
  (race.choiceRules?.length ?? 0) > 0;

const ruleOf = (race: RaceLike, kind: IRaceChoiceRule['kind']) =>
  race.choiceRules?.find((rule) => rule.kind === kind);

const tag = (
  traits: IRaceTrait[] | undefined,
  race: RaceLike,
  kind: IResolvedRaceTrait['kind'],
  subrace?: { slug: string; name: string }
): IResolvedRaceTrait[] =>
  (traits ?? []).map((trait) => {
    const ref: ICitizenRaceTraitRef = {
      race: race.slug,
      ...(subrace ? { subrace: subrace.slug } : {}),
      name: trait.name,
    };
    return {
      ...trait,
      ref,
      aliases: [ref],
      origin: subrace ? `${race.name} · ${subrace.name}` : race.name,
      alsoOrigins: [],
      kind,
      ...(subrace ? { subraceName: subrace.name } : {}),
    };
  });

/** As habilidades em comum — as que valem para todas as sub-raças. */
export const commonTraitsOf = (race: RaceLike) =>
  tag(race.traits, race, 'common');

/** Nome e descrição sem acento, caixa, pontuação nem espaço repetido. */
const fold = (text: string | undefined) =>
  (text ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

/** A identidade de conteúdo de uma habilidade: o que a faz "a mesma". */
const contentKey = (trait: Pick<IRaceTrait, 'name' | 'description'>) =>
  `${fold(trait.name)}|${fold(trait.description)}`;

/**
 * Junta as habilidades de mesmo nome e mesma descrição numa entrada só.
 *
 * A primeira ocorrência é a canônica; as outras viram `aliases` e
 * `alsoOrigins`. Quem não repete passa como está.
 */
function condense(list: IResolvedRaceTrait[]): IResolvedRaceTrait[] {
  const byKey = new Map<string, IResolvedRaceTrait>();
  for (const trait of list) {
    const key = contentKey(trait);
    const first = byKey.get(key);
    if (!first) {
      byKey.set(key, { ...trait, aliases: [...trait.aliases] });
      continue;
    }
    first.aliases.push(...trait.aliases);
    if (
      trait.origin !== first.origin &&
      !first.alsoOrigins.includes(trait.origin)
    ) {
      first.alsoOrigins.push(trait.origin);
    }
  }
  return [...byKey.values()];
}

/**
 * Tudo o que a Herança Híbrida deixa escolher numa raça de origem: as em
 * comum, as da raça base e as de cada sub-raça.
 */
export function hybridPoolOf(race: RaceLike): IResolvedRaceTrait[] {
  return condense([
    ...tag(race.traits, race, 'common'),
    ...tag(race.baseOnlyTraits, race, 'base'),
    ...race.subraces.flatMap((subrace) =>
      tag(subrace.traits, race, 'sub', subrace)
    ),
  ]);
}

/** O conjunto de todas as raças de origem, condensado entre elas também. */
export function hybridPoolOfParents(
  slugs: string[],
  racesBySlug: Map<string, RaceLike>
): IResolvedRaceTrait[] {
  return condense(
    slugs.flatMap((slug) => {
      const parent = racesBySlug.get(slug);
      if (!parent) return [];
      return [
        ...tag(parent.traits, parent, 'common'),
        ...tag(parent.baseOnlyTraits, parent, 'base'),
        ...parent.subraces.flatMap((subrace) =>
          tag(subrace.traits, parent, 'sub', subrace)
        ),
      ];
    })
  );
}

const sameRef = (a: ICitizenRaceTraitRef, b: ICitizenRaceTraitRef) =>
  a.race === b.race &&
  (a.subrace ?? '') === (b.subrace ?? '') &&
  a.name === b.name;

/** A referência aponta para esta habilidade (por qualquer um dos aliases). */
export const traitMatchesRef = (
  trait: Pick<IResolvedRaceTrait, 'aliases'>,
  ref: ICitizenRaceTraitRef
) => trait.aliases.some((alias) => sameRef(alias, ref));

/** O mesmo texto: duas referências que a Herança Híbrida conta uma vez só. */
export const sameContent = (a: IRaceTrait, b: IRaceTrait) =>
  contentKey(a) === contentKey(b);

/** O nome que a ficha mostra para a raça e a escolha: "Elfos (Drows)". */
export function raceLabelOf(
  race: RaceLike,
  choice: ICitizenRaceChoice | undefined,
  racesBySlug: Map<string, RaceLike>
): string {
  if (!isMixedRace(race)) {
    const subrace = race.subraces.find((s) => s.slug === choice?.subrace);
    return subrace ? `${race.name} (${subrace.name})` : race.name;
  }
  const names = [...(choice?.parents ?? [])]
    .sort(
      (a, b) =>
        Number(b === choice?.dominantParent) -
        Number(a === choice?.dominantParent)
    )
    .map((slug) => racesBySlug.get(slug)?.name)
    .filter((name): name is string => !!name);
  return names.length > 0 ? `Mestiço (${names.join(' + ')})` : 'Mestiço';
}

/** Em que passo do seletor cada pendência se resolve. */
export type RaceChoiceStep =
  'raca' | 'subraca' | 'origens' | 'sangue' | 'heranca' | 'opcoes';

export interface IRaceChoiceIssue {
  step: RaceChoiceStep;
  message: string;
}

/**
 * O que está errado numa escolha, com o passo do seletor onde se resolve.
 * Vazio quando a escolha está completa e válida.
 */
export function raceChoiceIssues(
  race: RaceLike,
  choice: ICitizenRaceChoice | undefined,
  racesBySlug: Map<string, RaceLike>
): IRaceChoiceIssue[] {
  const issues: IRaceChoiceIssue[] = [];
  const add = (step: RaceChoiceStep, message: string) =>
    issues.push({ step, message });

  if (!isMixedRace(race)) {
    if (
      choice?.subrace &&
      !race.subraces.some((subrace) => subrace.slug === choice.subrace)
    ) {
      add('subraca', `"${choice.subrace}" não é sub-raça de ${race.name}.`);
    }
  } else {
    const parents = choice?.parents ?? [];
    if (parents.length < 2) {
      add('origens', 'Escolha as raças de origem (pelo menos duas).');
    }
    for (const slug of parents) {
      const parent = racesBySlug.get(slug);
      if (!parent) add('origens', `Raça de origem desconhecida: "${slug}".`);
      else if (isMixedRace(parent) || slug === race.slug) {
        add('origens', `${parent.name} não pode ser raça de origem.`);
      }
    }

    if (ruleOf(race, 'dominantBlood')) {
      if (!choice?.dominantParent) {
        add('sangue', 'Escolha a raça dominante (Sangue Forte).');
      } else if (!parents.includes(choice.dominantParent)) {
        add('sangue', 'A raça dominante precisa ser uma das raças de origem.');
      }
    }

    const hybrid = ruleOf(race, 'hybridHeritage');
    if (hybrid) {
      const picked = choice?.hybridTraits ?? [];
      const count = hybrid.count ?? 2;
      if (picked.length !== count) {
        add('heranca', `Escolha ${count} habilidades (Herança Híbrida).`);
      }
      const pool = hybridPoolOfParents(parents, racesBySlug);
      const entries = picked.map((ref) =>
        pool.find((trait) => traitMatchesRef(trait, ref))
      );
      picked.forEach((ref, i) => {
        if (!entries[i]) {
          add('heranca', `"${ref.name}" não é habilidade das raças de origem.`);
        }
      });
      if (entries.some((entry, i) => entry && entries.indexOf(entry) !== i)) {
        add('heranca', 'A mesma habilidade foi escolhida duas vezes.');
      }
      const dominant = choice?.dominantParent
        ? racesBySlug.get(choice.dominantParent)
        : undefined;
      if (dominant && ruleOf(race, 'dominantBlood')) {
        const inherited = commonTraitsOf(dominant);
        picked.forEach((ref, i) => {
          const entry = entries[i];
          if (entry && inherited.some((trait) => sameContent(trait, entry))) {
            add('heranca', `"${ref.name}" já vem pelo Sangue Forte.`);
          }
        });
      }
    }
  }

  // Habilidade que manda escolher uma opção: a ficha precisa dizer qual.
  for (const trait of resolveRaceTraits(race, choice, racesBySlug)) {
    if (!trait.options?.length) continue;
    if (!trait.chosen) {
      add('opcoes', `Escolha uma opção de "${trait.name}".`);
    }
  }

  return issues;
}

/**
 * O que está errado numa escolha, em pt-BR para a ficha mostrar. Vazio quando
 * a escolha está completa e válida.
 */
export const validateRaceChoice = (
  race: RaceLike,
  choice: ICitizenRaceChoice | undefined,
  racesBySlug: Map<string, RaceLike>
): string[] =>
  raceChoiceIssues(race, choice, racesBySlug).map((issue) => issue.message);

/** Põe em cada habilidade com `options[]` a opção que a ficha escolheu. */
function withChosenOptions(
  traits: IResolvedRaceTrait[],
  choice: ICitizenRaceChoice | undefined
): IResolvedRaceTrait[] {
  const picks = choice?.traitOptions ?? [];
  return traits.map((trait) => {
    if (!trait.options?.length) return trait;
    const pick = picks.find((p) => traitMatchesRef(trait, p.ref));
    const chosen = trait.options.find((o) => o.name === pick?.option);
    return chosen ? { ...trait, chosen } : trait;
  });
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
    return withChosenOptions(
      subrace
        ? [
            ...tag(race.traits, race, 'common'),
            ...tag(subrace.traits, race, 'sub', subrace),
          ]
        : [
            ...tag(race.traits, race, 'common'),
            ...tag(race.baseOnlyTraits, race, 'base'),
          ],
      choice
    );
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
    const pool = hybridPoolOfParents(choice?.parents ?? [], racesBySlug);
    for (const ref of choice?.hybridTraits ?? []) {
      const trait = pool.find((t) => traitMatchesRef(t, ref));
      // Uma habilidade escolhida pela Herança Híbrida que também veio pelo
      // Sangue Forte não conta duas vezes na ficha.
      if (trait && !resolved.some((r) => sameContent(r, trait))) {
        resolved.push({ ...trait, via: 'hybridHeritage' });
      }
    }
  }

  return withChosenOptions(resolved, choice);
}
