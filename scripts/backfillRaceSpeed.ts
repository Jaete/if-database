import 'dotenv/config';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import type { Types } from 'mongoose';
import { connectDB } from '../lib/db';
import PlayerModel from '../db/players/players';
import { getRaceCatalog } from '../services/race.service';
import { effectiveSubrace, raceSpeed } from '../lib/raceRules';

/**
 * Lista o deslocamento que a raça daria às fichas ligadas a uma raça e SEM
 * deslocamento (aprovadas ou em criação). Por padrão NÃO grava nada: só mostra
 * o que gravaria. Gravar exige as duas travas: `--write` E ALLOW_DB_WRITES=1.
 * Idempotente (só toca ficha sem `combat.speed.walk`).
 *
 *   npx tsx ./scripts/backfillRaceSpeed.ts
 *   ALLOW_DB_WRITES=1 npx tsx ./scripts/backfillRaceSpeed.ts --write
 */
async function main() {
  const write =
    process.argv.includes('--write') && process.env.ALLOW_DB_WRITES === '1';
  if (process.argv.includes('--write') && !write) {
    console.error(
      'Recusado: --write exige ALLOW_DB_WRITES=1. Rodando em seco.'
    );
  }
  await connectDB();
  const races = new Map((await getRaceCatalog()).map((r) => [r.id, r]));
  const sheets = await PlayerModel.find({
    raceId: { $exists: true, $ne: null },
    'combat.speed.walk': { $exists: false },
  })
    .select('slug name status raceId raceChoice')
    .lean<
      {
        _id: Types.ObjectId;
        slug: string;
        name?: string;
        status?: string;
        raceId?: unknown;
        raceChoice?: { subrace?: string };
      }[]
    >();
  let would = 0;
  for (const sheet of sheets) {
    const race = races.get(String(sheet.raceId));
    if (!race) continue;
    const speed = raceSpeed(
      race,
      effectiveSubrace(race, sheet.raceChoice?.subrace)
    );
    const label = `${sheet.name || sheet.slug} [${sheet.status ?? 'sem status'}] ${race.name}`;
    if (speed.walk === undefined && Object.keys(speed).length === 0) {
      console.log(`  -  ${label}: a raça não define deslocamento`);
      continue;
    }
    would += 1;
    console.log(`  ~  ${label}: ${JSON.stringify(speed)}`);
    if (write) {
      await PlayerModel.updateOne(
        { _id: sheet._id, 'combat.speed.walk': { $exists: false } },
        { $set: { 'combat.speed': speed } }
      );
    }
  }
  console.log(
    `\n${write ? '' : '[dry] '}${would} ficha(s) ${write ? 'alteradas' : 'receberiam deslocamento'}.`
  );
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
