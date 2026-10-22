'use server';

import CharacterClassModel from '../db/classes/classes';
import SpellModel from '../db/spells/spells';
import type ICharacterClass from '../db/classes/class.d';
import type ISpell from '../db/spells/spell.d';
import { normalizeClassName, splitSpellClasses } from '../db/l10n/classes';
import { ForumSheetError } from './forumSheet.service';

export interface IClassLinkReport {
  scanned: number;
  updated: number;
  /** Slug da classe → quantas magias ficaram ligadas a ela. */
  matched: Record<string, number>;
  /** Nome que não casou com classe nenhuma. */
  unmatched: { token: string; count: number; spells: string[] }[];
}

/**
 * Índice de nome normalizado → id da classe.
 *
 * Inclui o nome e cada variante (`aliases`), que é por onde entram as grafias
 * que o normalizador não alcança sozinho.
 */
async function buildClassIndex(): Promise<Map<string, string>> {
  const classes = await CharacterClassModel.find()
    .select('_id name aliases')
    .lean<ICharacterClass[]>();

  const index = new Map<string, string>();
  for (const klass of classes) {
    const id = String(klass._id);
    index.set(normalizeClassName(klass.name), id);
    for (const alias of klass.aliases ?? []) {
      index.set(normalizeClassName(alias), id);
    }
  }
  return index;
}

/**
 * Deriva os vínculos de magia para classe a partir do texto livre.
 *
 * A seta é sempre `classes` → `classIds`, nunca o contrário: o texto é o que o
 * fórum escreveu, e é o que permite reauditar o casamento depois.
 */
export async function linkSpellsToClasses(options?: {
  dryRun?: boolean;
}): Promise<IClassLinkReport> {
  const index = await buildClassIndex();
  if (index.size === 0) {
    // Sem esta guarda, uma execução antes de cadastrar as classes zeraria o
    // vínculo de todas as magias. A ordem vira propriedade do código, e não
    // disciplina de quem opera.
    throw new ForumSheetError(
      'Nenhuma classe cadastrada. Importe as classes antes de vincular as magias.'
    );
  }

  const spells = await SpellModel.find()
    .select('_id name classes classIds')
    .lean<ISpell[]>();

  const matched: Record<string, number> = {};
  const unmatched = new Map<string, { count: number; spells: string[] }>();
  let updated = 0;

  for (const spell of spells) {
    const ids: string[] = [];
    for (const token of splitSpellClasses(spell.classes)) {
      const id = index.get(token);
      if (id) {
        if (!ids.includes(id)) ids.push(id);
        matched[id] = (matched[id] ?? 0) + 1;
      } else {
        const entry = unmatched.get(token) ?? { count: 0, spells: [] };
        entry.count++;
        if (entry.spells.length < 5) entry.spells.push(spell.name);
        unmatched.set(token, entry);
      }
    }

    // Gravar só quando o conjunto muda: `updatedAt` é usado como detector de
    // edição concorrente neste projeto, e mexer nele à toa em centenas de
    // documentos teria efeito colateral real.
    const current = (spell.classIds ?? []).map(String).sort().join(',');
    if (current === ids.slice().sort().join(',')) continue;

    updated++;
    if (!options?.dryRun) {
      await SpellModel.updateOne(
        { _id: spell._id },
        { $set: { classIds: ids } }
      );
    }
  }

  return {
    scanned: spells.length,
    updated,
    matched,
    unmatched: [...unmatched.entries()]
      .map(([token, v]) => ({ token, ...v }))
      .sort((a, b) => b.count - a.count),
  };
}
