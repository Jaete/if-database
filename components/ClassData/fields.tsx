import type ICharacterClass from '@/db/classes/class.d';
import type {
  CatalogKind,
  IArchetype,
  IClassCatalog,
  IClassCatalogItem,
  IClassFeature,
  IClassLevel,
  IRelationEntity,
  ITalent,
} from '@/db/classes/class.d';
import { formatSlotCell } from '@/db/l10n/classes';
import SlotsField from './SlotsField';
import IconPicker from './IconPicker';

/** Campos do modal do cabeçalho da classe. */
export function overviewFields(k: ICharacterClass) {
  const text = (value?: string) => value ?? '';
  return [
    {
      name: 'name',
      label: 'Nome da classe',
      required: true,
      initialValue: text(k.name),
      placeholder: 'ex.: Druida',
    },
    {
      name: 'image',
      label: 'Imagem (URL)',
      required: false,
      initialValue: text(k.image),
      placeholder: 'https://… (retrato vertical, ~3:4)',
    },
    {
      name: 'roles',
      label: 'Papéis',
      required: false,
      initialValue: (k.roles ?? []).join(','),
      placeholder: 'ex.: controle, dps',
    },
    {
      name: 'hitDie',
      label: 'Dado de vida',
      required: false,
      initialValue: text(k.hitDie),
      placeholder: 'ex.: 1d6 por nível de Druida',
    },
    {
      name: 'hpAtFirstLevel',
      label: 'PV no 1º nível',
      required: false,
      initialValue: text(k.hpAtFirstLevel),
      placeholder: 'ex.: 6 + modificador de Constituição',
    },
    {
      name: 'hpPerLevel',
      label: 'PV por nível',
      required: false,
      initialValue: text(k.hpPerLevel),
      placeholder: 'ex.: 1d6 (ou 4) + modificador de Constituição',
    },
    {
      name: 'armor',
      label: 'Armaduras',
      required: false,
      initialValue: text(k.proficiencies?.armor),
      placeholder: 'ex.: Armaduras leves',
    },
    {
      name: 'weapons',
      label: 'Armas',
      required: false,
      initialValue: text(k.proficiencies?.weapons),
      placeholder: 'ex.: Cajados, bastões, facas',
    },
    {
      name: 'tools',
      label: 'Ferramentas',
      required: false,
      initialValue: text(k.proficiencies?.tools),
      placeholder: 'ex.: Nenhuma',
    },
    {
      name: 'savingThrows',
      label: 'Testes de resistência',
      required: false,
      initialValue: text(k.proficiencies?.savingThrows),
      placeholder: 'ex.: Sabedoria, Carisma',
    },
    {
      name: 'skills',
      label: 'Perícias',
      required: false,
      initialValue: text(k.proficiencies?.skills),
      placeholder: 'ex.: Escolha duas entre...',
    },
    {
      name: 'startingEquipment',
      label: 'Equipamento inicial — um item por linha',
      type: 'multiline' as const,
      required: false,
      initialValue: (k.startingEquipment ?? []).join('\n'),
      placeholder: 'Um bastão\nUm Robe rank 1',
    },
    {
      name: 'aliases',
      label: 'Variantes do nome (separadas por vírgula)',
      required: false,
      initialValue: (k.aliases ?? []).join(', '),
      placeholder: 'ex.: cavaleiro negro',
    },
    {
      name: 'description',
      label: 'Descrição — "-" faz um item de lista, "--" faz um sub-item',
      type: 'multiline' as const,
      required: false,
      initialValue: text(k.description),
      placeholder: 'O que a classe é.',
    },
    {
      name: 'shortDescription',
      label: 'Descrição curta (texto do card)',
      type: 'multiline' as const,
      required: false,
      initialValue: text(k.shortDescription),
      placeholder: 'Uma ou duas frases.',
    },
  ];
}

/** Campos do modal de um arquétipo. */
export function archetypeFields(archetype?: IArchetype) {
  return [
    {
      name: 'name',
      label: 'Nome do arquétipo',
      required: true,
      initialValue: archetype?.name ?? '',
      placeholder: 'ex.: Controlador de Enxames',
    },
    {
      name: 'description',
      label: 'Descrição — "-" faz um item de lista, "--" faz um sub-item',
      type: 'multiline' as const,
      required: false,
      initialValue: archetype?.description ?? '',
      placeholder: 'O que o arquétipo é.',
    },
  ];
}

/**
 * Campos do modal de um nível da progressão.
 *
 * `previous` é o nível imediatamente abaixo na tabela. Ele entra como piso dos
 * espaços de magia — um nível nunca tira o que o anterior já deu — e como
 * ponto de partida de um nível que ainda não concede nenhum: começar do zero
 * obrigaria a redigitar toda a progressão a cada degrau.
 */
export function levelFields(
  level: IClassLevel | undefined,
  columns: string[],
  previous?: IClassLevel
) {
  // A célula de concessões é editada como TEXTO, na mesma notação do fórum
  // ("A + B ou C"), e relida na gravação. Expor a estrutura em campos
  // separados obrigaria a inventar uma interface para a gramática inteira, e
  // quem edita já conhece a notação.
  const grants = level?.grants?.length
    ? level.grants
        .map((g) => g.options.map((o) => o.name).join(' ou '))
        .join(' + ')
    : (level?.abilityScoreIncrease ?? '');

  return [
    {
      name: 'proficiencyBonus',
      label: 'Bônus de proficiência',
      type: 'number' as const,
      required: false,
      // Num nível novo, os três primeiros campos partem do anterior: numa
      // tabela de progressão eles repetem muito mais do que mudam.
      initialValue: String(
        level?.proficiencyBonus ?? previous?.proficiencyBonus ?? ''
      ),
      placeholder: 'ex.: 2',
    },
    {
      name: 'cantripsKnown',
      label: 'Truques',
      type: 'number' as const,
      required: false,
      initialValue: String(
        level?.cantripsKnown ?? previous?.cantripsKnown ?? ''
      ),
      placeholder: 'ex.: 3',
    },
    {
      name: 'spellSlotsRaw',
      label: 'Slots de magia (por círculo)',
      required: false,
      // Sem espaços próprios, o nível herda os do anterior como ponto de
      // partida — é o piso de qualquer jeito, e deixá-lo em branco só daria
      // trabalho de redigitar.
      initialValue:
        level?.spellSlotsRaw ?? formatSlotCell(previous?.spellSlots ?? []),
      render: (value: string, onChange: (next: string) => void) => (
        <SlotsField
          value={value}
          floor={previous?.spellSlots ?? []}
          onChange={onChange}
        />
      ),
    },
    ...columns.map((label) => ({
      name: `col:${label}`,
      label,
      required: false,
      initialValue: level?.columns?.[label] ?? '',
      placeholder: '—',
    })),
    {
      name: 'grants',
      label: 'Concessões — "+" soma, "ou" é escolha',
      type: 'multiline' as const,
      required: false,
      initialValue: grants,
      placeholder: 'ex.: Marca + Localização de Armadilhas ou Ataque Furtivo',
    },
  ];
}

/**
 * Campos do modal de uma característica.
 *
 * `archetypes` só é passado quando o modal foi aberto pelo título da seção, e
 * aí ele precisa perguntar a qual arquétipo a característica pertence — do
 * contrário o botão teria de viver dentro de cada painel, o que o faz competir
 * com o lápis do próprio arquétipo.
 */
export function featureFields(
  feature?: IClassFeature,
  archetypes?: { value: string; label: string }[],
  selected?: string
) {
  return [
    ...(archetypes
      ? [
          {
            name: 'archetype',
            label: 'Arquétipo',
            required: true,
            initialValue: selected ?? archetypes[0]?.value ?? '',
            options: archetypes,
          },
        ]
      : []),
    {
      name: 'name',
      label: 'Nome',
      required: true,
      initialValue: feature?.name ?? '',
      placeholder: 'ex.: Forma Selvagem',
    },
    {
      name: 'level',
      label: 'Nível',
      type: 'number' as const,
      required: false,
      initialValue: feature?.level === undefined ? '' : String(feature.level),
      placeholder: 'ex.: 8',
    },
    {
      name: 'description',
      label: 'Descrição — "-" faz um item de lista, "--" faz um sub-item',
      type: 'multiline' as const,
      required: false,
      initialValue: feature?.description ?? '',
      placeholder: 'O que a característica faz.',
    },
  ];
}

const KIND_LABELS: Record<CatalogKind, string> = {
  magias: 'Lista de Magias',
  habilidades: 'Lista de Habilidades',
  relacao: 'Tabela de Relação',
};

/**
 * Campos do modal de uma lista própria da classe.
 *
 * `kind` é o tipo escolhido no primeiro passo; ao editar, vem da própria
 * lista e aparece só para leitura — trocar o tipo reinterpretaria os itens.
 */
export function catalogFields(catalog?: IClassCatalog, kind?: CatalogKind) {
  const resolved = catalog?.kind ?? kind;
  return [
    {
      name: 'name',
      label: 'Nome da lista',
      required: true,
      initialValue: catalog?.name ?? '',
      placeholder: 'ex.: Artes Divinas',
    },
    ...(resolved
      ? [
          {
            name: 'kind',
            label: 'Tipo',
            required: false,
            initialValue: resolved,
            render: (value: string) => (
              <span>{KIND_LABELS[value as CatalogKind] ?? value}</span>
            ),
          },
        ]
      : []),
    {
      name: 'description',
      label: 'Descrição — "-" faz um item de lista, "--" faz um sub-item',
      type: 'multiline' as const,
      required: false,
      initialValue: catalog?.description ?? '',
      placeholder: 'Quando se escolhe um item, e o que a lista custa.',
    },
    {
      name: 'icon',
      label: 'Ícone',
      required: false,
      initialValue:
        catalog?.icon ??
        (catalog ? '' : resolved === 'magias' ? 'spellbook' : 'scroll'),
      render: (value: string, onChange: (next: string) => void) => (
        <IconPicker value={value} onChange={onChange} />
      ),
    },
  ];
}

/**
 * Campos do modal de um item de lista. Magias pedem só nome e slug; o texto
 * mora no grimório. Habilidades (e listas sem tipo) pedem nome e descrição.
 */
export function catalogItemFields(
  item?: IClassCatalogItem,
  kind?: CatalogKind
) {
  const name = {
    name: 'name',
    label: 'Nome',
    required: true,
    initialValue: item?.name ?? '',
    placeholder: kind === 'magias' ? 'ex.: Allegro' : 'ex.: Bastião da Luz',
  };
  if (kind === 'magias') {
    return [
      name,
      {
        name: 'spell',
        label: 'Magia do grimório (slug) — o nome vira link para ela',
        required: true,
        initialValue: item?.spell ?? '',
        placeholder: 'ex.: allegro',
      },
    ];
  }
  return [
    name,
    {
      name: 'description',
      label: 'Descrição — "-" faz um item de lista, "--" faz um sub-item',
      type: 'multiline' as const,
      required: false,
      initialValue: item?.description ?? '',
      placeholder: 'O que o item faz.',
    },
  ];
}

/** Campos do modal de um talento. */
export function talentFields(talent?: ITalent) {
  return [
    {
      name: 'name',
      label: 'Nome',
      required: true,
      initialValue: talent?.name ?? '',
      placeholder: 'ex.: Camuflagem',
    },
    {
      name: 'requirement',
      label: 'Requisito',
      required: false,
      initialValue: talent?.requirement ?? '',
      placeholder: 'ex.: nível 8 de druida',
    },
    {
      name: 'description',
      label: 'Descrição — "-" faz um item de lista, "--" faz um sub-item',
      type: 'multiline' as const,
      required: false,
      initialValue: talent?.description ?? '',
      placeholder: 'O que o talento faz.',
    },
  ];
}

/**
 * Campos do modal de criação/edição de uma tabela de relação.
 *
 * Quando `catalog` é passado, preenche os campos com os dados atuais;
 * senão, é criação e todos os valores começam vazios.
 */
export function relationCatalogFields(catalog?: IClassCatalog) {
  return [
    {
      name: 'name',
      label: 'Nome da tabela',
      required: true,
      initialValue: catalog?.name ?? '',
      placeholder: 'ex.: Ordens & Domínios',
    },
    {
      name: 'description',
      label: 'Descrição',
      type: 'multiline' as const,
      required: false,
      initialValue: catalog?.description ?? '',
      placeholder: 'Explique brevemente o propósito desta tabela.',
    },
    {
      name: 'groupALabel',
      label: 'Grupo A — label',
      required: true,
      initialValue: catalog?.groupA?.label ?? '',
      placeholder: 'ex.: Ordens Deíficas',
    },
    {
      name: 'groupASingular',
      label: 'Grupo A — singular',
      required: true,
      initialValue: catalog?.groupA?.unitSingular ?? '',
      placeholder: 'ex.: ordem',
    },
    {
      name: 'groupAPlural',
      label: 'Grupo A — plural',
      required: true,
      initialValue: catalog?.groupA?.unitPlural ?? '',
      placeholder: 'ex.: ordens',
    },
    {
      name: 'groupBLabel',
      label: 'Grupo B — label',
      required: true,
      initialValue: catalog?.groupB?.label ?? '',
      placeholder: 'ex.: Domínios',
    },
    {
      name: 'groupBSingular',
      label: 'Grupo B — singular',
      required: true,
      initialValue: catalog?.groupB?.unitSingular ?? '',
      placeholder: 'ex.: domínio',
    },
    {
      name: 'groupBPlural',
      label: 'Grupo B — plural',
      required: true,
      initialValue: catalog?.groupB?.unitPlural ?? '',
      placeholder: 'ex.: domínios',
    },
    {
      name: 'kind',
      label: 'Tipo',
      required: false,
      initialValue: 'relacao',
      render: () => <span>{KIND_LABELS.relacao}</span>,
    },
    {
      name: 'icon',
      label: 'Ícone',
      required: false,
      initialValue: catalog?.icon ?? 'halo-sword',
      render: (value: string, onChange: (next: string) => void) => (
        <IconPicker value={value} onChange={onChange} />
      ),
    },
  ];
}

/**
 * Campos do editor de uma entidade de relação (Grupo A ou B).
 *
 * O editor completo (fatos, habilidades, lista, relações) é dinâmico e
 * vive no RelationCodex; estes campos cobrem só os dados básicos que o
 * PromptModal consegue mostrar. Os sub-arrays (facts, abilities, list,
 * relatedSlugs) são editados inline no componente RelationCodex.
 */
export function relationEntityFields(entity?: IRelationEntity) {
  return [
    {
      name: 'name',
      label: 'Nome',
      required: true,
      initialValue: entity?.name ?? '',
      placeholder: 'ex.: Protetor',
    },
    {
      name: 'subtitle',
      label: 'Subtítulo',
      required: false,
      initialValue: entity?.subtitle ?? '',
      placeholder: 'ex.: Devotos de Alexander',
    },
    {
      name: 'description',
      label: 'Descrição — "-" faz um item de lista, "--" faz um sub-item',
      type: 'multiline' as const,
      required: false,
      initialValue: entity?.description ?? '',
      placeholder: 'O que esta entidade é.',
    },
  ];
}
