'use server';

import SpellModel from '../db/spells/spells';
import type ISpell from '../db/spells/spell.d';
import { spellSlug } from '../db/l10n/spells';
import { createEntityService } from './createEntityService';
import {
  ForumSheetError,
  fetchTopicHtml,
  parseTopicUrl,
} from './forumSheet.service';
import { parseSpellTopic } from './spellTopic.service';

const service = createEntityService<ISpell>(SpellModel);

export async function getAllSpells() {
  return service.getAll();
}

/**
 * Projeção magra do grimório, para o seletor de magias da ficha.
 *
 * Filtra por classe e círculo porque é assim que a ficha escolhe: um druida de
 * 1º nível só pode preparar magia de druida de 1º círculo, e mandar as 587 do
 * grimório para dentro de um iframe para descartar 531 no cliente seria
 * desperdício — além de deixar escolher o que a regra não permite.
 */
export async function getSpellOptions(filter: {
  classId?: string;
  circle?: number;
  maxCircle?: number;
}) {
  const query: Record<string, unknown> = {};
  if (filter.classId && /^[0-9a-f]{24}$/i.test(filter.classId)) {
    query.classIds = filter.classId;
  }
  if (typeof filter.circle === 'number' && Number.isFinite(filter.circle)) {
    query.circle = filter.circle;
  } else if (
    typeof filter.maxCircle === 'number' &&
    Number.isFinite(filter.maxCircle)
  ) {
    query.circle = { $gte: 1, $lte: filter.maxCircle };
  }

  return SpellModel.find(query)
    .select('_id name circle school classes')
    .sort({ circle: 1, name: 1 })
    .lean();
}

export async function getSpellBySlug(slug: string) {
  return service.getBySlug(slug);
}

export async function createSpell(data: Partial<ISpell>) {
  return service.create({
    ...data,
    slug: spellSlug(data.name ?? ''),
  } as ISpell);
}

export async function updateSpell(slug: string, data: Partial<ISpell>) {
  // Renomear move o slug junto, senão a chave de identidade descolaria do
  // nome e a próxima importação criaria uma segunda magia.
  const next = data.name ? { ...data, slug: spellSlug(data.name) } : data;
  return service.update(slug, next);
}

export async function removeSpell(slug: string) {
  return service.remove(slug);
}

export async function getSpellsByIds(ids: string[]) {
  const valid = ids.filter((id) => /^[0-9a-f]{24}$/i.test(id));
  if (valid.length === 0) return [];
  return SpellModel.find({ _id: { $in: valid } })
    .select('-__v')
    .lean<ISpell[]>();
}

export interface ISpellImportResult {
  created: number;
  updated: number;
  names: string[];
}

/**
 * Importa um tópico inteiro de magias para o grimório.
 *
 * O círculo não é lido do tópico: cada tópico do fórum é um círculo, e quem
 * importa informa qual. Fica como um campo do formulário ao lado do link.
 *
 * Reimportar o mesmo tópico atualiza as magias no lugar, casando pelo slug do
 * nome. É o que permite corrigir o texto no fórum e trazer a correção para cá
 * sem duplicar nem perder os vínculos com as fichas, que apontam para o `_id`.
 */
export async function importSpellTopic(
  rawUrl: string,
  circle: number
): Promise<ISpellImportResult> {
  if (!Number.isInteger(circle) || circle < 0 || circle > 9) {
    throw new ForumSheetError('O círculo precisa ser um número de 0 a 9.');
  }

  const url = parseTopicUrl(rawUrl);
  const html = await fetchTopicHtml(url);
  const parsed = parseSpellTopic(html, circle, url);

  if (parsed.length === 0) {
    throw new ForumSheetError(
      'Não reconheci nenhuma magia nesse tópico. Confira se o link é de uma lista de magias.'
    );
  }

  const importedAt = new Date();
  let created = 0;
  let updated = 0;

  for (const spell of parsed) {
    const slug = spellSlug(spell.name ?? '');
    if (!slug) continue;

    const existing = await SpellModel.findOne({ slug }).select('_id');
    await SpellModel.findOneAndUpdate(
      { slug },
      { ...spell, slug, importedAt },
      { upsert: true, returnDocument: 'after', runValidators: true }
    );
    if (existing) updated++;
    else created++;
  }

  return { created, updated, names: parsed.map((s) => s.name ?? '') };
}
