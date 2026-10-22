import type {
  ICitizenAbility,
  ICitizenArchetype,
} from '../db/citizens/citizen';
import type ICharacterClass from '../db/classes/class.d';
import type { IArchetype, IClassLevel } from '../db/classes/class.d';
import CharacterClassModel from '../db/classes/classes';
import { archetypePickOf, featureKey } from '../db/l10n/classes';

/**
 * Arquétipos: a parte da classe que é escolha, e não concessão.
 *
 * A tabela de progressão diz DUAS coisas sobre o arquétipo, e nenhuma delas é
 * uma característica: em que nível se escolhe um ("Arquétipo"), e quantas
 * habilidades dele já se tem ("Habilidade de Arquétipo", uma linha por
 * habilidade). O necromante escolhe no 3 e ganha habilidades no 3, 5, 10, 13 e
 * 18 — então um necromante de nível 6 tem arquétipo e duas habilidades dele.
 *
 * O arquétipo oferece muito mais do que isso: a Invocadora de Espectros tem 32
 * habilidades para cinco vagas. É aí que mora a build, e é por isso que a
 * escolha não pode ser derivada — só o seu teto pode.
 */

export interface IArchetypeProgress {
  /** Nível em que a classe manda escolher. `null` = a classe não tem arquétipo. */
  pickLevel: number | null;
  /** Quantas habilidades do arquétipo o nível já concede. */
  featureSlots: number;
}

/** O que o seletor da ficha precisa de um arquétipo. */
export interface IArchetypeOption {
  name: string;
  slug: string;
  description?: string;
  features: { name: string; description?: string }[];
}

/**
 * O catálogo de arquétipos de uma classe mais a progressão que o rege.
 *
 * `featureLevels` são os níveis em que a tabela abre uma vaga de habilidade,
 * e não a contagem já resolvida: quem edita a ficha no app pode mudar o nível
 * do personagem na mesma tela, e uma contagem fechada obrigaria a buscar o
 * catálogo de novo a cada dígito digitado ali.
 */
export interface IArchetypeCatalog {
  pickLevel: number | null;
  featureLevels: number[];
  archetypes: IArchetypeOption[];
}

const EMPTY: IArchetypeProgress = { pickLevel: null, featureSlots: 0 };

/**
 * Lê a tabela até `upTo` e conta o que ela abre em matéria de arquétipo.
 *
 * Só concessão de opção única conta. Onde a habilidade de arquétipo aparece
 * como uma opção entre outras — "Habilidade de Arquétipo ou Fôlego Extra", no
 * espadachim e em mais cinco classes — quem decide é o jogador, e a ficha
 * ainda não tem onde registrar essa escolha. Contar a vaga sem ela existir
 * seria pior que não contar: prometeria uma habilidade que o personagem pode
 * não ter pegado.
 */
export function archetypeProgressOf(
  levels: IClassLevel[] | undefined,
  level: number | undefined
): IArchetypeProgress {
  const upTo = Number(level);
  if (!Number.isFinite(upTo) || upTo < 1) return EMPTY;

  let pickLevel: number | null = null;
  let featureSlots = 0;

  for (const row of levels ?? []) {
    if (row.level > upTo) continue;
    for (const grant of row.grants ?? []) {
      if (grant.options.length !== 1) continue;
      const pick = archetypePickOf(grant.options[0].name);
      if (!pick) continue;
      if (pick.kind === 'archetype') {
        pickLevel =
          pickLevel === null ? row.level : Math.min(pickLevel, row.level);
      } else {
        featureSlots += 1;
      }
    }
  }

  return { pickLevel, featureSlots };
}

/**
 * Varre a tabela inteira: em que nível se escolhe o arquétipo, e em quais
 * níveis ele abre vaga de habilidade.
 *
 * Diferente de `archetypeProgressOf`, que só enxerga até o nível da ficha:
 * aqui o que se quer é a regra da classe, independente de quem a tem.
 */
function scanLevels(levels: IClassLevel[] | undefined): {
  pickLevel: number | null;
  featureLevels: number[];
} {
  let pickLevel: number | null = null;
  const featureLevels: number[] = [];

  for (const row of levels ?? []) {
    for (const grant of row.grants ?? []) {
      if (grant.options.length !== 1) continue;
      const pick = archetypePickOf(grant.options[0].name);
      if (!pick) continue;
      if (pick.kind === 'archetype') {
        if (pickLevel === null) pickLevel = row.level;
      } else {
        featureLevels.push(row.level);
      }
    }
  }

  featureLevels.sort((a, b) => a - b);
  return { pickLevel, featureLevels };
}

/** O catálogo de arquétipos de uma classe, para os dois editores de ficha. */
export async function getArchetypeCatalog(
  classId: string | undefined
): Promise<IArchetypeCatalog> {
  const empty: IArchetypeCatalog = {
    pickLevel: null,
    featureLevels: [],
    archetypes: [],
  };
  if (!classId || !/^[0-9a-f]{24}$/i.test(String(classId))) return empty;

  const klass = await CharacterClassModel.findById(classId)
    .select('levels archetypes')
    .lean<Pick<ICharacterClass, 'levels' | 'archetypes'>>();
  if (!klass) return empty;

  return {
    ...scanLevels(klass.levels),
    archetypes: (klass.archetypes ?? []).map((archetype) => ({
      name: archetype.name,
      slug: archetype.slug,
      description: archetype.description,
      features: (archetype.features ?? []).map((feature) => ({
        name: feature.name,
        description: feature.description,
      })),
    })),
  };
}

/**
 * Resolve a escolha de arquétipo da ficha contra a classe ligada.
 *
 * Devolve o bloco já enriquecido com o que a tabela diz (nome, nível de
 * escolha, vagas) e as habilidades escolhidas como entradas de ficha. Tudo é
 * derivado: o documento continua guardando só `{ slug, features }`.
 *
 * Duas limpezas acontecem aqui, e as duas são auto-curativas de propósito: um
 * nome que não existe mais no arquétipo some da lista, e o que passar das
 * vagas do nível fica de fora. É o que faz uma ficha sobreviver a uma
 * reimportação da classe e a um personagem que perdeu nível, sem nunca
 * apagar a escolha do jogador do banco.
 */
export async function resolveArchetype(
  classId: string | undefined,
  level: number | undefined,
  stored: ICitizenArchetype | undefined
): Promise<{
  archetype?: ICitizenArchetype;
  abilities: ICitizenAbility[];
}> {
  if (!classId || !/^[0-9a-f]{24}$/i.test(String(classId))) {
    return { abilities: [] };
  }

  const klass = await CharacterClassModel.findById(classId)
    .select('levels archetypes')
    .lean<Pick<ICharacterClass, 'levels' | 'archetypes'>>();
  if (!klass) return { abilities: [] };

  const { pickLevel: openedAt } = scanLevels(klass.levels);
  if (openedAt === null) return { abilities: [] };

  const { featureSlots } = archetypeProgressOf(klass.levels, level);

  const chosen: IArchetype | undefined = stored?.slug
    ? klass.archetypes?.find((a) => a.slug === stored.slug)
    : undefined;

  // Casado por nome dobrado pelo mesmo motivo das características: o nome
  // gravado na ficha é o que o códice mostrava no dia da escolha, e uma
  // reimportação pode ter corrigido um acento.
  const byKey = new Map(
    (chosen?.features ?? []).map((feature) => [
      featureKey(feature.name),
      feature,
    ])
  );

  const taken: string[] = [];
  const abilities: ICitizenAbility[] = [];
  const seen = new Set<string>();

  for (const name of stored?.features ?? []) {
    if (taken.length >= featureSlots) break;
    const key = featureKey(name);
    const feature = byKey.get(key);
    if (!feature || seen.has(key)) continue;
    seen.add(key);
    taken.push(feature.name);
    abilities.push({
      name: feature.name,
      description: feature.description,
      source: 'archetype',
    });
  }

  return {
    archetype: {
      ...(chosen ? { slug: chosen.slug, name: chosen.name } : {}),
      features: taken,
      pickLevel: openedAt,
      featureSlots,
    },
    abilities,
  };
}

/**
 * Tira da gravação o que a tabela da classe derivou.
 *
 * Mesmo papel de `stripDerivedCasting`: a ficha devolve o bloco inteiro no
 * save, e gravar `featureSlots` deixaria um teto congelado que o próximo nível
 * do personagem contradiz.
 */
export function stripDerivedArchetype(value: unknown): unknown {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return value;
  const { name, pickLevel, featureSlots, ...rest } = value as Record<
    string,
    unknown
  >;
  void name;
  void pickLevel;
  void featureSlots;
  return rest;
}
