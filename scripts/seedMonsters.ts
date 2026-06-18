// src/scripts/seed-creatures.ts
import 'dotenv/config';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

dotenv.config({
  path: [
    path.resolve(process.cwd(), '.env.local'),
    path.resolve(process.cwd(), '.env'),
  ],
});

import { connectDB } from '@/lib/db';
import CreatureDB from './creature-data';
import IMonster from '@/db/monsters/monster';
import Monster from '@/db/monsters/monsters';
import type { IStats, ISenses } from '@/db/creatures/creatures';

// Mapeamento de tradução PT-BR → EN para stats
const STATS_MAP: Record<string, string> = {
  forca: 'str',
  destreza: 'dex',
  constituicao: 'con',
  inteligencia: 'int',
  sabedoria: 'wis',
  carisma: 'cha',
};

// Mapeamento de CR para XP D&D 5e
const CR_XP_MAP: Record<string, number> = {
  '0': 10,
  '1/8': 25,
  '1/4': 50,
  '1/2': 100,
  '1': 200,
  '2': 450,
  '3': 700,
  '4': 1100,
  '5': 1800,
  '6': 2300,
  '7': 2900,
  '8': 3900,
  '9': 5000,
  '10': 5900,
};

interface RawAbility {
  nome?: string;
  desc?: string;
}

interface RawDrop {
  range?: string;
  item?: string;
}

interface RawSentidos {
  percepcaoPassiva?: string;
  visaoEscuro?: string;
}

interface RawCreatureData {
  name?: string;
  subtitle?: string;
  description?: string;
  type?: string;
  ac?: string;
  hp?: string;
  speed?: string;
  stats?: Record<string, string>;
  habilidades?: RawAbility[];
  acoes?: RawAbility[];
  sentidos?: RawSentidos;
  drops?: RawDrop[];
  alignment?: string;
  rarity?: string;
  icon?: string;
  image?: string;
}

const cleanUrl = (url?: string): string | undefined => url?.trim();

const extractNumber = (val?: string): number => {
  if (!val) return 0;
  const match = val.match(/-?\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

const transformStats = (
  rawStats?: Record<string, string>
): Partial<IStats> | undefined => {
  if (!rawStats) return undefined;
  const stats: Record<string, number | undefined> = {};
  Object.entries(rawStats).forEach(([key, value]) => {
    const enKey = STATS_MAP[key];
    if (enKey) {
      stats[enKey] = extractNumber(value);
    }
  });
  return stats as Partial<IStats>;
};

const transformAbilities = (
  rawAbilities?: Array<{ nome?: string; desc?: string }>
) => {
  if (!rawAbilities) return [];
  return rawAbilities.map(({ nome, desc }) => ({
    name: nome,
    description: desc,
  }));
};

const transformMonster = (
  slug: string,
  raw: RawCreatureData
): Partial<IMonster> => {
  const stats = transformStats(raw.stats);
  const traits = transformAbilities(raw.habilidades);
  const actions = transformAbilities(raw.acoes);

  // Extrair CR do subtitle (ex: "CR 1/6", "CR 3")
  let cr = '0';
  const subtitleStr = String(raw.subtitle ?? '');
  const crMatch = subtitleStr.match(/CR\s*([^\s]+)/i);
  if (crMatch) {
    cr = crMatch[1];
  } else if (subtitleStr.startsWith('CR')) {
    cr = subtitleStr.replace('CR', '').trim();
  }

  // Calcular XP com base no CR
  const xp = CR_XP_MAP[cr] || 10;

  // Extrair tamanho e tipo a partir de raw.type (ex: "Criatura Médio, Gosma")
  let size = 'Médio';
  let type = 'Gosma';
  const rawType = String(raw.type || '');
  const sizeMatch = rawType.match(
    /(Miúdo|Pequeno|Médio|Grande|Enorme|Colossal|Gargantuesco)/i
  );
  if (sizeMatch) {
    size = sizeMatch[1];
  }
  const typeParts = rawType.split(',');
  if (typeParts.length > 1) {
    type = typeParts[1].trim();
  } else {
    type =
      rawType
        .replace(
          /(Monstro|Criatura|Miúdo|Pequeno|Médio|Grande|Enorme|Colossal|Gargantuesco)/gi,
          ''
        )
        .replace(/\([^)]*\)/g, '')
        .trim() || 'Gosma';
  }

  // Parse sentidos
  const senses: ISenses = {};
  if (raw.sentidos) {
    if (raw.sentidos.percepcaoPassiva) {
      senses.passivePerception = extractNumber(raw.sentidos.percepcaoPassiva);
    }
    if (raw.sentidos.visaoEscuro) {
      senses.darkvision = extractNumber(raw.sentidos.visaoEscuro);
    }
  }

  // Extrair resistências, imunidades e vulnerabilidades das habilidades passivas
  const vulnerabilities: string[] = [];
  const resistances: string[] = [];
  const damageImmunities: string[] = [];
  const conditionImmunities: string[] = [];

  const rawAbilities =
    (raw.habilidades as Array<{ nome?: string; desc?: string }>) || [];
  rawAbilities.forEach(({ nome, desc }) => {
    if (!nome || !desc) return;
    const lowerNome = nome.toLowerCase();
    const cleanDesc = desc
      .split(/[,;e]/)
      .map((d) => d.trim())
      .filter(Boolean);

    if (lowerNome.includes('vulnerabilidade')) {
      vulnerabilities.push(...cleanDesc);
    } else if (
      lowerNome.includes('resistência') ||
      lowerNome.includes('resistências')
    ) {
      resistances.push(...cleanDesc);
    } else if (
      lowerNome.includes('imunidade') ||
      lowerNome.includes('imunidades')
    ) {
      if (lowerNome.includes('condição') || lowerNome.includes('condições')) {
        conditionImmunities.push(...cleanDesc);
      } else {
        damageImmunities.push(...cleanDesc);
      }
    }
  });

  // Parse velocidades (ex: "6m", "9m, 15m natação", "9m escalar 9m")
  const speedStr = String(raw.speed || '6m');
  const walkMatch = speedStr.match(/(\d+)m/);
  const walkSpeed = walkMatch ? parseInt(walkMatch[1], 10) * 5 : 30; // convert to feet: 6m ~ 30 feet (1.5m = 5 feet)

  const climbMatch = speedStr.match(/escalar\s*(\d+)m/i);
  const climbSpeed = climbMatch ? parseInt(climbMatch[1], 10) * 5 : undefined;

  const swimMatch = speedStr.match(/(\d+)m\s*natação/i);
  const swimSpeed = swimMatch ? parseInt(swimMatch[1], 10) * 5 : undefined;

  // Drops (range e item)
  const drops = ((raw.drops as Array<{ range?: string; item?: string }>) || [])
    .filter(
      (d) =>
        d.item &&
        d.item.toLowerCase() !== 'nada' &&
        d.item.toLowerCase() !== 'nada.'
    )
    .map((d, index, arr) => {
      return {
        item: d.item,
        range: d.range || `${index + 1}~${arr.length}`,
      };
    });

  // AC e HP
  const acVal = extractNumber(raw.ac);
  const hpVal = extractNumber(raw.hp);

  return {
    slug,
    name: String(raw.name ?? ''),
    size,
    type,
    alignment: raw.alignment || 'Neutro',
    rarity: String(raw.rarity ?? 'Comum'),
    icon: cleanUrl(raw.icon),
    image: cleanUrl(raw.image),
    subtitle: raw.subtitle,
    description: raw.description,
    cr,
    xp,
    combat: {
      ac: {
        value: acVal,
        formula: raw.ac || `${acVal}`,
      },
      hp: {
        value: hpVal,
        formula: raw.hp || `${hpVal}`,
      },
      speed: {
        walk: walkSpeed,
        climb: climbSpeed,
        swim: swimSpeed,
        note: speedStr,
      },
    },
    stats,
    proficiencies: {
      savingThrows: [],
      skills: [],
    },
    defenses: {
      vulnerabilities,
      resistances,
      damageImmunities,
      conditionImmunities,
    },
    senses,
    languages: ['Comum'],
    traits,
    actions,
    bonusActions: [],
    reactions: [],
    legendaryActions: [],
    drops,
  };
};

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

    console.log('\n🔍 Dados transformados (primeiro item):');
    console.log(JSON.stringify(monstersToInsert[0], null, 2));

    console.log('\n🧹 Limpando coleção "monsters"...');
    const deleteResult = await Monster.deleteMany({});
    console.log(`   Documentos removidos: ${deleteResult.deletedCount}`);

    console.log('\n🚀 Inserindo no MongoDB...');
    console.log(
      `   Quantidade de documentos para inserir: ${monstersToInsert.length}`
    );

    const result = await Monster.insertMany(monstersToInsert, {
      ordered: false,
      lean: true,
    });

    console.log(`\n✅ Sucesso! ${result.length} criaturas inseridas.`);

    console.log('\n⏳ Aguardando sincronização com o Atlas...');
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log('✅ Script finalizado com sucesso.');

    const { disconnectDB } = await import('@/lib/db');
    await disconnectDB();

    process.exit(0);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Erro desconhecido';

    console.error('❌ Erro no seed:', errorMessage);
    process.exit(1);
  }
};

void seedMonsters();
