// Sem 'use server' de propósito: com a diretiva, `importRaceTopic` — que
// grava no banco e não confere papel — viraria uma server action chamável do
// cliente. Este módulo só é usado por páginas, rotas e scripts no servidor;
// a checagem de papel fica na rota (`app/api/races/import`).

import RaceModel from '../db/races/races';
import type IRace from '../db/races/race.d';
import type { IRaceCatalogEntry, IRaceData } from '../db/races/race.d';
import { createEntityService } from './createEntityService';
import { deleteUnreferencedImages, uploadedImageIds } from './image.service';
import {
  ForumSheetError,
  fetchTopicHtml,
  parseTopicUrl,
} from './forumSheet.service';
import { parseRaceTopic } from './raceTopic.service';

const service = createEntityService<IRace>(RaceModel);

/**
 * O que a listagem precisa de cada raça — projeção magra: o card não usa as
 * habilidades nem a crônica. Serve ao site e ao iframe do fórum.
 */
export async function getRaceOptions() {
  const races = await RaceModel.find()
    .select('name slug unique images abilityScoreIncrease subraces.name')
    .sort({ name: 1 })
    .lean<IRace[]>();
  return races.map((race) => ({
    name: race.name,
    slug: race.slug,
    unique: race.unique,
    images: race.images ?? [],
    abilityScoreIncrease: race.abilityScoreIncrease,
    subraces: (race.subraces ?? []).map((s) => ({ name: s.name })),
  }));
}

/**
 * Com quem está cada raça única, pelo vínculo `raceId` das fichas.
 *
 * Derivado, como `getUniqueClassHolders`: apagar o personagem ou trocar de
 * raça libera a vaga sozinho. Só jogadores têm `raceId`.
 */
const unsent = (status?: string) => status === 'blank' || status === 'draft';

export async function getUniqueRaceHolders(): Promise<
  Map<string, { id: string; name: string; slug: string }>
> {
  const unique = await RaceModel.find({ unique: true })
    .select('_id')
    .lean<{ _id: unknown }[]>();
  const holders = new Map<string, { id: string; name: string; slug: string }>();
  if (unique.length === 0) return holders;

  const { default: PlayerModel } = await import('../db/players/players');
  const found = await PlayerModel.find({
    raceId: { $in: unique.map((r) => String(r._id)) },
  })
    .select('_id name slug raceId status')
    .lean<
      {
        _id: unknown;
        name?: string;
        slug?: string;
        raceId?: unknown;
        status?: string;
      }[]
    >();
  for (const doc of found) {
    const key = String(doc.raceId);
    if (!holders.has(key)) {
      holders.set(key, {
        id: String(doc._id),
        // Rascunho não enviado não mostra nome nem endereço da ficha.
        name: unsent(doc.status) ? '' : String(doc.name ?? ''),
        slug: unsent(doc.status) ? '' : String(doc.slug ?? ''),
      });
    }
  }
  return holders;
}

/**
 * A ficha pode ficar com esta raça? Devolve o motivo quando não pode.
 *
 * Espelha `uniqueClassConflict`: o seletor da ficha já mostra a raça como
 * indisponível, mas é aqui que a regra vale. `holder` identifica a ficha que
 * está sendo gravada (por slug ou por id) — quem já tem a raça única a mantém.
 */
export async function uniqueRaceConflict(
  raceId: unknown,
  holder?: { slug?: string; id?: string }
): Promise<string | null> {
  if (!raceId || typeof raceId !== 'string') return null;
  if (!/^[0-9a-f]{24}$/i.test(raceId)) return null;

  const race = await RaceModel.findById(raceId)
    .select('name unique')
    .lean<{ name?: string; unique?: boolean }>();
  if (!race?.unique) return null;

  const holders = await getUniqueRaceHolders();
  const current = holders.get(raceId);
  if (
    !current ||
    (holder?.slug && current.slug === holder.slug) ||
    (holder?.id && current.id === holder.id)
  ) {
    return null;
  }
  return `${race.name ?? 'Esta raça'} é uma raça única e já pertence a ${current.name || 'outro personagem'}.`;
}

const CATALOG_FIELDS = [
  'name',
  'slug',
  'unique',
  'images',
  'abilityScoreIncrease',
  'abilityBonusOverride',
  'speed',
  'size',
  'languages',
  'languagesOverride',
  'traits',
  'baseOnlyTraits',
  'choiceRules',
  'subraces.name',
  'subraces.slug',
  'subraces.group',
  'subraces.abilityScoreIncrease',
  'subraces.abilityBonusOverride',
  'subraces.languagesOverride',
  'subraces.speed',
  'subraces.size',
  'subraces.languages',
  'subraces.traits',
  'subraces.image',
].join(' ');

export async function getRaceCatalog(
  filter: Record<string, unknown> = {},
  // Quem tem cada raça única custa duas consultas a mais; só o seletor da
  // ficha precisa, não a leitura de uma ficha.
  options: { withHolders?: boolean; forPlayer?: string } = {}
): Promise<IRaceCatalogEntry[]> {
  const races = await RaceModel.find(filter)
    .select(CATALOG_FIELDS)
    .sort({ name: 1 })
    .lean<(IRaceCatalogEntry & { _id: unknown })[]>();
  const holders = options.withHolders
    ? await getUniqueRaceHolders()
    : new Map<string, { id: string; name: string; slug: string }>();
  return races.map(({ _id, ...race }) => ({
    ...race,
    id: String(_id),
    images: race.images ?? [],
    traits: race.traits ?? [],
    subraces: race.subraces ?? [],
    // Só nome e slug saem daqui (a rota é pública); quem tem a raça a mantém,
    // então para a própria ficha (`forPlayer`) ela não aparece como tomada.
    ...(race.unique &&
    holders.has(String(_id)) &&
    holders.get(String(_id))?.id !== options.forPlayer
      ? {
          takenBy: {
            name: holders.get(String(_id))!.name,
            slug: holders.get(String(_id))!.slug,
          },
        }
      : {}),
  }));
}

type RaceArt = Pick<IRace, 'images' | 'subraces'>;

/** Os ids enviados usados pela arte da raça e das sub-raças. */
const raceImageIds = (race?: RaceArt | null) =>
  uploadedImageIds([
    ...(race?.images ?? []).map((image) => image.url),
    ...(race?.subraces ?? []).map((subrace) => subrace.image?.url),
  ]);

const ART_FIELDS = 'images subraces.image';

/** Apaga o que `before` usava e `after` não usa mais. */
async function dropReplacedImages(
  before: RaceArt | null,
  after?: RaceArt | null
) {
  const kept = raceImageIds(after);
  await deleteUnreferencedImages(
    [...raceImageIds(before)].filter((id) => !kept.has(id))
  );
}

/**
 * Salvar uma raça apaga as imagens enviadas que ela deixou de usar. A troca
 * grava um id novo (a URL é `immutable` no cache) e o arquivo velho sai aqui,
 * depois do save, porque cancelar a edição não pode deixar o campo apontando
 * para um arquivo apagado.
 */
export async function updateRace(slug: string, data: Partial<IRace>) {
  const before = await RaceModel.findOne({ slug })
    .select(ART_FIELDS)
    .lean<RaceArt>();
  const result = await service.update(slug, data);
  if (result.success) await dropReplacedImages(before, result.data);
  return result;
}

export async function removeRace(slug: string) {
  const before = await RaceModel.findOne({ slug })
    .select(ART_FIELDS)
    .lean<RaceArt>();
  const result = await service.remove(slug);
  if (result.success) await dropReplacedImages(before);
  return result;
}

export async function getRaceBySlug(slug: string) {
  return service.getBySlug(slug);
}

export interface IRaceImportResult {
  name: string;
  slug: string;
  created: boolean;
  subraces: number;
  traits: number;
  warnings: string[];
  parsed?: Omit<IRaceData, 'warnings'>;
}

/**
 * O que é curadoria da tela de edição vence o tópico.
 *
 * A arte de uma raça (link e ponto de foco) é escolhida na edição e quase
 * nunca é a do fórum, e o resumo do topo nem existe no fórum. Reimportar o
 * texto não pode apagar essas escolhas; a imagem do tópico só entra onde
 * ainda não há nenhuma.
 */
function keepCuratedFields(
  data: Omit<IRaceData, 'warnings'>,
  existing: Pick<IRace, 'summary' | 'images' | 'subraces'> | null
): Omit<IRaceData, 'warnings'> {
  if (!existing) return data;
  const stored = new Map(
    (existing.subraces ?? []).map((subrace) => [subrace.slug, subrace.image])
  );
  return {
    ...data,
    ...(existing.summary ? { summary: existing.summary } : {}),
    images: existing.images?.length ? existing.images : data.images,
    subraces: data.subraces.map((subrace) => ({
      ...subrace,
      image: stored.get(subrace.slug) ?? subrace.image,
    })),
  };
}

/**
 * Importa um tópico de raça do fórum.
 *
 * Um tópico é uma raça, com as sub-raças dentro. Reimportar substitui o
 * documento casando pelo slug e preserva o `_id`, o `createdAt` o resumo e as
 * imagens (`keepCuratedFields`). O resto vem do tópico: texto editado à mão não
 * sobrevive a uma reimportação.
 */
export async function importRaceTopic(
  rawUrl: string,
  options?: { dryRun?: boolean }
): Promise<IRaceImportResult> {
  const url = parseTopicUrl(rawUrl);
  const html = await fetchTopicHtml(url);
  const { warnings, ...data } = parseRaceTopic(html, url);

  const traits = data.traits.length + (data.baseOnlyTraits?.length ?? 0);
  // O Mestiço não tem habilidade própria: tudo nele são regras de escolha.
  const rules = data.choiceRules?.length ?? 0;
  if (traits === 0 && rules === 0 && data.subraces.length === 0) {
    throw new ForumSheetError(
      'Não encontrei habilidades raciais nesse tópico. Confira se o link é de uma raça.'
    );
  }

  const summary: IRaceImportResult = {
    name: data.name,
    slug: data.slug,
    created: false,
    subraces: data.subraces.length,
    traits,
    warnings,
  };

  if (options?.dryRun) {
    summary.created = !(await RaceModel.exists({ slug: data.slug }));
    return { ...summary, parsed: data };
  }

  const existing = await RaceModel.findOne({ slug: data.slug })
    .select('_id createdAt summary images subraces.slug subraces.image')
    .lean<Pick<IRace, 'createdAt' | 'summary' | 'images' | 'subraces'>>();
  const merged = keepCuratedFields(data, existing);
  await RaceModel.findOneAndReplace(
    { slug: data.slug },
    {
      ...merged,
      importedAt: new Date(),
      ...(existing ? { createdAt: existing.createdAt } : {}),
    },
    { upsert: true, runValidators: true }
  );
  // Uma sub-raça que saiu do tópico leva a imagem enviada junto.
  if (existing) await dropReplacedImages(existing, merged);

  return { ...summary, created: !existing };
}
