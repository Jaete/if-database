import type {
  IPlayerSpellcasting,
  IPlayerSpellLevel,
} from '../db/citizens/citizen';
import type ICharacterClass from '../db/classes/class.d';
import CharacterClassModel from '../db/classes/classes';
import SpellModel from '../db/spells/spells';

/**
 * A conjuração que a classe concede num nível, lida da tabela de progressão.
 *
 * A regra do sistema: o personagem CONHECE todas as magias da classe até o
 * maior círculo que consegue conjurar, e só mantém PREPARADAS tantas quantos
 * forem os espaços somados. Um druida de 1º nível conhece os 56 feitiços de 1º
 * círculo e prepara 2; no 3º, conhece os de 1º e 2º e prepara 6.
 *
 * Nada disso é gravado na ficha: o que a ficha guarda é a escolha das
 * preparadas (`spellRefs`). Os números abaixo são derivados em toda leitura,
 * pelo mesmo motivo das características de classe — subir de nível ou corrigir
 * a tabela da classe tem que valer em todas as fichas, sem migração.
 */
export interface IClassCasting {
  /** Espaços por círculo. Índice 0 = 1º círculo, como vem da tabela. */
  slots: number[];
  /** Maior círculo com espaço. É até ele que o personagem conhece magias. */
  maxCircle: number;
  /** Quantas magias podem ficar preparadas ao mesmo tempo: a soma dos espaços. */
  preparedLimit: number;
  /** Quantos truques o personagem conhece. Truque não ocupa espaço. */
  cantripsKnown: number;
  /** Quantas magias existem no grimório dentro do alcance dele. */
  spellsKnown: number;
}

/**
 * Lê a linha da tabela da classe no nível do personagem.
 *
 * Cai na maior linha abaixo do nível quando a exata não existe: uma tabela
 * importada pela metade é melhor servida pelo último degrau conhecido do que
 * por nenhum.
 */
export async function getClassCasting(
  classId: string | undefined,
  level: number | undefined
): Promise<IClassCasting | null> {
  if (!classId || !/^[0-9a-f]{24}$/i.test(String(classId))) return null;
  const at = Number(level);
  if (!Number.isFinite(at) || at < 1) return null;

  const klass = await CharacterClassModel.findById(classId)
    .select('levels')
    .lean<Pick<ICharacterClass, 'levels'>>();
  if (!klass) return null;

  const row = (klass.levels ?? [])
    .filter((l) => l.level <= at)
    .sort((a, b) => b.level - a.level)[0];
  if (!row) return null;

  const slots = (row.spellSlots ?? []).map((n) => Number(n) || 0);
  // A tabela traz zeros à direita em algumas classes; o maior círculo é o
  // último que de fato tem espaço, não o comprimento do vetor.
  const maxCircle = slots.reduce((max, n, i) => (n > 0 ? i + 1 : max), 0);
  const cantripsKnown = Number(row.cantripsKnown) || 0;

  if (maxCircle === 0 && cantripsKnown === 0) return null;

  const spellsKnown =
    maxCircle > 0
      ? await SpellModel.countDocuments({
          classIds: classId,
          circle: { $gte: 1, $lte: maxCircle },
        })
      : 0;

  return {
    slots: slots.slice(0, maxCircle),
    maxCircle,
    preparedLimit: slots
      .slice(0, maxCircle)
      .reduce((sum, n) => sum + (n || 0), 0),
    cantripsKnown,
    spellsKnown,
  };
}

/**
 * Reescreve a conjuração da ficha com o que a classe determina.
 *
 * Os círculos passam a ser os da tabela, e não os que a ficha tiver gravado: é
 * a tabela que diz quantos espaços existem. `slotsUsed` é preservado, porque é
 * a única coisa ali que pertence à partida e não à classe — os espaços gastos
 * na sessão de hoje.
 *
 * As magias embutidas (`spellLevels[].spells`) não entram: numa ficha ligada
 * à classe, o que está preparado é o que `spellRefs` aponta, e é
 * `resolveSpellRefs` quem as materializa depois desta função.
 */
export function applyClassCasting(
  spellcasting: IPlayerSpellcasting | undefined,
  casting: IClassCasting
): IPlayerSpellcasting {
  const stored = spellcasting ?? ({} as IPlayerSpellcasting);
  const usedOf = (level: number) =>
    stored.spellLevels?.find((l) => l.level === level)?.slotsUsed ?? 0;

  const levels: IPlayerSpellLevel[] = [];
  if (casting.cantripsKnown > 0) {
    levels.push({ level: 0, slotsTotal: 0, slotsUsed: 0, spells: [] });
  }
  for (let circle = 1; circle <= casting.maxCircle; circle += 1) {
    const slotsTotal = casting.slots[circle - 1] ?? 0;
    levels.push({
      level: circle,
      slotsTotal,
      // Um nível perdido (ou um descanso) pode deixar o gasto acima do total;
      // o excedente seria renderizado como espaço negativo.
      slotsUsed: Math.min(usedOf(circle), slotsTotal),
      spells: [],
    });
  }

  return {
    ...stored,
    cantripsKnown: casting.cantripsKnown,
    spellsKnown: casting.spellsKnown,
    preparedLimit: casting.preparedLimit,
    maxCircle: casting.maxCircle,
    spellLevels: levels,
  };
}

/**
 * Tira da gravação o que a leitura derivou.
 *
 * As magias resolvidas carregam `spellId`, que é o que as distingue das
 * embutidas digitadas à mão: só as com id saem. Os limites derivados saem
 * inteiros — gravá-los deixaria na ficha um número que a tabela da classe
 * contradiz no instante seguinte.
 */
export function stripDerivedCasting(
  spellcasting: unknown
): Record<string, unknown> | undefined {
  if (!spellcasting || typeof spellcasting !== 'object') return undefined;
  const { preparedLimit, maxCircle, spellLevels, ...rest } =
    spellcasting as Record<string, unknown>;
  void preparedLimit;
  void maxCircle;

  if (!Array.isArray(spellLevels)) return rest;

  return {
    ...rest,
    spellLevels: spellLevels.map((level) => {
      if (!level || typeof level !== 'object') return level;
      const { spells, ...levelRest } = level as Record<string, unknown>;
      if (!Array.isArray(spells)) return level;
      return {
        ...levelRest,
        spells: spells.filter(
          (spell) =>
            !spell || typeof spell !== 'object' || !('spellId' in spell)
        ),
      };
    }),
  };
}
