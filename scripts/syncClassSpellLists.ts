import 'dotenv/config';
import mongoose from 'mongoose';
import { getConnectionString } from '../lib/db';
import CharacterClassModel from '../db/classes/classes';
import SpellModel from '../db/spells/spells';
import type { IClassCatalog, IClassCatalogItem } from '../db/classes/class.d';
import { linkSpellsToClasses } from '../services/classLink.service';

/**
 * Monta, em cada classe, as listas de magias que apontam para o grimório.
 *
 * Os itens só guardam o nome e o slug da magia (`spell`): o texto continua
 * morando no grimório, e o modal da classe o abre por cima da lista. Rodar de
 * novo depois de importar ou corrigir magias deixa as listas em dia.
 *
 * Passos:
 *   1. Revincula magia → classe pelo texto livre (`linkSpellsToClasses`).
 *   2. Para cada classe com magias, recria as listas de truques (círculo 0) e
 *      de magias (1º em diante), à frente das outras listas da classe.
 *
 * O bardo tem nomes e regra próprios: Jingles e Músicas, e só as magias que
 * nenhuma outra classe aprende.
 *
 * Sem `--apply` só relata.
 *
 *   npx tsx ./scripts/syncClassSpellLists.ts
 *   npx tsx ./scripts/syncClassSpellLists.ts --apply
 */

interface IListSpec {
  name: string;
  slug: string;
  description: (className: string) => string;
}

interface IClassSpec {
  /** Só as magias cujo único vínculo é esta classe. */
  exclusive?: boolean;
  cantrips: IListSpec;
  spells: IListSpec;
}

const DEFAULT_SPEC: IClassSpec = {
  cantrips: {
    name: 'Truques',
    slug: 'truques',
    description: (name) =>
      `Os truques (magias de círculo 0) que ${name} aprende. Cada nome abre a magia no grimório.`,
  },
  spells: {
    name: 'Magias',
    slug: 'magias',
    description: (name) =>
      `As magias de 1º círculo em diante que ${name} aprende, em ordem de círculo. Cada nome abre a magia no grimório.`,
  },
};

const CLASS_SPECS: Record<string, IClassSpec> = {
  bardo: {
    exclusive: true,
    cantrips: {
      name: 'Jingles',
      slug: 'jingles',
      description: () =>
        'Os jingles: músicas de nível 0 que só o bardo conhece. Não consomem slots de magia e podem ser usados novamente. Cada nome abre a magia no grimório. Ver a característica Jingles.',
    },
    spells: {
      name: 'Músicas',
      slug: 'musicas',
      description: () =>
        'As músicas de bardo: magias de 1º círculo em diante que só o bardo conhece, em ordem de círculo. Cada nome abre a magia no grimório. Ver a característica Músicas para como aprendê-las e executá-las.',
    },
  },
};

interface ISpellRow {
  name: string;
  slug: string;
  circle: number;
  classIds?: unknown[];
}

const sameItems = (a: IClassCatalogItem[] = [], b: IClassCatalogItem[]) =>
  a.length === b.length &&
  a.every((item, i) => item.name === b[i].name && item.spell === b[i].spell);

async function main() {
  const apply = process.argv.includes('--apply');
  const uri = getConnectionString();
  if (!uri) throw new Error('Conexão com o banco não configurada no .env.');
  await mongoose.connect(uri);

  // 1. Vínculos.
  const link = await linkSpellsToClasses({ dryRun: !apply });
  console.log(
    `Vínculos: ${link.scanned} magias lidas, ${link.updated} ${apply ? 'atualizadas' : 'a atualizar'}.`
  );
  if (link.unmatched.length > 0) {
    console.log('Nomes de classe que não casaram (as magias ficam sem eles):');
    for (const u of link.unmatched) {
      console.log(`  "${u.token}" × ${u.count}: ${u.spells.join(', ')}`);
    }
  }

  // Em dry-run o passo 1 não gravou; o resto lê o que já está no banco.
  const spells = await SpellModel.find()
    .select('name slug circle classIds')
    .lean<ISpellRow[]>();
  const byCircle = (a: ISpellRow, b: ISpellRow) =>
    a.circle - b.circle || a.name.localeCompare(b.name, 'pt-BR');

  // 2. Listas.
  const classes = await CharacterClassModel.find()
    .select('_id name slug catalogs')
    .lean<
      {
        _id: unknown;
        name: string;
        slug: string;
        catalogs?: IClassCatalog[];
      }[]
    >();

  for (const klass of classes) {
    const id = String(klass._id);
    const spec = CLASS_SPECS[klass.slug] ?? DEFAULT_SPEC;
    const own = spells
      .filter((s) => {
        const ids = (s.classIds ?? []).map(String);
        if (!ids.includes(id)) return false;
        return spec.exclusive ? ids.length === 1 : true;
      })
      .sort(byCircle);

    const toItem = (s: ISpellRow): IClassCatalogItem => ({
      name: s.name,
      spell: s.slug,
    });
    const lists: IClassCatalog[] = [];
    const cantrips = own.filter((s) => s.circle === 0).map(toItem);
    const higher = own.filter((s) => s.circle > 0).map(toItem);
    for (const [list, items] of [
      [spec.spells, higher],
      [spec.cantrips, cantrips],
    ] as const) {
      if (items.length === 0) continue;
      lists.push({
        name: list.name,
        slug: list.slug,
        description: list.description(klass.name),
        items,
      });
    }

    const managed = new Set([spec.cantrips.slug, spec.spells.slug]);
    const current = klass.catalogs ?? [];
    const others = current.filter((c) => !managed.has(c.slug));
    const changed =
      lists.length !== current.filter((c) => managed.has(c.slug)).length ||
      lists.some((list) => {
        const before = current.find((c) => c.slug === list.slug);
        return (
          !before ||
          before.description !== list.description ||
          !sameItems(before.items, list.items ?? [])
        );
      });

    if (lists.length === 0 && !changed) continue;
    console.log(
      `${klass.name}: ${lists.map((l) => `${l.name} ${l.items?.length}`).join(', ') || 'sem magias'}${changed ? '' : ' (sem mudança)'}`
    );
    if (!changed || !apply) continue;

    await CharacterClassModel.updateOne(
      { _id: klass._id },
      { $set: { catalogs: [...lists, ...others] } },
      { runValidators: true }
    );
  }

  if (!apply) console.log('\nNada gravado. Rode com --apply para gravar.');
  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
