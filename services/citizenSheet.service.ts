import type ICitizen from '@/db/citizens/citizen.d';

/**
 * A máquina de estados que lê uma ficha de cidadão linha a linha.
 *
 * Vivia dentro de `app/api/parse-markdown-citizen/route.ts`. Foi extraída para
 * cá porque a importação de ficha do fórum precisa exatamente do mesmo passo:
 * o serviço do fórum converte o HTML do tópico em linhas no mesmo dialeto e
 * chama esta função, em vez de manter um segundo parser.
 *
 * Devolve o objeto cru que o formulário consome — não um ICitizen validado.
 */
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

export function parseCitizenSheetLines(
  lines: string[]
): Record<string, unknown> {
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
  const pendingNarration: string[] = [];
  // Magia sendo montada dentro de "Conjuração de Magias", e os parágrafos da
  // descrição dela. `spellCircle` só deixa de ser nulo depois de um cabeçalho
  // de círculo, que é o que distingue este formato das listas soltas de
  // "### Truques" e "### Magias Preparadas".
  let currentSpell: Record<string, unknown> | null = null;
  let spellCircle: number | null = null;
  let inSpellArea = false;
  const pendingSpellText: string[] = [];
  let inSpellDescription = false;

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

  // ── Blocos de magia ───────────────────────────────────────
  //
  // Cada magia é um bloco "#### Nome" dentro de Conjuração de Magias, com os
  // campos da ficha da magia em seguida. O círculo vem do campo "Círculo"; sem
  // ele a magia cai nos truques, que é o único círculo que não tem espaços.
  const SPELL_KEYS: Record<string, string> = {
    escola: 'school',
    classes: 'classes',
    classe: 'classes',
    'tempo de conjuracao': 'castingTime',
    alcance: 'range',
    componentes: 'components',
    duracao: 'duration',
    alvo: 'target',
    'teste de resistencia': 'save',
    'resistencia a magia': 'spellResistance',
    uso: 'use',
  };

  const foldKey = (text: string) =>
    text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\*/g, '')
      .trim()
      .toLowerCase();

  /** O círculo de nível `level`, criado se a tabela de espaços não o trouxe. */
  const ensureCircle = (level: number) => {
    const sc = getSpellcasting();
    const levels = (sc.spellLevels as Array<Record<string, unknown>>) || [];
    let circle = levels.find((l) => l.level === level);
    if (!circle) {
      circle = { level, slotsTotal: 0, slotsUsed: 0, spells: [] };
      levels.push(circle);
      sc.spellLevels = levels;
    }
    return circle;
  };

  /** Menor círculo que tem espaços, ou o primeiro quando não há tabela. */
  const lowestSlotLevel = () => {
    const sc = getSpellcasting();
    const levels = (sc.spellLevels as Array<Record<string, unknown>>) || [];
    const withSlots = levels
      .filter((l) => (l.level as number) > 0 && (l.slotsTotal as number) > 0)
      .map((l) => l.level as number);
    return withSlots.length > 0 ? Math.min(...withSlots) : 1;
  };

  const flushSpell = () => {
    if (!currentSpell) return;
    const text = pendingSpellText.join('\n').trim();
    if (text) currentSpell.description = text;

    // `circle` é só o trânsito do campo "Círculo:" até aqui; o círculo de
    // verdade é a posição na lista, não um campo da magia.
    const own = currentSpell.circle;
    delete currentSpell.circle;

    // A ficha do fórum não agrupa as magias por círculo: o que ela diz é a
    // escola, e é lá que o truque se identifica ("cura/truque"). O que não é
    // truque cai no menor círculo com espaços, para ficar visível e poder ser
    // movido depois.
    let level = typeof own === 'number' ? own : spellCircle;
    if (level === null) {
      level = /truque|cantrip/i.test(String(currentSpell.school ?? ''))
        ? 0
        : lowestSlotLevel();
    }
    const circle = ensureCircle(level);
    const spells = (circle.spells as Array<Record<string, unknown>>) || [];
    spells.push(currentSpell);
    circle.spells = spells;

    currentSpell = null;
    pendingSpellText.length = 0;
    inSpellDescription = false;
  };

  /** Aplica "Escola: X" a uma magia; devolve false se a chave não for dela. */
  const applySpellField = (rawKey: string, rawValue: string): boolean => {
    if (!currentSpell) return false;
    const key = foldKey(rawKey);
    // O "- **Chave:** valor" do template deixa um "**" encostado no valor
    // quando a linha é quebrada no primeiro dois-pontos.
    const value = rawValue.replace(/^\*+/, '').trim();
    if (!value) return false;

    if (key === 'preparada' || key === 'preparado') {
      currentSpell.prepared = !/^(n|f)/i.test(value);
      return true;
    }
    const field = SPELL_KEYS[key];
    if (!field) return false;
    currentSpell[field] = value;
    return true;
  };

  const getSpellcasting = () => {
    if (!parsedData.playerSpellcasting)
      parsedData.playerSpellcasting = { spellLevels: [] };
    return parsedData.playerSpellcasting as Record<string, unknown>;
  };

  // Comentários do modelo (<!-- como preencher -->) são instrução para quem
  // escreve a ficha, não valor — e cairiam no texto corrido das seções.
  let inComment = false;

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trimEnd();

    if (inComment) {
      if (line.includes('-->')) inComment = false;
      continue;
    }
    if (line.trimStart().startsWith('<!--')) {
      if (!line.includes('-->')) inComment = true;
      continue;
    }

    // ─── Section Headers (## ...) ─────────────────────
    const sectionMatch = line.match(/^##\s+(.+)/);
    if (sectionMatch) {
      flushSpell();
      inSpellArea = false;
      spellCircle = null;
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
    // Cabeçalho de círculo: "#### Nível 1", "#### Nível 0 (Truques)",
    // "#### 2º Círculo". É ele que abre a área das magias detalhadas.
    const circleMatch = line.match(/^####\s+(.+)/);
    if (circleMatch && currentSection === 'Conjuração de Magias') {
      flushSpell();
      const title = circleMatch[1].trim();
      const numbered = title.match(/\d+/);
      inSpellArea = true;
      // Sem número e sem "truque" no título, o círculo fica indefinido e cada
      // magia decide o seu — é o caso do cabeçalho genérico que a importação
      // do fórum emite.
      spellCircle = numbered
        ? parseInt(numbered[0], 10)
        : /truque/i.test(title)
          ? 0
          : null;
      if (spellCircle !== null) ensureCircle(spellCircle);
      continue;
    }

    const subMatch = line.match(/^###\s+(.+)/);
    if (subMatch) {
      flushSpell();
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
        'Estilo de Narração',
      ];
      const matchedSection = knownSections.find(
        (s) => s.toLowerCase() === cleanedTitle.toLowerCase()
      );
      if (matchedSection) {
        flushSpell();
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

    // ─── Magias detalhadas, sob um cabeçalho de círculo ──
    if (currentSection === 'Conjuração de Magias' && inSpellArea) {
      const trimmed = line.trim();

      if (!trimmed) {
        // Linha em branco separa parágrafos da descrição; fora dela, não há
        // nada a guardar.
        if (currentSpell && inSpellDescription) pendingSpellText.push('');
        continue;
      }

      // Régua de separação fecha o bloco: sem isso o "---" que divide as
      // seções entra como último parágrafo da descrição.
      if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
        flushSpell();
        continue;
      }

      const bare = trimmed.replace(/^-\s*/, '');
      const kv = bare.match(/^\*{0,2}(.+?)\*{0,2}:\*{0,2}\s*(.*)$/);
      const fieldKey = kv ? foldKey(kv[1]) : '';

      // Uma magia nova começa no seu nome.
      if (kv && fieldKey === 'nome' && kv[2].trim()) {
        flushSpell();
        currentSpell = {
          name: kv[2].replace(/^\*+/, '').trim(),
          prepared: true,
        };
        continue;
      }

      // A magia pode declarar o próprio círculo, que é como a ficha do fórum
      // informa isso — lá as magias não vêm agrupadas por cabeçalho.
      if (
        currentSpell &&
        kv &&
        (fieldKey === 'circulo' || fieldKey === 'nivel') &&
        kv[2].trim()
      ) {
        currentSpell.circle = getNum(kv[2]);
        continue;
      }

      // Espaços do círculo, quando a ficha os declara aqui em vez da tabela.
      if (
        kv &&
        spellCircle !== null &&
        (fieldKey === 'espacos' || fieldKey === 'slots')
      ) {
        const circle = ensureCircle(spellCircle);
        const total = getNum(kv[2]);
        if (total) circle.slotsTotal = total;
        continue;
      }

      // Campo do modelo deixado em branco: pular, para "**Escola:**" vazio não
      // virar a primeira linha da descrição.
      if (kv && !kv[2].trim() && SPELL_KEYS[fieldKey]) continue;

      // Rótulo solto ("- **Magias:**"), sem valor: não é campo de ninguém.
      if (kv && !kv[2].trim() && !currentSpell) continue;

      if (currentSpell) {
        const descMatch = bare.match(
          /^\*{0,2}(?:descri[çc][ãa]o|description)\*{0,2}:\*{0,2}\s*(.*)$/i
        );
        if (descMatch) {
          inSpellDescription = true;
          if (descMatch[1].trim())
            pendingSpellText.push(descMatch[1].replace(/^\*+/, '').trim());
          continue;
        }

        if (!inSpellDescription) {
          // Uma linha pode trazer mais de um campo. O separador das fichas é
          // o ponto e vírgula ("Escola: X; Classes: Y"); a barra aparece
          // dentro de valores como "cura/truque", então só vale com espaços.
          const pairs = bare
            .split(/\s*;\s*|\s+\/\s+/)
            .map((part) => part.match(/^(.+?):\s*(.+)$/))
            .filter((m): m is RegExpMatchArray => m !== null);
          if (
            pairs.length > 0 &&
            pairs.every((m) => applySpellField(m[1], m[2]))
          ) {
            continue;
          }
        }

        pendingSpellText.push(trimmed);
        inSpellDescription = true;
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

      // Cantrips (Truques) — stored as level 0 spells
      if (
        currentSection === 'Conjuração de Magias' &&
        currentSubSection?.toLowerCase().includes('truques')
      ) {
        const sc = getSpellcasting();
        const levels = (sc.spellLevels as Array<Record<string, unknown>>) || [];
        let level0 = levels.find((l) => l.level === 0);
        if (!level0) {
          level0 = { level: 0, slotsTotal: 0, slotsUsed: 0, spells: [] };
          levels.push(level0);
          sc.spellLevels = levels;
        }
        const spells0 = (level0.spells as Array<Record<string, unknown>>) || [];
        spells0.push({ name: listValue, prepared: true });
        level0.spells = spells0;
        continue;
      }
    }

    // ─── Key-Value pairs: "- **Key:** value" or "Key: value" ──
    const kvMatch = line.match(/^-\s+\*\*(.+?):\*\*\s*(.*)/);
    const plainKvMatch = !kvMatch
      ? line.match(/^([A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ\s()]+?):\s+(.*)/)
      : null;
    // Em seção de texto corrido, "Não pode aparecer: tortura" é conteúdo, não
    // um par chave-valor — sem esta guarda a linha some da ficha.
    const isProseSection =
      currentSection === 'Aparência' ||
      currentSection === 'História' ||
      currentSection === 'Estilo de Narração';

    const effectiveKv = isProseSection ? null : kvMatch || plainKvMatch;
    if (effectiveKv) {
      const key = effectiveKv[1].trim();
      const value = effectiveKv[2].trim();
      if (!value) continue;

      switch (currentSection) {
        case 'Informações Básicas': {
          if (key === 'Nome') parsedData.name = value;
          else if (key === 'Idade') parsedData.age = value;
          else if (key === 'Altura') parsedData.height = value;
          else if (key === 'Tamanho') parsedData.size = value;
          else if (key === 'Tipo') parsedData.type = value;
          else if (key === 'Subtítulo' || key === 'Epíteto')
            parsedData.subtitle = value;
          else if (key === 'Classe') parsedData.class = value;
          else if (key === 'Raça') parsedData.race = value;
          else if (key === 'Gênero') parsedData.gender = value;
          else if (key === 'Alinhamento') parsedData.alignment = value;
          else if (key === 'Família') parsedData.family = value;
          else if (key === 'Reino') parsedData.kingdom = value;
          else if (key === 'Clã' || key === 'Cla') parsedData.clan = value;
          else if (key === 'Adoração') parsedData.deity = value;
          else if (key === 'Imagem') parsedData.image = value;
          else if (key === 'Ícone' || key === 'Icone') parsedData.icon = value;
          break;
        }

        case 'Progressão': {
          if (key === 'Nível') parsedData.level = getNum(value);
          else if (key === 'Experiência Atual') {
            const exp = (parsedData.experience as Record<string, number>) || {};
            exp.current = getNum(value);
            parsedData.experience = exp;
          } else if (key === 'Experiência Próximo Nível') {
            const exp = (parsedData.experience as Record<string, number>) || {};
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
          // Os quatro campos gerais são reconhecidos pelo nome, não pela
          // sub-seção: a ficha do fórum não tem "### Informações Gerais", e
          // exigi-la fazia os quatro serem descartados em silêncio.
          const sc = getSpellcasting();
          if (key.includes('Atributo')) sc.ability = value;
          else if (key.includes('CD')) sc.saveDC = getNum(value);
          else if (key.includes('Bônus')) sc.attackBonus = getNum(value);
          else if (key.includes('Conjurador') || key.includes('Conjuração'))
            sc.casterLevel = getNum(value);
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
            else if (key === 'Acessório 1') eq.accessory1 = value;
            else if (key === 'Acessório 2') eq.accessory2 = value;
          } else if (
            currentSubSection === 'Inventário' ||
            currentSubSection?.toLowerCase().includes('inventário')
          ) {
            if (key === 'Gil') eq.gil = getNum(value);
            else if (key === 'Mochila') {
              eq.backpack = value;
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
        const abilities = parsedData.abilities as Array<Record<string, string>>;
        if (abilities && abilities[currentArrayIndex]) {
          // Acumula em vez de sobrescrever: uma habilidade pode ter vários
          // parágrafos, e antes só o último sobrevivia.
          const current = abilities[currentArrayIndex].description;
          abilities[currentArrayIndex].description = current
            ? `${current}\n\n${descValue}`
            : descValue;
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

    if (currentSection === 'Estilo de Narração' && line.trim()) {
      pendingNarration.push(line.trim());
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

  flushSpell();

  // "### Magias Preparadas" é uma lista de nomes sem círculo nenhum. Antes
  // isso parava num campo que nada lia, e as magias sumiam da ficha. Sem a
  // informação do círculo, o melhor palpite é o menor com espaços — fica
  // visível e editável, em vez de perdido.
  const sc = parsedData.playerSpellcasting as Record<string, unknown>;
  const loose = sc?.preparedSpells;
  if (Array.isArray(loose) && loose.length > 0) {
    const levels = (sc.spellLevels as Array<Record<string, unknown>>) || [];
    const withSlots = levels
      .filter((l) => (l.level as number) > 0)
      .map((l) => l.level as number);
    const target = withSlots.length > 0 ? Math.min(...withSlots) : 1;
    const circle = ensureCircle(target);
    const spells = (circle.spells as Array<Record<string, unknown>>) || [];
    for (const name of loose) {
      if (typeof name === 'string' && name.trim()) {
        spells.push({ name: name.trim(), prepared: true });
      }
    }
    circle.spells = spells;
    delete sc.preparedSpells;
  }

  if (pendingNarration.length > 0) {
    parsedData.narrationStyle = pendingNarration.join('\n');
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

  // Auto-generate slug from name if present
  if (parsedData.name && !parsedData.slug) {
    parsedData.slug = (parsedData.name as string)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  return parsedData;
}
