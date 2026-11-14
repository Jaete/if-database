import 'dotenv/config';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { connectDB } from '../lib/db';
import CharacterClassModel from '../db/classes/classes';

/**
 * Dados de classe que a criação de ficha precisa, por decisão da mesa:
 *   - correções de vida do 1º nível (Monge, Paladino, Mago Negro);
 *   - `startingGil`: a fórmula do gil inicial rolado na criação;
 *   - `spellcastingAbility`: o atributo de conjuração (CD e ataque mágico).
 *
 * Idempotente: só grava o campo cujo valor difere do desejado, e registra
 * antes/depois de cada classe. Rodar de novo não muda nada. `--dry` só mostra.
 *
 *   npx tsx ./scripts/applyCreationClassData.ts [--dry]
 */

type Patch = {
  hitDie?: string;
  hpAtFirstLevel?: string;
  hpPerLevel?: string;
  startingGil: string;
  spellcastingAbility?: 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';
};

const HUMBLE = '4d6 × 10';
const MIDDLE = '1d100';
const NOBLE = '2d100 + 50';

export const PATCHES: Record<string, Patch> = {
  arqueiro: { startingGil: HUMBLE },
  berserker: { startingGil: HUMBLE },
  druida: { startingGil: HUMBLE, spellcastingAbility: 'wis' },
  geomante: { startingGil: HUMBLE, spellcastingAbility: 'wis' },
  ladrao: { startingGil: HUMBLE },
  dancarino: { startingGil: HUMBLE },
  'cavaleiro-das-trevas': { startingGil: HUMBLE, spellcastingAbility: 'cha' },
  espadachim: { startingGil: MIDDLE },
  guerreiros: { startingGil: MIDDLE },
  atirador: { startingGil: MIDDLE },
  dragoon: { startingGil: MIDDLE },
  bardo: { startingGil: MIDDLE, spellcastingAbility: 'cha' },
  clerigo: { startingGil: MIDDLE, spellcastingAbility: 'wis' },
  'mago-branco': { startingGil: MIDDLE, spellcastingAbility: 'wis' },
  invocador: { startingGil: MIDDLE, spellcastingAbility: 'cha' },
  necromante: { startingGil: MIDDLE, spellcastingAbility: 'cha' },
  cavaleiro: { startingGil: NOBLE },
  paladino: {
    startingGil: NOBLE,
    spellcastingAbility: 'cha',
    hitDie: 'd10',
    hpAtFirstLevel: '10 + modificador de Constituição',
    hpPerLevel: '1d10 (ou 6) + modificador de Constituição por nível',
  },
  'mago-negro': {
    startingGil: NOBLE,
    spellcastingAbility: 'int',
    hpAtFirstLevel: '6 + modificador de Constituição',
  },
  'mago-do-tempo': { startingGil: NOBLE, spellcastingAbility: 'int' },
  ilusionista: { startingGil: NOBLE, spellcastingAbility: 'cha' },
  monge: {
    startingGil: '10d6',
    hpAtFirstLevel: '12 + Modificador de Constituição',
  },
};

const FIELDS = [
  'hitDie',
  'hpAtFirstLevel',
  'hpPerLevel',
  'startingGil',
  'spellcastingAbility',
] as const;

async function main() {
  const dry = process.argv.includes('--dry');
  await connectDB();
  let changed = 0;
  for (const [slug, patch] of Object.entries(PATCHES)) {
    const before = await CharacterClassModel.findOne({ slug })
      .select(`name ${FIELDS.join(' ')}`)
      .lean<Record<string, string | undefined>>();
    if (!before) {
      console.error(`!! classe não encontrada: ${slug}`);
      process.exitCode = 1;
      continue;
    }
    const set: Record<string, string> = {};
    for (const field of FIELDS) {
      const want = patch[field];
      if (want !== undefined && before[field] !== want) set[field] = want;
    }
    if (Object.keys(set).length === 0) {
      console.log(`  =  ${before.name} (${slug}): já está certo`);
      continue;
    }
    changed += 1;
    console.log(`  ~  ${before.name} (${slug})`);
    for (const [field, value] of Object.entries(set)) {
      console.log(
        `       ${field}: ${JSON.stringify(before[field] ?? null)} -> ${JSON.stringify(value)}`
      );
    }
    if (!dry) {
      await CharacterClassModel.updateOne({ slug }, { $set: set });
      const after = await CharacterClassModel.findOne({ slug })
        .select(FIELDS.join(' '))
        .lean<Record<string, string | undefined>>();
      for (const field of Object.keys(set)) {
        if (after?.[field] !== set[field]) {
          console.error(`!! ${slug}.${field} não gravou`);
          process.exitCode = 1;
        }
      }
    }
  }
  console.log(
    `\n${dry ? '[dry] ' : ''}${changed} classe(s) ${dry ? 'mudariam' : 'alteradas'}.`
  );
  process.exit(process.exitCode ?? 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
