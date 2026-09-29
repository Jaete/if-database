/**
 * Conserta as defesas gravadas pelo seed antes da correção de
 * `scripts/seedMonsters.ts`, que separava a descrição por `/[,;e]/` — a letra
 * "e" dentro da classe de caracteres. Resultado no banco: "Gelo" virou
 * ["G", "lo"], "Veneno" virou ["V", "n", "no"], e assim por diante.
 *
 * A quebra não é reversível a partir do banco (não dá para saber se um limite
 * veio de vírgula ou da letra "e"), então o conserto recalcula as defesas a
 * partir de `scripts/creature-data.ts`, que é a fonte original e está intacta.
 *
 * Só mexe em monstros cujo slug existe na fonte e cujas defesas estão
 * diferentes do que a fonte produz — edições manuais posteriores em criaturas
 * fora da fonte ficam de lado.
 *
 * NÃO é o seed: `seedMonsters.ts` faz `deleteMany({})` e recria tudo. Este
 * script só faz `findOne` por slug e reescreve o campo `defenses`. Monstros
 * fora da fonte nem chegam a ser visitados, e nenhum outro campo é tocado.
 * Antes de gravar, salva as defesas atuais em um JSON para dar marcha a ré.
 *
 * Uso:
 *   npx tsx ./scripts/repairDefenses.ts          # só relata (padrão)
 *   npx tsx ./scripts/repairDefenses.ts --apply  # grava
 */
import 'dotenv/config';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { connectDB } from '@/lib/db';
import CreatureDB from './creature-data';
import Monster from '@/db/monsters/monsters';

interface IDefenses {
  vulnerabilities: string[];
  resistances: string[];
  damageImmunities: string[];
  conditionImmunities: string[];
}

// Mesma derivação de seedMonsters.ts, já com o separador correto.
function defensesFromAbilities(
  abilities: Array<{ nome?: string; desc?: string }>
): IDefenses {
  const out: IDefenses = {
    vulnerabilities: [],
    resistances: [],
    damageImmunities: [],
    conditionImmunities: [],
  };

  abilities.forEach(({ nome, desc }) => {
    if (!nome || !desc) return;
    const lowerNome = nome.toLowerCase();
    const cleanDesc = desc
      .split(/[,;]/)
      .map((d) => d.trim())
      .filter(Boolean);

    if (lowerNome.includes('vulnerabilidade')) {
      out.vulnerabilities.push(...cleanDesc);
    } else if (
      lowerNome.includes('resistência') ||
      lowerNome.includes('resistências')
    ) {
      out.resistances.push(...cleanDesc);
    } else if (
      lowerNome.includes('imunidade') ||
      lowerNome.includes('imunidades')
    ) {
      if (lowerNome.includes('condição') || lowerNome.includes('condições')) {
        out.conditionImmunities.push(...cleanDesc);
      } else {
        out.damageImmunities.push(...cleanDesc);
      }
    }
  });

  return out;
}

const same = (a: string[] = [], b: string[] = []) =>
  a.length === b.length && a.every((item, i) => item === b[i]);

async function main() {
  const apply = process.argv.includes('--apply');

  await connectDB();

  const source = CreatureDB as unknown as Record<
    string,
    { name?: string; habilidades?: Array<{ nome?: string; desc?: string }> }
  >;

  let checked = 0;
  let changed = 0;
  let missing = 0;
  const backup: Record<string, unknown> = {};

  for (const [slug, raw] of Object.entries(source)) {
    const doc = await Monster.findOne({ slug });
    if (!doc) {
      missing += 1;
      continue;
    }

    checked += 1;

    const next = defensesFromAbilities(raw.habilidades ?? []);
    const current = (doc.defenses ?? {}) as Partial<IDefenses>;

    const differs = (Object.keys(next) as Array<keyof IDefenses>).some(
      (key) => !same(current[key] ?? [], next[key])
    );

    if (!differs) continue;

    changed += 1;
    backup[slug] = current;
    console.log(`\n${raw.name ?? slug} (${slug})`);
    (Object.keys(next) as Array<keyof IDefenses>).forEach((key) => {
      const before = current[key] ?? [];
      if (same(before, next[key])) return;
      console.log(`  ${key}`);
      console.log(`    antes:  ${JSON.stringify(before)}`);
      console.log(`    depois: ${JSON.stringify(next[key])}`);
    });

    if (apply) {
      doc.defenses = next;
      await doc.save();
    }
  }

  if (apply && changed > 0) {
    const file = path.resolve(
      process.cwd(),
      `defenses-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
    );
    fs.writeFileSync(file, JSON.stringify(backup, null, 2), 'utf-8');
    console.log(`\nDefesas anteriores salvas em ${file}`);
  }

  console.log(
    `\n${checked} monstros conferidos, ${changed} com defesas divergentes, ` +
      `${missing} slugs da fonte sem documento no banco.`
  );
  console.log(
    apply
      ? 'Alterações gravadas.'
      : 'Nada foi gravado. Rode de novo com --apply para aplicar.'
  );

  const { disconnectDB } = await import('@/lib/db');
  await disconnectDB();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
