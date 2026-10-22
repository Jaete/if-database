'use client';

import { useState } from 'react';
import Link from 'next/link';
import type ICharacterClass from '@/db/classes/class.d';
import type {
  IArchetype,
  IClassCatalog,
  IClassCatalogItem,
  IClassFeature,
  IClassLevel,
  ITalent,
} from '@/db/classes/class.d';
import { formatSlotCell } from '@/db/l10n/classes';
import { useCssHandles } from '@/hooks/useCssHandles';
import { useAuth } from '@/app/context/AuthContext';
import ConfirmModal from '../ConfirmModal';
import Modal from '../Modal';
import PromptModal from '../PromptModal';
import {
  CloseIcon,
  DieIcon,
  ListIcon,
  SunIcon,
  PencilIcon,
  ScrollIcon,
  ShieldIcon,
  StarIcon,
  TableIcon,
} from '../Icons';
import ClassWheel, { type IClassWheelNode } from './ClassWheel';
import SlotsField from './SlotsField';
import { nextLevelNumber, useClassData } from './useClassData';
import { renderDescription } from './richText';
import ClassDataHandles from './handles';
import '@/styles/components/classGrid.scss';

interface IProps {
  characterClass: ICharacterClass;
}

/**
 * A classe por inteiro: dados, progressão dos 20 níveis, características,
 * arquétipos e talentos.
 *
 * Leitura apenas. A autoria do conteúdo aninhado é a importação do fórum, que
 * é idempotente — corrigir lá e reimportar é o caminho.
 */
/** Índice que abre o modal para um nível novo, como `-1` nos outros editores. */
const NEW_LEVEL = -1;

const ORDINALS = ['', '1º', '2º', '3º', '4º', '5º', '6º', '7º', '8º', '9º'];

/**
 * Os espaços de magia do nível, um losango por espaço, em blocos por círculo.
 *
 * Cada bloco se fecha como um quadrado de quatro: três deixam o canto
 * faltando, dois viram uma linha no meio da altura e um fica centrado. A forma
 * é o que se lê de longe — dá para ver a progressão descendo a coluna sem ler
 * número nenhum.
 *
 * A célula crua ("4 (1º) / 2 (2º)") continua como título e rótulo acessível:
 * ela é a procedência, e o desenho não substitui o número exato.
 *
 * O losango é o mesmo da ficha, e de propósito: é lá que esses espaços são
 * gastos, e a mesma coisa deve ser a mesma coisa nas duas telas.
 */
function renderSlots(level: IClassLevel, handles: Record<string, string>) {
  const groups = (level.spellSlots ?? [])
    .map((count, index) => ({ circle: index + 1, count: Number(count) || 0 }))
    .filter((group) => group.count > 0);

  // Sem a célula estruturada não há o que desenhar: algumas classes só têm o
  // texto original, e perdê-lo seria pior que não ter o desenho.
  if (groups.length === 0) return level.spellSlotsRaw ?? '—';

  const label = groups
    .map((g) => `${g.count} de ${ORDINALS[g.circle] ?? `${g.circle}º`}`)
    .join(', ');

  return (
    <span
      className={handles.codexSlots}
      role="img"
      aria-label={`Espaços de magia: ${label}`}
      title={level.spellSlotsRaw}
    >
      {groups.map((group) => (
        <span key={group.circle} className={handles.codexSlotGroup}>
          <span className={handles.codexSlotCircle}>
            {ORDINALS[group.circle] ?? `${group.circle}º`}
          </span>
          <span className={handles.codexSlotGrid}>
            {Array.from({ length: group.count }, (_, i) => (
              <i key={i} className={handles.codexSlot} />
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}

/**
 * Mostra o que o nível concede, preservando a diferença entre garantido e
 * escolha — que é a informação que a célula crua do fórum carrega e uma lista
 * plana perderia.
 */
function renderGrants(level: IClassLevel) {
  if (!level.grants?.length) return level.abilityScoreIncrease ?? '—';

  return level.grants.map((grant, i) => (
    <span key={i}>
      {i > 0 && ' + '}
      {grant.options.map((option, j) => (
        <span key={option.name}>
          {j > 0 && <em> ou </em>}
          {option.name}
          {option.requiresPrerequisite && (
            <abbr title="Exige um requisito, descrito na própria habilidade">
              *
            </abbr>
          )}
        </span>
      ))}
    </span>
  ));
}

/** Campos do modal do cabeçalho da classe. */
function overviewFields(k: ICharacterClass) {
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
  ];
}

/** Campos do modal de um arquétipo. */
function archetypeFields(archetype?: IArchetype) {
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
function levelFields(
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
function featureFields(
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

/** Campos do modal de uma lista própria da classe. */
function catalogFields(catalog?: IClassCatalog) {
  return [
    {
      name: 'name',
      label: 'Nome da lista',
      required: true,
      initialValue: catalog?.name ?? '',
      placeholder: 'ex.: Artes Divinas',
    },
    {
      name: 'description',
      label: 'Descrição — "-" faz um item de lista, "--" faz um sub-item',
      type: 'multiline' as const,
      required: false,
      initialValue: catalog?.description ?? '',
      placeholder: 'Quando se escolhe um item, e o que a lista custa.',
    },
  ];
}

/** Campos do modal de um item de lista. */
function catalogItemFields(item?: IClassCatalogItem) {
  return [
    {
      name: 'name',
      label: 'Nome',
      required: true,
      initialValue: item?.name ?? '',
      placeholder: 'ex.: Bastião da Luz',
    },
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
function talentFields(talent?: ITalent) {
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

const ClassData = ({ characterClass: initial }: IProps) => {
  const handles = useCssHandles(ClassDataHandles);
  const { canEdit } = useAuth();
  const {
    characterClass: k,
    error,
    saving,
    saveOverview,
    saveArchetype,
    removeArchetype,
    saveArchetypeFeature,
    removeArchetypeFeature,
    saveLevel,
    removeLevel,
    applyCandidate,
    discardCandidate,
    saveFeature,
    removeFeature,
    saveCatalog,
    removeCatalog,
    saveCatalogItem,
    removeCatalogItem,
    saveTalent,
    removeTalent,
  } = useClassData(initial);

  // Índice em edição por tipo; -1 acrescenta, null é o modal fechado.
  const [levelAt, setLevelAt] = useState<number | null>(null);
  const [featureAt, setFeatureAt] = useState<number | null>(null);
  const [talentAt, setTalentAt] = useState<number | null>(null);
  const [editingOverview, setEditingOverview] = useState(false);
  const [archetypeAt, setArchetypeAt] = useState<number | null>(null);
  const [catalogAt, setCatalogAt] = useState<number | null>(null);
  const [catalogItemAt, setCatalogItemAt] = useState<[number, number] | null>(
    null
  );
  const [openNode, setOpenNode] = useState<string | null>(null);
  // Par [índice do arquétipo, índice da característica]; -1 acrescenta.
  const [archFeatureAt, setArchFeatureAt] = useState<[number, number] | null>(
    null
  );

  const nextLevel = nextLevelNumber(k.levels);
  /**
   * O que o X pediu para excluir, com o que dizer e o que fazer.
   *
   * Um estado só para os cinco tipos — nível, característica, arquétipo,
   * característica de arquétipo e talento. Cinco pares de estado e cinco
   * modais de confirmação seriam a mesma coisa escrita cinco vezes, e o que
   * muda entre eles é texto.
   *
   * Estas exclusões são as únicas da página que acontecem fora de um modal de
   * edição: um clique só, direto na lista. Por isso perguntam antes.
   */
  const [removing, setRemoving] = useState<{
    title: string;
    message: string;
    confirm: () => void;
  } | null>(null);

  const facts: [string, string | undefined][] = [
    ['Dado de vida', k.hitDie],
    ['PV no 1º nível', k.hpAtFirstLevel],
    ['PV por nível', k.hpPerLevel],
    ['Armaduras', k.proficiencies?.armor],
    ['Armas', k.proficiencies?.weapons],
    ['Ferramentas', k.proficiencies?.tools],
    ['Testes de resistência', k.proficiencies?.savingThrows],
    ['Perícias', k.proficiencies?.skills],
  ];

  // Colunas específicas desta classe, descobertas nos próprios níveis.
  const extraColumns = [
    ...new Set(
      (k.levels ?? []).flatMap((level) => Object.keys(level.columns ?? {}))
    ),
  ];

  const talentEntries = (k.talents ?? []).map((talent, index) => ({
    talent,
    index,
  }));
  const looseTalents = talentEntries.filter((entry) => !entry.talent.group);
  const talentGroups = talentEntries.reduce<
    {
      name: string;
      unlock?: string;
      entries: { talent: ITalent; index: number }[];
    }[]
  >((groups, entry) => {
    const name = entry.talent.group;
    if (!name) return groups;
    const found = groups.find((group) => group.name === name);
    if (found) {
      found.entries.push(entry);
      return groups;
    }
    groups.push({
      name,
      unlock: entry.talent.unlock,
      entries: [entry],
    });
    return groups;
  }, []);

  const renderTalent = (talent: ITalent, index: number) => (
    <article
      key={`${talent.name}-${index}`}
      className={`${handles.codexFeature} section`}
    >
      <h3 className={handles.codexFeatureName}>
        <span className="sectionTitle">{talent.name}</span>
        {talent.requirement && (
          <span className={handles.codexFeatureLevel}>
            Requer {talent.requirement}
          </span>
        )}
        {canEdit && (
          <>
            <button
              type="button"
              className={handles.codexEdit}
              onClick={() => setTalentAt(index)}
              aria-label={`Editar ${talent.name}`}
            >
              <PencilIcon />
            </button>
            <button
              type="button"
              className={handles.codexRemove}
              onClick={() =>
                setRemoving({
                  title: `Excluir o talento ${talent.name}?`,
                  message:
                    'O talento sai da classe com a descrição e as tabelas dele.',
                  confirm: () => removeTalent(index),
                })
              }
              aria-label={`Excluir ${talent.name}`}
            >
              <CloseIcon />
            </button>
          </>
        )}
      </h3>
      {renderDescription(talent.description, talent.tables, handles)}
    </article>
  );

  const wheelNodes: IClassWheelNode[] = [
    { id: 'progressao', label: 'Progressão', icon: TableIcon },
  ];
  if ((k.features?.length ?? 0) > 0 || canEdit) {
    wheelNodes.push({
      id: 'caracteristicas',
      label: 'Características',
      icon: ScrollIcon,
    });
  }
  if ((k.archetypes?.length ?? 0) > 0 || canEdit) {
    wheelNodes.push({
      id: 'arquetipos',
      label: 'Arquétipos',
      icon: ShieldIcon,
    });
  }
  if ((k.talents?.length ?? 0) > 0 || canEdit) {
    wheelNodes.push({ id: 'talentos', label: 'Talentos', icon: StarIcon });
  }
  for (const catalog of k.catalogs ?? []) {
    wheelNodes.push({
      id: `catalog:${catalog.slug}`,
      label: catalog.name,
      icon: catalog.slug === 'artes-divinas' ? SunIcon : ListIcon,
    });
  }
  wheelNodes.push({ id: 'dados', label: 'Dados', icon: DieIcon });

  const wheelTitle =
    openNode === 'dados'
      ? 'Dados'
      : openNode === 'progressao'
        ? 'Progressão'
        : openNode === 'caracteristicas'
          ? 'Características'
          : openNode === 'arquetipos'
            ? 'Arquétipos'
            : openNode === 'talentos'
              ? 'Talentos'
              : ((k.catalogs ?? []).find(
                  (catalog) => `catalog:${catalog.slug}` === openNode
                )?.name ?? '');

  const wheelRailed =
    openNode === 'caracteristicas' ||
    openNode === 'arquetipos' ||
    openNode === 'talentos' ||
    (openNode?.startsWith('catalog:') ?? false);

  return (
    <div className={handles.codexDetail}>
      <Link href="/classes" className={handles.codexBack} prefetch={false}>
        ← Classes
      </Link>
      <h1 className={handles.codexDetailTitle}>{k.name}</h1>
      {k.description && (
        <p className={handles.codexDetailIntro}>{k.description}</p>
      )}

      {canEdit && k.candidate && (
        <section className={handles.codexCandidate}>
          <h2 className={handles.codexCandidateTitle}>
            Texto extraído, à espera de avaliação
          </h2>
          <p className={handles.codexCandidateWhy}>
            {k.candidate.reason} Por isso nada disto entrou na classe
            automaticamente — confira contra{' '}
            {k.sourceUrl ? (
              <a
                className={handles.codexCandidateLink}
                href={k.sourceUrl}
                target="_blank"
                rel="noreferrer"
              >
                o tópico
              </a>
            ) : (
              'o tópico'
            )}{' '}
            antes de aceitar.
          </p>

          {(
            [
              ['Características', k.candidate.features],
              ['Arquétipos', k.candidate.archetypes],
              ['Talentos', k.candidate.talents],
            ] as const
          ).map(([label, list]) =>
            (list?.length ?? 0) === 0 ? null : (
              <div key={label} className={handles.codexCandidateGroup}>
                <span className={handles.codexCandidateCount}>
                  {list!.length} {label.toLowerCase()}
                </span>
                <p className={handles.codexCandidateNames}>
                  {list!.map((item) => item.name).join(' · ')}
                </p>
              </div>
            )
          )}

          <div className={handles.codexCandidateActions}>
            <button
              type="button"
              className={handles.codexEdit}
              onClick={() => applyCandidate()}
            >
              Aceitar tudo
            </button>
            <button
              type="button"
              className={handles.codexCandidateDiscard}
              onClick={() =>
                setRemoving({
                  title: 'Descartar o texto extraído?',
                  message:
                    'As características, arquétipos e talentos que o importador separou somem. O texto cru do tópico continua guardado, e reimportar a classe gera tudo de novo.',
                  confirm: () => discardCandidate(),
                })
              }
            >
              Descartar
            </button>
          </div>
        </section>
      )}

      <ClassWheel
        nodes={wheelNodes}
        name={k.name}
        onOpen={setOpenNode}
        onAddList={canEdit ? () => setCatalogAt(-1) : undefined}
      />

      <Modal
        isOpen={openNode !== null}
        onClose={() => setOpenNode(null)}
        title={wheelTitle}
        sectionRail={wheelRailed}
      >
        {openNode === 'dados' && (
          <section className={handles.codexSection}>
            <h2 className={handles.codexSectionTitle}>
              Características de classe
              {canEdit && (
                <button
                  type="button"
                  className={handles.codexEdit}
                  onClick={() => setEditingOverview(true)}
                  aria-label="Editar características de classe"
                >
                  <PencilIcon />
                </button>
              )}
            </h2>
            <dl className={handles.codexFacts}>
              {facts
                .filter(([, value]) => !!value)
                .map(([label, value]) => (
                  <div key={label} className={handles.codexFact}>
                    <dt className={handles.codexFactLabel}>{label}</dt>
                    <dd className={handles.codexFactValue}>{value}</dd>
                  </div>
                ))}
            </dl>
            {(k.startingEquipment?.length ?? 0) > 0 && (
              <div className={handles.codexFact}>
                <dt className={handles.codexFactLabel}>Equipamento inicial</dt>
                <dd className={handles.codexFactValue}>
                  {k.startingEquipment?.join(' · ')}
                </dd>
              </div>
            )}
          </section>
        )}

        {openNode === 'progressao' && (
          <section className={handles.codexSection}>
            <h2 className={handles.codexSectionTitle}>
              Progressão
              {canEdit && (
                <button
                  type="button"
                  className={handles.codexEdit}
                  onClick={() => setLevelAt(NEW_LEVEL)}
                >
                  + Nível {nextLevel}
                </button>
              )}
            </h2>
            <div className={handles.codexTableScroll}>
              <table className={handles.codexTable}>
                <thead>
                  <tr>
                    <th>Nível</th>
                    <th>Prof.</th>
                    {k.isSpellcaster && <th>Truques</th>}
                    {k.isSpellcaster && <th>Slots por círculo</th>}
                    {extraColumns.map((label) => (
                      <th key={label}>{label}</th>
                    ))}
                    <th>Características</th>
                    {canEdit && <th aria-label="Ações" />}
                  </tr>
                </thead>
                <tbody>
                  {(k.levels ?? []).map((level, index) => (
                    <tr key={level.level}>
                      <td>{level.level}</td>
                      <td>
                        {level.proficiencyBonus !== undefined
                          ? `+${level.proficiencyBonus}`
                          : '—'}
                      </td>
                      {k.isSpellcaster && <td>{level.cantripsKnown ?? '—'}</td>}
                      {k.isSpellcaster && (
                        <td>{renderSlots(level, handles)}</td>
                      )}
                      {extraColumns.map((label) => (
                        <td key={label}>{level.columns?.[label] ?? '—'}</td>
                      ))}
                      <td className={handles.codexGrantCell}>
                        {renderGrants(level)}
                      </td>
                      {canEdit && (
                        <td className={handles.codexLevelCell}>
                          <button
                            type="button"
                            className={handles.codexEdit}
                            onClick={() => setLevelAt(index)}
                            aria-label={`Editar nível ${level.level}`}
                          >
                            <PencilIcon />
                          </button>
                          <button
                            type="button"
                            className={handles.codexRemove}
                            onClick={() =>
                              setRemoving({
                                title: `Excluir o nível ${level.level}?`,
                                message:
                                  'A linha sai da tabela com tudo o que ela concede. Os outros níveis mantêm a numeração que têm.',
                                confirm: () => removeLevel(index),
                              })
                            }
                            aria-label={`Excluir nível ${level.level}`}
                          >
                            <CloseIcon />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {openNode === 'caracteristicas' && (
          <section className={handles.codexSection}>
            <h2 className={handles.codexSectionTitle}>
              Características
              {canEdit && (
                <button
                  type="button"
                  className={handles.codexEdit}
                  onClick={() => setFeatureAt(-1)}
                >
                  + Característica
                </button>
              )}
            </h2>
            {k.features?.map((feature, i) => (
              <article
                key={`${feature.name}-${i}`}
                className={`${handles.codexFeature} section`}
              >
                <h3 className={handles.codexFeatureName}>
                  <span className="sectionTitle">{feature.name}</span>
                  {feature.level !== undefined && (
                    <span className={handles.codexFeatureLevel}>
                      Nível {feature.level}
                    </span>
                  )}
                  {canEdit && (
                    <>
                      <button
                        type="button"
                        className={handles.codexEdit}
                        onClick={() => setFeatureAt(i)}
                        aria-label={`Editar ${feature.name}`}
                      >
                        <PencilIcon />
                      </button>
                      <button
                        type="button"
                        className={handles.codexRemove}
                        onClick={() =>
                          setRemoving({
                            title: `Excluir ${feature.name}?`,
                            message:
                              'A característica sai da classe com a descrição e as tabelas dela. A tabela de progressão continua citando o nome, porque quem concede a característica é o nível.',
                            confirm: () => removeFeature(i),
                          })
                        }
                        aria-label={`Excluir ${feature.name}`}
                      >
                        <CloseIcon />
                      </button>
                    </>
                  )}
                </h3>
                {renderDescription(
                  feature.description,
                  feature.tables,
                  handles
                )}
              </article>
            ))}
          </section>
        )}

        {openNode === 'arquetipos' && (
          <section className={handles.codexSection}>
            <h2 className={handles.codexSectionTitle}>
              Arquétipos
              {canEdit && (
                <button
                  type="button"
                  className={handles.codexEdit}
                  onClick={() => setArchetypeAt(-1)}
                >
                  + Arquétipo
                </button>
              )}
            </h2>
            {k.archetypes?.map((archetype, ai) => (
              <article
                key={archetype.slug}
                className={`${handles.codexArchetype} section`}
              >
                <header className={handles.codexArchetypeHead}>
                  <span className={handles.codexArchetypeTag}>Arquétipo</span>
                  <h3 className={`${handles.codexArchetypeName} sectionTitle`}>
                    {archetype.name}
                    {canEdit && (
                      <>
                        <button
                          type="button"
                          className={handles.codexEdit}
                          onClick={() => setArchetypeAt(ai)}
                          aria-label={`Editar ${archetype.name}`}
                        >
                          <PencilIcon />
                        </button>
                        <button
                          type="button"
                          className={handles.codexRemove}
                          onClick={() =>
                            setRemoving({
                              title: `Excluir o arquétipo ${archetype.name}?`,
                              message: `O arquétipo sai da classe levando junto as ${archetype.features?.length ?? 0} características que ele concede.`,
                              confirm: () => removeArchetype(ai),
                            })
                          }
                          aria-label={`Excluir ${archetype.name}`}
                        >
                          <CloseIcon />
                        </button>
                      </>
                    )}
                  </h3>
                  {renderDescription(archetype.description, undefined, handles)}
                </header>

                {((archetype.features?.length ?? 0) > 0 || canEdit) && (
                  <div className={handles.codexArchetypeBody}>
                    <h4 className={handles.codexArchetypeSubtitle}>
                      O que {archetype.name} concede
                      {/* O botão vive aqui, e não no título da seção: agora que
                        o subtítulo nomeia o arquétipo, a que ele se aplica é
                        óbvio pela posição. */}
                      {canEdit && (
                        <button
                          type="button"
                          className={handles.codexEdit}
                          onClick={() => setArchFeatureAt([ai, -1])}
                        >
                          + Característica
                        </button>
                      )}
                    </h4>
                    {archetype.features?.map((feature, i) => (
                      <section
                        key={`${feature.name}-${i}`}
                        className={handles.codexSubFeature}
                      >
                        <h5 className={handles.codexFeatureName}>
                          {feature.level !== undefined && (
                            <span className={handles.codexFeatureLevel}>
                              Nível {feature.level}
                            </span>
                          )}
                          {feature.name}
                          {canEdit && (
                            <>
                              <button
                                type="button"
                                className={handles.codexEdit}
                                onClick={() => setArchFeatureAt([ai, i])}
                                aria-label={`Editar ${feature.name}`}
                              >
                                <PencilIcon />
                              </button>
                              <button
                                type="button"
                                className={handles.codexRemove}
                                onClick={() =>
                                  setRemoving({
                                    title: `Excluir ${feature.name}?`,
                                    message: `A característica sai do arquétipo ${archetype.name}. O arquétipo em si continua na classe.`,
                                    confirm: () =>
                                      removeArchetypeFeature(ai, i),
                                  })
                                }
                                aria-label={`Excluir ${feature.name}`}
                              >
                                <CloseIcon />
                              </button>
                            </>
                          )}
                        </h5>
                        {renderDescription(
                          feature.description,
                          feature.tables,
                          handles
                        )}
                      </section>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </section>
        )}

        {(k.catalogs ?? []).map((catalog, ci) =>
          openNode === `catalog:${catalog.slug}` ? (
            <section key={catalog.slug} className={handles.codexSection}>
              <article className={handles.codexArchetype}>
                <header className={handles.codexArchetypeHead}>
                  <h3 className={handles.codexArchetypeName}>
                    {catalog.name}
                    {canEdit && (
                      <>
                        <button
                          type="button"
                          className={handles.codexEdit}
                          onClick={() => setCatalogAt(ci)}
                          aria-label={`Editar ${catalog.name}`}
                        >
                          <PencilIcon />
                        </button>
                        <button
                          type="button"
                          className={handles.codexRemove}
                          onClick={() =>
                            setRemoving({
                              title: `Excluir a lista ${catalog.name}?`,
                              message: `A lista sai da classe levando junto os ${catalog.items?.length ?? 0} itens dela.`,
                              confirm: () => removeCatalog(ci),
                            })
                          }
                          aria-label={`Excluir ${catalog.name}`}
                        >
                          <CloseIcon />
                        </button>
                      </>
                    )}
                  </h3>
                  {renderDescription(catalog.description, undefined, handles)}
                </header>
                {((catalog.items?.length ?? 0) > 0 || canEdit) && (
                  <div className={handles.codexArchetypeBody}>
                    <h4 className={handles.codexArchetypeSubtitle}>
                      Itens
                      {canEdit && (
                        <button
                          type="button"
                          className={handles.codexEdit}
                          onClick={() => setCatalogItemAt([ci, -1])}
                        >
                          + Item
                        </button>
                      )}
                    </h4>
                    {catalog.items?.map((item, i) => (
                      <section
                        key={`${item.name}-${i}`}
                        className={`${handles.codexSubFeature} section`}
                      >
                        <h5
                          className={`${handles.codexFeatureName} sectionTitle`}
                        >
                          {item.name}
                          {canEdit && (
                            <>
                              <button
                                type="button"
                                className={handles.codexEdit}
                                onClick={() => setCatalogItemAt([ci, i])}
                                aria-label={`Editar ${item.name}`}
                              >
                                <PencilIcon />
                              </button>
                              <button
                                type="button"
                                className={handles.codexRemove}
                                onClick={() =>
                                  setRemoving({
                                    title: `Excluir ${item.name}?`,
                                    message: `O item sai da lista ${catalog.name}. A lista em si continua na classe.`,
                                    confirm: () => removeCatalogItem(ci, i),
                                  })
                                }
                                aria-label={`Excluir ${item.name}`}
                              >
                                <CloseIcon />
                              </button>
                            </>
                          )}
                        </h5>
                        {renderDescription(
                          item.description,
                          item.tables,
                          handles
                        )}
                      </section>
                    ))}
                  </div>
                )}
              </article>
            </section>
          ) : null
        )}

        {openNode === 'talentos' && (
          <section className={handles.codexSection}>
            <h2 className={handles.codexSectionTitle}>
              Talentos
              {canEdit && (
                <button
                  type="button"
                  className={handles.codexEdit}
                  onClick={() => setTalentAt(-1)}
                >
                  + Talento
                </button>
              )}
            </h2>
            {looseTalents.map(({ talent, index }) =>
              renderTalent(talent, index)
            )}
            {talentGroups.map((group) => (
              <article key={group.name} className={handles.codexArchetype}>
                <header className={handles.codexArchetypeHead}>
                  <h3 className={handles.codexArchetypeName}>{group.name}</h3>
                  {group.unlock && (
                    <p className={handles.codexFeatureText}>{group.unlock}</p>
                  )}
                </header>
                <div className={handles.codexArchetypeBody}>
                  {group.entries.map(({ talent, index }) =>
                    renderTalent(talent, index)
                  )}
                </div>
              </article>
            ))}
          </section>
        )}
      </Modal>

      {(saving || error) && (
        <div className={handles.codexEditBar} role="status">
          {saving && (
            <span className={handles.codexFeatureLevel}>Salvando…</span>
          )}
          {error && <span className={handles.codexNote}>{error}</span>}
        </div>
      )}

      {(k.unparsedSections?.length ?? 0) > 0 && (
        <p className={handles.codexNote}>
          O texto deste tópico não pôde ser estruturado com segurança — só a
          progressão por nível foi importada. O conteúdo original foi preservado
          e pode ser preenchido à mão.
        </p>
      )}

      <PromptModal
        isOpen={editingOverview}
        onClose={() => setEditingOverview(false)}
        title="Características de classe"
        confirmLabel="Salvar"
        fields={overviewFields(k)}
        onSubmit={saveOverview}
      />

      <PromptModal
        isOpen={archetypeAt !== null}
        onClose={() => setArchetypeAt(null)}
        title={archetypeAt === -1 ? 'Novo arquétipo' : 'Editar arquétipo'}
        confirmLabel="Salvar"
        fields={archetypeFields(
          archetypeAt !== null && archetypeAt >= 0
            ? k.archetypes?.[archetypeAt]
            : undefined
        )}
        onDelete={
          archetypeAt !== null && archetypeAt >= 0
            ? () => removeArchetype(archetypeAt)
            : undefined
        }
        deleteLabel="Remover arquétipo"
        onSubmit={(values) =>
          archetypeAt !== null && saveArchetype(archetypeAt, values)
        }
      />

      <PromptModal
        isOpen={archFeatureAt !== null}
        onClose={() => setArchFeatureAt(null)}
        title={
          archFeatureAt?.[1] === -1
            ? 'Nova característica de arquétipo'
            : 'Editar característica de arquétipo'
        }
        confirmLabel="Salvar"
        fields={featureFields(
          archFeatureAt && archFeatureAt[1] >= 0
            ? k.archetypes?.[archFeatureAt[0]]?.features?.[archFeatureAt[1]]
            : undefined,
          // Sem seletor de arquétipo: o botão que abriu este modal vive
          // dentro do arquétipo, então o dono já está determinado.
          undefined,
          undefined
        )}
        onDelete={
          archFeatureAt && archFeatureAt[1] >= 0
            ? () => removeArchetypeFeature(archFeatureAt[0], archFeatureAt[1])
            : undefined
        }
        deleteLabel="Remover"
        onSubmit={(values) => {
          if (!archFeatureAt) return;
          const target =
            values.archetype !== undefined
              ? Number(values.archetype)
              : archFeatureAt[0];
          saveArchetypeFeature(target, archFeatureAt[1], values);
        }}
      />

      <ConfirmModal
        isOpen={removing !== null}
        onClose={() => setRemoving(null)}
        onConfirm={() => removing?.confirm()}
        title={removing?.title ?? ''}
        message={removing?.message}
      />

      <PromptModal
        isOpen={levelAt !== null}
        onClose={() => setLevelAt(null)}
        title={`Nível ${
          levelAt === NEW_LEVEL
            ? nextLevel
            : (k.levels?.[levelAt ?? 0]?.level ?? '')
        }`}
        confirmLabel="Salvar"
        fields={levelFields(
          levelAt === NEW_LEVEL ? undefined : k.levels?.[levelAt ?? 0],
          extraColumns,
          // O nível anterior: o último da tabela quando se está criando, o de
          // baixo quando se está editando. É dele que saem o piso dos espaços
          // e os valores de partida.
          levelAt === NEW_LEVEL
            ? k.levels?.[(k.levels?.length ?? 0) - 1]
            : levelAt
              ? k.levels?.[levelAt - 1]
              : undefined
        )}
        onSubmit={(values) =>
          levelAt !== null && saveLevel(levelAt, values, extraColumns)
        }
      />

      <PromptModal
        isOpen={featureAt !== null}
        onClose={() => setFeatureAt(null)}
        title={
          featureAt === -1 ? 'Nova característica' : 'Editar característica'
        }
        confirmLabel="Salvar"
        fields={featureFields(
          featureAt !== null && featureAt >= 0
            ? k.features?.[featureAt]
            : undefined
        )}
        onDelete={
          featureAt !== null && featureAt >= 0
            ? () => removeFeature(featureAt)
            : undefined
        }
        deleteLabel="Remover"
        onSubmit={(values) =>
          featureAt !== null && saveFeature(featureAt, values)
        }
      />

      <PromptModal
        isOpen={catalogAt !== null}
        onClose={() => setCatalogAt(null)}
        title={catalogAt === -1 ? 'Nova lista' : 'Editar lista'}
        confirmLabel="Salvar"
        fields={catalogFields(
          catalogAt !== null && catalogAt >= 0
            ? k.catalogs?.[catalogAt]
            : undefined
        )}
        onDelete={
          catalogAt !== null && catalogAt >= 0
            ? () => removeCatalog(catalogAt)
            : undefined
        }
        deleteLabel="Remover lista"
        onSubmit={(values) =>
          catalogAt !== null && saveCatalog(catalogAt, values)
        }
      />

      <PromptModal
        isOpen={catalogItemAt !== null}
        onClose={() => setCatalogItemAt(null)}
        title={catalogItemAt?.[1] === -1 ? 'Novo item' : 'Editar item'}
        confirmLabel="Salvar"
        fields={catalogItemFields(
          catalogItemAt && catalogItemAt[1] >= 0
            ? k.catalogs?.[catalogItemAt[0]]?.items?.[catalogItemAt[1]]
            : undefined
        )}
        onDelete={
          catalogItemAt && catalogItemAt[1] >= 0
            ? () => removeCatalogItem(catalogItemAt[0], catalogItemAt[1])
            : undefined
        }
        deleteLabel="Remover"
        onSubmit={(values) => {
          if (!catalogItemAt) return;
          saveCatalogItem(catalogItemAt[0], catalogItemAt[1], values);
        }}
      />

      <PromptModal
        isOpen={talentAt !== null}
        onClose={() => setTalentAt(null)}
        title={talentAt === -1 ? 'Novo talento' : 'Editar talento'}
        confirmLabel="Salvar"
        fields={talentFields(
          talentAt !== null && talentAt >= 0 ? k.talents?.[talentAt] : undefined
        )}
        onDelete={
          talentAt !== null && talentAt >= 0
            ? () => removeTalent(talentAt)
            : undefined
        }
        deleteLabel="Remover"
        onSubmit={(values) => talentAt !== null && saveTalent(talentAt, values)}
      />
    </div>
  );
};

export default ClassData;
