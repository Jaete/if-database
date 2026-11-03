import 'dotenv/config';
import mongoose from 'mongoose';
import { getConnectionString } from '../lib/db';
import CharacterClassModel from '../db/classes/classes';
import type { IClassCatalog } from '../db/classes/class.d';

/**
 * Grava `kind` e `icon` nas listas de classe que ainda não têm tipo.
 *
 * Lista em que todo item aponta para uma magia vira `magias` (ícone livro);
 * as demais viram `habilidades` (ícone lista). Idempotente: só toca listas sem
 * `kind`. Sem `--apply` só relata.
 *
 *   npx tsx ./scripts/migrateCatalogKinds.ts
 *   npx tsx ./scripts/migrateCatalogKinds.ts --apply
 */
async function main() {
  const apply = process.argv.includes('--apply');
  const uri = getConnectionString();
  if (!uri) throw new Error('Conexão com o banco não configurada no .env.');
  await mongoose.connect(uri);

  const operations: Parameters<typeof CharacterClassModel.bulkWrite>[0] = [];
  const classes = await CharacterClassModel.find({
    'catalogs.0': { $exists: true },
  }).lean();

  for (const characterClass of classes) {
    const $set: Record<string, string> = {};
    (characterClass.catalogs ?? []).forEach(
      (catalog: IClassCatalog, i: number) => {
        if (catalog.kind) return;
        const items = catalog.items ?? [];
        const spells = items.length > 0 && items.every((item) => item.spell);
        $set[`catalogs.${i}.kind`] = spells ? 'magias' : 'habilidades';
        if (!catalog.icon)
          $set[`catalogs.${i}.icon`] = spells ? 'spellbook' : 'list';
        console.log(
          `${characterClass.name}: ${catalog.name} -> ${spells ? 'magias' : 'habilidades'}`
        );
      }
    );
    if (Object.keys($set).length > 0) {
      operations.push({
        updateOne: { filter: { _id: characterClass._id }, update: { $set } },
      });
    }
  }

  if (apply && operations.length > 0) {
    await CharacterClassModel.bulkWrite(operations);
  }
  console.log(
    `${operations.length} classes ${apply ? 'atualizadas' : 'a atualizar'}.`
  );
  if (!apply) console.log('Nada gravado. Rode com --apply para gravar.');
  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
