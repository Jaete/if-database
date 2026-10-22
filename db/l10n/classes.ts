import type ICharacterClass from '../classes/class';
import type { IClassGrant } from '../classes/class';

/**
 * Rótulos e normalização de classes de personagem.
 *
 * Mora aqui, junto das outras tabelas em pt-BR, pelo mesmo motivo de
 * `spells.ts`: a mesma lista é usada pela página de classes, pelo formulário
 * da ficha e pelo vínculo com o grimório.
 */

/** Chave de identidade da classe. Mesma dobra de `spellSlug`. */
export const classSlug = (name: string): string =>
  name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/**
 * Dobra um nome de classe escrito à mão até a forma comparável.
 *
 * Cada remoção abaixo mata uma grafia real medida no campo `classes` das
 * magias, que tem 56 variantes para 15 classes:
 *   'invocador (nível 1)'   → parênteses
 *   'druida 1'              → dígitos
 *   'Mago Negro.'           → pontuação
 *   'Bardo'                 → caixa
 *   'astrólogo'             → acento
 */
export const normalizeClassName = (raw: string): string =>
  raw
    .replace(/\([^)]*\)/g, ' ')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\d+/g, ' ')
    .replace(/[^a-z\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Dobra o nome de uma característica até a forma comparável.
 *
 * A tabela de progressão e a lista de descrições da mesma classe não escrevem
 * o nome igual — o druida concede "Vinculo com a Natureza" na tabela e
 * descreve "Vínculo com a Natureza" no texto. Sem dobrar acento, caixa e
 * pontuação, a característica concedida ficaria sem descrição nenhuma.
 */
export const featureKey = (raw: string): string =>
  raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

/**
 * Quebra o texto livre de `Spell.classes` nos nomes que ele contém.
 *
 * Os separadores são os que o fórum realmente usa: vírgula, ponto-e-vírgula e
 * barra. " e " NÃO entra: quebrar por ele produziria pedaços como "branco",
 * que não casam com classe nenhuma. Um nome não reconhecido é melhor no
 * relatório de não casados do que inventado aqui.
 */
export const splitSpellClasses = (raw?: string): string[] => {
  if (!raw) return [];
  return [
    ...new Set(raw.split(/[,;/]/).map(normalizeClassName).filter(Boolean)),
  ];
};

/** Campos escalares da classe, para o modal de edição. */
export const CLASS_FIELDS: readonly {
  name: keyof ICharacterClass;
  label: string;
  placeholder: string;
}[] = [
  { name: 'hitDie', label: 'Dado de vida', placeholder: 'ex.: 1d8 por nível' },
  {
    name: 'hpAtFirstLevel',
    label: 'PV no 1º nível',
    placeholder: 'ex.: 8 + modificador de Constituição',
  },
  {
    name: 'hpPerLevel',
    label: 'PV nos níveis seguintes',
    placeholder: 'ex.: 1d8 (ou 5) + modificador de Constituição',
  },
];

/**
 * O que o formulário lê de uma classe.
 *
 * Deliberadamente mais frouxo que `ICharacterClass`: a listagem trabalha com a
 * projeção magra, em que `_id` já veio serializado como string.
 */
export interface IClassFormSource {
  name?: string;
  description?: string;
  aliases?: string[];
  hitDie?: string;
  hpAtFirstLevel?: string;
  hpPerLevel?: string;
  isUnique?: boolean;
}

/** Campos do modal: nome, escalares, variantes e descrição. */
export const classPromptFields = (klass?: IClassFormSource) => [
  {
    name: 'name',
    label: 'Nome da classe',
    required: true,
    initialValue: klass?.name ?? '',
    placeholder: 'ex.: Druida',
  },
  ...CLASS_FIELDS.map((field) => ({
    name: field.name as string,
    label: field.label,
    required: false,
    placeholder: field.placeholder,
    initialValue:
      (klass?.[field.name as keyof IClassFormSource] as string | undefined) ??
      '',
  })),
  {
    name: 'isUnique',
    label: 'Classe única (só um personagem no mundo pode tê-la)',
    required: false,
    initialValue: klass?.isUnique ? 'sim' : 'nao',
    options: [
      { value: 'nao', label: 'Não' },
      { value: 'sim', label: 'Sim' },
    ],
  },
  {
    name: 'aliases',
    label: 'Variantes do nome (separadas por vírgula)',
    required: false,
    initialValue: (klass?.aliases ?? []).join(', '),
    placeholder: 'ex.: injurador, conjurador',
  },
  {
    name: 'description',
    label: 'Descrição',
    type: 'multiline' as const,
    required: false,
    initialValue: klass?.description ?? '',
    placeholder: 'O que a classe é.',
  },
];

/** Monta a classe a partir do que o modal devolveu. */
export const classFromPrompt = (
  values: Record<string, string>
): Partial<ICharacterClass> => {
  const next: Record<string, unknown> = { name: values.name };
  for (const field of CLASS_FIELDS) {
    const key = field.name as string;
    if (values[key]) next[key] = values[key];
  }
  if (values.description) next.description = values.description;
  // Sempre escrito, inclusive como `false`: é um interruptor, e omitir o
  // "não" deixaria a classe única para sempre depois do primeiro "sim".
  next.isUnique = values.isUnique === 'sim';
  next.aliases = splitSpellClasses(values.aliases);
  return next as Partial<ICharacterClass>;
};

/** "4 (1º) / 3 (2º) / 2 (3º)" → [4, 3, 2], por círculo. */
export function parseSlotCell(cell: string): number[] {
  const slots: number[] = [];
  // O fórum mistura "º", "o" e "°" no ordinal do círculo.
  for (const m of cell.matchAll(/(\d+)\s*\(\s*(\d+)\s*[ºo°]?\s*\)/g)) {
    slots[Number(m[2]) - 1] = Number(m[1]);
  }
  return Array.from(slots, (value) => value ?? 0);
}

/** [4, 3] → "4 (1º) / 3 (2º)". Inverso de `parseSlotCell`. */
export function formatSlotCell(slots: number[]): string {
  return slots
    .map((count, index) => ({ count, circle: index + 1 }))
    .filter((slot) => slot.count > 0)
    .map((slot) => `${slot.count} (${slot.circle}º)`)
    .join(' / ');
}

/**
 * Lê a célula de características como a gramática que ela é.
 *
 * Regra da ficha do fórum: "+" separa concessões independentes e "ou" liga
 * mais forte que "+". Então o "ou" é resolvido DENTRO de cada termo separado
 * por "+", e não ao contrário:
 *
 *   "Vínculo com a Natureza + Sentido Natural"
 *      → duas concessões garantidas
 *   "Marca + Localização de Armadilhas ou Ataque Furtivo"
 *      → Marca garantida, e UMA entre as outras duas
 *   "H1 + H2 ou H3 + H4"
 *      → H1 e H4 garantidas, escolha entre H2 e H3
 *
 * O separador exige espaço dos dois lados. Sem isso, "+2 em um atributo ou +1
 * em dois atributos" seria partido no sinal do próprio bônus — ali o "+" é
 * parte do número, não separador.
 *
 * A VÍRGULA é o mesmo operador que o "+". Ela é a grafia das classes mais
 * antigas, escritas antes de a gramática estar fechada, e que nunca foram
 * revisadas — o arqueiro e o espadachim chegam a misturar as duas na mesma
 * célula ("Rajada, Defesa a distância + Mestre da Mira"). São as 12 únicas
 * células com vírgula nos 20 tópicos, e em nenhuma delas a vírgula está
 * dentro do nome de uma característica.
 */
export function parseGrants(cell: string): IClassGrant[] {
  // Normaliza "ou + X" → "ou X": alguns tópicos escrevem "A ou + B" quando
  // querem dizer "A ou B" (o "+" é redacional, não separador de concessão).
  const normalized = cell.replace(/\s+ou\s+\+\s+/gi, ' ou ');
  return normalized
    .split(/\s+\+\s+|\s*,\s*/)
    .map((term) => term.trim())
    .filter(Boolean)
    .map((term) => ({
      options: term
        .split(/\s+ou\s+/i)
        .map((option) => option.trim())
        .filter(Boolean)
        .map((option) => {
          // O "*" marca habilidade com requisito, explicado nela própria.
          const requiresPrerequisite = /\*\s*$/.test(option);
          return {
            name: option.replace(/\*\s*$/, '').trim(),
            ...(requiresPrerequisite ? { requiresPrerequisite } : {}),
          };
        }),
    }))
    .filter((grant) => grant.options.length > 0);
}

/**
 * O que uma concessão da tabela pede quando ela não nomeia uma característica.
 *
 * Três células dos vinte tópicos não concedem nada: pedem uma ESCOLHA.
 * "Arquétipo" quer dizer "escolha um dos arquétipos da classe", e "Habilidade
 * de Arquétipo" quer dizer "escolha mais uma habilidade do arquétipo que você
 * já escolheu". Tratá-las como característica — que é o que acontecia — punha
 * na ficha uma habilidade chamada "skill de arquétipo", sem descrição e sem
 * escolha nenhuma por trás.
 *
 * `rest` é o resto da célula quando o marcador vem colado a uma concessão de
 * verdade ("Habilidade do arquétipo e Arqueiro Mestre"). Ali o " e " é o mesmo
 * operador do "+", escrito à mão nas classes antigas — o mesmo caso da
 * vírgula em `parseGrants`. Resolver aqui em vez de na gramática é de
 * propósito: separar " e " de um nome como "Mestre da Morte-Viva e Além"
 * exigiria saber quais nomes existem, e aqui o prefixo já garante que o que
 * sobra é outra concessão.
 */
export type ArchetypePick = {
  kind: 'archetype' | 'archetypeFeature';
  rest?: string;
};

const ARCHETYPE_PICK = /^(?:escolha\s+d[eo]\s+)?arquetipos?(?=$|\s*\(|\s+e\s)/;
const ARCHETYPE_FEATURE_PICK =
  /^(?:skills?|habilidades?)\s+d[eo]\s+arquetipo(?=$|\s*\(|\s+e\s)/;

export function archetypePickOf(raw: string): ArchetypePick | null {
  const folded = raw.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

  const kind = ARCHETYPE_FEATURE_PICK.test(folded)
    ? ('archetypeFeature' as const)
    : ARCHETYPE_PICK.test(folded)
      ? ('archetype' as const)
      : null;
  if (!kind) return null;

  const at = raw.search(/\s+e\s+/i);
  const rest =
    at >= 0
      ? raw
          .slice(at)
          .replace(/^\s+e\s+/i, '')
          .trim()
      : '';
  return rest ? { kind, rest } : { kind };
}
