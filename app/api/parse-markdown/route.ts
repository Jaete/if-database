import { NextResponse } from 'next/server';
import type IMonster from '@/db/monsters/monster.d';
import * as mammoth from 'mammoth';

type IStats = NonNullable<IMonster['stats']>;
type ISenses = NonNullable<IMonster['senses']>;

const getNum = (v: string) => parseInt(v.replace(/\D/g, ''), 10) || 0;

function sectionTitle(raw: string): string {
  // Strip emoji, keep text, accents, and common symbols
  return raw.replace(/[^\w\sáéíóúâêôãõçàèìòùäëïöüñ/\-(),']/gi, '').trim();
}

function cleanKey(raw: string): string {
  // Extract key from "- **Key:** value" or "**Key:** value"
  return raw
    .replace(/^-\s*\*{1,2}/, '')
    .replace(/\*{1,2}:\s*$/, '')
    .trim();
}

function parseTableRow(row: string, colCount: number): string[] | null {
  const cleaned = row.trim();
  if (!cleaned.startsWith('|') || !cleaned.endsWith('|')) return null;
  const parts = cleaned
    .split('|')
    .slice(1, -1)
    .map((s) => s.trim());
  // Skip separator rows (all dashes/pipes/spaces)
  if (parts.every((p) => /^[-:\s]+$/.test(p))) return null;
  return parts.length === colCount ? parts : null;
}

// ─── Markdown Parser ──────────────────────────────────────

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

    // Extract text content (supports .md plain text and .docx)
    let content: string;
    const fileName = file.name.toLowerCase();
    if (fileName.endsWith('.docx')) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const result = await mammoth.extractRawText({ buffer });
      content = result.value;
    } else {
      content = await file.text();
    }
    const lines = content.split('\n');

    const parsedData: Partial<IMonster> & { level?: string } = {
      stats: {},
      senses: {},
      combat: {
        ac: {},
        hp: {},
        speed: {},
      },
      defenses: {},
      proficiencies: {},
      traits: [],
      actions: [],
      bonusActions: [],
      reactions: [],
      legendaryActions: [],
      drops: [],
      spellcasting: {},
      source: {},
    };

    // State machine
    let currentSection = '';
    let currentSubSection = '';
    let currentArrayIndex = -1;

    // For sub-tables in Proficiências
    let profSubSection = '';
    let inProfTable = false;
    let expectProfValue = false;
    let lastProfName = '';

    // For spellcasting sub-sections
    let spellLevelSection = '';

    // For defenses list items
    let defenseSubSection = '';

    // For vertical stats format (docx)
    const STAT_NAMES = [
      'Força',
      'Destreza',
      'Constituição',
      'Inteligência',
      'Sabedoria',
      'Carisma',
    ];
    const STAT_KEYS: (keyof IStats)[] = [
      'str',
      'dex',
      'con',
      'int',
      'wis',
      'cha',
    ];
    let pendingStatNames: string[] = [];

    // Helper: push to the correct array based on section
    const pushArrayItem = (name: string, description: string) => {
      const item = { name, description };
      switch (currentSection) {
        case 'Traços / Habilidades Passivas':
          parsedData.traits?.push(item);
          break;
        case 'Ações':
          parsedData.actions?.push(item);
          break;
        case 'Ações Bônus':
          parsedData.bonusActions?.push(item);
          break;
        case 'Reações':
          parsedData.reactions?.push(item);
          break;
        case 'Ações Lendárias':
          parsedData.legendaryActions?.push(item);
          break;
      }
    };

    // Helper: set nested combat fields
    const setCombat = (key: string, value: string) => {
      const c = parsedData.combat!;
      switch (key) {
        case 'Valor':
          if (currentSubSection === 'Classe de Armadura (AC)') {
            c.ac = { ...c.ac, value: getNum(value), formula: value };
          } else if (currentSubSection === 'Pontos de Vida (HP)') {
            c.hp = { ...c.hp, value: getNum(value), formula: value };
          }
          break;
        case 'Fórmula':
          if (currentSubSection === 'Classe de Armadura (AC)') {
            c.ac = { ...c.ac, formula: value };
          } else if (currentSubSection === 'Pontos de Vida (HP)') {
            c.hp = { ...c.hp, formula: value };
          }
          break;
        case 'Caminhada':
          c.speed = { ...c.speed, walk: getNum(value) };
          break;
        case 'Voo':
          c.speed = { ...c.speed, fly: getNum(value) };
          break;
        case 'Natação':
          c.speed = { ...c.speed, swim: getNum(value) };
          break;
        case 'Escalada':
          c.speed = { ...c.speed, climb: getNum(value) };
          break;
        case 'Escavação':
          c.speed = { ...c.speed, burrow: getNum(value) };
          break;
        case 'Observações':
          c.speed = { ...c.speed, note: value };
          break;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const raw = lines[i];
      const line = raw.trimEnd();

      // ─── Section Headers (## ...) ───────────────────────
      const sectionMatch = line.match(/^##\s+(.+)/);
      if (sectionMatch) {
        currentSection = sectionTitle(sectionMatch[1].trim());
        currentSubSection = '';
        defenseSubSection = '';
        profSubSection = '';
        inProfTable = false;
        expectProfValue = false;
        lastProfName = '';
        spellLevelSection = '';
        currentArrayIndex = -1;
        continue;
      }

      // ─── Sub-Section / Array Item / Defenses Header (### ...)
      const subMatch = line.match(/^###\s+(.+)/);
      if (subMatch) {
        const subTitle = subMatch[1].trim();

        // Check if this is an array item (### N. Name)
        const arrayItemMatch = subTitle.match(/^(\d+)\.\s+(.+)/);
        if (
          arrayItemMatch &&
          (currentSection === 'Traços / Habilidades Passivas' ||
            currentSection === 'Ações' ||
            currentSection === 'Ações Bônus' ||
            currentSection === 'Reações' ||
            currentSection === 'Ações Lendárias')
        ) {
          currentArrayIndex = parseInt(arrayItemMatch[1], 10) - 1;
          const itemName = arrayItemMatch[2].trim();
          pushArrayItem(itemName, '');
          currentSubSection = subTitle;
          continue;
        }

        // Defenses sub-sections
        if (currentSection === 'Defesas') {
          defenseSubSection = subTitle;
          currentSubSection = subTitle;
          continue;
        }

        // Proficiências sub-sections
        if (currentSection === 'Proficiências') {
          profSubSection = subTitle;
          currentSubSection = subTitle;
          inProfTable = false;
          expectProfValue = false;
          lastProfName = '';
          continue;
        }

        // Combat sub-sections
        if (currentSection === 'Combate') {
          currentSubSection = subTitle;
          continue;
        }

        // Spellcasting sub-sections
        if (currentSection === 'Conjuração de Magias') {
          if (subTitle === 'Informações Gerais') {
            currentSubSection = subTitle;
          } else {
            // Spell level: "1. Nome da Ação Bônus" or generic
            currentSubSection = subTitle;
          }
          continue;
        }

        currentSubSection = subTitle;
        continue;
      }

      // ─── Spell Level (#### ...)
      const spellLevelMatch = line.match(/^####\s+(.+)/);
      if (spellLevelMatch && currentSection === 'Conjuração de Magias') {
        spellLevelSection = spellLevelMatch[1].trim();
        continue;
      }

      // ─── Plain section headers (from .docx without ##)
      if (
        !line.startsWith('-') &&
        !line.startsWith('|') &&
        !line.startsWith('*') &&
        !line.startsWith('#')
      ) {
        const cleanedTitle = sectionTitle(line);
        const knownSections = [
          'Informações Básicas',
          'Atributos',
          'Combate',
          'Proficiências',
          'Defesas',
          'Sentidos',
          'Idiomas',
          'Traços / Habilidades Passivas',
          'Ações',
          'Ações Bônus',
          'Reações',
          'Ações Lendárias',
          'Conjuração de Magias',
          'Fonte',
          'Dados Específicos de Monstro',
        ];
        const matchedSection = knownSections.find(
          (s) => s.toLowerCase() === cleanedTitle.toLowerCase()
        );
        if (matchedSection) {
          currentSection = matchedSection;
          currentSubSection = '';
          defenseSubSection = '';
          profSubSection = '';
          inProfTable = false;
          expectProfValue = false;
          lastProfName = '';
          spellLevelSection = '';
          currentArrayIndex = -1;
          pendingStatNames = [];
          continue;
        }

        // Detect defense sub-sections from plain text
        if (currentSection === 'Defesas') {
          const defSubMatch = [
            'Vulnerabilidades',
            'Resistências',
            'Imunidades a Dano',
            'Imunidades a Condição',
          ].find((k) =>
            cleanedTitle
              .toLowerCase()
              .includes(k.toLowerCase().replace(/[()]/g, '').trim())
          );
          if (defSubMatch) {
            defenseSubSection = defSubMatch;
            continue;
          }
        }

        // Detect prof sub-sections
        if (currentSection === 'Proficiências') {
          const lc = cleanedTitle.toLowerCase();
          if (lc.includes('resistência') || lc.includes('salvaguarda')) {
            profSubSection = 'Testes de Resistência';
            continue;
          }
          if (lc.includes('perícia') || lc.includes('skill')) {
            profSubSection = 'Perícias';
            continue;
          }
        }

        // Detect combat sub-sections
        if (currentSection === 'Combate') {
          const lc = cleanedTitle.toLowerCase();
          if (lc.includes('classe de armadura') || lc.includes('armadura')) {
            currentSubSection = 'Classe de Armadura (AC)';
            continue;
          }
          if (
            lc.includes('pontos de vida') ||
            lc.includes('hp') ||
            lc.includes('vida')
          ) {
            currentSubSection = 'Pontos de Vida (HP)';
            continue;
          }
          if (lc.includes('deslocamento')) {
            currentSubSection = 'Deslocamento';
            continue;
          }
        }

        // Detect spellcasting sub-sections
        if (currentSection === 'Conjuração de Magias') {
          const lc = cleanedTitle.toLowerCase();
          if (
            lc.includes('informações gerais') ||
            lc.includes('informacoes gerais')
          ) {
            currentSubSection = 'Informações Gerais';
            continue;
          }
          if (
            lc.includes('magias por nível') ||
            lc.includes('magias por nivel')
          ) {
            currentSubSection = 'Magias por Nível';
            continue;
          }
          // Spell level detection: "Nível 0 (Truques)" etc.
          if (
            currentSubSection === 'Magias por Nível' &&
            /^N[ií]vel/i.test(cleanedTitle)
          ) {
            spellLevelSection = cleanedTitle;
            continue;
          }
        }
      }

      // ─── Table rows
      const tableParts = parseTableRow(line, 2);
      if (tableParts && inProfTable) {
        // Proficiency table row
        const profName = tableParts[0];
        const profValue = getNum(tableParts[1]);
        if (profName && profValue) {
          if (profSubSection === 'Testes de Resistência') {
            parsedData.proficiencies!.savingThrows =
              parsedData.proficiencies!.savingThrows || [];
            parsedData.proficiencies!.savingThrows!.push({
              attribute: profName,
              value: profValue,
            });
          } else if (profSubSection === 'Perícias') {
            parsedData.proficiencies!.skills =
              parsedData.proficiencies!.skills || [];
            parsedData.proficiencies!.skills!.push({
              name: profName,
              value: profValue,
            });
          }
        }
        continue;
      }

      // Detect start of a proficiency table (header row)
      if (
        currentSection === 'Proficiências' &&
        line.includes('|') &&
        !inProfTable
      ) {
        const headerParts = parseTableRow(line, 2);
        if (headerParts) {
          inProfTable = true;
          // Check next line - skip separator
          if (i + 1 < lines.length && /^[\s|:-]+$/.test(lines[i + 1])) {
            i++; // skip separator
          }
        }
        continue;
      }

      // Alternating prof values from docx (name on one line, value on next)
      if (
        currentSection === 'Proficiências' &&
        profSubSection &&
        !inProfTable &&
        line.trim()
      ) {
        const trimmed = line.trim();
        // Skip table header rows
        if (
          [
            'Atributo',
            'Valor',
            'Nome',
            'Perícias',
            'Perícia',
            'Testes de Resistência',
          ].includes(trimmed)
        ) {
          continue;
        }

        if (!expectProfValue) {
          lastProfName = trimmed;
          expectProfValue = true;
          continue;
        } else {
          const profValue = getNum(trimmed);
          if (lastProfName && profValue) {
            if (profSubSection === 'Testes de Resistência') {
              parsedData.proficiencies!.savingThrows =
                parsedData.proficiencies!.savingThrows || [];
              parsedData.proficiencies!.savingThrows!.push({
                attribute: lastProfName,
                value: profValue,
              });
            } else if (profSubSection === 'Perícias') {
              parsedData.proficiencies!.skills =
                parsedData.proficiencies!.skills || [];
              parsedData.proficiencies!.skills!.push({
                name: lastProfName,
                value: profValue,
              });
            }
          }
          expectProfValue = false;
          lastProfName = '';
          continue;
        }
      }

      // Stats table (6 columns) or vertical format
      if (currentSection === 'Atributos') {
        const trimmed = line.trim();
        if (!trimmed) continue;

        // Try table format
        const statRow = parseTableRow(line, 6);
        if (statRow) {
          statRow.forEach((val, idx) => {
            const numVal = parseInt(val, 10);
            if (!isNaN(numVal) && parsedData.stats) {
              parsedData.stats[STAT_KEYS[idx]] = numVal;
            }
          });
          if (i + 1 < lines.length && /^[\s|:-]+$/.test(lines[i + 1])) {
            i++;
          }
          pendingStatNames = [];
          continue;
        }

        // Vertical format: collect stat names, then values
        const statIdx = STAT_NAMES.findIndex(
          (n) => n.toLowerCase() === trimmed.toLowerCase()
        );
        if (
          statIdx >= 0 &&
          pendingStatNames.length < 6 &&
          pendingStatNames.length === statIdx
        ) {
          pendingStatNames.push(trimmed);
          continue;
        }

        // Assign values after 6 names collected
        if (pendingStatNames.length >= 6 && parsedData.stats) {
          const numVal = parseInt(trimmed, 10);
          if (!isNaN(numVal)) {
            const assignIdx = pendingStatNames.length - 6;
            if (assignIdx < 6) {
              parsedData.stats[STAT_KEYS[assignIdx]] = numVal;
              pendingStatNames.push('');
            }
          }
        }

        continue;
      }

      // Drops table (2 columns: Item | Chance)
      if (currentSection === 'Dados Específicos de Monstro') {
        const dropRow = parseTableRow(line, 2);
        if (dropRow) {
          const itemName = dropRow[0];
          // Skip header row
          if (itemName.toLowerCase() === 'item') continue;
          const chanceVal = getNum(dropRow[1]) || 100;
          if (itemName) {
            parsedData.drops?.push({ item: itemName, chance: chanceVal });
          }
          if (i + 1 < lines.length && /^[\s|:-]+$/.test(lines[i + 1])) {
            i++;
          }
          continue;
        }

        // Numbered drops from docx: "1. Item Name" (chance on same or next line)
        const numberedDrop = line.match(/^(\d+)\.\s+(.+)/);
        if (numberedDrop) {
          let itemText = numberedDrop[2].trim();
          // Check for inline chance: "Item (25%)"
          const inlineChance = itemText.match(/^(.+?)\s*\((\d+)%\)\s*$/);
          let chanceVal = 100;
          if (inlineChance) {
            itemText = inlineChance[1].trim();
            chanceVal = parseInt(inlineChance[2], 10);
          } else {
            // Look ahead for "XX%" on next non-empty line
            for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
              const nextLine = lines[j].trim();
              if (!nextLine) continue;
              const chanceMatch = nextLine.match(/^(\d+)%\s*$/);
              if (chanceMatch) {
                chanceVal = parseInt(chanceMatch[1], 10);
                i = j; // skip the chance line
              }
              break;
            }
          }
          // Skip header rows
          if (['Item', 'Espólios', 'Drops', 'Chance'].includes(itemText))
            continue;
          if (itemText) {
            parsedData.drops?.push({ item: itemText, chance: chanceVal });
          }
          continue;
        }
      }

      // ─── Key-Value pairs: "- **Key:** value" or "Key: value" (plain)
      const kvMatch = line.match(/^-\s+\*\*(.+?):\*\*\s*(.*)/);
      const plainKvMatch = !kvMatch
        ? line.match(/^([A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ\s()]+?):\s+(.+)/)
        : null;
      const effectiveKv = kvMatch || plainKvMatch;
      if (effectiveKv) {
        const key = effectiveKv[1].trim();
        const value = effectiveKv[2].trim();

        // If value is empty, skip
        if (!value) continue;

        switch (currentSection) {
          case 'Informações Básicas': {
            if (key === 'Nome') parsedData.name = value;
            else if (key === 'Slug') parsedData.slug = value;
            else if (key === 'Tamanho') parsedData.size = value;
            else if (key === 'Tipo') parsedData.type = value;
            else if (key === 'Tendência') parsedData.alignment = value;
            else if (key === 'Raridade') parsedData.rarity = value;
            else if (key === 'Subtítulo') parsedData.subtitle = value;
            else if (key === 'Descrição') parsedData.description = value;
            else if (key === 'Ícone') parsedData.icon = value;
            else if (key === 'Imagem') parsedData.image = value;
            break;
          }

          case 'Combate': {
            setCombat(key, value);
            break;
          }

          case 'Sentidos': {
            const s = parsedData.senses as ISenses;
            if (key.includes('Percepção Passiva'))
              s.passivePerception = getNum(value);
            else if (key.includes('Visão no Escuro'))
              s.darkvision = getNum(value);
            else if (key.includes('Sentido Cego')) s.blindsight = getNum(value);
            else if (
              key.includes('Senso Sísmico') ||
              key.includes('Sentido Sísmico')
            )
              s.tremorsense = getNum(value);
            else if (key.includes('Visão Verdadeira'))
              s.truesight = getNum(value);
            break;
          }

          case 'Idiomas': {
            parsedData.languages = value
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean);
            break;
          }

          case 'Fonte': {
            if (key === 'Livro') parsedData.source!.book = value;
            else if (key === 'Página') parsedData.source!.page = getNum(value);
            break;
          }

          case 'Conjuração de Magias': {
            if (currentSubSection === 'Informações Gerais') {
              const sc = parsedData.spellcasting!;
              if (key.includes('Atributo')) sc.ability = value;
              else if (key.includes('CD')) sc.saveDC = getNum(value);
              else if (key.includes('Bônus')) sc.attackBonus = getNum(value);
              else if (key.includes('Nível')) sc.casterLevel = getNum(value);
            } else if (spellLevelSection && key === 'Nome') {
              // Spell name under a spell level
              const sc = parsedData.spellcasting!;
              sc.spellLevels = sc.spellLevels || [];
              const levelDetect = (section: string): number | null => {
                const lvl = section.match(/^N[íi]vel (\d+)/);
                if (lvl) return parseInt(lvl[1], 10);
                if (section.includes('Truque') || section.includes('Cantrip'))
                  return 0;
                return null;
              };
              const spellLevel = levelDetect(spellLevelSection);
              if (spellLevel !== null) {
                let levelEntry = sc.spellLevels.find(
                  (l) => l.level === spellLevel
                );
                if (!levelEntry) {
                  levelEntry = { level: spellLevel, spells: [] };
                  sc.spellLevels.push(levelEntry);
                }
                levelEntry.spells = levelEntry.spells || [];
                levelEntry.spells.push({ name: value });
              }
            } else if (spellLevelSection && key === 'Espaços') {
              const sc = parsedData.spellcasting!;
              sc.spellLevels = sc.spellLevels || [];
              const levelDetect = (section: string): number | null => {
                const lvl = section.match(/^N[íi]vel (\d+)/);
                if (lvl) return parseInt(lvl[1], 10);
                if (section.includes('Truque') || section.includes('Cantrip'))
                  return 0;
                return null;
              };
              const spellLevel = levelDetect(spellLevelSection);
              if (spellLevel !== null) {
                let levelEntry = sc.spellLevels.find(
                  (l) => l.level === spellLevel
                );
                if (!levelEntry) {
                  levelEntry = { level: spellLevel, spells: [] };
                  sc.spellLevels.push(levelEntry);
                }
                levelEntry.slots = getNum(value);
              }
            }
            break;
          }

          case 'Dados Específicos de Monstro': {
            if (key === 'Nível de Desafio') parsedData.cr = value;
            else if (key === 'XP') parsedData.xp = getNum(value);
            break;
          }

          // Array item description from plain text (docx)
          default:
            if (key === 'Descrição' && currentArrayIndex >= 0) {
              const updateArrItem = (
                arr?: Array<{ name?: string; description?: string }>
              ) => {
                if (arr && arr[currentArrayIndex]) {
                  arr[currentArrayIndex].description = arr[currentArrayIndex]
                    .description
                    ? arr[currentArrayIndex].description + '\n' + value
                    : value;
                }
              };
              switch (currentSection) {
                case 'Traços / Habilidades Passivas':
                  updateArrItem(parsedData.traits);
                  break;
                case 'Ações':
                  updateArrItem(parsedData.actions);
                  break;
                case 'Ações Bônus':
                  updateArrItem(parsedData.bonusActions);
                  break;
                case 'Reações':
                  updateArrItem(parsedData.reactions);
                  break;
                case 'Ações Lendárias':
                  updateArrItem(parsedData.legendaryActions);
                  break;
              }
            }
            break;
        }
        continue;
      }

      // ─── Indented field continuation for spells: "**Key:** value" or "- **Key:** value"
      // (within Conjuração de Magias, after a spell level header)
      if (currentSection === 'Conjuração de Magias' && spellLevelSection) {
        const spellFieldMatch = line.match(/^\s{2,}\*\*(.+?):\*\*\s*(.*)/);
        const spellListItemMatch = line.match(
          /^\s{2,}-\s+\*\*(.+?):\*\*\s*(.*)/
        );
        const fieldMatch = spellFieldMatch || spellListItemMatch;
        if (fieldMatch) {
          const key = fieldMatch[1].trim();
          const value = fieldMatch[2].trim();
          if (!value) continue;

          const sc = parsedData.spellcasting!;
          sc.spellLevels = sc.spellLevels || [];

          // Detect spell level from section header
          const levelDetect = (section: string): number | null => {
            const lvl = section.match(/^N[íi]vel (\d+)/);
            if (lvl) return parseInt(lvl[1], 10);
            if (section.includes('Truque') || section.includes('Cantrip'))
              return 0;
            return null;
          };

          const spellLevel = levelDetect(spellLevelSection);
          if (spellLevel !== null) {
            if (key === 'Nome') {
              // Spell name - could be on its own or part of a spell entry
              let usage = '';
              let description = '';

              // Check next line for usage
              if (i + 1 < lines.length) {
                const nextLine = lines[i + 1].trim();
                const usageMatch = nextLine.match(
                  /^\s{2,}\*\*(Uso):\*\*\s*(.*)/
                );
                if (usageMatch) {
                  usage = usageMatch[2].trim();
                  i++; // skip usage line
                }
              }
              if (i + 1 < lines.length) {
                const nextLine = lines[i + 1].trim();
                const descMatch = nextLine.match(
                  /^\s{2,}\*\*(Descrição):\*\*\s*(.*)/
                );
                if (descMatch) {
                  description = descMatch[2].trim();
                  i++; // skip description line
                }
              }

              // Find or create spell level entry
              let levelEntry = sc.spellLevels.find(
                (l) => l.level === spellLevel
              );
              if (!levelEntry) {
                levelEntry = { level: spellLevel, spells: [] };
                sc.spellLevels.push(levelEntry);
              }
              levelEntry.spells = levelEntry.spells || [];
              levelEntry.spells.push({
                name: value,
                usage: usage || undefined,
                description: description || undefined,
              });
            } else if (key === 'Espaços') {
              let levelEntry = sc.spellLevels.find(
                (l) => l.level === spellLevel
              );
              if (!levelEntry) {
                levelEntry = { level: spellLevel, spells: [] };
                sc.spellLevels.push(levelEntry);
              }
              levelEntry.slots = getNum(value);
            }
          }
          continue;
        }
      }

      // ─── List items in Defenses / Drops / array item descriptions
      const listMatch = line.match(/^-\s+(.+)/);
      if (listMatch) {
        const listValue = listMatch[1].trim();
        if (!listValue) continue;

        // Defenses list items
        if (currentSection === 'Defesas') {
          const d = parsedData.defenses!;
          switch (defenseSubSection) {
            case 'Vulnerabilidades':
              d.vulnerabilities = d.vulnerabilities || [];
              d.vulnerabilities.push(listValue);
              break;
            case 'Resistências':
              d.resistances = d.resistances || [];
              d.resistances.push(listValue);
              break;
            case 'Imunidades a Dano':
              d.damageImmunities = d.damageImmunities || [];
              d.damageImmunities.push(listValue);
              break;
            case 'Imunidades a Condição':
              d.conditionImmunities = d.conditionImmunities || [];
              d.conditionImmunities.push(listValue);
              break;
          }
          continue;
        }

        // Idiomas list items
        if (currentSection === 'Idiomas') {
          parsedData.languages = parsedData.languages || [];
          parsedData.languages.push(listValue);
          continue;
        }
      }

      // ─── Plain text lines in Defesas / Idiomas (from .docx without "- ")
      if (currentSection === 'Defesas' && defenseSubSection && line.trim()) {
        const trimmed = line.trim();
        const d = parsedData.defenses!;
        switch (defenseSubSection) {
          case 'Vulnerabilidades':
            d.vulnerabilities = d.vulnerabilities || [];
            if (!d.vulnerabilities.includes(trimmed))
              d.vulnerabilities.push(trimmed);
            break;
          case 'Resistências':
            d.resistances = d.resistances || [];
            if (!d.resistances.includes(trimmed)) d.resistances.push(trimmed);
            break;
          case 'Imunidades a Dano':
            d.damageImmunities = d.damageImmunities || [];
            if (!d.damageImmunities.includes(trimmed))
              d.damageImmunities.push(trimmed);
            break;
          case 'Imunidades a Condição':
            d.conditionImmunities = d.conditionImmunities || [];
            if (!d.conditionImmunities.includes(trimmed))
              d.conditionImmunities.push(trimmed);
            break;
        }
        continue;
      }

      // ─── Plain comma-separated text in Idiomas (from .docx)
      if (currentSection === 'Idiomas' && line.trim()) {
        const trimmed = line.trim();
        const parts = trimmed
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
        if (parts.length > 0 && !trimmed.startsWith('#')) {
          parsedData.languages = parsedData.languages || [];
          parts.forEach((p) => {
            if (!parsedData.languages!.includes(p))
              parsedData.languages!.push(p);
          });
          continue;
        }
      }

      // ─── Array items from docx: "N. Name" (without ###)
      const numberItemMatch = line.match(/^(\d+)\.\s+(.+)/);
      if (
        numberItemMatch &&
        [
          'Traços / Habilidades Passivas',
          'Ações',
          'Ações Bônus',
          'Reações',
          'Ações Lendárias',
        ].includes(currentSection)
      ) {
        const name = numberItemMatch[2].trim();
        pushArrayItem(name, '');
        // Set index based on current section's array
        switch (currentSection) {
          case 'Traços / Habilidades Passivas':
            currentArrayIndex = parsedData.traits!.length - 1;
            break;
          case 'Ações':
            currentArrayIndex = parsedData.actions!.length - 1;
            break;
          case 'Ações Bônus':
            currentArrayIndex = parsedData.bonusActions!.length - 1;
            break;
          case 'Reações':
            currentArrayIndex = parsedData.reactions!.length - 1;
            break;
          case 'Ações Lendárias':
            currentArrayIndex = parsedData.legendaryActions!.length - 1;
            break;
        }
        continue;
      }

      // ─── Array item description from docx: "Descrição: value" (without **)
      const plainDescMatch = line.match(/^Descrição:\s*(.*)/);
      if (plainDescMatch && currentArrayIndex >= 0) {
        const descValue = plainDescMatch[1].trim();
        if (descValue) {
          const updateItem = (
            arr?: Array<{ name?: string; description?: string }>
          ) => {
            if (arr && arr[currentArrayIndex]) {
              arr[currentArrayIndex].description = arr[currentArrayIndex]
                .description
                ? arr[currentArrayIndex].description + '\n' + descValue
                : descValue;
            }
          };
          switch (currentSection) {
            case 'Traços / Habilidades Passivas':
              updateItem(parsedData.traits);
              break;
            case 'Ações':
              updateItem(parsedData.actions);
              break;
            case 'Ações Bônus':
              updateItem(parsedData.bonusActions);
              break;
            case 'Reações':
              updateItem(parsedData.reactions);
              break;
            case 'Ações Lendárias':
              updateItem(parsedData.legendaryActions);
              break;
          }
        }
        continue;
      }

      // ─── Array item description continuation: "**Descrição:** value"
      // This comes right after an array item header (### N. Name)
      const descMatch = line.match(/^\*{2}(Descrição|Description):\*\*\s*(.*)/);
      if (descMatch && currentArrayIndex >= 0) {
        const descValue = descMatch[2].trim();
        if (descValue) {
          const updateItem = (
            arr?: Array<{ name?: string; description?: string }>
          ) => {
            if (arr && arr[currentArrayIndex]) {
              arr[currentArrayIndex].description = arr[currentArrayIndex]
                .description
                ? arr[currentArrayIndex].description + '\n' + descValue
                : descValue;
            }
          };
          switch (currentSection) {
            case 'Traços / Habilidades Passivas':
              updateItem(parsedData.traits);
              break;
            case 'Ações':
              updateItem(parsedData.actions);
              break;
            case 'Ações Bônus':
              updateItem(parsedData.bonusActions);
              break;
            case 'Reações':
              updateItem(parsedData.reactions);
              break;
            case 'Ações Lendárias':
              updateItem(parsedData.legendaryActions);
              break;
          }
        }
        continue;
      }
    }

    return NextResponse.json({ success: true, data: parsedData });
  } catch (error) {
    console.error('Error parsing markdown:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Erro ao processar arquivo';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
