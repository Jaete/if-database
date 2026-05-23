// src/scripts/seed-creatures.ts
import 'dotenv/config';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// OU carrega múltiplos arquivos (ordem de prioridade)
dotenv.config({
  path: [
    path.resolve(process.cwd(), '.env.local'),
    path.resolve(process.cwd(), '.env'),
  ],
});

import { connectDB } from '@/lib/db';
import {
  IAbilities,
  IDrops,
  ISenses,
  IStats,
} from '@/db/creatures/creatures.d';
import CreatureDB from './creature-data';
import IMonster from '@/db/monsters/monster';
import Monster from '@/db/monsters/monsters';

// Mapeamento de tradução PT-BR → EN para stats
const STATS_MAP: Record<string, keyof IStats> = {
  forca: 'str',
  destreza: 'dex',
  constituicao: 'con',
  inteligencia: 'int',
  sabedoria: 'wis',
  carisma: 'cha',
} as const;

// Mapeamento de tradução para sentidos
const SENSES_MAP: Record<string, keyof ISenses> = {
  percepcaoPassiva: 'passivePerception',
  visaoEscuro: 'darkvision',
} as const;

/**
 * Limpa URLs removendo espaços extras
 */
const cleanUrl = (url?: string): string | undefined => url?.trim();

/**
 * Transforma stats do formato PT-BR para EN
 */
const transformStats = (
  rawStats?: Record<string, string>
): IStats | undefined => {
  if (!rawStats) return undefined;

  const stats: Partial<IStats> = {};

  Object.entries(rawStats).forEach(([key, value]) => {
    const enKey = STATS_MAP[key];
    if (enKey) {
      stats[enKey] = value;
    }
  });

  return stats as IStats;
};

/**
 * Transforma array de habilidades/acoes para o schema
 */
const transformAbilities = (
  rawAbilities?: Array<{ nome?: string; desc?: string }>
): Array<IAbilities> | undefined => {
  if (!rawAbilities) return undefined;

  return rawAbilities.map(({ nome, desc }) => ({
    name: nome,
    description: desc,
  }));
};

/**
 * Transforma sentidos para o schema
 */
const transformSenses = (
  rawSenses?: Record<string, string>
): ISenses | undefined => {
  if (!rawSenses) return undefined;

  const senses: Partial<ISenses> = {};

  Object.entries(rawSenses).forEach(([key, value]) => {
    const enKey = SENSES_MAP[key];
    if (enKey) {
      senses[enKey] = value;
    }
  });

  return senses as ISenses;
};

/**
 * Transforma drops mantendo estrutura
 */
const transformDrops = (
  rawDrops?: Array<{ range?: string; item?: string }>
): Array<IDrops> | undefined => {
  if (!rawDrops) return undefined;

  return rawDrops.map(({ range, item }) => ({
    range,
    item,
  }));
};

/**
 * Transforma um criatura do formato original para o schema IMonster
 */
const transformMonster = (
  slug: string,
  raw: Record<string, unknown>
): Partial<IMonster> => {
  const stats = transformStats(raw.stats as Record<string, string>);
  const habilidades = transformAbilities(
    raw.habilidades as Array<{ nome?: string; desc?: string }>
  );
  const acoes = transformAbilities(
    raw.acoes as Array<{ nome?: string; desc?: string }>
  );
  const sentidos = transformSenses(raw.sentidos as Record<string, string>);
  const drops = transformDrops(
    raw.drops as Array<{ range?: string; item?: string }>
  );

  return {
    slug,
    name: String(raw.name ?? ''),
    rarity: String(raw.rarity ?? ''),
    icon: cleanUrl(raw.icon as string),
    image: cleanUrl(raw.image as string),
    subtitle: raw.subtitle as string | undefined,
    description: raw.description as string | undefined,
    combat: {
      type: raw.type as string | undefined,
      ac: raw.ac as string | undefined,
      hp: raw.hp as string | undefined,
      speed: raw.speed as string | undefined,
    },
    stats,
    abilities: habilidades,
    actions: acoes,
    senses: sentidos,
    drops,
  };
};

/**
 * Função principal de seed
 */
const seedMonsters = async (): Promise<void> => {
  try {
    console.log('🔄 Conectando ao MongoDB...');
    await connectDB();

    console.log(
      `📦 Transformando ${Object.keys(CreatureDB).length} criaturas...`
    );

    const monstersToInsert = Object.entries(CreatureDB).map(([slug, data]) =>
      transformMonster(slug, data)
    );

    console.log('🧹 Limpando coleção "monsters"...');
    await Monster.deleteMany({});

    console.log('🚀 Inserindo no MongoDB...');
    const result = await Monster.insertMany(monstersToInsert, {
      ordered: false,
      lean: true,
    });

    console.log(`✅ Sucesso! ${result.length} criaturas inseridos.`);

    console.log('\n📋 Criaturas inseridos:');
    result.forEach((creature, index) => {
      console.log(`  ${index + 1}. ${creature.slug}`);
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Erro desconhecido';

    console.error('❌ Erro no seed:', errorMessage);

    process.exit(1);
  } finally {
    process.exit(0);
  }
};

// Executa o seed
void seedMonsters();
