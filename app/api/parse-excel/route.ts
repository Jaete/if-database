import { NextResponse } from 'next/server';
import * as xlsx from 'xlsx';
import type IMonster from '@/db/monsters/monster.d';

type IStats = NonNullable<IMonster['stats']>;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const data = xlsx.utils.sheet_to_json<unknown[]>(sheet, { header: 1 });

    const parsedData: Partial<IMonster> = {
      stats: {},
      senses: {},
      combat: {
        ac: {},
        hp: {},
        speed: {},
      },
      traits: [],
      actions: [],
      legendaryActions: [],
      drops: [],
    };

    let currentSection = '';

    for (const row of data) {
      if (!row || row.length === 0) continue;

      const key = row[0]?.toString().trim();
      const val = row[1]?.toString().trim();

      if (!key) continue;

      if (!val) {
        currentSection = key;
        continue;
      }

      if (currentSection === '') {
        if (key === 'Título') parsedData.name = val;
        if (key === 'Nível') parsedData.cr = val;
        if (key === 'Tamanho') parsedData.size = val;
        if (key === 'Tipo') parsedData.type = val;
        if (key === 'Tendência') parsedData.alignment = val;
      } else if (currentSection === 'Características Principais') {
        parsedData.description =
          (parsedData.description ? parsedData.description + '\n' : '') +
          `${key}: ${val}`;
      } else if (currentSection?.includes('Atributos Base')) {
        const statKeyMap: Record<string, keyof IStats> = {
          for: 'str',
          des: 'dex',
          con: 'con',
          int: 'int',
          sab: 'wis',
          car: 'cha',
        };
        const rawStatKey = key.split(' ')[0].toLowerCase();
        const mappedKey = statKeyMap[rawStatKey];
        if (mappedKey && parsedData.stats) {
          parsedData.stats[mappedKey] = parseInt(val) || 0;
        }
      } else if (currentSection === 'Sentidos e Perícias') {
        const s = parsedData.senses;
        if (s) {
          const getNum = (v: string) => parseInt(v.replace(/\D/g, '')) || 0;
          if (key.includes('Percepção Passiva'))
            s.passivePerception = getNum(val);
          else if (key.includes('Sentido Sísmico')) s.tremorsense = getNum(val);
          else if (key.includes('Visão no Escuro')) s.darkvision = getNum(val);
          else if (key.includes('Visão Verdadeira')) s.truesight = getNum(val);
          else if (key.includes('Percepção às Cegas'))
            s.blindsight = getNum(val);
          else {
            parsedData.description =
              (parsedData.description ? parsedData.description + '\n' : '') +
              `${key}: ${val}`;
          }
        }
      } else if (currentSection === 'Combate') {
        const c = parsedData.combat;
        if (c) {
          if (key.includes('CA')) {
            const valNum = parseInt(val) || 0;
            c.ac = { value: valNum, formula: val };
          } else if (key.includes('PV')) {
            const valNum = parseInt(val) || 0;
            c.hp = { value: valNum, formula: val };
          } else if (key.includes('Deslocamento')) {
            const valNum = parseInt(val) || 0;
            c.speed = { walk: valNum, note: val };
          } else if (key.includes('Tipo de Armadura')) {
            if (c.ac) {
              c.ac.formula = `${c.ac.value || ''} (${val})`;
            }
          } else {
            parsedData.description =
              (parsedData.description ? parsedData.description + '\n' : '') +
              `${key}: ${val}`;
          }
        }
      } else if (currentSection === 'Habilidades Passivas') {
        parsedData.traits?.push({ name: key, description: val });
      } else if (
        currentSection === 'Ações' ||
        currentSection === 'Ações Lendárias'
      ) {
        if (currentSection === 'Ações Lendárias') {
          parsedData.legendaryActions?.push({ name: key, description: val });
        } else {
          parsedData.actions?.push({ name: key, description: val });
        }
      } else if (currentSection === 'Drops e seus usos') {
        const chanceVal = parseInt(val) || 100;
        parsedData.drops?.push({ item: key, chance: chanceVal });
      } else if (currentSection?.includes('Upgrades de Nível')) {
        parsedData.traits?.push({ name: key, description: val });
      }
    }

    return NextResponse.json({ success: true, data: parsedData });
  } catch (error) {
    console.error('Error parsing excel:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Erro ao processar arquivo';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
