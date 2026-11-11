// Sem 'use server' de propósito: com a diretiva, `importRaceTopic` — que
// grava no banco e não confere papel — viraria uma server action chamável do
// cliente. Este módulo só é usado por páginas, rotas e scripts no servidor;
// a checagem de papel fica na rota (`app/api/races/import`).

import RaceModel from '../db/races/races';
import type IRace from '../db/races/race.d';
import type { IRaceData } from '../db/races/race.d';
import { createEntityService } from './createEntityService';
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
  await RaceModel.findOneAndReplace(
    { slug: data.slug },
    {
      ...keepCuratedFields(data, existing),
      importedAt: new Date(),
      ...(existing ? { createdAt: existing.createdAt } : {}),
    },
    { upsert: true, runValidators: true }
  );

  return { ...summary, created: !existing };
}
