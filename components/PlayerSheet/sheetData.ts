import type { IPublicPlayer } from '@/db/players/publicFields';
import type { IBonus, ISkill } from '@/db/creatures/creatures';
import type { IStatDetail } from '@/db/citizens/citizen';
import { attributeKeyOf, modifierOf } from '@/lib/stats';
import type { AttributeKey } from '@/lib/stats';

export const DASH = '—';

// ── Attributes ──────────────────────────────────────────────

// Alias do tipo de lib/stats, que é onde o mapeamento nome → atributo mora
// agora que o servidor também precisa dele.
export type AttrKey = AttributeKey;

export const ATTRIBUTES: readonly {
  key: AttrKey;
  abbr: string;
  label: string;
}[] = [
  { key: 'str', abbr: 'FOR', label: 'Força' },
  { key: 'dex', abbr: 'DES', label: 'Destreza' },
  { key: 'con', abbr: 'CON', label: 'Constituição' },
  { key: 'int', abbr: 'INT', label: 'Inteligência' },
  { key: 'wis', abbr: 'SAB', label: 'Sabedoria' },
  { key: 'cha', abbr: 'CAR', label: 'Carisma' },
];

/**
 * The identity rows, as the canonical list rather than as whatever happens to
 * be filled in. Read-only rendering filters the blanks out; edit mode needs the
 * full list, or a field that is empty today could never be filled from here.
 */
export const IDENTITY_FIELDS: readonly { path: string; label: string }[] = [
  { path: 'age', label: 'Idade' },
  { path: 'height', label: 'Altura' },
  { path: 'size', label: 'Tamanho' },
  { path: 'gender', label: 'Gênero' },
  { path: 'race', label: 'Raça' },
  { path: 'type', label: 'Tipo' },
  { path: 'class', label: 'Classe' },
  { path: 'alignment', label: 'Alinhamento' },
  { path: 'family', label: 'Família' },
  { path: 'clan', label: 'Clã' },
  { path: 'kingdom', label: 'Reino' },
  { path: 'deity', label: 'Adoração' },
];

/** Same idea for the senses, which render as formatted tags when read-only. */
export const SENSE_FIELDS: readonly {
  path: string;
  label: string;
  meters: boolean;
}[] = [
  { path: 'senses.darkvision', label: 'Visão no escuro', meters: true },
  { path: 'senses.blindsight', label: 'Visão às cegas', meters: true },
  { path: 'senses.tremorsense', label: 'Sentido sísmico', meters: true },
  { path: 'senses.truesight', label: 'Visão verdadeira', meters: true },
  {
    path: 'senses.passivePerception',
    label: 'Percepção passiva',
    meters: false,
  },
];

// Skills are fixed by the system, grouped by the attribute that governs them.
export const SKILL_GROUPS: readonly { attr: AttrKey; skills: string[] }[] = [
  { attr: 'str', skills: ['Atletismo'] },
  { attr: 'dex', skills: ['Acrobacia', 'Furtividade', 'Prestidigitação'] },
  {
    attr: 'int',
    skills: ['Arcanismo', 'História', 'Investigação', 'Natureza', 'Religião'],
  },
  {
    attr: 'wis',
    skills: [
      'Intuição',
      'Medicina',
      'Percepção',
      'Sobrevivência',
      'Lidar com Animais',
    ],
  },
  {
    attr: 'cha',
    skills: ['Atuação', 'Enganação', 'Intimidação', 'Persuasão'],
  },
];

export const EQUIPMENT_SLOTS = [
  { key: 'head', label: 'Cabeça' },
  { key: 'accessory1', label: 'Acessório I' },
  { key: 'torso', label: 'Torso' },
  { key: 'accessory2', label: 'Acessório II' },
  { key: 'hand', label: 'Mão principal' },
  { key: 'offhand', label: 'Mão secundária' },
  { key: 'legs', label: 'Pernas' },
  { key: 'feet', label: 'Pés' },
] as const;

export type SlotKey = (typeof EQUIPMENT_SLOTS)[number]['key'];

// ── Text helpers ────────────────────────────────────────────

export const formatNumber = (n: number) => n.toLocaleString('pt-BR');

export const formatMeters = (m: number) => `${String(m).replace('.', ',')} m`;

const normalize = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase();

/** Trims a string list and drops blanks and lone dashes ("—" placeholders). */
export const cleanList = (list?: unknown): string[] =>
  Array.isArray(list)
    ? list
        .filter((v): v is string => typeof v === 'string')
        .map((v) => v.trim())
        .filter((v) => v && v !== '—' && v !== '-')
    : [];

export const splitLines = (text?: string): string[] =>
  (text ?? '')
    .split(/\r?\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

export const splitBackpack = (text?: string): string[] =>
  (text ?? '')
    .split(/[;\n]/)
    .map((p) => p.trim())
    .filter(Boolean);

export const isHttpUrl = (value?: string): value is string => {
  if (!value) return false;
  try {
    const { protocol } = new URL(value);
    return protocol === 'https:' || protocol === 'http:';
  } catch {
    return false;
  }
};

export const formatDate = (value?: string | Date): string | null => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toLocaleDateString('pt-BR');
};

// ── Data readers ────────────────────────────────────────────

export interface IAttrView {
  modifier: number;
  total?: number;
  base?: number;
  raceBonus?: number;
  classBonus?: number;
  // True when only the flat `stats` score exists (no Valor/Raça/Classe split).
  flat: boolean;
}

/** Attribute data from `playerStats`, falling back to the flat `stats`. */
export const readAttribute = (
  player: IPublicPlayer,
  key: AttrKey
): IAttrView | null => {
  const detail: IStatDetail | undefined = player.playerStats?.[key];
  if (detail && typeof detail.modifier === 'number') {
    return { ...detail, flat: false };
  }
  const flat = Number(player.stats?.[key]);
  if (player.stats?.[key] !== undefined && Number.isFinite(flat)) {
    return { modifier: modifierOf(flat), total: flat, flat: true };
  }
  return null;
};

export const attrFromName = attributeKeyOf;

export const sameName = (a?: string, b?: string) =>
  !!a && !!b && normalize(a) === normalize(b);

export interface IItemView {
  name: string;
  description?: string;
}

/** Equipment slots are stored as a plain name (current schema) or an object. */
export const readItem = (raw: unknown): IItemView | null => {
  if (typeof raw === 'string') {
    const name = raw.trim();
    return name ? { name } : null;
  }
  if (raw && typeof raw === 'object' && 'name' in raw) {
    const { name, description } = raw as {
      name?: unknown;
      description?: unknown;
    };
    if (typeof name !== 'string' || !name.trim()) return null;
    return {
      name: name.trim(),
      description: typeof description === 'string' ? description : undefined,
    };
  }
  return null;
};

export const hasSpellcasting = (player: IPublicPlayer): boolean =>
  !!player.playerSpellcasting &&
  typeof player.playerSpellcasting === 'object' &&
  Object.keys(player.playerSpellcasting).length > 0;

// ── Bônus de perícia ────────────────────────────────────────

/**
 * Parcelas de bônus de uma perícia.
 *
 * Documentos anteriores ao detalhamento guardam só o total em `bonus`, sem
 * origem; eles viram uma parcela única, para a exibição ser a mesma nos dois
 * casos. Um total zerado não vira parcela nenhuma.
 */
export const readBonuses = (entry?: ISkill): IBonus[] => {
  const detailed = Array.isArray(entry?.bonuses) ? entry.bonuses : [];
  if (detailed.length > 0) {
    return detailed.filter((b) => Number.isFinite(b?.value));
  }
  const total = entry?.bonus ?? 0;
  return total ? [{ value: total }] : [];
};

/** `bonus` é sempre a soma de `bonuses` — é o que o app inteiro já lê. */
export const sumBonuses = (bonuses: IBonus[]): number =>
  bonuses.reduce((total, b) => total + (Number(b.value) || 0), 0);

// ── Magias ──────────────────────────────────────────────────

// A lista de campos mora em db/l10n/spells porque o formulário completo do app
// edita exatamente os mesmos; reexportada aqui para os painéis não precisarem
// conhecer os dois caminhos.
export { SPELL_FIELDS, hasSpellDetail } from '@/db/l10n/spells';

// ── Menu ────────────────────────────────────────────────────

export type ScreenId =
  | 'status'
  | 'pericias'
  | 'habilidades'
  | 'arquetipo'
  | 'magias'
  | 'equipamento'
  | 'profissoes'
  | 'cronica';

export interface IMenuItem {
  id: ScreenId;
  label: string;
  desc: string;
  meta: string;
  disabled: boolean;
}

export const countAbilities = (player: IPublicPlayer): number =>
  [
    player.abilities,
    player.traits,
    player.actions,
    player.bonusActions,
    player.reactions,
    player.legendaryActions,
  ].reduce(
    (sum, list) =>
      sum + (Array.isArray(list) ? list.filter((a) => a?.name).length : 0),
    0
  );

/**
 * O arquétipo da ficha, quando ele já é escolha de verdade.
 *
 * `pickLevel` só vem resolvido quando a classe ligada TEM arquétipo na tabela
 * (ver services/classArchetypes.service.ts); comparar com o nível é o que
 * separa um necromante de nível 6, que já escolheu, de um druida de nível 1,
 * que só escolhe no 3. Até lá não há tela: oferecer um menu que não leva a
 * decisão nenhuma é pior que não oferecer.
 */
export const readArchetype = (player: IPublicPlayer) => {
  const archetype = player.archetype;
  const pickLevel = Number(archetype?.pickLevel);
  if (!Number.isFinite(pickLevel) || pickLevel < 1) return null;
  if ((player.level ?? 0) < pickLevel) return null;
  return {
    name: archetype?.name ?? '',
    chosen: archetype?.features?.length ?? 0,
    slots: archetype?.featureSlots ?? 0,
  };
};

export const readProfessions = (player: IPublicPlayer) =>
  Array.isArray(player.professions)
    ? player.professions.filter((p) => p?.name)
    : [];

export const countEquipped = (player: IPublicPlayer): number =>
  EQUIPMENT_SLOTS.filter((s) => readItem(player.equipment?.[s.key])).length;

/**
 * `editable` destrava "Magias" para quem ainda não conjura: sem isso, um
 * personagem que acabou de virar conjurador nunca alcançaria a tela onde se
 * preenche a conjuração.
 */
export const buildMenu = (
  player: IPublicPlayer,
  editable = false
): IMenuItem[] => {
  const caster = hasSpellcasting(player);
  const proficient = (player.proficiencies?.skills ?? []).filter(
    (s) => s.proficient
  ).length;
  const abilities = countAbilities(player);
  const professions = readProfessions(player).length;
  const archetype = readArchetype(player);

  return [
    {
      id: 'status',
      label: 'Status',
      desc: 'Identidade, atributos e defesas',
      meta: player.race?.split(' ')[0] ?? '',
      disabled: false,
    },
    {
      id: 'pericias',
      label: 'Perícias',
      desc: 'Testes, perícias e proficiências',
      meta: `${proficient} prof.`,
      disabled: false,
    },
    {
      id: 'habilidades',
      label: 'Habilidades',
      desc: 'Características, ações e reações',
      meta: String(abilities),
      disabled: false,
    },
    // Entra entre Habilidades e Magias, e só para quem já alcançou o nível de
    // escolha da classe. `filter(Boolean)` lá embaixo tira o buraco.
    archetype && {
      id: 'arquetipo' as const,
      label: 'Arquétipo',
      desc: archetype.name || 'Escolha o arquétipo da classe',
      meta: `${archetype.chosen}/${archetype.slots}`,
      disabled: false,
    },
    {
      id: 'magias',
      label: 'Magias',
      desc: caster
        ? 'Espaços por círculo e magias preparadas'
        : 'Sem conjuração',
      meta: caster ? `CD ${player.playerSpellcasting?.saveDC ?? DASH}` : DASH,
      disabled: !caster && !editable,
    },
    {
      id: 'equipamento',
      label: 'Equipamento',
      desc: 'Itens equipados, gil e mochila',
      meta: `${countEquipped(player)}/${EQUIPMENT_SLOTS.length}`,
      disabled: false,
    },
    {
      id: 'profissoes',
      label: 'Profissões',
      desc: 'Ofícios e especializações',
      meta: String(professions),
      disabled: false,
    },
    {
      id: 'cronica',
      label: 'Crônica',
      desc: 'Aparência, história e registro',
      meta: '',
      disabled: false,
    },
  ].filter(Boolean) as IMenuItem[];
};

export const tabId = (uid: string, id: ScreenId) => `${uid}-tab-${id}`;
