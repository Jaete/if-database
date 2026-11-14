import 'dotenv/config';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { connectDB } from '../lib/db';
import CharacterClassModel from '../db/classes/classes';
import { describeSchedule } from '../lib/catalogPicks';

/**
 * Correções das listas de escolha da classe que o leitor de texto não alcança
 * (lib/catalogPicks.ts). As outras listas (Técnicas de Investida, Formas e
 * Poderes de Fúria, Talentos de Dança, Danças Místicas…) saem do texto.
 *
 * Idempotente: só grava o campo que difere, e registra antes/depois. `--dry`
 * só mostra.
 *
 *   npx tsx ./scripts/applyCatalogPickOverrides.ts [--dry]
 */
const OVERRIDES: {
  cls: string;
  catalog: string;
  set: Record<string, unknown>;
}[] = [
  // "A cada dois níveis subsequentes" sem início no texto: a tabela da classe
  // põe Técnicas de Blitz no 7.
  {
    cls: 'monge',
    catalog: 'tecnicas-blitz',
    set: { pickLevels: [7, 9, 11, 13, 15, 17, 19] },
  },
  // Só o monge selvagem escolhe poderes de fúria.
  {
    cls: 'monge',
    catalog: 'habilidades-de-furia-berserker',
    set: { requiresArchetype: 'monge-selvagem' },
  },
  // Duas no 7º e mais uma a cada três níveis (decisão da mesa).
  {
    cls: 'paladino',
    catalog: 'artes-divinas',
    set: { pickLevels: [7, 7, 10, 13, 16, 19] },
  },
  // Ou um tipo adicional de Atuação, escrito à mão.
  {
    cls: 'bardo',
    catalog: 'performances-versateis-avancadas',
    set: { freeTextLabel: 'Outro tipo de Atuação' },
  },
];

async function main() {
  const dry = process.argv.includes('--dry');
  await connectDB();
  let changed = 0;
  for (const o of OVERRIDES) {
    const klass = await CharacterClassModel.findOne({ slug: o.cls })
      .select('name catalogs')
      .lean<{ name: string; catalogs: Record<string, unknown>[] }>();
    const catalog = klass?.catalogs.find((c) => c.slug === o.catalog);
    if (!klass || !catalog) {
      console.error(`!! não encontrada: ${o.cls}/${o.catalog}`);
      process.exitCode = 1;
      continue;
    }
    const diff = Object.entries(o.set).filter(
      ([k, v]) => JSON.stringify(catalog[k] ?? null) !== JSON.stringify(v)
    );
    if (diff.length === 0) {
      console.log(`  =  ${klass.name} / ${catalog.name}: já está certo`);
      continue;
    }
    changed += 1;
    console.log(`  ~  ${klass.name} / ${catalog.name}`);
    for (const [k, v] of diff) {
      console.log(
        `       ${k}: ${JSON.stringify(catalog[k] ?? null)} -> ${JSON.stringify(v)}`
      );
    }
    if (!dry) {
      await CharacterClassModel.updateOne(
        { slug: o.cls },
        {
          $set: Object.fromEntries(
            diff.map(([k, v]) => [`catalogs.$[c].${k}`, v])
          ),
        },
        { arrayFilters: [{ 'c.slug': o.catalog }] }
      );
    }
  }

  // O cronograma final de cada lista de escolha.
  console.log('\nCronograma final (nível ou nível×quantidade):');
  const classes = await CharacterClassModel.find()
    .select('slug catalogs')
    .lean<{ slug: string; catalogs: Record<string, unknown>[] }[]>();
  for (const c of classes) {
    for (const cat of c.catalogs ?? []) {
      const schedule = describeSchedule(cat as never);
      if (schedule) {
        console.log(
          `  ${c.slug} / ${cat.name}: ${schedule}${cat.requiresArchetype ? ` [só ${cat.requiresArchetype}]` : ''}${cat.freeTextLabel ? ` [+ ${cat.freeTextLabel}]` : ''}`
        );
      }
    }
  }
  console.log(
    `\n${dry ? '[dry] ' : ''}${changed} lista(s) ${dry ? 'mudariam' : 'alteradas'}.`
  );
  process.exit(process.exitCode ?? 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
