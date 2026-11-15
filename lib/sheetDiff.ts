// O diff da auditoria da ficha: antes → depois, por campo. Puro, sem banco.
//
// Compara só os campos que são DADO da ficha. Fica de fora o que é derivado ou
// de controle (a leitura resolve habilidades, linhagem e magias; `updatedAt`,
// `__v`, selos de nível, novidades), e o estado de criação (`creation`), que não
// vai a público: o que ele decide aparece nos campos da ficha. As observações da
// revisão (`review`) viram só "Observações enviadas", nunca o texto.

export interface IChange {
  path: string;
  label: string;
  before: unknown;
  after: unknown;
}

/** Raízes comparadas, com o rótulo de tela. */
export const FIELD_LABELS: Record<string, string> = {
  name: 'Nome',
  slug: 'Endereço',
  race: 'Raça',
  gender: 'Gênero',
  class: 'Classe',
  classId: 'Classe',
  raceId: 'Raça',
  raceChoice: 'Escolha de raça',
  age: 'Idade',
  height: 'Altura',
  family: 'Família',
  kingdom: 'Reino',
  clan: 'Clã',
  deity: 'Divindade',
  subtitle: 'Epíteto',
  image: 'Retrato',
  size: 'Tamanho',
  type: 'Tipo',
  alignment: 'Tendência',
  level: 'Nível',
  experience: 'Experiência',
  chi: 'Ki',
  proficiencyBonus: 'Proficiência',
  combat: 'Combate',
  stats: 'Atributos',
  playerStats: 'Atributos',
  proficiencies: 'Perícias e proficiências',
  defenses: 'Defesas',
  senses: 'Sentidos',
  languages: 'Idiomas',
  abilities: 'Habilidades',
  traits: 'Traços',
  actions: 'Ações',
  bonusActions: 'Ações bônus',
  reactions: 'Reações',
  legendaryActions: 'Ações lendárias',
  playerSpellcasting: 'Magias',
  archetype: 'Arquétipo',
  talents: 'Talentos',
  talentMilestones: 'Marcos de talento',
  featureChoices: 'Características escolhidas',
  catalogPicks: 'Escolhas de listas da classe',
  equipment: 'Equipamento e gil',
  professions: 'Profissões',
  appearance: 'Aparência',
  backstory: 'História',
  narrationStyle: 'Narração',
  status: 'Estado da ficha',
  ownerUsername: 'Dono',
};

/** Rótulos mais finos para alguns caminhos. */
const PATH_LABELS: [RegExp, string][] = [
  [/^equipment\.gil$/, 'Gil'],
  [/^equipment\.backpack$/, 'Mochila'],
  [/^equipment\.(\w+)$/, 'Equipamento'],
  [/^combat\.hp/, 'Vida'],
  [/^combat\.speed/, 'Deslocamento'],
  [/^combat\.ac/, 'Classe de armadura'],
  [/^playerStats\.(\w+)/, 'Atributo'],
  [/^proficiencies\.skills/, 'Perícia'],
  [/^proficiencies\.savingThrows/, 'Resistência'],
  [/^playerSpellcasting\.spellRefs/, 'Magia preparada'],
];

const ATTR = {
  str: 'Força',
  dex: 'Destreza',
  con: 'Constituição',
  int: 'Inteligência',
  wis: 'Sabedoria',
  cha: 'Carisma',
} as Record<string, string>;

export const labelOf = (path: string): string => {
  const hit = PATH_LABELS.find(([re]) => re.test(path));
  if (hit) {
    const attr = /^playerStats\.(\w+)/.exec(path)?.[1];
    if (attr && ATTR[attr]) return `Atributo · ${ATTR[attr]}`;
    const skill = /^proficiencies\.skills\[(.+?)\]/.exec(path)?.[1];
    if (skill) return `Perícia · ${skill}`;
    return hit[1];
  }
  return FIELD_LABELS[path.split(/[.[]/)[0]] ?? path;
};

/** A ficha só é comparada pelas raízes de FIELD_LABELS (e `review`, à parte). */
const COMPARED = new Set(Object.keys(FIELD_LABELS));

const MAX_TEXT = 4000;
const clip = (value: unknown): unknown =>
  typeof value === 'string' && value.length > MAX_TEXT
    ? `${value.slice(0, MAX_TEXT)}…`
    : value;

const isObject = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v) && !(v instanceof Date);

const norm = (v: unknown): unknown => {
  // ObjectId e Date viram texto: o diff compara valor, não identidade.
  if (v && typeof v === 'object' && !Array.isArray(v)) {
    const t = v as { toString?: () => string; _bsontype?: string };
    if (t._bsontype === 'ObjectId') return String(v);
    if (v instanceof Date) return v.toISOString();
  }
  return v;
};

const same = (a: unknown, b: unknown) =>
  JSON.stringify(norm(a) ?? null) === JSON.stringify(norm(b) ?? null);

/** O identificador de um item de lista que tem um: perícia, magia, talento. */
const keyOf = (item: unknown): string | null => {
  if (!isObject(item)) return null;
  for (const k of ['name', 'spellId', 'key']) {
    if (typeof item[k] === 'string' && item[k]) return `${item[k]}`;
  }
  return null;
};

function walk(path: string, before: unknown, after: unknown, out: IChange[]) {
  if (same(before, after)) return;
  if (isObject(before) || isObject(after)) {
    const b = isObject(before) ? before : {};
    const a = isObject(after) ? after : {};
    // Um valor que passou de objeto a outra coisa (ou o contrário): inteiro.
    if (
      (before !== undefined && before !== null && !isObject(before)) ||
      (after !== undefined && after !== null && !isObject(after))
    ) {
      out.push({
        path,
        label: labelOf(path),
        before: clip(norm(before)),
        after: clip(norm(after)),
      });
      return;
    }
    for (const key of new Set([...Object.keys(b), ...Object.keys(a)])) {
      walk(path ? `${path}.${key}` : key, b[key], a[key], out);
    }
    return;
  }
  if (Array.isArray(before) || Array.isArray(after)) {
    const b = Array.isArray(before) ? before : [];
    const a = Array.isArray(after) ? after : [];
    const keyed =
      [...b, ...a].length > 0 && [...b, ...a].every((i) => keyOf(i) !== null);
    if (keyed) {
      const bm = new Map(b.map((i) => [keyOf(i)!, i]));
      const am = new Map(a.map((i) => [keyOf(i)!, i]));
      for (const key of new Set([...bm.keys(), ...am.keys()])) {
        const was = bm.get(key);
        const now = am.get(key);
        if (!same(was, now)) {
          const p = `${path}[${key}]`;
          out.push({
            path: p,
            label: labelOf(p),
            before: was ?? null,
            after: now ?? null,
          });
        }
      }
      return;
    }
  }
  out.push({
    path,
    label: labelOf(path),
    before: clip(norm(before)),
    after: clip(norm(after)),
  });
}

/**
 * As mudanças entre dois documentos CRUS da ficha (do banco, antes da leitura
 * resolvida). `after` ausente = criação; `before` ausente = só o que nasceu.
 */
export function diffSheet(
  before: Record<string, unknown> | null,
  after: Record<string, unknown> | null
): IChange[] {
  const out: IChange[] = [];
  const b = before ?? {};
  const a = after ?? {};
  for (const key of new Set([...Object.keys(b), ...Object.keys(a)])) {
    if (!COMPARED.has(key)) continue;
    walk(key, b[key], a[key], out);
  }
  // As observações da revisão: só o fato de terem sido enviadas.
  const reviewBefore = Array.isArray(b.review) ? b.review.length : 0;
  const reviewAfter = Array.isArray(a.review) ? a.review.length : 0;
  if (reviewAfter > reviewBefore) {
    const added = (a.review as { kind?: string; notes?: string }[]).slice(
      reviewBefore
    );
    if (added.some((r) => r?.kind === 'return' && r?.notes)) {
      out.push({
        path: 'review',
        label: 'Observações enviadas',
        before: null,
        after: null,
      });
    }
  }
  return out;
}

/**
 * Funde a mudança mais nova numa entrada aberta do mesmo autor: fica o PRIMEIRO
 * `before` de cada campo e o ÚLTIMO `after`; o campo que voltou ao valor de
 * antes sai da entrada.
 */
export function mergeChanges(prev: IChange[], next: IChange[]): IChange[] {
  const byPath = new Map(prev.map((c) => [c.path, c]));
  for (const change of next) {
    const was = byPath.get(change.path);
    byPath.set(change.path, was ? { ...change, before: was.before } : change);
  }
  return [...byPath.values()].filter(
    (c) => c.path === 'review' || !same(c.before, c.after)
  );
}
