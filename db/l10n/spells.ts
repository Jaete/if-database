import type { IPlayerSpell } from '../citizens/citizen';
import type ISpell from '../spells/spell';

/**
 * Os campos da ficha de uma magia, na ordem em que as fontes do sistema os
 * apresentam.
 *
 * Mora aqui, junto das outras tabelas de rótulo em pt-BR, porque é a mesma
 * lista em três lugares: a leitura na ficha embutida, a edição nela e o
 * formulário completo do app. Divergir faria um editor gravar um campo que o
 * outro não mostra.
 */
export const SPELL_FIELDS: readonly {
  name: keyof IPlayerSpell;
  label: string;
  placeholder: string;
}[] = [
  { name: 'school', label: 'Escola', placeholder: 'ex.: Transmutação' },
  { name: 'classes', label: 'Classes', placeholder: 'ex.: bardo' },
  {
    name: 'castingTime',
    label: 'Tempo de conjuração',
    placeholder: 'ex.: 1 ação',
  },
  { name: 'range', label: 'Alcance', placeholder: 'ex.: Pessoal' },
  { name: 'components', label: 'Componentes', placeholder: 'ex.: V, S' },
  {
    name: 'duration',
    label: 'Duração',
    placeholder: 'ex.: Instantânea; veja o texto',
  },
  { name: 'target', label: 'Alvo', placeholder: 'ex.: 1 criatura viva' },
  { name: 'area', label: 'Área', placeholder: 'ex.: linha de 9 metros' },
  { name: 'effect', label: 'Efeito', placeholder: 'ex.: 2 raios' },
  {
    name: 'save',
    label: 'Teste de resistência',
    placeholder: 'ex.: Vontade anula',
  },
  {
    name: 'spellResistance',
    label: 'Resistência a magia',
    placeholder: 'ex.: sim',
  },
  { name: 'use', label: 'Uso', placeholder: 'ex.: 1/dia' },
];

/** Uma magia só vira botão de detalhe quando há detalhe para mostrar. */
export const hasSpellDetail = (spell: IPlayerSpell): boolean =>
  !!spell.description || SPELL_FIELDS.some((f) => !!spell[f.name]);

/**
 * Campos do modal de edição de magia: o nome, a ficha toda e a descrição,
 * que é longa e vai por último.
 */
export const spellPromptFields = (spell?: IPlayerSpell) => [
  {
    name: 'name',
    label: 'Nome da magia',
    initialValue: spell?.name ?? '',
    placeholder: 'ex.: Allegro',
  },
  ...SPELL_FIELDS.map((field) => ({
    name: field.name as string,
    label: field.label,
    required: false,
    placeholder: field.placeholder,
    initialValue: (spell?.[field.name] as string) ?? '',
  })),
  {
    name: 'description',
    label: 'Descrição',
    type: 'multiline' as const,
    required: false,
    initialValue: spell?.description ?? '',
    placeholder: 'O que a magia faz.',
  },
];

/** Monta a magia a partir do que o modal devolveu, sem campos vazios. */
export const spellFromPrompt = (
  values: Record<string, string>,
  base?: IPlayerSpell
): IPlayerSpell => {
  const next: IPlayerSpell = {
    ...base,
    name: values.name,
    prepared: base?.prepared ?? true,
  };
  const writable = next as unknown as Record<string, unknown>;
  for (const key of [
    ...SPELL_FIELDS.map((f) => f.name as string),
    'description',
  ]) {
    // Campo esvaziado some do documento em vez de virar string vazia.
    if (values[key]) writable[key] = values[key];
    else delete writable[key];
  }
  return next;
};

/**
 * Chave de identidade de uma magia: o nome sem acento, caixa ou pontuação.
 *
 * É o que faz reimportar um tópico atualizar as magias no lugar em vez de
 * duplicá-las — "Faísca Aérea" e "faisca aerea" são a mesma magia.
 */
export const spellSlug = (name: string): string =>
  name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/**
 * Campos do modal do grimório: igual ao da ficha, mais o círculo, e sem o
 * `prepared` — preparar é estado de quem conjura, não da magia no catálogo.
 */
export const grimoireSpellFields = (spell?: Partial<ISpell>) => [
  {
    name: 'name',
    label: 'Nome da magia',
    required: true,
    initialValue: spell?.name ?? '',
    placeholder: 'ex.: Faísca Aérea',
  },
  {
    name: 'circle',
    label: 'Círculo',
    type: 'number' as const,
    required: true,
    initialValue: spell?.circle === undefined ? '' : String(spell.circle),
    placeholder: '0 para truques',
  },
  {
    name: 'image',
    label: 'Imagem (URL)',
    required: false,
    initialValue: spell?.image ?? '',
    placeholder: 'https://…',
  },
  ...SPELL_FIELDS.map((field) => ({
    name: field.name as string,
    label: field.label,
    required: false,
    placeholder: field.placeholder,
    initialValue: (spell?.[field.name as keyof ISpell] as string) ?? '',
  })),
  {
    name: 'description',
    label: 'Descrição',
    type: 'multiline' as const,
    required: false,
    initialValue: spell?.description ?? '',
    placeholder: 'O que a magia faz.',
  },
];

/** Monta a magia do grimório a partir do que o modal devolveu. */
export const grimoireSpellFromPrompt = (
  values: Record<string, string>
): Partial<ISpell> => {
  const next: Record<string, unknown> = {
    name: values.name,
    circle: Number(values.circle) || 0,
    // Sempre escrita, mesmo vazia: é assim que a arte é removida.
    image: values.image ?? '',
  };
  for (const key of [
    ...SPELL_FIELDS.map((f) => f.name as string),
    'description',
  ]) {
    // Campo esvaziado some do documento em vez de virar string vazia.
    if (values[key]) next[key] = values[key];
  }
  return next as Partial<ISpell>;
};

/** O número que vai no selo do círculo: `T` para truque. */
export const circleLabel = (circle: number): string =>
  circle === 0 ? 'T' : String(circle);

/** O nome do círculo, para cabeçalhos e rótulos de acessibilidade. */
export const circleTitle = (circle: number): string =>
  circle === 0 ? 'Truques' : `${circle}º círculo`;

export const SPELL_SCHOOLS = [
  { key: 'abjuracao', prefix: 'abjur', label: 'Abjuração' },
  { key: 'adivinhacao', prefix: 'adivinh', label: 'Adivinhação' },
  { key: 'conjuracao', prefix: 'conjur', label: 'Conjuração' },
  { key: 'encantamento', prefix: 'encant', label: 'Encantamento' },
  { key: 'evocacao', prefix: 'evoc', label: 'Evocação' },
  { key: 'ilusao', prefix: 'ilus', label: 'Ilusão' },
  { key: 'necromancia', prefix: 'necro', label: 'Necromancia' },
  { key: 'transmutacao', prefix: 'transmut', label: 'Transmutação' },
] as const;

export type SpellSchoolKey = (typeof SPELL_SCHOOLS)[number]['key'] | 'outra';

/**
 * A escola canônica de um texto livre ("Evocação [Fogo]", "Ilusão (Sensação)").
 *
 * Casa pelo prefixo, sem acento nem caixa; o que não for reconhecido
 * ("Universal", vazio) cai em `outra`. Só serve para escolher cor e glifo: o
 * texto original continua sendo o que a magia mostra.
 */
export const spellSchoolKey = (school?: string): SpellSchoolKey => {
  const normalized = (school ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
  return (
    SPELL_SCHOOLS.find((s) => normalized.startsWith(s.prefix))?.key ?? 'outra'
  );
};

/** Nome curto da escola para a linha da lista. */
export const spellSchoolLabel = (school?: string): string => {
  const key = spellSchoolKey(school);
  const known = SPELL_SCHOOLS.find((s) => s.key === key);
  return known?.label ?? school?.split(/[\s([]/)[0] ?? '';
};
