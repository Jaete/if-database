import { extractPostBodies } from './forumSheet.service';

/**
 * Lê os tópicos de itens do fórum: as lojas do Mercado (f8) e o tópico de
 * refinamento e efeitos de equipamentos (t280).
 *
 * Tudo aqui é puro: HTML entra, dados interpretados e avisos saem. Nada é
 * gravado e nenhuma linha ruim lança — o que não for entendido vira aviso, e o
 * texto original fica guardado para a revisão no preview.
 *
 * Calibrado contra t17 (armas), t18 (armaduras), t20 (itens), t24 (lojas
 * diversas), t53 (livraria) e t280 (efeitos). Cada post de loja é uma
 * categoria, com poucas exceções (t20 post de arremesso tem duas tabelas; a
 * tabela de armas de fogo não tem título).
 */

// ─── Tipos ─────────────────────────────────────────────────────────────────

export type ItemTier = 'F' | 'E' | 'D' | 'C' | 'B' | 'A' | 'S';

export type ItemKind =
  | 'weapon'
  | 'armor'
  | 'shield'
  | 'consumable'
  | 'ammo'
  | 'thrown'
  | 'kit'
  | 'gear'
  | 'service'
  | 'grimoire'
  | 'event'
  | 'misc';

export type ItemAbility = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';

export type ItemEffectScope =
  | 'efeitosEscudos'
  | 'efeitosArmaduras'
  | 'efeitosRanged'
  | 'efeitosMelee'
  | 'efeitosGerais';

export type ItemEffect =
  | { type: 'damage'; dice: string; element?: string; when?: string }
  | {
      type: 'condition';
      condition: string;
      mode: 'apply' | 'cure';
      save?: string;
      duration?: string;
      touch?: boolean;
    }
  | {
      type: 'heal';
      amount: string;
      resource: 'hp' | 'spellSlot';
      slotLevel?: number;
      // Esta cura é uma alternativa à anterior ("1 slot nível 2 ou 2 nível 1").
      alternative?: boolean;
    }
  | { type: 'modifier'; target: string; value: number; unit?: 'percent' }
  | { type: 'element'; element: string; mode: 'attack' | 'touch' }
  | {
      type: 'ref';
      scope: string;
      forumKey: string;
      name: string;
      // Preenchido por `resolveEffectRefs` quando o efeito existe em t280.
      effectId?: string;
    }
  | { type: 'custom'; text: string };

export interface IItemDamage {
  // 0 e `die: null` quando o dano é fixo (rifles, fuzis).
  count: number;
  die: number | null;
  fixed?: number;
  abilities: ItemAbility[];
  // "*": vale o maior dos atributos listados.
  abilityMode?: 'highest';
  bonus: number;
  type?: string;
  critMultiplier?: number;
  raw: string;
}

export interface IItemArmorClass {
  // null quando a CA é só um bônus (escudo: "+2").
  base: number | null;
  addDex: boolean;
  dexCap: number | null;
  bonus: number;
  raw: string;
}

export interface IGrimoireSpell {
  name: string;
  description: string;
  manaCost: number | null;
  // A conversão de custo de mana para espaço de magia é manual: fica nulo.
  circle: number | null;
  extra?: Record<string, string>;
}

export type ItemWarningType =
  | 'row-skipped'
  | 'unparsed-damage'
  | 'unparsed-ac'
  | 'unknown-tier'
  | 'unparsed-price'
  | 'duplicate-name'
  | 'slug-collision'
  | 'price-anomaly'
  | 'die-anomaly'
  | 'missing-bonus'
  | 'tier-count'
  | 'hands-conflict'
  | 'placeholder-name'
  | 'ignored-category'
  | 'asterisk-note'
  | 'grimoire-format'
  | 'grimoire-empty'
  | 'star-ability'
  | 'unresolved-effect'
  | 'effect-alias'
  | 'duplicate-effect'
  | 'sub-entry'
  | 'refine-rule'
  | 'untitled-category'
  | 'app-item';

export interface IItemWarning {
  type: ItemWarningType;
  message: string;
  // Tópico, categoria e item, quando se sabe.
  topic?: string;
  category?: string;
  item?: string;
}

export interface IItemCategory {
  name: string;
  slug: string;
  topic: string;
  kind: ItemKind;
  description: string;
  properties: string[];
  banner: string | null;
  twoHanded: boolean;
  ignored: boolean;
  notes: string[];
  headers: string[];
  itemCount: number;
}

export interface IParsedItem {
  name: string;
  baseSlug: string;
  slug: string;
  kind: ItemKind;
  category: string;
  categorySlug: string;
  topic: string;
  source: 'forum' | 'app';
  tier: ItemTier | null;
  tierRaw: number | null;
  price: number | null;
  availability: number | null;
  damage: IItemDamage | null;
  armorClass: IItemArmorClass | null;
  target: string | null;
  twoHanded: boolean;
  description: string | null;
  contentsText: string | null;
  contents: IGrimoireSpell[] | null;
  extra: Record<string, string>;
  // Texto original da coluna de efeito, antes da interpretação.
  effectText: string | null;
  effects: ItemEffect[];
  notes: string[];
  imageUrl: string | null;
  flags: string[];
}

export interface IShopTopicResult {
  categories: IItemCategory[];
  items: IParsedItem[];
  warnings: IItemWarning[];
}

export interface IForumEffect {
  scope: ItemEffectScope;
  section: string;
  name: string;
  key: string;
  id: string;
  description: string;
  mechanics: ItemEffect[];
  duplicateInSection: boolean;
  // Item de lista aninhada (resultados de uma tabela de rolagem).
  subEntryOf: string | null;
}

export interface IItemProperty {
  name: string;
  description: string;
}

export interface IRefineRules {
  maxLevel: number | null;
  bonusPerLevel: number | null;
  rangedRangePerLevelM: number | null;
}

export interface IEffectsTopicResult {
  effects: IForumEffect[];
  properties: IItemProperty[];
  refine: IRefineRules;
  warnings: IItemWarning[];
}

// ─── Utilidades de texto ───────────────────────────────────────────────────

export function decode(text: string): string {
  return text
    .replace(/&nbsp;|&#8195;|&#8194;|&ensp;|&emsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) =>
      String.fromCharCode(parseInt(hex, 16))
    )
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCharCode(Number(code))
    )
    .replace(/&amp;/g, '&');
}

export const fold = (text: string): string =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Chave de comparação: sem acento, sem pontuação, espaços colapsados. */
export const norm = (text: string): string =>
  fold(decode(text))
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

export const slugify = (text: string): string => norm(text).replace(/ /g, '-');

const camelCase = (text: string): string =>
  norm(text)
    .split(' ')
    .filter(Boolean)
    .map((word, i) => (i === 0 ? word : word[0].toUpperCase() + word.slice(1)))
    .join('');

const SMALL_WORDS = new Set(['de', 'da', 'do', 'das', 'dos', 'e', 'a', 'o']);

/** "INNS E HOTÉIS" → "Inns e Hotéis"; texto já em caixa mista fica como está. */
function normalizeTitle(text: string): string {
  const title = text.replace(/\s+/g, ' ').trim();
  if (title !== title.toUpperCase()) return title;
  return title
    .toLowerCase()
    .split(' ')
    .map((word, i) =>
      i > 0 && SMALL_WORDS.has(word)
        ? word
        : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(' ');
}

const stripBBCode = (text: string): string =>
  text.replace(/\[\/?(?!tooltip)[a-z]{1,10}(?:=[^\]]*)?\]/gi, '');

const stripTags = (html: string): string => html.replace(/<[^>]+>/g, '');

function tablesToText(html: string): string {
  return html.replace(/<table[\s\S]*?<\/table>/gi, (table) => {
    const rows = table.match(/<tr[\s\S]*?<\/tr>/gi) ?? [];
    const lines = rows.map((row) =>
      (row.match(/<t[dh][\s\S]*?<\/t[dh]>/gi) ?? [])
        .map((cell) => stripTags(cell).trim())
        .join(': ')
    );
    return `<br />${lines.join('<br />')}<br />`;
  });
}

/** HTML → texto com quebras de linha onde havia <br> / bloco. */
export function htmlToText(html: string): string {
  return decode(
    tablesToText(html)
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(div|p|li|tr|h\d|dd|dt|ul)>/gi, '\n')
      .replace(/<[^>]+>/g, '')
  )
    .replace(/[ \t ]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const oneLine = (html: string): string =>
  decode(
    stripTags(
      html
        .replace(/<br\s*\/?>/gi, ' ')
        .replace(/<script[\s\S]*?<\/script>/gi, '')
    )
  )
    .replace(/\s+/g, ' ')
    .trim();

const EMPTY_CELL = /^[-–—\s]*$/;

export const excerpt = (text: string, max = 90): string => {
  const flat = text.replace(/\s+/g, ' ').trim();
  return flat.length > max ? `${flat.slice(0, max - 1)}…` : flat;
};

// ─── Camada de campos: preço, disponibilidade, tier, dano, CA ──────────────

export function parsePrice(raw: string): number | null {
  const text = raw.replace(/gil/gi, '').trim();
  if (EMPTY_CELL.test(text)) return null;
  // "." e "," são separadores de milhar ("6,600", "13.500").
  const digits = text.replace(/[.,\s]/g, '');
  return /^\d+$/.test(digits) ? Number(digits) : null;
}

export function parseAvailability(raw: string): number | null {
  const m = raw.match(/(\d+)\s*%/);
  return m ? Number(m[1]) : null;
}

const NUMERIC_TIERS: ItemTier[] = ['F', 'E', 'D', 'C', 'B', 'A', 'S', 'S'];

/**
 * Letras F…S ficam como estão. Rank numérico (loja de itens) vira letra, onde
 * menor é pior: 1→F … 6→A, 7→S, 8→S. O número original vai em `tierRaw`.
 */
export function parseTier(
  raw: string
): { tier: ItemTier | null; tierRaw: number | null } | null {
  const text = raw.trim();
  if (EMPTY_CELL.test(text)) return { tier: null, tierRaw: null };
  if (/^[FEDCBAS]$/i.test(text)) {
    return { tier: text.toUpperCase() as ItemTier, tierRaw: null };
  }
  if (/^\d+$/.test(text)) {
    const n = Number(text);
    const tier = NUMERIC_TIERS[n - 1];
    return tier ? { tier, tierRaw: n } : null;
  }
  return null;
}

const ABILITY_ALIASES: Record<string, ItemAbility> = {
  for: 'str',
  str: 'str',
  forca: 'str',
  des: 'dex',
  dex: 'dex',
  destreza: 'dex',
  con: 'con',
  constituicao: 'con',
  int: 'int',
  inteligencia: 'int',
  sab: 'wis',
  wis: 'wis',
  sabedoria: 'wis',
  car: 'cha',
  cha: 'cha',
  carisma: 'cha',
};

const abilityOf = (token: string): ItemAbility | null =>
  ABILITY_ALIASES[norm(token)] ?? null;

/** Atributos de uma categoria cujo "*" vale "o mais alto dos dois". */
export function starAbilitiesOf(description: string): ItemAbility[] {
  const m = fold(description).match(
    /valor de (.+?),?\s+aquele que for mais alto/
  );
  if (!m) return [];
  return m[1]
    .split(/\s+ou\s+|\s*,\s*/)
    .map((part) => abilityOf(part))
    .filter((a): a is ItemAbility => a !== null);
}

export function parseDamage(
  raw: string,
  starAbilities: ItemAbility[] = []
): IItemDamage | null {
  let text = raw.trim();
  if (EMPTY_CELL.test(text)) return null;

  let critMultiplier: number | undefined;
  text = text.replace(/\(\s*cr[ií]tico\s*x\s*(\d+)\s*\)/i, (_, n: string) => {
    critMultiplier = Number(n);
    return '';
  });
  text = text.trim();

  let count = 0;
  let die: number | null = null;
  let fixed: number | undefined;

  const dice = text.match(/^(\d*)d(\d+)/i);
  if (dice) {
    count = dice[1] ? Number(dice[1]) : 1;
    die = Number(dice[2]);
    text = text.slice(dice[0].length);
  } else {
    const fix = text.match(/^(\d+)/);
    if (!fix) return null;
    fixed = Number(fix[1]);
    text = text.slice(fix[0].length);
  }

  const abilities: ItemAbility[] = [];
  let abilityMode: 'highest' | undefined;
  let bonus = 0;
  let type: string | undefined;

  for (const piece of text.split('+')) {
    const token = piece.trim();
    if (!token) continue;
    if (token === '*') {
      abilities.push(...starAbilities);
      abilityMode = 'highest';
    } else if (/^\d+$/.test(token)) {
      bonus += Number(token);
    } else if (/^-\s*\d+$/.test(token)) {
      bonus -= Number(token.replace(/\D/g, ''));
    } else if (abilityOf(token)) {
      abilities.push(abilityOf(token) as ItemAbility);
    } else if (/^[a-zà-ú/ ]+$/i.test(token)) {
      type = type ? `${type} ${token}` : token;
    } else {
      return null;
    }
  }

  const damage: IItemDamage = {
    count,
    die,
    abilities: [...new Set(abilities)],
    bonus,
    raw,
  };
  if (fixed !== undefined) damage.fixed = fixed;
  if (abilityMode) damage.abilityMode = abilityMode;
  if (type) damage.type = type;
  if (critMultiplier !== undefined) damage.critMultiplier = critMultiplier;
  return damage;
}

export function parseArmorClass(raw: string): IItemArmorClass | null {
  const text = raw.trim();
  if (EMPTY_CELL.test(text)) return null;

  const flat = text.match(/^\+\s*(\d+)$/);
  if (flat) {
    return {
      base: null,
      addDex: false,
      dexCap: null,
      bonus: Number(flat[1]),
      raw,
    };
  }

  const base = text.match(/^(\d+)/);
  if (!base) return null;

  const cap = text.match(/\(\s*m[aá]x\.?\s*(\d+)\s*\)/i);
  const rest = text
    .slice(base[0].length)
    .replace(/\(\s*m[aá]x\.?\s*\d+\s*\)/i, '');
  const addDex = /dex/i.test(rest);
  const leftovers = rest.replace(/dex/gi, '').replace(/\+\s*\d+/g, '');
  if (leftovers.replace(/[\s+]/g, '')) return null;

  let bonus = 0;
  for (const m of rest.matchAll(/\+\s*(\d+)/g)) bonus += Number(m[1]);

  return {
    base: Number(base[1]),
    addDex,
    dexCap: cap ? Number(cap[1]) : null,
    bonus,
    raw,
  };
}

// ─── Efeitos de consumíveis (dicionário) ───────────────────────────────────

const ELEMENTS: Record<string, string> = {
  fogo: 'fogo',
  gelo: 'gelo',
  eletricidade: 'eletricidade',
  eletrico: 'eletricidade',
  ar: 'ar',
  vento: 'ar',
  agua: 'agua',
  terra: 'terra',
  luz: 'luz',
  sagrado: 'luz',
  radiante: 'luz',
  trevas: 'trevas',
  sombrio: 'trevas',
};

const CONDITIONS: Record<string, string> = {
  poison: 'poison',
  veneno: 'poison',
  venom: 'venom',
  blind: 'blind',
  cegueira: 'blind',
  sleep: 'sleep',
  silence: 'silence',
  berserk: 'berserk',
  immobilize: 'immobilize',
  mini: 'mini',
  toad: 'toad',
  petrify: 'petrify',
  zombie: 'zombie',
  slow: 'slow',
  stop: 'stop',
  death: 'death',
  confusao: 'confuse',
  confuso: 'confuse',
  disable: 'disable',
};

function parseSegment(segment: string): ItemEffect[] | null {
  const f = norm(segment);
  if (!f) return null;

  let m = f.match(/^([a-z]+) ataque$/);
  if (m && ELEMENTS[m[1]]) {
    return [{ type: 'element', element: ELEMENTS[m[1]], mode: 'attack' }];
  }
  m = f.match(/^dano de ([a-z]+)$/);
  if (m && ELEMENTS[m[1]]) {
    return [{ type: 'element', element: ELEMENTS[m[1]], mode: 'attack' }];
  }
  m = f.match(/^([a-z ]+?) (?:toque|touch)$/);
  if (m) {
    if (ELEMENTS[m[1]]) {
      return [{ type: 'element', element: ELEMENTS[m[1]], mode: 'touch' }];
    }
    if (CONDITIONS[m[1]]) {
      return [
        {
          type: 'condition',
          condition: CONDITIONS[m[1]],
          mode: 'apply',
          touch: true,
        },
      ];
    }
  }
  m = f.match(/^(\d+) dano$/) ?? f.match(/^(\d+) de dano$/);
  if (m && /^\s*\+/.test(segment)) {
    return [{ type: 'modifier', target: 'damage', value: Number(m[1]) }];
  }
  m = f.match(/^(\d+) acerto$/);
  if (m && /^\s*\+/.test(segment)) {
    return [{ type: 'modifier', target: 'attack', value: Number(m[1]) }];
  }
  m = f.match(/^ignora (\d+) def$/);
  if (m) {
    return [{ type: 'modifier', target: 'ignoreDef', value: Number(m[1]) }];
  }
  m = segment.trim().match(/^(-?\d+)\s*%\s*dano$/i);
  if (m) {
    return [
      {
        type: 'modifier',
        target: 'damage',
        value: Number(m[1]),
        unit: 'percent',
      },
    ];
  }
  if (CONDITIONS[f]) {
    return [{ type: 'condition', condition: CONDITIONS[f], mode: 'apply' }];
  }
  return null;
}

function parseCure(f: string): ItemEffect[] | null {
  const m = f.match(/^cancela (?:a|as) condic(?:ao|oes) de status (.+)$/);
  if (!m) return null;
  return m[1]
    .split(/\s*,\s*|\s+e\s+/)
    .filter(Boolean)
    .map((name): ItemEffect => {
      const condition = CONDITIONS[name.trim()];
      return condition
        ? { type: 'condition', condition, mode: 'cure' }
        : { type: 'custom', text: `Cancela: ${name}` };
    });
}

function parseRestore(f: string): ItemEffect[] | null {
  const m = f.match(/^restaura (.+)$/);
  if (!m) return null;
  const body = m[1];

  const hp = body.match(/^(\d*d\d+|\d+) ?hp$/);
  if (hp) return [{ type: 'heal', amount: hp[1], resource: 'hp' }];

  const slots = [...body.matchAll(/(\d+) (?:slots? )?nivel (\d)/g)];
  if (slots.length && /^\d+ slots? nivel/.test(body)) {
    return slots.map((s, i): ItemEffect => ({
      type: 'heal',
      amount: s[1],
      resource: 'spellSlot',
      slotLevel: Number(s[2]),
      ...(i > 0 ? { alternative: true } : {}),
    }));
  }
  return null;
}

/**
 * Texto de efeito de consumível → efeitos tipados. O que o dicionário não
 * reconhece vira `custom`, e o texto original continua em `effectText`.
 */
export function parseEffectText(raw: string): ItemEffect[] {
  const text = raw
    .replace(/\*+\s*$/, '')
    .replace(/[.\s]+$/, '')
    .trim();
  if (!text || EMPTY_CELL.test(text)) return [];

  const f = norm(text);
  const whole = parseCure(f) ?? parseRestore(f) ?? parseSegment(text);
  if (whole) return whole;

  const segments = text
    .split(/\s+e\s+|\s*\/\s*|\s+-\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (segments.length <= 1) return [{ type: 'custom', text }];

  return segments.flatMap(
    (segment): ItemEffect[] =>
      parseSegment(segment) ?? [{ type: 'custom', text: segment }]
  );
}

// ─── Efeitos de t280: mecânicas seguras ────────────────────────────────────

/** Só os padrões sem ambiguidade; todo o resto continua sendo texto. */
export function extractMechanics(description: string): ItemEffect[] {
  const out: ItemEffect[] = [];
  const seen = new Set<string>();
  const text = description.replace(/\s+/g, ' ');

  const elementDamage =
    /\+(\d+d\d+) de dano (?:de |do )?(terra|fogo|gelo|[aá]gua|vento|sombrio|sagrado|el[eé]trico)\b(?! para cada)/gi;
  for (const m of text.matchAll(elementDamage)) {
    const element = ELEMENTS[norm(m[2])];
    if (!element) continue;
    const before = text.slice(Math.max(0, m.index - 70), m.index);
    // Só vale como "em crítico" se não houver ponto entre o gatilho e o dano.
    const crit = /cr[ií]tico[^.]*$/i.test(before);
    const key = `${m[1]}|${element}|${crit}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      type: 'damage',
      dice: m[1],
      element,
      ...(crit ? { when: 'crit' } : {}),
    });
  }

  const crit = text.match(
    /Em caso de acerto cr[ií]tico, \+(\d+d\d+)(?! de dano)/i
  );
  if (crit) {
    const key = `${crit[1]}|crit-only`;
    if (!seen.has(key))
      out.push({ type: 'damage', dice: crit[1], when: 'crit' });
  }

  return out;
}

// ─── Tópico de efeitos (t280) ──────────────────────────────────────────────

const SECTION_SCOPES: { match: RegExp; scope: ItemEffectScope }[] = [
  { match: /escudo/, scope: 'efeitosEscudos' },
  { match: /armadura/, scope: 'efeitosArmaduras' },
  { match: /ranged|dist[aâ]ncia/, scope: 'efeitosRanged' },
  { match: /melee|corpo/, scope: 'efeitosMelee' },
  { match: /geral|gerais/, scope: 'efeitosGerais' },
];

function parseRefineRules(
  text: string,
  warnings: IItemWarning[]
): IRefineRules {
  const flat = fold(text).replace(/\s+/g, ' ');
  const max = flat.match(/maximo de \+?(\d+)/);
  const per = flat.match(/aumenta em \+?(\d+)/);
  const ranged = /em um numero de metros igual ao nivel do refinamento/.test(
    flat
  );
  const rules: IRefineRules = {
    maxLevel: max ? Number(max[1]) : null,
    bonusPerLevel: per ? Number(per[1]) : null,
    rangedRangePerLevelM: ranged ? 1 : null,
  };
  for (const [key, value] of Object.entries(rules)) {
    if (value === null) {
      warnings.push({
        type: 'refine-rule',
        topic: 't280',
        message: `Regra de refinamento não reconhecida: ${key}.`,
      });
    }
  }
  return rules;
}

export function parseEffectsTopic(
  html: string,
  url: string
): IEffectsTopicResult {
  void url;
  const warnings: IItemWarning[] = [];
  const effects: IForumEffect[] = [];
  const properties: IItemProperty[] = [];
  let refine: IRefineRules = {
    maxLevel: null,
    bonusPerLevel: null,
    rangedRangePerLevelM: null,
  };

  const bodies = extractPostBodies(html);
  if (bodies.length === 0) {
    warnings.push({
      type: 'row-skipped',
      topic: 't280',
      message: 'Nenhuma mensagem encontrada no tópico de efeitos.',
    });
  }

  for (const body of bodies) {
    // Glossário de propriedades: <li><u><strong>Nome.</strong></u> texto.
    const glossary = [
      ...body.matchAll(
        /<li>\s*<u>\s*<strong>([\s\S]*?)<\/strong>\s*<\/u>([\s\S]*?)<\/li>/gi
      ),
    ];
    if (glossary.length) {
      for (const g of glossary) {
        properties.push({
          name: oneLine(g[1]).replace(/[.:]+$/, ''),
          description: htmlToText(g[2]),
        });
      }
      refine = parseRefineRules(htmlToText(body), warnings);
    }

    const heading = body.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
    if (!heading) continue;
    const section = oneLine(heading[1]);
    const scope = SECTION_SCOPES.find((s) =>
      s.match.test(fold(section))
    )?.scope;
    if (!scope) {
      warnings.push({
        type: 'row-skipped',
        topic: 't280',
        message: `Seção de efeitos desconhecida: "${section}".`,
      });
      continue;
    }

    const starts = [...body.matchAll(/<li>\s*<strong>([\s\S]*?)<\/strong>/gi)];
    const seenInSection = new Set<string>();
    let lastTop: string | null = null;

    for (const start of starts) {
      const from = (start.index ?? 0) + start[0].length;
      const end = body.indexOf('</li>', from);
      const rawBody = body.slice(from, end === -1 ? undefined : end);
      const name = oneLine(start[1]).replace(/[.:]+$/, '');
      const description = htmlToText(rawBody).replace(/^[:\s]+/, '');

      // Lista aninhada malformada: "<strong>Fugir</strong>: texto" dentro do
      // efeito anterior. Entra na contagem, mas como sub-item.
      const isSub = /^\s*:/.test(htmlToText(rawBody)) && lastTop !== null;
      if (!isSub) lastTop = name;

      const key = norm(name);
      const duplicateInSection = seenInSection.has(key);
      seenInSection.add(key);

      const effect: IForumEffect = {
        scope,
        section,
        name,
        key: camelCase(name),
        id: `${scope}.${camelCase(name)}`,
        description,
        mechanics: extractMechanics(description),
        duplicateInSection,
        subEntryOf: isSub ? lastTop : null,
      };
      effects.push(effect);

      if (duplicateInSection) {
        warnings.push({
          type: 'duplicate-effect',
          topic: 't280',
          category: section,
          item: name,
          message: `Efeito "${name}" aparece mais de uma vez na seção ${section}; o primeiro vale para a resolução.`,
        });
      }
      if (isSub) {
        warnings.push({
          type: 'sub-entry',
          topic: 't280',
          category: section,
          item: name,
          message: `"${name}" é item de lista aninhada malformada dentro de "${lastTop}"; foi contado como efeito próprio.`,
        });
      }
    }
  }

  return { effects, properties, refine, warnings };
}

// Aliases de nome entre o tooltip da loja e o t280. O t280 escreve
// "Jaete d’Água" onde a loja usa a chave `jatoDagua`.
const EFFECT_NAME_ALIASES: Record<string, string> = {
  'jato dagua': 'jaete d agua',
  'jato d agua': 'jaete d agua',
  'explosao de jato dagua': 'explosao de jaete d agua',
  'explosao de jato d agua': 'explosao de jaete d agua',
};

const aliasName = (name: string): string => {
  const n = norm(name);
  return EFFECT_NAME_ALIASES[n] ?? n;
};

/**
 * Liga cada `ref` de item ao efeito de t280 por (seção, nome normalizado).
 * Mexe nos itens (preenche `effectId`) e devolve os avisos de quem não achou.
 */
export function resolveEffectRefs(
  items: IParsedItem[],
  effects: IForumEffect[]
): IItemWarning[] {
  const warnings: IItemWarning[] = [];
  const byScope = new Map<string, IForumEffect>();
  for (const effect of effects) {
    if (effect.subEntryOf) continue;
    const k = `${effect.scope}|${aliasName(effect.name)}`;
    if (!byScope.has(k)) byScope.set(k, effect);
  }
  const aliasWarned = new Set<string>();

  for (const item of items) {
    for (const effect of item.effects) {
      if (effect.type !== 'ref') continue;
      const direct = byScope.get(`${effect.scope}|${norm(effect.name)}`);
      const viaAlias = byScope.get(`${effect.scope}|${aliasName(effect.name)}`);
      const found = direct ?? viaAlias;
      if (found) {
        effect.effectId = found.id;
        if (!direct && !aliasWarned.has(effect.forumKey)) {
          aliasWarned.add(effect.forumKey);
          warnings.push({
            type: 'effect-alias',
            topic: item.topic,
            message: `${effect.forumKey} ("${effect.name}") ligado a "${found.name}" do t280 por alias.`,
          });
        }
      } else {
        warnings.push({
          type: 'unresolved-effect',
          topic: item.topic,
          category: item.category,
          item: item.name,
          message: `${item.name}: efeito ${effect.forumKey} ("${effect.name}") não existe no t280.`,
        });
      }
    }
  }
  return warnings;
}

// ─── Lojas ─────────────────────────────────────────────────────────────────

const topicOf = (url: string): string => {
  const m = url.match(/\/t(\d+)/);
  return m ? `t${m[1]}` : 'tópico';
};

type Field =
  | 'name'
  | 'tier'
  | 'price'
  | 'availability'
  | 'effect'
  | 'damage'
  | 'ac'
  | 'target'
  | 'contents'
  | 'description'
  | { extra: string };

const HEADER_FIELDS: Record<string, Field> = {
  tier: 'tier',
  custo: 'price',
  preco: 'price',
  'preco gil': 'price',
  dispon: 'availability',
  disponibilidade: 'availability',
  habilidade: 'effect',
  habilidades: 'effect',
  notas: 'effect',
  efeito: 'effect',
  dano: 'damage',
  ca: 'ac',
  alvo: 'target',
  conteudo: 'contents',
  descricao: 'description',
};

function buildHeaderMap(headers: string[]): Field[] {
  return headers.map((label, index) => {
    // A primeira coluna é sempre o nome: "Tipo", "Item", "Kit", "Descrição",
    // "Qualidade do quarto"...
    if (index === 0) return 'name';
    return HEADER_FIELDS[norm(label)] ?? { extra: camelCase(label) };
  });
}

function categoryKind(topic: string, name: string): ItemKind {
  const f = norm(name);
  switch (topic) {
    case 't17':
      return 'weapon';
    case 't18':
      return /escudo/.test(f) ? 'shield' : 'armor';
    case 't20':
      if (/recuperacao/.test(f)) return 'consumable';
      if (/bala|flecha|seta|municao/.test(f)) return 'ammo';
      return 'thrown';
    case 't24':
      if (/inns|hotel/.test(f)) return 'service';
      if (/^kits a parte/.test(f)) return 'gear';
      if (/^kits/.test(f)) return 'kit';
      return 'misc';
    case 't53':
      return 'grimoire';
    default:
      return 'misc';
  }
}

const SERVICE_NAME = /refeicao|passagem|chocobo|aluguel|diaria|estalagem/;

const TWO_HANDED =
  /(?:ocupa|utiliza)(?:m)?\s+ambos\s+os\s+slots?\s+para\s+arma/;

interface ISegment {
  name: string;
  description: string;
  properties: string[];
  notes: string[];
  banner: string | null;
}

const HEADING_IGNORE =
  /^(utilizad[oa] por|x\d+ por compra|obs|regras especiais|alcance|custo|propriedades)\b/;

const PROPERTIES_BLOCK =
  /(?:<h\d[^>]*>\s*|<strong>\s*)?Propriedades:?\s*(?:<\/strong>|<\/h\d>)?\s*(?:<br\s*\/?>\s*)*<ul>([\s\S]*?)<\/ul>/i;

/** Lê o que vem antes de uma tabela: título, texto, propriedades, banner. */
function readSegment(pre: string, banner: string | null): ISegment {
  let html = pre;
  const properties: string[] = [];

  const props = html.match(PROPERTIES_BLOCK);
  if (props) {
    for (const li of props[1].match(/<li[\s\S]*?<\/li>/gi) ?? []) {
      const text = stripBBCode(oneLine(li)).replace(/\.$/, '').trim();
      if (text) properties.push(text);
    }
    html = html.replace(PROPERTIES_BLOCK, '');
  }

  // O título é o último <strong> que não é rótulo ("Alcance:", "OBS:", ...).
  let name = '';
  html = html.replace(
    /<strong>([\s\S]*?)<\/strong>/gi,
    (whole, inner: string) => {
      const label = oneLine(inner);
      const f = norm(label);
      if (!f || label.endsWith(':') || HEADING_IGNORE.test(f)) return whole;
      name = label;
      return '';
    }
  );

  const lines = htmlToText(html.replace(/<a [^>]*>\s*<img[^>]*>\s*<\/a>/gi, ''))
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  // "Kits" vem num <div align="center"> sem <strong>: a primeira linha é o nome.
  if (!name && lines.length) name = lines.shift() as string;

  const notes: string[] = [];
  const description: string[] = [];
  for (const line of lines) {
    if (/^(utilizad[oa] por|x\d+ por compra)/i.test(line)) notes.push(line);
    else description.push(line);
  }

  return {
    name: name ? normalizeTitle(name) : '',
    description: description.join('\n'),
    properties,
    notes,
    banner,
  };
}

interface ITrailer {
  lines: string[];
  byKey: Map<string, string>;
}

/** Texto depois da última tabela: "OBS: ..." e "REGRAS ESPECIAIS". */
function readTrailer(html: string): ITrailer {
  const lines = htmlToText(html)
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .filter((l) => !/^(obs|regras especiais):?$/i.test(l))
    .map((l) => l.replace(/^obs:\s*/i, ''));
  const byKey = new Map<string, string>();
  for (const line of lines) {
    const m = line.match(/^([^:]{2,40}):\s*(.+)$/);
    if (m) byKey.set(norm(m[1]), line);
  }
  return { lines, byKey };
}

function parseHeadersAndRows(table: string): {
  headers: string[];
  rows: string[][];
} {
  const trs = table.match(/<tr[\s\S]*?<\/tr>/gi) ?? [];
  const grid = trs.map((tr) =>
    (tr.match(/<t[dh][\s\S]*?<\/t[dh]>/gi) ?? []).map((cell) => oneLine(cell))
  );
  const [headers = [], ...rows] = grid;
  return { headers, rows };
}

const TOOLTIP = /\[tooltip="([^"]+)"\]([\s\S]*?)\[\/tooltip\]/gi;

function effectsFromCell(text: string): ItemEffect[] {
  const clean = text.trim();
  if (EMPTY_CELL.test(clean)) return [];
  const refs: ItemEffect[] = [];
  for (const m of clean.matchAll(TOOLTIP)) {
    const [scope] = m[1].split('.');
    refs.push({
      type: 'ref',
      scope,
      forumKey: m[1],
      name: m[2].trim(),
    });
  }
  const leftover = stripBBCode(clean.replace(TOOLTIP, '')).trim();
  if (refs.length) {
    return leftover && !EMPTY_CELL.test(leftover)
      ? [...refs, { type: 'custom', text: leftover }]
      : refs;
  }
  return parseEffectText(clean);
}

function isPlaceholder(name: string): boolean {
  return /\[x\]/i.test(name);
}

interface ICategoryDraft {
  category: IItemCategory;
  items: IParsedItem[];
  trailer: ITrailer;
  damageAbilities: ItemAbility[];
}

function buildCategory(
  topic: string,
  segment: ISegment,
  headers: string[],
  fallbackName: string,
  warnings: IItemWarning[]
): IItemCategory {
  let name = segment.name;
  if (!name) {
    name = fallbackName;
    warnings.push({
      type: 'untitled-category',
      topic,
      message: `Tabela sem título no ${topic}; usado o nome "${name}".`,
    });
  }
  const twoHanded = TWO_HANDED.test(fold(segment.description));
  return {
    name,
    slug: slugify(name),
    topic,
    kind: categoryKind(topic, name),
    description: segment.description,
    properties: segment.properties,
    banner: segment.banner,
    twoHanded,
    ignored: false,
    notes: segment.notes,
    headers,
    itemCount: 0,
  };
}

function parseTableCategory(
  topic: string,
  segment: ISegment,
  table: string,
  warnings: IItemWarning[]
): ICategoryDraft {
  const { headers, rows } = parseHeadersAndRows(table);
  const map = buildHeaderMap(headers);

  // A tabela de armas de fogo não tem título; a coluna "Categoria" a denuncia.
  const fallback = headers.some((h) => norm(h) === 'categoria')
    ? 'Armas de fogo antigas e modernas'
    : 'Sem título';
  const category = buildCategory(topic, segment, headers, fallback, warnings);
  const starAbilities = starAbilitiesOf(category.description);
  const items: IParsedItem[] = [];

  for (const [index, cells] of rows.entries()) {
    const name = (cells[0] ?? '').trim();
    if (!name || cells.every((c) => !c.trim())) continue;
    if (cells.length < headers.length) {
      warnings.push({
        type: 'row-skipped',
        topic,
        category: category.name,
        item: name,
        message: `Linha ${index + 2} de ${category.name} tem ${cells.length} colunas, esperado ${headers.length}.`,
      });
      continue;
    }

    const item: IParsedItem = {
      name,
      baseSlug: slugify(name),
      slug: slugify(name),
      kind: category.kind,
      category: category.name,
      categorySlug: category.slug,
      topic,
      source: 'forum',
      tier: null,
      tierRaw: null,
      price: null,
      availability: null,
      damage: null,
      armorClass: null,
      target: null,
      twoHanded: category.twoHanded,
      description: null,
      contentsText: null,
      contents: null,
      extra: {},
      effectText: null,
      effects: [],
      notes: [],
      imageUrl: category.banner,
      flags: [],
    };

    const ctx = (): Pick<IItemWarning, 'topic' | 'category' | 'item'> => ({
      topic,
      category: category.name,
      item: name,
    });

    map.forEach((field, col) => {
      const value = (cells[col] ?? '').trim();
      if (field === 'name') return;
      if (typeof field === 'object') {
        if (!EMPTY_CELL.test(value)) item.extra[field.extra] = value;
        return;
      }
      switch (field) {
        case 'tier': {
          const tier = parseTier(value);
          if (!tier) {
            warnings.push({
              ...ctx(),
              type: 'unknown-tier',
              message: `${name}: tier "${value}" não reconhecido.`,
            });
          } else {
            item.tier = tier.tier;
            item.tierRaw = tier.tierRaw;
          }
          break;
        }
        case 'price':
          item.price = parsePrice(value);
          if (item.price === null && !EMPTY_CELL.test(value)) {
            warnings.push({
              ...ctx(),
              type: 'unparsed-price',
              message: `${name}: preço "${value}" não reconhecido.`,
            });
          }
          break;
        case 'availability':
          item.availability = parseAvailability(value);
          break;
        case 'damage':
          item.damage = parseDamage(value, starAbilities);
          if (item.damage === null && !EMPTY_CELL.test(value)) {
            warnings.push({
              ...ctx(),
              type: 'unparsed-damage',
              message: `${name}: dano "${value}" não reconhecido.`,
            });
          }
          if (/\*/.test(value) && starAbilities.length === 0) {
            warnings.push({
              ...ctx(),
              type: 'star-ability',
              message: `${name}: "*" no dano, mas a descrição de ${category.name} não diz quais atributos.`,
            });
          }
          break;
        case 'ac':
          item.armorClass = parseArmorClass(value);
          if (item.armorClass === null && !EMPTY_CELL.test(value)) {
            warnings.push({
              ...ctx(),
              type: 'unparsed-ac',
              message: `${name}: CA "${value}" não reconhecida.`,
            });
          }
          break;
        case 'target':
          if (!EMPTY_CELL.test(value)) item.target = value;
          break;
        case 'contents':
          if (!EMPTY_CELL.test(value)) item.contentsText = value;
          break;
        case 'description':
          if (!EMPTY_CELL.test(value)) item.description = value;
          break;
        case 'effect':
          if (!EMPTY_CELL.test(value)) {
            item.effectText = stripBBCode(value.replace(TOOLTIP, '$2'));
            item.effects = effectsFromCell(value);
          }
          break;
      }
    });

    if (topic === 't24' && category.kind === 'misc') {
      item.kind = SERVICE_NAME.test(norm(name)) ? 'service' : 'gear';
    }
    items.push(item);
  }

  category.itemCount = items.length;
  return {
    category,
    items,
    trailer: { lines: [], byKey: new Map() },
    damageAbilities: starAbilities,
  };
}

function linkAsteriskNotes(draft: ICategoryDraft, warnings: IItemWarning[]) {
  const { items, trailer, category } = draft;
  for (const item of items) {
    const text = item.effectText ?? '';
    if (!text.trim().endsWith('*')) {
      // "Fast Ammo": a nota se chama como o item e o efeito só diz "veja notas".
      const own = trailer.byKey.get(norm(item.name));
      if (own && /notas|abaixo/i.test(text)) item.notes.push(own);
      continue;
    }
    const key = norm(text.replace(/\*+$/, ''));
    let note: string | undefined;
    for (const [noteKey, line] of trailer.byKey) {
      if (
        key === noteKey ||
        key.startsWith(noteKey) ||
        noteKey.startsWith(key)
      ) {
        note = line;
        break;
      }
    }
    if (note) {
      item.notes.push(note);
    } else {
      warnings.push({
        type: 'asterisk-note',
        topic: category.topic,
        category: category.name,
        item: item.name,
        message: `${item.name}: "${text.trim()}" tem asterisco, mas o post não traz a nota correspondente.`,
      });
    }
  }
}

function checkCategory(draft: ICategoryDraft, warnings: IItemWarning[]) {
  const { category, items } = draft;
  const base = { topic: category.topic, category: category.name };
  const tiered =
    ['weapon', 'armor', 'shield'].includes(category.kind) &&
    category.headers.some((h) => norm(h) === 'tier');

  if (tiered) {
    if (items.length !== 8) {
      warnings.push({
        ...base,
        type: 'tier-count',
        message: `${category.name} tem ${items.length} itens (esperado 8 tiers).`,
      });
    }

    // Preço fora da progressão: maior que o do tier seguinte.
    for (let i = 0; i + 1 < items.length; i++) {
      const prev = items[i - 1]?.price ?? null;
      const cur = items[i].price;
      const next = items[i + 1].price;
      if (cur === null || next === null) continue;
      if (cur > next && (prev === null || prev <= next)) {
        warnings.push({
          ...base,
          item: items[i].name,
          type: 'price-anomaly',
          message: `${items[i].name} (${items[i].tier ?? '?'}) custa ${cur}, mais que ${items[i + 1].name} (${items[i + 1].tier ?? '?'}, ${next}): preço fora da progressão.`,
        });
      }
    }

    // Dado diferente do resto da categoria (Bone Axe 2d12).
    const diceOf = (it: IParsedItem) =>
      it.damage?.die ? `${it.damage.count}d${it.damage.die}` : null;
    const counts = new Map<string, number>();
    for (const it of items) {
      const d = diceOf(it);
      if (d) counts.set(d, (counts.get(d) ?? 0) + 1);
    }
    if (counts.size > 1) {
      const [modal] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
      for (const it of items) {
        const d = diceOf(it);
        if (d && d !== modal) {
          warnings.push({
            ...base,
            item: it.name,
            type: 'die-anomaly',
            message: `${it.name} causa ${d}; o resto de ${category.name} usa ${modal}.`,
          });
        }
      }
    }

    // Dano com dado mas sem o +N por tier (Rapieras, Caneleiras).
    const withDice = items.filter((it) => it.damage?.die);
    if (
      withDice.length >= 4 &&
      withDice.every((it) => (it.damage?.bonus ?? 0) === 0)
    ) {
      warnings.push({
        ...base,
        type: 'missing-bonus',
        message: `${category.name}: nenhum item tem o +N de dano por tier (todos iguais).`,
      });
    }

    // Mão: a descrição fala em uma mão, as propriedades em duas.
    const oneHand = /\buma (?:unica )?mao\b/.test(fold(category.description));
    const twoHandProp = category.properties.some((p) =>
      /duas maos/.test(fold(p))
    );
    if (oneHand && twoHandProp) {
      warnings.push({
        ...base,
        type: 'hands-conflict',
        message: `${category.name}: a descrição diz uma mão, mas as propriedades listam "Duas Mãos".`,
      });
    }
  }

  const placeholders = items.filter((it) => isPlaceholder(it.name));
  if (placeholders.length) {
    warnings.push({
      ...base,
      type: 'placeholder-name',
      message: `${category.name}: ${placeholders.length} nomes com "[x]" (${placeholders.map((p) => p.name).join(', ')}); o jogador escolhe o instrumento.`,
    });
  }
}

// ─── Livraria (t53) ────────────────────────────────────────────────────────

function parseManaCost(raw: string): number | null {
  const m = raw.match(/\d+/);
  return m ? Number(m[0]) : null;
}

type GrimoireFormat = 'html-table' | 'line-grid' | 'bbcode-table';

function parseGrimoireSpells(segment: string): {
  spells: IGrimoireSpell[];
  format: GrimoireFormat | null;
} {
  const toSpell = (cells: Record<string, string>): IGrimoireSpell => {
    const extra: Record<string, string> = {};
    for (const [key, value] of Object.entries(cells)) {
      if (!['feitico', 'descricao', 'custoDeMana'].includes(key) && value) {
        extra[key] = value;
      }
    }
    return {
      name: cells.feitico ?? '',
      description: cells.descricao ?? '',
      manaCost: parseManaCost(cells.custoDeMana ?? ''),
      circle: null,
      ...(Object.keys(extra).length ? { extra } : {}),
    };
  };

  const table = segment.match(/<table[\s\S]*?<\/table>/i);
  if (table) {
    const { headers, rows } = parseHeadersAndRows(table[0]);
    const keys = headers.map(camelCase);
    const spells = rows
      .filter((r) => r.some((c) => c.trim()))
      .map((r) =>
        toSpell(Object.fromEntries(keys.map((k, i) => [k, r[i] ?? ''])))
      );
    return { spells, format: 'html-table' };
  }

  // Sem <table>: as células viram linhas, uma por <br>, e as linhas de uma
  // magia ficam coladas, separadas da seguinte por uma linha em branco.
  const rawLines = segment
    .replace(/<dt[\s\S]*?<\/dt>/gi, '')
    .split(/<br\s*\/?>/i)
    .map((l) => decode(stripTags(l)).trim());
  const bbcode = rawLines.some((l) => /^\[table\]/i.test(l));
  const lines = rawLines.map((l) =>
    l
      .replace(/^\[table\]/i, '')
      .replace(/\[\/table\]$/i, '')
      .trim()
  );

  const headerAt = lines.findIndex((l) => norm(l) === 'feitico');
  if (headerAt === -1) return { spells: [], format: null };

  const headers: string[] = [];
  let i = headerAt;
  while (i < lines.length && lines[i]) headers.push(lines[i++]);
  const keys = headers.map(camelCase);

  const spells: IGrimoireSpell[] = [];
  let group: string[] = [];
  const flush = () => {
    if (group.length === keys.length) {
      spells.push(
        toSpell(Object.fromEntries(keys.map((k, n) => [k, group[n]])))
      );
    } else if (group.length) {
      // Linha com número de células errado: não inventa campo.
      spells.push({
        name: group[0],
        description: group.slice(1).join(' '),
        manaCost: null,
        circle: null,
      });
    }
    group = [];
  };
  for (; i < lines.length; i++) {
    if (lines[i]) group.push(lines[i]);
    else flush();
  }
  flush();
  return { spells, format: bbcode ? 'bbcode-table' : 'line-grid' };
}

function parseGrimoireTopic(
  topic: string,
  bodies: string[],
  warnings: IItemWarning[]
): { categories: IItemCategory[]; items: IParsedItem[] } {
  const categories: IItemCategory[] = [];
  const items: IParsedItem[] = [];

  for (const body of bodies) {
    const banner = body.match(/<img[^>]+src="([^"]+)"/i)?.[1] ?? null;
    const headings = [
      ...body.matchAll(/<strong>\s*(Grim[oó]rio\s+d[^<]*?)\s*<\/strong>/gi),
    ];
    if (headings.length === 0) continue;

    const title = oneLine(
      body.match(/<strong>([\s\S]*?)<\/strong>/i)?.[1] ?? 'Grimórios'
    );
    const intro = htmlToText(body.slice(0, headings[0].index))
      .split('\n')
      .slice(1)
      .filter(Boolean);
    const category: IItemCategory = {
      name: normalizeTitle(title),
      slug: slugify(title),
      topic,
      kind: 'grimoire',
      description: intro.join('\n'),
      properties: [],
      banner,
      twoHanded: false,
      ignored: false,
      notes: [],
      headers: ['Feitiço', 'Descrição', 'Custo de Mana'],
      itemCount: 0,
    };

    headings.forEach((heading, n) => {
      const start = heading.index ?? 0;
      const end = headings[n + 1]?.index ?? body.length;
      const segment = body.slice(start + heading[0].length, end);
      const name = oneLine(heading[1]);

      const costText = htmlToText(segment).match(/Custo:\s*([\d.,]+)\s*Gil/i);
      const price = costText ? parsePrice(costText[1]) : null;
      const { spells, format } = parseGrimoireSpells(segment);

      if (format !== 'html-table') {
        warnings.push({
          type: 'grimoire-format',
          topic,
          category: category.name,
          item: name,
          message: format
            ? `${name}: magias sem <table> do fórum (${format}); lidas por linhas.`
            : `${name}: não foi possível ler a tabela de magias.`,
        });
      }
      if (spells.length === 0) {
        warnings.push({
          type: 'grimoire-empty',
          topic,
          category: category.name,
          item: name,
          message: `${name}: nenhuma magia lida.`,
        });
      }

      items.push({
        name,
        baseSlug: slugify(name),
        slug: slugify(name),
        kind: 'grimoire',
        category: category.name,
        categorySlug: category.slug,
        topic,
        source: 'forum',
        tier: null,
        tierRaw: null,
        price,
        availability: null,
        damage: null,
        armorClass: null,
        target: null,
        twoHanded: false,
        description: null,
        contentsText: null,
        contents: spells,
        extra: format ? { formatoTabela: format } : {},
        effectText: null,
        effects: [],
        notes: [],
        imageUrl: banner,
        flags: [],
      });
    });

    category.itemCount = headings.length;
    categories.push(category);
  }

  return { categories, items };
}

// ─── Slugs ─────────────────────────────────────────────────────────────────

const singular = (slug: string): string =>
  slug.endsWith('s') && !slug.endsWith('ss') ? slug.slice(0, -1) : slug;

/**
 * Atribui `slug` único a todos os itens, sempre a partir de `baseSlug`
 * (idempotente: pode ser chamada de novo com a lista de várias lojas).
 *
 * - Duplicado na mesma categoria: aviso e sufixo "-2", "-3".
 * - Mesmo slug em categorias diferentes: todos recebem a categoria no fim
 *   (valiant-rifle / valiant-pistola).
 */
export function assignUniqueSlugs(items: IParsedItem[]): IItemWarning[] {
  const warnings: IItemWarning[] = [];

  const inCategory = new Map<string, number>();
  for (const item of items) {
    const key = `${item.topic}|${item.categorySlug}|${item.baseSlug}`;
    const n = (inCategory.get(key) ?? 0) + 1;
    inCategory.set(key, n);
    item.slug = n === 1 ? item.baseSlug : `${item.baseSlug}-${n}`;
    if (n > 1) {
      warnings.push({
        type: 'duplicate-name',
        topic: item.topic,
        category: item.category,
        item: item.name,
        message: `"${item.name}" aparece mais de uma vez em ${item.category}; a repetição vira "${item.slug}".`,
      });
    }
  }

  const byBase = new Map<string, IParsedItem[]>();
  for (const item of items) {
    if (item.slug !== item.baseSlug) continue;
    const list = byBase.get(item.baseSlug) ?? [];
    list.push(item);
    byBase.set(item.baseSlug, list);
  }
  for (const [base, group] of byBase) {
    const categories = new Set(
      group.map((i) => `${i.topic}|${i.categorySlug}`)
    );
    if (categories.size < 2) continue;
    for (const item of group) {
      item.slug = `${base}-${singular(item.categorySlug)}`;
    }
    warnings.push({
      type: 'slug-collision',
      message: `"${group[0].name}" existe em ${group.map((i) => i.category).join(', ')}; slugs: ${group.map((i) => i.slug).join(', ')}.`,
    });
  }

  // Rede de segurança: nunca devolve dois slugs iguais.
  const used = new Set<string>();
  for (const item of items) {
    let slug = item.slug;
    let n = 2;
    while (used.has(slug)) slug = `${item.slug}-${n++}`;
    used.add(slug);
    item.slug = slug;
  }

  return warnings;
}

// ─── Ponto de entrada das lojas ────────────────────────────────────────────

export function parseShopTopic(html: string, url: string): IShopTopicResult {
  const topic = topicOf(url);
  const warnings: IItemWarning[] = [];
  const categories: IItemCategory[] = [];
  const items: IParsedItem[] = [];

  const bodies = extractPostBodies(html);

  if (topic === 't53') {
    const grimoires = parseGrimoireTopic(topic, bodies, warnings);
    categories.push(...grimoires.categories);
    items.push(...grimoires.items);
  } else {
    for (const body of bodies) {
      const banner = body.match(/<img[^>]+src="([^"]+)"/i)?.[1] ?? null;
      const parts = body.split(/(<table[\s\S]*?<\/table>)/i);
      const tableCount = Math.floor(parts.length / 2);
      if (tableCount === 0) continue;

      const drafts: ICategoryDraft[] = [];
      for (let t = 0; t < tableCount; t++) {
        const segment = readSegment(parts[t * 2], banner);
        drafts.push(
          parseTableCategory(topic, segment, parts[t * 2 + 1], warnings)
        );
      }
      // O texto depois da última tabela ("OBS", "REGRAS ESPECIAIS") é da última.
      const last = drafts[drafts.length - 1];
      last.trailer = readTrailer(parts[parts.length - 1]);
      last.category.notes.push(...last.trailer.lines);

      for (const draft of drafts) {
        // Caneleiras ficam de fora por ora (decisão do usuário), mas são lidas.
        if (norm(draft.category.name) === 'caneleiras') {
          draft.category.ignored = true;
          warnings.push({
            type: 'ignored-category',
            topic,
            category: draft.category.name,
            message:
              'Caneleiras ignoradas por ora (decisão do usuário); lidas e marcadas ignored.',
          });
        }
        linkAsteriskNotes(draft, warnings);
        checkCategory(draft, warnings);
        categories.push(draft.category);
        items.push(...draft.items);
      }
    }
  }

  warnings.push(...assignUniqueSlugs(items));
  return { categories, items, warnings };
}
