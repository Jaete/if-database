'use server';

import PlayerModel from '../db/players/players';
import IPlayer from '../db/players/player';
import {
  PLAYER_PUBLIC_FIELDS,
  type IPublicPlayer,
} from '../db/players/publicFields';
import { createEntityService } from './createEntityService';
import { resolveSpellRefs } from './spellLink.service';
import {
  getGrantedClassAbilities,
  mergeClassAbilities,
  stripClassAbilities,
} from './classFeatures.service';
import {
  applyClassCasting,
  getClassCasting,
  stripDerivedCasting,
} from './classSpells.service';
import {
  resolveArchetype,
  stripDerivedArchetype,
} from './classArchetypes.service';

const service = createEntityService<IPlayer>(PlayerModel);

export async function createPlayer(data: IPlayer) {
  return service.create(data);
}

export async function getAllPlayers() {
  return service.getAll();
}

export async function getPlayerBySlug(slug: string) {
  return service.getBySlug(slug);
}

// Public projection (whitelist): this feeds the unauthenticated embed.
// 24 hex chars only: `isValidObjectId` also accepts any 12-character string.
export async function getPlayerById(id: string) {
  if (!/^[0-9a-f]{24}$/i.test(id)) return null;
  const player = await PlayerModel.findById(id)
    .select(PLAYER_PUBLIC_FIELDS.join(' '))
    .lean<IPublicPlayer>();
  return resolveLinks(player);
}

/**
 * Desliga o vínculo com o códice quando o texto da classe é editado à mão.
 *
 * A ficha embutida grava `class` como texto livre. Se o texto deixar de bater
 * com a classe ligada, o vínculo passa a mentir — e um vínculo que mente é
 * pior que vínculo nenhum, porque nada na tela denuncia. Editar o texto
 * desfaz a ligação; reatar é escolher a classe de novo no formulário.
 */
async function unlinkClassIfRenamed(
  id: string,
  updateData: Record<string, unknown>
) {
  if (typeof updateData.class !== 'string') return;

  const current = await PlayerModel.findById(id).select('classId').lean<{
    classId?: unknown;
  }>();
  if (!current?.classId) return;

  const { default: CharacterClassModel } =
    await import('../db/classes/classes');
  const linked = await CharacterClassModel.findById(current.classId)
    .select('name')
    .lean<{ name?: string }>();

  if (linked?.name !== updateData.class) {
    updateData.classId = null;
  }
}

/**
 * Resolve os dois vínculos da ficha — as magias do grimório e as
 * características da classe — aqui, no serviço, e não em cada página: assim a
 * ficha embutida, a rota de escrita e o app enxergam todos a mesma ficha, sem
 * nenhum deles precisar saber que existe um códice do outro lado.
 */
async function resolveLinks<T extends IPublicPlayer | null>(
  player: T
): Promise<T> {
  if (!player) return player;

  const granted = await getGrantedClassAbilities(player.classId, player.level);

  // O arquétipo é a parte da classe que é escolha. O que a ficha guarda é a
  // escolha; o teto dela e as descrições vêm da classe, aqui.
  const archetype = await resolveArchetype(
    player.classId,
    player.level,
    player.archetype
  );
  const fromClass = [...granted, ...archetype.abilities];

  // Com classe ligada, os círculos e os limites vêm da tabela dela; sem ela, a
  // ficha continua sendo o que alguém digitou. Nos dois casos as magias ligadas
  // ao grimório são materializadas por último, já dentro dos círculos certos.
  const casting = await getClassCasting(player.classId, player.level);
  const spellcasting = casting
    ? applyClassCasting(player.playerSpellcasting, casting)
    : player.playerSpellcasting;

  return {
    ...player,
    ...(spellcasting
      ? { playerSpellcasting: await resolveSpellRefs(spellcasting) }
      : {}),
    ...(archetype.archetype ? { archetype: archetype.archetype } : {}),
    ...(fromClass.length > 0
      ? { abilities: mergeClassAbilities(player.abilities, fromClass) }
      : {}),
  };
}

/**
 * Monta o que será gravado em `playerSpellcasting`.
 *
 * Numa ficha ligada à classe, a tela não é dona dos círculos: ela escolhe as
 * preparadas (`spellRefs`) e marca os espaços gastos. Os círculos gravados
 * continuam sendo os do documento — é o que impede o save de apagar as magias
 * embutidas de uma ficha importada, que a tela nem chega a mostrar porque os
 * círculos exibidos vieram da tabela da classe.
 */
function mergeSpellcastingForWrite(
  stored: Record<string, unknown> | undefined,
  incoming: Record<string, unknown>
): Record<string, unknown> {
  const storedLevels = Array.isArray(stored?.spellLevels)
    ? (stored.spellLevels as Record<string, unknown>[])
    : [];
  const incomingLevels = Array.isArray(incoming.spellLevels)
    ? (incoming.spellLevels as Record<string, unknown>[])
    : [];

  const usedOf = (level: unknown) =>
    incomingLevels.find((l) => l?.level === level)?.slotsUsed;

  // `cantripsKnown` e `spellsKnown` também saem da tabela da classe numa ficha
  // ligada; gravá-los deixaria um número que a próxima leitura contradiz.
  const { cantripsKnown, spellsKnown, ...rest } = incoming;
  void cantripsKnown;
  void spellsKnown;

  return {
    ...rest,
    spellLevels: storedLevels.map((level) => {
      const used = usedOf(level?.level);
      return used === undefined ? level : { ...level, slotsUsed: used };
    }),
  };
}

export async function updatePlayer(slug: string, updateData: Partial<IPlayer>) {
  // O editor do app lê a ficha crua e não vê as características da classe, mas
  // a limpeza vale pelos dois caminhos de escrita: uma entrada de classe que
  // chegasse aqui seria gravada como cópia manual.
  if ('abilities' in updateData) {
    updateData.abilities = stripClassAbilities(updateData.abilities) ?? [];
  }
  if ('playerSpellcasting' in updateData) {
    updateData.playerSpellcasting = stripDerivedCasting(
      updateData.playerSpellcasting
    ) as IPlayer['playerSpellcasting'];
  }
  if ('archetype' in updateData) {
    updateData.archetype = stripDerivedArchetype(
      updateData.archetype
    ) as IPlayer['archetype'];
  }
  return service.update(slug, updateData);
}

// A ficha embutida no fórum só conhece o `_id` (é o que a tag [ficha] carrega),
// enquanto `updatePlayer` é chaveado por slug. Mesma guarda de 24 hex de
// getPlayerById, e `$set` explícito: um update doc sem `$set` substituiria o
// subdocumento inteiro, então gravar `combat.ac` apagaria `combat.hp`.
export async function updatePlayerById(
  id: string,
  updateData: Record<string, unknown>
) {
  if (!/^[0-9a-f]{24}$/i.test(id)) return null;
  await unlinkClassIfRenamed(id, updateData);

  // A leitura funde as características da classe na lista; o editor devolve a
  // lista inteira. Sem tirá-las aqui, o vínculo viraria cópia embutida.
  if ('abilities' in updateData) {
    updateData.abilities = stripClassAbilities(updateData.abilities) ?? [];
  }

  // Só a escolha é gravada; o nome do arquétipo e o número de vagas saem da
  // tabela da classe a cada leitura.
  if ('archetype' in updateData) {
    updateData.archetype = stripDerivedArchetype(updateData.archetype);
  }

  if ('playerSpellcasting' in updateData) {
    const stored = await PlayerModel.findById(id)
      .select('classId playerSpellcasting')
      .lean<{
        classId?: unknown;
        playerSpellcasting?: Record<string, unknown>;
      }>();

    const clean = stripDerivedCasting(updateData.playerSpellcasting);
    // `classId` pode ter acabado de ser desligado acima; o que vale é o estado
    // final, porque é ele que diz de quem são os círculos.
    const linked =
      updateData.classId === null ? false : Boolean(stored?.classId);

    updateData.playerSpellcasting =
      clean && linked
        ? mergeSpellcastingForWrite(stored?.playerSpellcasting, clean)
        : clean;
  }

  const player = await PlayerModel.findByIdAndUpdate(
    id,
    { $set: updateData },
    { returnDocument: 'after', runValidators: true }
  )
    .select(PLAYER_PUBLIC_FIELDS.join(' '))
    .lean<IPublicPlayer>();
  return resolveLinks(player);
}

export async function deletePlayer(slug: string) {
  return service.remove(slug);
}
