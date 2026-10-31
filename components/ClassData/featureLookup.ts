import type ICharacterClass from '@/db/classes/class.d';
import type { IClassFeature } from '@/db/classes/class.d';

/**
 * Nome comparável de uma característica.
 *
 * A tabela de progressão e a lista de descrições escrevem o mesmo nome de
 * jeitos diferentes: acento, artigo ("Segredo dos Mortos" × "Segredos dos
 * Mortos" não casa, mas "O Pacto" × "Pacto" sim) e sufixo de escolha
 * ("(escolhe 2)"). Dobrar isso tudo é o que liga o nome da tabela à
 * descrição; o que ainda não casar fica como texto, sem link.
 */
export const grantKey = (name: string): string =>
  name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s*\([^)]*\)\s*/g, ' ')
    .replace(/\b(a|o|as|os|de|da|do|das|dos)\b/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

/** Nome comparável → índice da característica em `features`. */
export function indexFeatures(
  features: IClassFeature[] | undefined
): Map<string, number> {
  const index = new Map<string, number>();
  (features ?? []).forEach((feature, i) => {
    const key = grantKey(feature.name);
    if (!index.has(key)) index.set(key, i);
  });
  return index;
}

export interface IFeatureEntry {
  feature: IClassFeature;
  index: number;
}

export interface IFeatureBlock {
  /** Opções ligadas por "ou" na tabela, no mesmo nível: escolhe-se uma. */
  choice: boolean;
  entries: IFeatureEntry[];
}

export interface IFeatureLevelGroup {
  /** 0 = característica sem nível conhecido. */
  level: number;
  blocks: IFeatureBlock[];
}

/**
 * Agrupa as características por nível.
 *
 * `feature.level` manda; quando falta, o nível é deduzido do primeiro nível da
 * tabela que concede uma opção de mesmo nome. Sem nenhum dos dois, cai em 0.
 */
export function groupFeaturesByLevel(
  k: Pick<ICharacterClass, 'features' | 'levels'>
): IFeatureLevelGroup[] {
  const levels = k.levels ?? [];

  // Nome → conjunto de opções irmãs ("ou") que a tabela liga a ele.
  const choiceOf = new Map<string, string>();
  for (const level of levels) {
    if (level.abilityScoreIncrease) continue;
    for (const grant of level.grants ?? []) {
      if (grant.options.length < 2) continue;
      const keys = grant.options.map((option) => grantKey(option.name));
      const set = `${level.level}:${keys.join('|')}`;
      keys.forEach((key) => choiceOf.set(key, set));
    }
  }

  const byLevel = new Map<number, IFeatureEntry[]>();
  (k.features ?? []).forEach((feature, index) => {
    let level = feature.level;
    if (level === undefined || level === null) {
      const key = grantKey(feature.name);
      const hit = levels.find((l) =>
        (l.grants ?? []).some((g) =>
          g.options.some((option) => grantKey(option.name) === key)
        )
      );
      level = hit ? hit.level : 0;
    }
    const list = byLevel.get(level) ?? [];
    list.push({ feature, index });
    byLevel.set(level, list);
  });

  return [...byLevel.entries()]
    .sort(([a], [b]) => a - b)
    .map(([level, entries]) => {
      const blocks: IFeatureBlock[] = [];
      const seen = new Map<string, IFeatureBlock>();
      for (const entry of entries) {
        const set = choiceOf.get(grantKey(entry.feature.name));
        if (!set) {
          blocks.push({ choice: false, entries: [entry] });
          continue;
        }
        let block = seen.get(set);
        if (!block) {
          block = { choice: true, entries: [] };
          seen.set(set, block);
          blocks.push(block);
        }
        block.entries.push(entry);
      }
      // Uma "escolha" com uma opção só não é escolha.
      return {
        level,
        blocks: blocks.map((b) =>
          b.choice && b.entries.length < 2 ? { ...b, choice: false } : b
        ),
      };
    });
}
