import 'dotenv/config';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { connectDB } from '../lib/db';
import RaceModel from '../db/races/races';

/**
 * "Concede na criação" dos Humanos, por decisão da mesa:
 *   - Humanos (base): 1 escolha versátil ("Versatilidade Adaptativa") e 1
 *     talento geral ("Talentosos");
 *   - Humanos comuns (sub-raça): 1 perícia extra ("Variedade Genética").
 *
 * Idempotente: só grava o que difere, e registra antes/depois. `--dry` só mostra.
 *
 *   npx tsx ./scripts/applyRaceCreationGrants.ts [--dry]
 */
const RACE = 'humanos';
const BASE = 'versatil:1=Versatilidade Adaptativa, talentos:1=Talentosos';
const SUBRACE = {
  slug: 'humanos-comuns',
  grants: 'pericias:1=Variedade Genética',
};

async function main() {
  const dry = process.argv.includes('--dry');
  await connectDB();
  const race = await RaceModel.findOne({ slug: RACE })
    .select(
      'name creationGrants subraces.slug subraces.name subraces.creationGrants'
    )
    .lean<{
      name: string;
      creationGrants?: string;
      subraces: { slug: string; name: string; creationGrants?: string }[];
    }>();
  if (!race) throw new Error(`raça não encontrada: ${RACE}`);
  const sub = race.subraces.find((s) => s.slug === SUBRACE.slug);
  if (!sub) throw new Error(`sub-raça não encontrada: ${SUBRACE.slug}`);

  const changes: [string, string | undefined, string][] = [];
  if (race.creationGrants !== BASE) {
    changes.push([`${race.name} (base)`, race.creationGrants, BASE]);
  }
  if (sub.creationGrants !== SUBRACE.grants) {
    changes.push([sub.name, sub.creationGrants, SUBRACE.grants]);
  }
  if (changes.length === 0) {
    console.log('  =  Humanos: já está certo');
  }
  for (const [what, before, after] of changes) {
    console.log(
      `  ~  ${what}\n       creationGrants: ${JSON.stringify(before ?? null)} -> ${JSON.stringify(after)}`
    );
  }
  if (!dry && changes.length > 0) {
    await RaceModel.updateOne(
      { slug: RACE },
      {
        $set: {
          creationGrants: BASE,
          'subraces.$[s].creationGrants': SUBRACE.grants,
        },
      },
      { arrayFilters: [{ 's.slug': SUBRACE.slug }] }
    );
    const after = await RaceModel.findOne({ slug: RACE })
      .select('creationGrants subraces.slug subraces.creationGrants')
      .lean<{
        creationGrants?: string;
        subraces: { slug: string; creationGrants?: string }[];
      }>();
    const okBase = after?.creationGrants === BASE;
    const okSub =
      after?.subraces.find((s) => s.slug === SUBRACE.slug)?.creationGrants ===
      SUBRACE.grants;
    if (!okBase || !okSub) {
      console.error('!! a gravação não conferiu');
      process.exitCode = 1;
    }
  }
  console.log(
    `\n${dry ? '[dry] ' : ''}${changes.length} campo(s) ${dry ? 'mudariam' : 'alterados'}.`
  );
  process.exit(process.exitCode ?? 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
