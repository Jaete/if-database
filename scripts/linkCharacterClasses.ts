import 'dotenv/config';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { connectDB } from '../lib/db';
import CharacterClassModel from '../db/classes/classes';
import CitizenModel from '../db/citizens/citizens';
import PlayerModel from '../db/players/players';
import { normalizeClassName } from '../db/l10n/classes';

/**
 * Liga as fichas já existentes às classes do códice, casando pelo texto de
 * `class`.
 *
 * Sem `--apply` apenas relata. Nunca cria classe e nunca limpa o texto: o que
 * não casar continua exatamente como está, e aparece no relatório para ser
 * resolvido à mão (criando a classe ou acrescentando uma variante de nome).
 *
 *   npx tsx ./scripts/linkCharacterClasses.ts
 *   npx tsx ./scripts/linkCharacterClasses.ts --apply
 */
async function main() {
  const apply = process.argv.includes('--apply');
  await connectDB();

  const classes = await CharacterClassModel.find()
    .select('_id name aliases')
    .lean<{ _id: unknown; name: string; aliases?: string[] }[]>();

  if (classes.length === 0) {
    console.error('Nenhuma classe cadastrada. Importe as classes primeiro.');
    process.exit(1);
  }

  const index = new Map<string, { id: string; name: string }>();
  for (const klass of classes) {
    const entry = { id: String(klass._id), name: klass.name };
    index.set(normalizeClassName(klass.name), entry);
    for (const alias of klass.aliases ?? []) {
      index.set(normalizeClassName(alias), entry);
    }
  }

  const unmatched = new Map<string, number>();
  let linked = 0;
  let already = 0;

  // Os dois models têm schemas diferentes, e a união deles não é chamável sem
  // um tipo comum. Só três campos são usados aqui.
  interface ISheetDoc {
    _id: unknown;
    name: string;
    class: string;
    classId?: unknown;
  }
  type SheetModel = {
    find: (filter: Record<string, unknown>) => {
      select: (fields: string) => { lean: () => Promise<ISheetDoc[]> };
    };
    updateOne: (
      filter: Record<string, unknown>,
      update: Record<string, unknown>
    ) => Promise<unknown>;
  };

  const collections: [string, SheetModel][] = [
    ['cidadão', CitizenModel as unknown as SheetModel],
    ['jogador', PlayerModel as unknown as SheetModel],
  ];

  for (const [label, Model] of collections) {
    const docs = await Model.find({ class: { $nin: [null, ''] } })
      .select('_id name class classId')
      .lean();

    for (const doc of docs) {
      if (doc.classId) {
        already++;
        continue;
      }
      const match = index.get(normalizeClassName(doc.class));
      if (!match) {
        const key = normalizeClassName(doc.class);
        unmatched.set(key, (unmatched.get(key) ?? 0) + 1);
        continue;
      }

      linked++;
      console.log(
        `  ${label} ${doc.name}: "${doc.class}" → ${match.name}` +
          (match.name === doc.class ? '' : ' (grafia canonizada)')
      );
      if (apply) {
        await Model.updateOne(
          { _id: doc._id },
          { $set: { classId: match.id, class: match.name } }
        );
      }
    }
  }

  console.log(
    `\n${apply ? 'Ligadas' : 'A ligar'}: ${linked} | já ligadas: ${already}`
  );
  if (unmatched.size > 0) {
    console.log('\nSem classe correspondente:');
    for (const [name, count] of [...unmatched].sort((a, b) => b[1] - a[1])) {
      console.log(`  ${String(count).padStart(3)}  ${name}`);
    }
  }
  if (!apply) console.log('\nNada foi gravado. Use --apply para gravar.');
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
