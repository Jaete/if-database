import type { ICitizenAbility } from '../db/citizens/citizen';
import type ICharacterClass from '../db/classes/class.d';
import type { IClassFeature, IFeatureTable } from '../db/classes/class.d';
import CharacterClassModel from '../db/classes/classes';
import { archetypePickOf, featureKey } from '../db/l10n/classes';

/**
 * As características que a classe ligada concede, prontas para a ficha.
 *
 * O que decide QUANDO uma característica é concedida é a tabela de progressão
 * (`levels[].grants`), não o campo `level` das descrições: os dois discordam em
 * várias classes, e a tabela é a fonte do fórum para progressão. As descrições
 * entram só como texto, casadas por nome dobrado.
 *
 * Concessão com mais de uma opção é escolha do jogador ("Marca + Localização
 * de Armadilhas ou Ataque Furtivo" concede Marca e UMA das outras duas) e fica
 * de fora: só o que é garantido pode entrar na ficha sozinho. O mesmo vale para
 * a opção marcada com `*`, que depende de um requisito que só o jogador sabe se
 * cumpre.
 */

/**
 * Devolve a descrição com as tabelas da característica no lugar do marcador.
 *
 * A ficha renderiza texto corrido, e não o rich text da página de classe. Em
 * vez de descartar a tabela — a "Forma de Enxame" do druida é quase só tabela —
 * ela é achatada em linhas no ponto em que estava.
 */
function flattenTables(
  description: string | undefined,
  tables: IFeatureTable[] | undefined
): string | undefined {
  if (!description) return description;
  if (!tables?.length) return description;

  return description.replace(/\[\[tabela:(\d+)\]\]/g, (match, index) => {
    const table = tables[Number(index)];
    if (!table) return match;
    const rows = table.headers ? [table.headers, ...table.rows] : table.rows;
    return rows.map((row) => row.join(' — ')).join('\n');
  });
}

/** Índice de nome dobrado → descrição, montado uma vez por classe. */
function describeBy(features: IClassFeature[] | undefined) {
  const index = new Map<string, IClassFeature>();
  for (const feature of features ?? []) {
    const key = featureKey(feature.name);
    // A primeira ocorrência vence: há classes que repetem o nome em níveis
    // diferentes (a mesma característica, melhorada), e a entrada do nível mais
    // baixo é a que descreve o que ela é.
    if (!index.has(key)) index.set(key, feature);
  }
  return index;
}

/**
 * As características de classe de um personagem de nível `level`.
 *
 * Sem classe ligada ou sem nível não há nada a conceder: a ficha de texto livre
 * continua funcionando exatamente como antes.
 */
export async function getGrantedClassAbilities(
  classId: string | undefined,
  level: number | undefined
): Promise<ICitizenAbility[]> {
  if (!classId || !/^[0-9a-f]{24}$/i.test(String(classId))) return [];
  const upTo = Number(level);
  if (!Number.isFinite(upTo) || upTo < 1) return [];

  const klass = await CharacterClassModel.findById(classId)
    .select('levels features')
    .lean<Pick<ICharacterClass, 'levels' | 'features'>>();
  if (!klass) return [];

  const described = describeBy(klass.features);
  const granted: ICitizenAbility[] = [];
  const seen = new Set<string>();

  const rows = (klass.levels ?? [])
    .filter((row) => row.level <= upTo)
    .sort((a, b) => a.level - b.level);

  /** Acrescenta uma concessão garantida, se já não tiver entrado. */
  const grant = (name: string, level: number) => {
    const key = featureKey(name);
    if (!key || seen.has(key)) return;
    seen.add(key);

    const feature = described.get(key);
    granted.push({
      // O nome da descrição vence o da tabela: é o acentuado e o que a
      // página da classe mostra.
      name: feature?.name ?? name,
      description: flattenTables(feature?.description, feature?.tables),
      source: 'class',
      level,
    });
  };

  for (const row of rows) {
    for (const cell of row.grants ?? []) {
      if (cell.options.length !== 1) continue;
      const [option] = cell.options;
      if (option.requiresPrerequisite) continue;

      // "Arquétipo" e "Habilidade de Arquétipo" não são características: são o
      // pedido de uma escolha, feita no bloco de arquétipo da ficha. O que
      // vier colado ao marcador ("Habilidade do arquétipo e Arqueiro Mestre")
      // é concessão de verdade e continua entrando.
      const pick = archetypePickOf(option.name);
      if (pick) {
        if (pick.rest) grant(pick.rest, row.level);
        continue;
      }

      grant(option.name, row.level);
    }
  }

  return granted;
}

/**
 * Funde as características da classe na lista da ficha.
 *
 * Uma entrada manual de mesmo nome é substituída pela da classe, no lugar em
 * que estava: são as fichas preenchidas à mão antes deste vínculo existir, que
 * passam a ter a descrição do códice em vez da cópia. Como entrada de classe
 * nunca é gravada (ver `stripClassAbilities`), a cópia manual desaparece do
 * documento no primeiro save — que é o resultado desejado.
 */
export function mergeClassAbilities(
  abilities: ICitizenAbility[] | undefined,
  granted: ICitizenAbility[]
): ICitizenAbility[] {
  if (granted.length === 0) return abilities ?? [];

  const byKey = new Map(granted.map((a) => [featureKey(a.name ?? ''), a]));
  const used = new Set<string>();

  const merged = (abilities ?? []).map((ability) => {
    const key = featureKey(ability.name ?? '');
    const replacement = byKey.get(key);
    if (!replacement || used.has(key)) return ability;
    used.add(key);
    return replacement;
  });

  return [
    ...merged,
    ...granted.filter((a) => !used.has(featureKey(a.name ?? ''))),
  ];
}

/**
 * Tira da gravação o que veio da classe.
 *
 * A ficha devolvida pela leitura já traz as características da classe e as
 * habilidades do arquétipo escolhido, e o editor manda a lista inteira de
 * volta. Sem esta limpeza, o vínculo viraria uma cópia embutida no primeiro
 * save — e a próxima correção no códice deixaria de aparecer nesta ficha.
 */
export function stripClassAbilities(
  abilities: unknown
): ICitizenAbility[] | undefined {
  if (!Array.isArray(abilities)) return undefined;
  return abilities.filter(
    (ability) =>
      !ability ||
      typeof ability !== 'object' ||
      (ability.source !== 'class' && ability.source !== 'archetype')
  );
}
