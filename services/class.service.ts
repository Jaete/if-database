'use server';

import CharacterClassModel from '../db/classes/classes';
import type ICharacterClass from '../db/classes/class.d';
import { classSlug } from '../db/l10n/classes';
import { createEntityService } from './createEntityService';
import {
  ForumSheetError,
  fetchTopicHtml,
  parseTopicUrl,
} from './forumSheet.service';
import { parseClassTopic } from './classTopic.service';

const service = createEntityService<ICharacterClass>(CharacterClassModel);

export async function getAllClasses() {
  return service.getAll();
}

export async function getClassBySlug(slug: string) {
  return service.getBySlug(slug);
}

/**
 * Quem está com cada classe única, pelo vínculo que já existe nas fichas.
 *
 * Derivado, nunca gravado na classe: um personagem morto, apagado ou que
 * trocou de classe libera a vaga sozinho, sem nada para sincronizar. Cidadãos
 * e jogadores entram na mesma conta — um personagem é um personagem.
 */
export async function getUniqueClassHolders(): Promise<
  Map<string, { id: string; name: string; slug: string }>
> {
  const unique = await CharacterClassModel.find({ isUnique: true })
    .select('_id')
    .lean<{ _id: unknown }[]>();
  if (unique.length === 0) return new Map();

  const ids = unique.map((k) => String(k._id));
  const [{ default: CitizenModel }, { default: PlayerModel }] =
    await Promise.all([
      import('../db/citizens/citizens'),
      import('../db/players/players'),
    ]);

  const holders = new Map<string, { id: string; name: string; slug: string }>();
  for (const Model of [CitizenModel, PlayerModel]) {
    const found = await (
      Model as unknown as {
        find: (f: Record<string, unknown>) => {
          select: (s: string) => {
            lean: () => Promise<Record<string, unknown>[]>;
          };
        };
      }
    )
      .find({ classId: { $in: ids } })
      .select('_id name slug classId')
      .lean();

    for (const doc of found) {
      const key = String(doc.classId);
      // O primeiro encontrado fica com a vaga. Duas fichas na mesma classe
      // única é um estado que não deveria existir, e escolher uma delas é
      // melhor que esconder a classe de ambas.
      if (!holders.has(key)) {
        holders.set(key, {
          id: String(doc._id),
          name: String(doc.name ?? ''),
          slug: String(doc.slug ?? ''),
        });
      }
    }
  }
  return holders;
}

/**
 * Projeção magra, para a listagem e o seletor da ficha.
 *
 * A classe completa carrega 20 níveis mais características e talentos; mandar
 * isso para um `<select>` seria desperdício em toda edição de ficha.
 *
 * `holderId` é o personagem que está sendo editado. Uma classe única já tomada
 * sai da lista — exceto para quem a tem, que precisa continuar vendo a própria
 * classe selecionada. Sem `holderId` (a listagem do códice), nada é escondido:
 * lá a informação interessa, e vem anotada em `takenBy`.
 */
export async function getClassOptions(holderId?: string) {
  const [classes, holders] = await Promise.all([
    CharacterClassModel.find()
      .select('_id name slug hitDie isSpellcaster isUnique')
      .sort({ name: 1 })
      .lean<Record<string, unknown>[]>(),
    getUniqueClassHolders(),
  ]);

  return classes
    .map((klass) => {
      const holder = klass.isUnique
        ? holders.get(String(klass._id))
        : undefined;
      return holder ? { ...klass, takenBy: holder } : klass;
    })
    .filter((klass) => {
      const holder = (klass as { takenBy?: { id: string } }).takenBy;
      if (!holder || !holderId) return true;
      return holder.id === holderId;
    });
}

/**
 * A ficha pode ficar com esta classe? Devolve o motivo quando não pode.
 *
 * A lista do seletor já esconde o que está tomado, mas esconder é interface:
 * quem chama a API direto, ou tem a página aberta desde antes de alguém mais
 * pegar a classe, passaria por cima. É aqui que a regra é de fato aplicada.
 */
export async function uniqueClassConflict(
  classId: unknown,
  holderSlug?: string
): Promise<string | null> {
  if (!classId || typeof classId !== 'string') return null;

  const holders = await getUniqueClassHolders();
  const holder = holders.get(classId);
  if (!holder || holder.slug === holderSlug) return null;

  const klass = await CharacterClassModel.findById(classId)
    .select('name')
    .lean<{ name?: string }>();

  return `${klass?.name ?? 'Esta classe'} é uma classe única e já pertence a ${holder.name || 'outro personagem'}.`;
}

export async function createClass(data: Partial<ICharacterClass>) {
  return service.create({
    ...data,
    slug: classSlug(data.name ?? ''),
  } as ICharacterClass);
}

export async function updateClass(
  slug: string,
  data: Partial<ICharacterClass>
) {
  const next = data.name ? { ...data, slug: classSlug(data.name) } : data;
  const result = await service.update(slug, next);

  // O nome da classe é desnormalizado na ficha do personagem, para a ficha não
  // precisar resolver nada na leitura. O preço explícito disso é propagar a
  // renomeação — sem isto, o texto da ficha apodrece.
  if (result.success && data.name) {
    const doc = result.data as ICharacterClass;
    const classId = String(doc._id);
    const { default: CitizenModel } = await import('../db/citizens/citizens');
    const { default: PlayerModel } = await import('../db/players/players');
    await CitizenModel.updateMany({ classId }, { $set: { class: doc.name } });
    await PlayerModel.updateMany({ classId }, { $set: { class: doc.name } });
  }

  return result;
}

export async function removeClass(slug: string) {
  return service.remove(slug);
}

export interface IClassImportResult {
  name: string;
  slug: string;
  created: boolean;
  levels: number;
  features: number;
  archetypes: number;
  talents: number;
  contentBlocks: number;
  /** O que o parser extraiu e não confiou, esperando avaliação na página. */
  candidate?: { features: number; archetypes: number; talents: number };
  warnings: string[];
  /**
   * Diagnóstico por post — presente apenas em dry-run com `verbose: true` ou
   * sempre quando há blocos não classificados.
   */
  postDiagnostics?: import('./classTopic.service').IPostDiagnostic[];
  /**
   * Diferenças encontradas entre o tópico importado e o registro existente
   * — preenchido somente em dry-run quando já há uma classe com esse slug.
   */
  diff?: {
    levelsChanged: boolean;
    featureCountDiff: number;
    archetypeCountDiff: number;
    talentCountDiff: number;
    existingCandidate: boolean;
  };
}

/** Deduz o nome da classe pelo título do tópico. */
/**
 * "Necromante (Classe Única)" → marca de classe única no título do tópico.
 *
 * O acento entra na classe de caracteres em vez de o título ser dobrado: a
 * mesma expressão precisa RECORTAR o trecho do título original, e dobrar
 * acento muda os índices do que seria recortado.
 */
const UNIQUE_IN_TITLE = /\(?\s*classe\s+[úu]nica\s*\)?/i;

function classNameFromTopic(html: string, url: string): string {
  const title = /<title>([\s\S]*?)<\/title>/i.exec(html)?.[1] ?? '';
  const clean = title.split('|')[0].replace(/\s+/g, ' ').trim();
  // O "(Classe Única)" é qualificação, não nome: sem tirá-lo, a classe se
  // chamaria "Necromante (Classe Única)" na ficha de quem a joga.
  const named = clean
    .replace(UNIQUE_IN_TITLE, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
  if (named) return named;
  const slug = /\/t\d+-(.+?)(?:$|\?|#)/.exec(url)?.[1] ?? '';
  return decodeURIComponent(slug).replace(/-/g, ' ').trim() || 'Classe';
}

/** O tópico anuncia a classe como única? Lido do título. */
function uniqueFromTopic(html: string): boolean {
  const title = /<title>([\s\S]*?)<\/title>/i.exec(html)?.[1] ?? '';
  return UNIQUE_IN_TITLE.test(title.split('|')[0]);
}

/**
 * Importa um tópico de classe do fórum.
 *
 * Um tópico é uma classe — ao contrário do grimório, em que um tópico traz
 * dezenas de magias. Reimportar atualiza no lugar casando pelo slug e preserva
 * o `_id`, que é a condição para os vínculos com magias e fichas sobreviverem.
 */
export async function importClassTopic(
  rawUrl: string,
  options?: { dryRun?: boolean }
): Promise<IClassImportResult & { parsed?: Partial<ICharacterClass> }> {
  const url = parseTopicUrl(rawUrl);
  const html = await fetchTopicHtml(url);
  const name = classNameFromTopic(html, url);
  const parsed = parseClassTopic(html, name, url);

  if ((parsed.levels?.length ?? 0) === 0) {
    throw new ForumSheetError(
      'Não encontrei uma tabela de progressão nesse tópico. Confira se o link é de uma classe.'
    );
  }

  const { warnings, postDiagnostics, ...data } = parsed;
  const slug = classSlug(name);
  const summary: IClassImportResult = {
    name,
    slug,
    created: false,
    levels: parsed.levels?.length ?? 0,
    features: parsed.features?.length ?? 0,
    archetypes: parsed.archetypes?.length ?? 0,
    talents: parsed.talents?.length ?? 0,
    contentBlocks: parsed.contentBlocks?.length ?? 0,
    // O que ficou esperando avaliação, para o relatório não dizer "0
    // características" quando na verdade achou 44 e não confiou nelas.
    candidate: parsed.candidate
      ? {
          features: parsed.candidate.features?.length ?? 0,
          archetypes: parsed.candidate.archetypes?.length ?? 0,
          talents: parsed.candidate.talents?.length ?? 0,
        }
      : undefined,
    warnings,
    ...(postDiagnostics?.length ? { postDiagnostics } : {}),
  };

  if (options?.dryRun) {
    // Em dry-run, consulta o banco apenas para o diff — sem gravar nada.
    const existing = await CharacterClassModel.findOne({ slug })
      .select('_id levels features archetypes talents candidate')
      .lean<{
        _id: unknown;
        levels?: unknown[];
        features?: unknown[];
        archetypes?: unknown[];
        talents?: unknown[];
        candidate?: unknown;
      }>();

    if (existing) {
      summary.diff = {
        levelsChanged:
          (existing.levels?.length ?? 0) !== (parsed.levels?.length ?? 0),
        featureCountDiff:
          (parsed.features?.length ?? 0) - (existing.features?.length ?? 0),
        archetypeCountDiff:
          (parsed.archetypes?.length ?? 0) - (existing.archetypes?.length ?? 0),
        talentCountDiff:
          (parsed.talents?.length ?? 0) - (existing.talents?.length ?? 0),
        existingCandidate: existing.candidate != null,
      };
    }
    return { ...summary, parsed: data };
  }

  const existing = await CharacterClassModel.findOne({ slug }).select(
    '_id aliases createdAt'
  );
  await CharacterClassModel.findOneAndReplace(
    { slug },
    {
      ...data,
      slug,
      importedAt: new Date(),
      // As variantes de nome são correções manuais feitas pela interface. A
      // importação sobrescreve o documento inteiro, então preservá-las tem de
      // ser explícito — senão cada reimportação apagaria o trabalho de quem
      // reconciliou os nomes das magias.
      aliases: existing?.aliases ?? data.aliases ?? [],
      candidate: data.candidate ?? null,
      isUnique: uniqueFromTopic(html),
      ...(existing?.createdAt ? { createdAt: existing.createdAt } : {}),
    },
    { upsert: true, returnDocument: 'after', runValidators: true }
  );

  return { ...summary, created: !existing };
}
