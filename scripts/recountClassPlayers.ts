import 'dotenv/config';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { connectDB } from '../lib/db';
import CharacterClassModel from '../db/classes/classes';
import { recountClassPlayers } from '../db/players/classPlayerCount';

/**
 * Reconstrói `playerCount` de todas as classes a partir das fichas.
 *
 * O model de jogador mantém o número em dia sozinho; este script existe para
 * o backfill inicial e para reparar o contador se alguma escrita passar por
 * fora do Mongoose (um comando direto no shell do banco, por exemplo).
 *
 *   npx tsx ./scripts/recountClassPlayers.ts
 */
async function main() {
  await connectDB();
  await recountClassPlayers();

  const classes = await CharacterClassModel.find()
    .select('name playerCount')
    .sort({ name: 1 })
    .lean<{ name: string; playerCount?: number }[]>();
  for (const klass of classes) {
    console.log(
      `  ${String(klass.playerCount ?? 0).padStart(3)}  ${klass.name}`
    );
  }
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
