'use server';

import CharacterClassModel from '../db/classes/classes';
import type ICharacterClass from '../db/classes/class.d';
import TalentModel from '../db/talents/talents';
import type ITalentDoc from '../db/talents/talent.d';
import { classSlug } from '../db/l10n/classes';
import { createEntityService } from './createEntityService';
import {
  ForumSheetError,
  fetchTopicHtml,
  parseTopicUrl,
} from './forumSheet.service';
import { parseTalentTopic } from './talentTopic.service';

const service = createEntityService<ITalentDoc>(TalentModel);

/** Mesma dobra de `classSlug`: nome sem acento, caixa nem pontuação. */
const talentSlug = classSlug;

export async function getAllTalents() {
  return service.getAll();
}

export async function getTalentBySlug(slug: string) {
  return service.getBySlug(slug);
}

export async function createTalent(data: Partial<ITalentDoc>) {
  return service.create({
    ...data,
    slug: talentSlug(data.name ?? ''),
  } as ITalentDoc);
}

export async function updateTalent(slug: string, data: Partial<ITalentDoc>) {
  const next = data.name ? { ...data, slug: talentSlug(data.name) } : data;
  return service.update(slug, next);
}

export async function removeTalent(slug: string) {
  return service.remove(slug);
}

// ── Catálogo para a ficha ────────────────────────────────

/**
 * Um talento como o seletor da ficha o vê, venha ele de onde vier.
 *
 * `scope` é o que a regra do jogo distingue: no nível em que ganha um talento,
 * o personagem pode pegar um GERAL ou um DA PRÓPRIA CLASSE — as duas listas se
 * somam. Quem é de classe traz também o grupo e a condição de destrave, porque
 * há conjuntos ("Talentos Avançados de Necromancia") que só abrem em certo
 * nível.
 */
export interface ITalentOption {
  /** Identidade estável: o slug do geral, ou `classe:slug` no de classe. */
  key: string;
  name: string;
  scope: 'general' | 'class';
  category?: string;
  prerequisites?: string;
  description?: string;
  /** Só nos de classe: o conjunto a que pertence e a regra que o destrava. */
  group?: string;
  unlock?: string;
}

/** Junta os campos do talento geral num texto só, para a tela de leitura. */
function describeGeneral(talent: ITalentDoc): string {
  return [
    talent.benefit && `Benefício: ${talent.benefit}`,
    talent.slotIncrease && `Aumento de Slot: ${talent.slotIncrease}`,
    talent.normal && `Normal: ${talent.normal}`,
    talent.special && `Especial: ${talent.special}`,
    talent.description,
  ]
    .filter(Boolean)
    .join('\n\n');
}

const classTalentKey = (slug: string, name: string) =>
  `${slug}:${talentSlug(name)}`;

/**
 * Tudo o que um personagem daquela classe pode escolher.
 *
 * Os gerais moram na coleção `talents`; os da classe, dentro do documento da
 * classe, onde a importação do tópico dela já os põe. Não há cópia de um lado
 * para o outro de propósito: cada um continua sendo mantido onde é escrito, e
 * a soma acontece aqui, na leitura — é a mesma escolha de `resolveLinks`, pelo
 * mesmo motivo.
 */
export async function getTalentOptions(
  classId?: string
): Promise<ITalentOption[]> {
  const general = await TalentModel.find({})
    .select(
      'name slug category prerequisites benefit normal special slotIncrease description'
    )
    .sort({ name: 1 })
    .lean<ITalentDoc[]>();

  const options: ITalentOption[] = general.map((talent) => ({
    key: talent.slug,
    name: talent.name,
    scope: 'general',
    category: talent.category,
    prerequisites: talent.prerequisites,
    description: describeGeneral(talent),
  }));

  if (classId && /^[0-9a-f]{24}$/i.test(classId)) {
    const klass = await CharacterClassModel.findById(classId)
      .select('slug name talents')
      .lean<Pick<ICharacterClass, 'slug' | 'name' | 'talents'>>();

    for (const talent of klass?.talents ?? []) {
      options.push({
        key: classTalentKey(klass?.slug ?? 'classe', talent.name),
        name: talent.name,
        scope: 'class',
        category: klass?.name,
        prerequisites: talent.requirement,
        description: talent.description,
        group: talent.group,
        unlock: talent.unlock,
      });
    }
  }

  return options;
}

// ── Importação ───────────────────────────────────────────

export interface ITalentImportResult {
  created: number;
  updated: number;
  names: string[];
}

/**
 * Importa o tópico de talentos gerais do fórum.
 *
 * Reimportar atualiza no lugar, casando pelo slug do nome — o mesmo contrato
 * do grimório, e o que permite corrigir o texto no fórum sem duplicar nem
 * perder os vínculos das fichas.
 *
 * Nomes repetidos entre categorias ("Observador" existe em duas) ganham o
 * sufixo da categoria, nas DUAS entradas e não só na segunda: assim o slug não
 * depende da ordem em que o tópico foi lido, e uma reimportação não troca qual
 * das duas ficou com o nome curto.
 */
export async function importTalentTopic(
  rawUrl: string
): Promise<ITalentImportResult> {
  const url = parseTopicUrl(rawUrl);
  const html = await fetchTopicHtml(url);
  const parsed = parseTalentTopic(html, url);

  if (parsed.length === 0) {
    throw new ForumSheetError(
      'Não reconheci nenhum talento nesse tópico. Confira se o link é o da lista de talentos.'
    );
  }

  const seen = new Map<string, number>();
  for (const talent of parsed) {
    const base = talentSlug(talent.name);
    seen.set(base, (seen.get(base) ?? 0) + 1);
  }

  const importedAt = new Date();
  let created = 0;
  let updated = 0;
  const names: string[] = [];

  for (const talent of parsed) {
    const base = talentSlug(talent.name);
    if (!base) continue;
    const slug =
      (seen.get(base) ?? 0) > 1 && talent.category
        ? `${base}-${talentSlug(talent.category)}`
        : base;

    const existing = await TalentModel.findOne({ slug }).select('_id');
    await TalentModel.findOneAndUpdate(
      { slug },
      { ...talent, slug, importedAt },
      { upsert: true, returnDocument: 'after', runValidators: true }
    );
    if (existing) updated++;
    else created++;
    names.push(talent.name);
  }

  return { created, updated, names };
}
