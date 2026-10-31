import { Types, type Model } from 'mongoose';

/**
 * Mantém `playerCount` das classes em dia com o `classId` das fichas.
 *
 * O contador é gravado na classe para que a listagem do códice não precise
 * contar fichas a cada abertura. O preço de gravar um derivado é mantê-lo
 * certo, e por isso a manutenção é RECONTAGEM das classes afetadas, não
 * `$inc`: um incremento perdido (um erro entre as duas escritas, um script
 * que passou por fora) ficaria errado para sempre, enquanto a recontagem se
 * corrige na próxima escrita que tocar a classe. Com `classId` indexado, contar
 * as fichas de uma classe custa o mesmo que incrementar.
 *
 * Só jogadores entram: cidadãos são NPCs, e o selo é "quantos jogadores".
 */

// Importação tardia dos dois models: este módulo é usado pelo schema de
// jogador, que é carregado antes do model existir.
async function loadModels() {
  const [{ default: CharacterClassModel }, { default: PlayerModel }] =
    await Promise.all([import('../classes/classes'), import('./players')]);
  return {
    CharacterClassModel: CharacterClassModel as Model<unknown>,
    PlayerModel: PlayerModel as Model<unknown>,
  };
}

const isObjectId = (id: string) => /^[0-9a-f]{24}$/i.test(id);

/**
 * Reconta as classes indicadas. Sem `classIds`, reconta todas — é o que o
 * script de backfill usa, e o que zera as classes sem nenhuma ficha.
 */
export async function recountClassPlayers(classIds?: unknown[]) {
  const { CharacterClassModel, PlayerModel } = await loadModels();

  const ids = classIds
    ? [...new Set(classIds.filter(Boolean).map(String))].filter(isObjectId)
    : (
        await CharacterClassModel.find()
          .select('_id')
          .lean<{ _id: unknown }[]>()
      ).map((k) => String(k._id));
  if (ids.length === 0) return;

  const counted = await PlayerModel.aggregate<{ _id: unknown; n: number }>([
    // `aggregate` não converte tipos como `find`: o filtro precisa de ObjectId.
    { $match: { classId: { $in: ids.map((id) => new Types.ObjectId(id)) } } },
    { $group: { _id: '$classId', n: { $sum: 1 } } },
  ]);
  const byId = new Map(counted.map((c) => [String(c._id), c.n]));

  await CharacterClassModel.bulkWrite(
    ids.map((id) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { playerCount: byId.get(id) ?? 0 } },
        // Um contador não é edição da classe: mexer em `updatedAt` faria o
        // detector de edição concorrente acusar conflito que não houve.
        timestamps: false,
      },
    })),
    { ordered: false }
  );
}

/**
 * A recontagem roda depois da escrita da ficha, que já foi gravada. Falhar
 * aqui não pode transformar um save bem-sucedido em erro na tela — o número
 * fica defasado até a próxima escrita na classe, ou até o backfill.
 */
export async function recountClassPlayersSafely(classIds?: unknown[]) {
  try {
    await recountClassPlayers(classIds);
  } catch (error) {
    console.error('[playerCount] recontagem falhou', error);
  }
}

/** Se um documento de update mexe em `classId`, e com que valor. */
export function classIdFromUpdate(
  update: Record<string, unknown> | null | undefined
): { touched: boolean; value?: unknown } {
  if (!update) return { touched: false };
  for (const key of ['$set', '$setOnInsert']) {
    const op = update[key] as Record<string, unknown> | undefined;
    if (op && 'classId' in op) return { touched: true, value: op.classId };
  }
  const unset = update.$unset as Record<string, unknown> | undefined;
  if (unset && 'classId' in unset) return { touched: true };
  // Update sem operador (o Mongoose embrulha em `$set`) ou documento de
  // substituição.
  if ('classId' in update) return { touched: true, value: update.classId };
  return { touched: false };
}
