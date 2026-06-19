import { NextResponse } from 'next/server';
import type ICitizen from '@/db/citizens/citizen.d';
import * as mammoth from 'mammoth';

type IStats = NonNullable<ICitizen['stats']>;

const getNum = (v: string) => {
  const cleaned = v.replace(/[^\d-]/g, '');
  return parseInt(cleaned, 10) || 0;
};

function sectionTitle(raw: string): string {
  return raw.replace(/[^\w\sáéíóúâêôãõçàèìòùäëïöüñ/\-(),']/gi, '').trim();
}

function parseTableRow(row: string, colCount: number): string[] | null {
  const cleaned = row.trim();
  if (!cleaned.startsWith('|') || !cleaned.endsWith('|')) return null;
  const parts = cleaned
    .split('|')
    .slice(1, -1)
    .map((s) => s.trim());
  if (parts.every((p) => /^[-:\s]+$/.test(p))) return null;
  return parts.length === colCount ? parts : null;
}

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

    let content: string;
    if (file.name.toLowerCase().endsWith('.docx')) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const result = await mammoth.extractRawText({ buffer });
      content = result.value;
    } else {
      content = await file.text();
    }
    const lines = content.split('\n');

    const parsedData: Record<string, unknown> = {
      stats: {},
      combat: {},
      senses: {},
      defenses: {},
      proficiencies: {},
      abilities: [],
      professions: [],
      equipment: {},
      playerSpellcasting: { spellLevels: [] },
      languages: [],
    };

    let currentSection = '';
    let currentSubSection = '';
    let currentArrayIndex = -1;
    let defenseSubSection = '';
    let profSubSection = '';
    let inProfTable = false;
    let expectProfValue = false;
    let lastProfName = '';
    let inSpellSlotsTable = false;
    let inStatsTable = false;
    let inStatsTableHeader = false;
    const pendingAppearance: string[] = [];
    const pendingBackstory: string[] = [];

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
    const STAT_COL_MAP = [0, 1, 2, 3, 4, 5]; // Valor, +Raça, +Classe, Total, Mod

    const getEquipment = () => {
      if (!parsedData.equipment) parsedData.equipment = {};
      return parsedData.equipment as Record<string, unknown>;
    };

    const getSpellcasting = () => {
      if (!parsedData.playerSpellcasting)
        parsedData.playerSpellcasting = { spellLevels: [] };
      return parsedData.playerSpellcasting as Record<string, unknown>;
    };

    for (let i = 0; i < lines.length; i++) {
      const raw = lines[i];
      const line = raw.trimEnd();

      // ─── Section Headers (## ...) ─────────────────────
      const sectionMatch = line.match(/^##\s+(.+)/);
      if (sectionMatch) {
        currentSection = sectionTitle(sectionMatch[1].trim());
        currentSubSection = '';
        defenseSubSection = '';
        profSubSection = '';
        inProfTable = false;
        expectProfValue = false;
        lastProfName = '';
        currentArrayIndex = -1;
        inSpellSlotsTable = false;
        inStatsTable = false;
        inStatsTableHeader = false;
        continue;
      }

      // ─── Sub-Section Headers (### ...) ────────────────
      const subMatch = line.match(/^###\s+(.+)/);
      if (subMatch) {
        const subTitle = subMatch[1].trim();

        // Array item: ### N. Name (abilities, professions)
        const arrayItemMatch = subTitle.match(/^(\d+)\.\s+(.+)/);
        if (arrayItemMatch) {
          currentArrayIndex = parseInt(arrayItemMatch[1], 10) - 1;
          const itemName = arrayItemMatch[2].trim();

          if (currentSection === 'Habilidades e Características') {
            const abilities =
              (parsedData.abilities as Array<Record<string, string>>) || [];
            abilities.push({ name: itemName, description: '' });
            parsedData.abilities = abilities;
          } else if (currentSection === 'Profissões') {
            const professions =
              (parsedData.professions as Array<Record<string, unknown>>) || [];
            professions.push({ name: itemName, subProfessions: [] });
            parsedData.professions = professions;
          }

          currentSubSection = subTitle;
          continue;
        }

        // Spell slots sub-section
        if (
          currentSection === 'Recursos Principais' &&
          subTitle.toLowerCase().includes('slots')
        ) {
          inSpellSlotsTable = true;
          currentSubSection = subTitle;
          continue;
        }

        // Equipment sub-sections
        if (currentSection === 'Equipamento') {
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
          inProfTable = false;
          expectProfValue = false;
          lastProfName = '';
          continue;
        }

        // Spellcasting general info
        if (currentSection === 'Conjuração de Magias') {
          currentSubSection = subTitle;
          continue;
        }

        currentSubSection = subTitle;
        continue;
      }

      // ─── Plain section detection (from .docx) ─────────
      if (
        !line.startsWith('-') &&
        !line.startsWith('|') &&
        !line.startsWith('*') &&
        !line.startsWith('#') &&
        line.trim()
      ) {
        const cleanedTitle = sectionTitle(line);
        const knownSections = [
          'Informações Básicas',
          'Progressão',
          'Recursos Principais',
          'Atributos',
          'Proficiências',
          'Habilidades e Características',
          'Profissões',
          'Conjuração de Magias',
          'Equipamento',
          'Aparência',
          'História',
          'Defesas',
          'Sentidos',
          'Idiomas',
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
          currentArrayIndex = -1;
          inSpellSlotsTable = false;
          inStatsTable = false;
          inStatsTableHeader = false;
          continue;
        }

        // Detect defense sub-sections
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
      }

      // ─── Spell Slots Table (3 columns: Círculo, Total, Usados) ──
      if (inSpellSlotsTable) {
        const slotRow = parseTableRow(line, 3);
        if (slotRow) {
          const circle = parseInt(slotRow[0], 10);
          const total = parseInt(slotRow[1], 10);
          const used = parseInt(slotRow[2], 10);
          if (!isNaN(circle) && !isNaN(total)) {
            const sc = getSpellcasting();
            const levels =
              (sc.spellLevels as Array<Record<string, unknown>>) || [];
            levels.push({
              level: circle,
              slotsTotal: total,
              slotsUsed: isNaN(used) ? 0 : used,
              spells: [],
            });
            sc.spellLevels = levels;
          }
          continue;
        }
        // If line is blank or separator, stop table
        if (line.trim() === '' || /^[\s|:-]+$/.test(line)) continue;
      }

      // ─── Stats Table (6 columns) ──────────────────────
      if (currentSection === 'Atributos') {
        const statRow = parseTableRow(line, 6);
        if (statRow) {
          const statName = statRow[0].trim();
          const statIdx = STAT_NAMES.findIndex(
            (n) => n.toLowerCase() === statName.toLowerCase()
          );
          if (statIdx >= 0) {
            const key = STAT_KEYS[statIdx];
            const val = parseInt(statRow[1], 10);
            const raceBonus = parseInt(statRow[2], 10);
            const classBonus = parseInt(statRow[3], 10);
            const total = parseInt(statRow[4], 10);
            const mod = parseInt(statRow[5], 10);

            if (!isNaN(val)) {
              // Store simple stat for fallback
              const stats = parsedData.stats as Record<string, number>;
              stats[key] = val;
            }

            if (!isNaN(total)) {
              const playerStats =
                (parsedData.playerStats as Record<string, unknown>) || {};
              playerStats[key] = {
                base: isNaN(val) ? 0 : val,
                raceBonus: isNaN(raceBonus) ? 0 : raceBonus,
                classBonus: isNaN(classBonus) ? 0 : classBonus,
                total,
                modifier: isNaN(mod) ? Math.floor((total - 10) / 2) : mod,
              };
              parsedData.playerStats = playerStats;
            }
          }
          continue;
        }

        // Skip header/separator rows
        if (/^\|/.test(line.trim())) {
          continue;
        }
      }

      // ─── Proficiency Table (2 columns) ────────────────
      const tableParts = parseTableRow(line, 2);
      if (tableParts && inProfTable) {
        const profName = tableParts[0];
        const profValue = getNum(tableParts[1]);
        if (profName && profValue) {
          const profs = parsedData.proficiencies as Record<string, unknown>;
          if (profSubSection === 'Testes de Resistência') {
            const st =
              (profs.savingThrows as Array<Record<string, unknown>>) || [];
            st.push({ attribute: profName, value: profValue });
            profs.savingThrows = st;
          } else if (profSubSection === 'Perícias') {
            const sk = (profs.skills as Array<Record<string, unknown>>) || [];
            sk.push({ name: profName, value: profValue });
            profs.skills = sk;
          }
        }
        continue;
      }

      // Detect start of proficiency table
      if (
        currentSection === 'Proficiências' &&
        line.includes('|') &&
        !inProfTable
      ) {
        const headerParts = parseTableRow(line, 2);
        if (headerParts) {
          inProfTable = true;
          if (i + 1 < lines.length && /^[\s|:-]+$/.test(lines[i + 1])) {
            i++;
          }
        }
        continue;
      }

      // Alternating proficiency values (docx format)
      if (
        currentSection === 'Proficiências' &&
        profSubSection &&
        !inProfTable &&
        line.trim()
      ) {
        const trimmed = line.trim();
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
            const profs = parsedData.proficiencies as Record<string, unknown>;
            if (profSubSection === 'Testes de Resistência') {
              const st =
                (profs.savingThrows as Array<Record<string, unknown>>) || [];
              st.push({ attribute: lastProfName, value: profValue });
              profs.savingThrows = st;
            } else if (profSubSection === 'Perícias') {
              const sk = (profs.skills as Array<Record<string, unknown>>) || [];
              sk.push({ name: lastProfName, value: profValue });
              profs.skills = sk;
            }
          }
          expectProfValue = false;
          lastProfName = '';
          continue;
        }
      }

      // ─── List items in Defenses ────────────────────────
      const listMatch = line.match(/^-\s+(.+)/);
      if (listMatch) {
        const listValue = listMatch[1].trim();
        if (!listValue) continue;

        if (currentSection === 'Defesas') {
          const d = parsedData.defenses as Record<string, string[]>;
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

        if (currentSection === 'Idiomas') {
          const langs = parsedData.languages as string[];
          langs.push(listValue);
          continue;
        }

        // Prepared spells list
        if (
          currentSection === 'Conjuração de Magias' &&
          currentSubSection?.toLowerCase().includes('preparadas')
        ) {
          // It's a spell name
          const sc = getSpellcasting();
          // Add as a generic level 0 or attach directly
          const existingSpells = (sc.preparedSpells as string[]) || [];
          existingSpells.push(listValue);
          sc.preparedSpells = existingSpells;
          continue;
        }
      }

      // ─── Key-Value pairs: "- **Key:** value" or "Key: value" ──
      const kvMatch = line.match(/^-\s+\*\*(.+?):\*\*\s*(.*)/);
      const plainKvMatch = !kvMatch
        ? line.match(/^([A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ\s()]+?):\s+(.*)/)
        : null;
      const effectiveKv = kvMatch || plainKvMatch;
      if (effectiveKv) {
        const key = effectiveKv[1].trim();
        const value = effectiveKv[2].trim();
        if (!value) continue;

        switch (currentSection) {
          case 'Informações Básicas': {
            if (key === 'Nome') parsedData.name = value;
            else if (key === 'Idade') parsedData.age = value;
            else if (key === 'Altura') parsedData.height = value;
            else if (key === 'Classe') parsedData.class = value;
            else if (key === 'Raça') parsedData.race = value;
            else if (key === 'Gênero') parsedData.gender = value;
            else if (key === 'Alinhamento') parsedData.alignment = value;
            else if (key === 'Família') parsedData.family = value;
            else if (key === 'Adoração') parsedData.deity = value;
            else if (key === 'Imagem') parsedData.image = value;
            break;
          }

          case 'Progressão': {
            if (key === 'Nível') parsedData.level = getNum(value);
            else if (key === 'Experiência Atual') {
              const exp =
                (parsedData.experience as Record<string, number>) || {};
              exp.current = getNum(value);
              parsedData.experience = exp;
            } else if (key === 'Experiência Próximo Nível') {
              const exp =
                (parsedData.experience as Record<string, number>) || {};
              exp.nextLevel = getNum(value);
              parsedData.experience = exp;
            }
            break;
          }

          case 'Recursos Principais': {
            const combat = parsedData.combat as Record<string, unknown>;
            if (key === 'HP') {
              combat.hp = { value: getNum(value), formula: value };
            } else if (key === 'Chi Máximo') {
              parsedData.chi = { current: getNum(value), max: getNum(value) };
            } else if (key === 'CA') {
              combat.ac = { value: getNum(value), formula: value };
            } else if (key === 'Velocidade') {
              const speedVal = getNum(value);
              combat.speed = { walk: speedVal || 0 };
              // Also store the raw string
              if (!speedVal) combat.speed = value;
            } else if (key === 'Bônus de Proficiência') {
              parsedData.proficiencyBonus = getNum(value);
            }
            break;
          }

          case 'Proficiências': {
            const profs = parsedData.proficiencies as Record<string, unknown>;
            if (key === 'Armas') {
              profs.weapons = value
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean);
            } else if (key === 'Armaduras') {
              profs.armor = value
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean);
            } else if (key === 'Ferramentas') {
              profs.tools = value
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean);
            }
            break;
          }

          case 'Conjuração de Magias': {
            if (
              currentSubSection === 'Informações Gerais' ||
              currentSubSection?.toLowerCase().includes('informações')
            ) {
              const sc = getSpellcasting();
              if (key.includes('Atributo')) sc.ability = value;
              else if (key.includes('CD')) sc.saveDC = getNum(value);
              else if (key.includes('Bônus')) sc.attackBonus = getNum(value);
              else if (key.includes('Nível') || key.includes('Conjurador'))
                sc.casterLevel = getNum(value);
            }
            break;
          }

          case 'Equipamento': {
            const eq = getEquipment();
            if (currentSubSection === 'Slots' || !currentSubSection) {
              if (key === 'Cabeça') eq.head = value;
              else if (key === 'Tronco') eq.torso = value;
              else if (key === 'Pernas') eq.legs = value;
              else if (key === 'Pés') eq.feet = value;
              else if (key === 'Mão') eq.hand = value;
              else if (key === 'Secundária' || key === 'Offhand')
                eq.offhand = value;
            } else if (
              currentSubSection === 'Inventário' ||
              currentSubSection?.toLowerCase().includes('inventário')
            ) {
              if (key === 'Gil') eq.gil = getNum(value);
              else if (key === 'Mochila') {
                eq.backpack = value
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean);
              }
            }
            break;
          }

          case 'Sentidos': {
            const s = parsedData.senses as Record<string, number>;
            if (key.includes('Percepção Passiva'))
              s.passivePerception = getNum(value);
            else if (key.includes('Visão no Escuro'))
              s.darkvision = getNum(value);
            else if (key.includes('Sentido Cego')) s.blindsight = getNum(value);
            break;
          }
        }
        continue;
      }

      // ─── Description field for array items (abilities, professions) ──
      const descMatch = line.match(/^\*{2}(Descrição|Description):\*\*\s*(.*)/);
      if (descMatch && currentArrayIndex >= 0) {
        const descValue = descMatch[2].trim();
        if (descValue && currentSection === 'Habilidades e Características') {
          const abilities = parsedData.abilities as Array<
            Record<string, string>
          >;
          if (abilities && abilities[currentArrayIndex]) {
            abilities[currentArrayIndex].description = descValue;
          }
        }
        continue;
      }

      // Sub-profissões field
      const subProfMatch = line.match(
        /^\*{2}(Sub-profissões|Sub-profissões|Subprofissões):\*\*\s*(.*)/
      );
      if (
        subProfMatch &&
        currentArrayIndex >= 0 &&
        currentSection === 'Profissões'
      ) {
        const subValue = subProfMatch[2].trim();
        if (subValue) {
          const professions = parsedData.professions as Array<
            Record<string, unknown>
          >;
          if (professions && professions[currentArrayIndex]) {
            const names = subValue
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean);
            professions[currentArrayIndex].subProfessions = names.map(
              (name: string) => ({ name })
            );
          }
        }
        continue;
      }

      // ─── Plain text accumulation for Appearance / Backstory ──
      if (currentSection === 'Aparência' && line.trim()) {
        pendingAppearance.push(line.trim());
        continue;
      }

      if (currentSection === 'História' && line.trim()) {
        pendingBackstory.push(line.trim());
        continue;
      }

      // ─── Plain text in Defenses (docx) ──────────────────
      if (currentSection === 'Defesas' && defenseSubSection && line.trim()) {
        const trimmed = line.trim();
        const d = parsedData.defenses as Record<string, string[]>;
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

      // ─── Plain comma-separated text in Idiomas (docx) ────
      if (currentSection === 'Idiomas' && line.trim()) {
        const trimmed = line.trim();
        const parts = trimmed
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
        if (parts.length > 0 && !trimmed.startsWith('#')) {
          const langs = parsedData.languages as string[];
          parts.forEach((p) => {
            if (!langs.includes(p)) langs.push(p);
          });
          continue;
        }
      }
    }

    // Flush pending appearance/backstory
    if (pendingAppearance.length > 0) {
      parsedData.appearance = pendingAppearance.join('\n');
    }
    if (pendingBackstory.length > 0) {
      parsedData.backstory = pendingBackstory.join('\n');
    }

    // Auto-generate slug from name if present
    if (parsedData.name && !parsedData.slug) {
      parsedData.slug = (parsedData.name as string)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }

    return NextResponse.json({ success: true, data: parsedData });
  } catch (error) {
    console.error('Error parsing citizen markdown:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Erro ao processar arquivo';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
