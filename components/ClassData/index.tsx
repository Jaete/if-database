'use client';

import { useState } from 'react';
import type ICharacterClass from '@/db/classes/class.d';
import type { CatalogKind } from '@/db/classes/class.d';
import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import { useOptionalAuth } from '@/app/context/AuthContext';
import ConfirmModal from '../ConfirmModal';
import withClassEditors from '../ClassFieldEditors';
import PromptModal from '../PromptModal';
import TopBar from './TopBar';
import Hero from './Hero';
import Candidate from './Candidate';
import Sheet from './Sheet';
import About from './About';
import SectionModal from './SectionModal';
import type { IRemoval, ISectionActions } from './SectionModal/types';
import DivineCodex from './DivineCodex';
import RelationCodex from './RelationCodex';
import CatalogKindPicker from './CatalogKindPicker';
import {
  archetypeFields,
  catalogFields,
  catalogItemFields,
  featureFields,
  levelFields,
  overviewFields,
  relationCatalogFields,
  talentFields,
} from './fields';
import { buildSections, CATALOG_PREFIX } from './sections';
import { effectiveKind } from './catalogKind';
import { nextLevelNumber, useClassData } from './useClassData';
import ClassDataHandles from './handles';
import '@/styles/components/classData.scss';

interface IProps {
  characterClass: ICharacterClass;
  /** Onde mora o seletor de classes (o "← Classes"). O embed usa `/embed/classes`. */
  basePath?: string;
  /** Embed no fórum: respiro menor e roda limitada pela altura do iframe. */
  compact?: boolean;
  /** Esconde toda a edição, mesmo para quem pode editar. */
  readOnly?: boolean;
  /**
   * Aberta por cima do seletor: o "← Classes" fecha o overlay em vez de
   * navegar para `basePath`.
   */
  onBack?: () => void;
  /**
   * Com quem está a classe, quando ela é única. Derivado do vínculo das
   * fichas (ver `getClassHolder`), nunca gravado na classe.
   */
  takenBy?: { name: string };
}

/** Índice que abre o modal para um nível novo, como `-1` nos outros editores. */
const NEW_LEVEL = -1;

/**
 * A página de detalhe da classe: identidade, roda de seções, ficha e
 * descrição, com a progressão, as características, os arquétipos e os
 * talentos no modal das seções.
 *
 * Quem pode editar corrige cada peça onde ela está; o estado de gravação vive
 * em `useClassData`.
 */
const ClassData = ({
  characterClass: initial,
  basePath = '/classes',
  compact = false,
  readOnly = false,
  onBack,
  takenBy,
}: IProps) => {
  const handles = useCssHandles(ClassDataHandles);
  // O embed não tem AuthProvider: sem contexto, ninguém edita.
  const auth = useOptionalAuth();
  const canEdit = !readOnly && (auth?.canEdit ?? false);
  const {
    characterClass: k,
    error,
    saving,
    saveOverview,
    saveDescription,
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
    saveRelationCatalog,
    saveRelationEntity,
    removeRelationEntity,
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
  // Criar uma lista tem dois passos: o tipo (picker) e depois o formulário.
  const [pickingKind, setPickingKind] = useState(false);
  const [newCatalogKind, setNewCatalogKind] = useState<CatalogKind | null>(
    null
  );
  const [catalogItemAt, setCatalogItemAt] = useState<[number, number] | null>(
    null
  );
  const [openNode, setOpenNode] = useState<string | null>(null);
  // Característica para onde o modal rola ao abrir Características. O `nonce`
  // faz o mesmo pedido valer duas vezes seguidas.
  const [focus, setFocus] = useState<{ index: number; nonce: number } | null>(
    null
  );
  // Par [índice do arquétipo, índice da característica]; -1 acrescenta.
  const [archFeatureAt, setArchFeatureAt] = useState<[number, number] | null>(
    null
  );

  const nextLevel = nextLevelNumber(k.levels);
  /**
   * O que o X pediu para excluir, com o que dizer e o que fazer.
   *
   * Um estado só para todos os tipos: o que muda entre eles é texto. Estas
   * exclusões acontecem fora de um modal de edição — um clique só, direto na
   * lista —, por isso perguntam antes.
   */
  const [removing, setRemoving] = useState<IRemoval | null>(null);

  // Colunas específicas desta classe, descobertas nos próprios níveis.
  const extraColumns = [
    ...new Set(
      (k.levels ?? []).flatMap((level) => Object.keys(level.columns ?? {}))
    ),
  ];

  const nodes = buildSections(k, canEdit);
  const catalogKind = catalogItemAt
    ? effectiveKind(k.catalogs?.[catalogItemAt[0]])
    : undefined;

  const actions: ISectionActions = {
    canEdit,
    ask: setRemoving,
    edit: {
      level: setLevelAt,
      feature: setFeatureAt,
      archetype: setArchetypeAt,
      archetypeFeature: (archetype, feature) =>
        setArchFeatureAt([archetype, feature]),
      catalog: setCatalogAt,
      catalogItem: (catalog, item) => setCatalogItemAt([catalog, item]),
      talent: setTalentAt,
    },
    remove: {
      catalog: removeCatalog,
      level: removeLevel,
      feature: removeFeature,
      archetype: removeArchetype,
      archetypeFeature: removeArchetypeFeature,
      catalogItem: removeCatalogItem,
      talent: removeTalent,
    },
  };

  const openSection = (id: string) => {
    setFocus(null);
    setOpenNode(id);
  };

  return (
    <div
      className={`${handles.clsPage}${
        compact ? ` ${applyModifiers(handles.clsPage, 'compact')}` : ''
      }`}
    >
      <TopBar
        basePath={basePath}
        onBack={onBack}
        onEdit={canEdit ? () => setEditingOverview(true) : undefined}
      />

      <Hero
        characterClass={k}
        takenBy={takenBy}
        nodes={nodes}
        openId={openNode}
        onOpen={openSection}
        onEditImage={canEdit ? () => setEditingOverview(true) : undefined}
        onAddList={canEdit ? () => setPickingKind(true) : undefined}
      />

      {canEdit && k.candidate && (
        <Candidate
          candidate={k.candidate}
          sourceUrl={k.sourceUrl}
          onAccept={() => applyCandidate()}
          onDiscard={() =>
            setRemoving({
              title: 'Descartar o texto extraído?',
              message:
                'As características, arquétipos e talentos que o importador separou somem. O texto cru do tópico continua guardado, e reimportar a classe gera tudo de novo.',
              confirm: () => discardCandidate(),
            })
          }
        />
      )}

      <div className={handles.clsBody}>
        <Sheet
          characterClass={k}
          onEdit={canEdit ? () => setEditingOverview(true) : undefined}
        />
        <About
          characterClass={k}
          canEdit={canEdit}
          saving={saving}
          onSave={saveDescription}
        />
      </div>

      <SectionModal
        characterClass={k}
        nodes={nodes.filter(
          (n) =>
            n.id !== 'dominios' &&
            !(
              n.id.startsWith(CATALOG_PREFIX) &&
              k.catalogs?.find((c) => `${CATALOG_PREFIX}${c.slug}` === n.id)
                ?.kind === 'relacao'
            )
        )}
        openId={
          openNode === 'dominios' ||
          (openNode?.startsWith(CATALOG_PREFIX) &&
            k.catalogs?.find((c) => `${CATALOG_PREFIX}${c.slug}` === openNode)
              ?.kind === 'relacao')
            ? null
            : openNode
        }
        actions={actions}
        onClose={() => {
          setFocus(null);
          setOpenNode(null);
        }}
        onSwitch={openSection}
        onGoto={(id, featureIndex) => {
          setOpenNode(id);
          setFocus(
            featureIndex === undefined
              ? null
              : { index: featureIndex, nonce: Date.now() }
          );
        }}
        focus={focus}
      />

      {(saving || error) && (
        <div
          className={`${handles.clsToast}${
            error ? ` ${applyModifiers(handles.clsToast, 'error')}` : ''
          }`}
          role="status"
        >
          {saving ? 'Salvando…' : error}
        </div>
      )}

      <PromptModal
        isOpen={editingOverview}
        onClose={() => setEditingOverview(false)}
        title="Características de classe"
        confirmLabel="Salvar"
        fields={withClassEditors(overviewFields(k))}
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

      <CatalogKindPicker
        isOpen={pickingKind}
        onClose={() => setPickingKind(false)}
        onPick={(kind) => {
          setNewCatalogKind(kind);
          setPickingKind(false);
          setCatalogAt(NEW_LEVEL);
        }}
      />

      <PromptModal
        isOpen={
          catalogAt !== null &&
          (newCatalogKind ?? k.catalogs?.[catalogAt ?? 0]?.kind) !== 'relacao'
        }
        onClose={() => {
          setCatalogAt(null);
          setNewCatalogKind(null);
        }}
        title={catalogAt === -1 ? 'Nova lista' : 'Editar lista'}
        confirmLabel="Salvar"
        fields={catalogFields(
          catalogAt !== null && catalogAt >= 0
            ? k.catalogs?.[catalogAt]
            : undefined,
          newCatalogKind ?? undefined
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
        isOpen={
          catalogAt !== null &&
          (newCatalogKind ?? k.catalogs?.[catalogAt ?? 0]?.kind) === 'relacao'
        }
        onClose={() => {
          setCatalogAt(null);
          setNewCatalogKind(null);
        }}
        title={
          catalogAt === -1
            ? 'Nova tabela de relação'
            : 'Editar tabela de relação'
        }
        confirmLabel={catalogAt === -1 ? 'Criar' : 'Salvar'}
        fields={relationCatalogFields(
          catalogAt !== null && catalogAt >= 0
            ? k.catalogs?.[catalogAt]
            : undefined
        )}
        onDelete={
          catalogAt !== null && catalogAt >= 0
            ? () => removeCatalog(catalogAt)
            : undefined
        }
        deleteLabel="Remover tabela"
        onSubmit={(values) =>
          catalogAt !== null && saveRelationCatalog(catalogAt, values)
        }
      />

      <PromptModal
        isOpen={catalogItemAt !== null}
        onClose={() => setCatalogItemAt(null)}
        title={
          catalogItemAt?.[1] === -1
            ? catalogKind === 'magias'
              ? 'Nova magia'
              : catalogKind === 'habilidades'
                ? 'Nova habilidade'
                : 'Novo item'
            : catalogKind === 'magias'
              ? 'Editar magia'
              : catalogKind === 'habilidades'
                ? 'Editar habilidade'
                : 'Editar item'
        }
        confirmLabel="Salvar"
        fields={catalogItemFields(
          catalogItemAt && catalogItemAt[1] >= 0
            ? k.catalogs?.[catalogItemAt[0]]?.items?.[catalogItemAt[1]]
            : undefined,
          catalogKind
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

      {((k.divineOrders?.length ?? 0) > 0 || (k.domains?.length ?? 0) > 0) && (
        <DivineCodex
          isOpen={openNode === 'dominios'}
          onClose={() => setOpenNode(null)}
          className={k.name}
          orders={k.divineOrders ?? []}
          domains={k.domains ?? []}
        />
      )}

      {(k.catalogs ?? []).map((catalog, catIdx) =>
        catalog.kind === 'relacao' ? (
          <RelationCodex
            key={catalog.slug}
            isOpen={openNode === `${CATALOG_PREFIX}${catalog.slug}`}
            onClose={() => setOpenNode(null)}
            className={k.name}
            catalogName={catalog.name}
            catalogIcon={catalog.icon}
            catalogDescription={catalog.description}
            groupA={
              catalog.groupA ?? {
                label: '',
                unitSingular: '',
                unitPlural: '',
                entities: [],
              }
            }
            groupB={
              catalog.groupB ?? {
                label: '',
                unitSingular: '',
                unitPlural: '',
                entities: [],
              }
            }
            canEdit={canEdit}
            onSaveEntity={(group, entityIndex, entity) =>
              saveRelationEntity(catIdx, group, entityIndex, entity)
            }
            onRemoveEntity={(group, entityIndex) =>
              removeRelationEntity(catIdx, group, entityIndex)
            }
            onEditCatalog={() => setCatalogAt(catIdx)}
          />
        ) : null
      )}
    </div>
  );
};

export default ClassData;
