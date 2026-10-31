'use client';

import { Fragment } from 'react';
import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import { useOptionalAuth } from '@/app/context/AuthContext';
import { ChevronRightIcon, DownloadIcon, LinkIcon, PlusIcon } from '../Icons';
import EmbedBackLink from '../EmbedBackLink';
import Skeleton, { SkeletonStatus } from '../Skeleton';
import ClassGridHandles from '../ClassGrid/handles';
import ClassCarouselHandles from '../ClassCarousel/handles';
import ClassCardHandles from '../ClassCard/handles';
import ClassRolesHandles from '../ClassRoles/handles';
import '@/styles/components/classGrid.scss';
import '@/styles/components/classCarousel.scss';
import '@/styles/components/classCard.scss';
import '@/styles/components/classRoles.scss';
import '@/styles/components/classGridSkeleton.scss';

interface IProps {
  /** Embed no fórum: título e busca numa linha, sem barra de ações. */
  compact?: boolean;
  /** Esconde a barra de ações, mesmo para quem pode editar. */
  readOnly?: boolean;
}

type Row = [label: string, value: string];

// Texto representativo: só a largura e o número de linhas importam. A
// descrição precisa passar das 3 linhas do `-webkit-line-clamp` do card.
const GHOST_NAMES = [
  'Cavaleiro',
  'Necromante',
  'Paladino',
  'Arqueiro',
  'Espadachim',
  'Bardo',
  'Druida',
];
const GHOST_ROLES = [
  ['Defesa', 'Controle'],
  ['Controle', 'Suporte'],
  ['Defesa', 'Cura'],
  ['Dano', 'Controle'],
  ['Dano', 'Utilidade'],
  ['Suporte', 'Cura'],
  ['Cura', 'Controle'],
];
const GHOST_DESC =
  'Especialista em combate à distância, usa o arco para eliminar alvos com precisão e eficiência. Destaca-se em emboscadas, na leitura do campo e em manter distância segura dos inimigos mais perigosos.';
const GHOST_HIT_POINTS: Row[] = [
  ['Dado de vida', '1d10 por nível'],
  ['1º nível', '10 + seu modificador de Constituição'],
  ['Níveis seguintes', '1d10 (ou 6) + seu modificador de Constituição'],
];
const GHOST_PROFICIENCIES: Row[] = [
  ['Armaduras', 'Armaduras leves'],
  ['Armas', 'Arcos, bestas'],
  ['Ferramentas', 'Nenhuma'],
  ['Testes de resistência', 'Força, Destreza'],
  ['Perícias', 'Escolha três dentre Atletismo, Furtividade e Natureza'],
];

// Três vizinhos de cada lado do card em foco: cobre o palco de 76rem.
const OFFSETS = [-3, -2, -1, 0, 1, 2, 3];

/**
 * O códice enquanto a lista carrega: mesmos contêineres e classes da tela
 * real, com o conteúdo trocado por texto fantasma — a troca não desloca nada.
 *
 * A barra de ações é desenhada como na tela real (o `AuthGate` só monta os
 * filhos depois de verificar a sessão, então `canEdit` já é conhecido).
 */
const ClassGridSkeleton = ({ compact = false, readOnly = false }: IProps) => {
  const grid = useCssHandles(ClassGridHandles);
  const carousel = useCssHandles(ClassCarouselHandles);
  const card = useCssHandles(ClassCardHandles);
  const roles = useCssHandles(ClassRolesHandles);
  const auth = useOptionalAuth();
  const canEdit = !readOnly && (auth?.canEdit ?? false);

  const search = (
    <input
      className={grid.codexSearch}
      placeholder={compact ? 'Buscar classe...' : 'Buscar classe pelo nome...'}
      aria-label="Buscar classe pelo nome"
      readOnly
      inert
    />
  );

  const renderRows = (rows: Row[]) =>
    rows.map(([label, value]) => (
      <Fragment key={label}>
        <dt>{label}</dt>
        <dd>
          <Skeleton>{value}</Skeleton>
        </dd>
      </Fragment>
    ));

  const renderCard = (offset: number) => {
    const index = offset + 3;
    const focused = offset === 0;
    const [primaryRole, secondaryRole] = GHOST_ROLES[index];
    return (
      <div
        key={offset}
        className={`${card.pickCard} ${applyModifiers(card.pickCard, 'skeleton')}${
          focused ? ` ${applyModifiers(card.pickCard, 'focused')}` : ''
        }`}
      >
        <div
          className={`${card.pickArt} ${applyModifiers(card.pickArt, 'empty')} ${applyModifiers(card.pickArt, 'skeleton')}`}
        >
          <Skeleton />
        </div>
        <div className={card.pickTop}>
          <span className={card.pickKind} />
        </div>
        <div className={card.pickSpacer} />
        <div className={card.pickHead}>
          <h3 className={card.pickName}>
            <Skeleton>{GHOST_NAMES[index]}</Skeleton>
          </h3>
          <ul
            className={`${roles.classRoles} ${applyModifiers(roles.classRoles, 'skeleton')}`}
          >
            <li
              className={`${roles.classRole} ${applyModifiers(roles.classRole, 'primary')}`}
            >
              <span className={roles.classRoleIcon} />
              <Skeleton>{primaryRole}</Skeleton>
            </li>
            <li className={roles.classRole}>
              <Skeleton>{secondaryRole}</Skeleton>
            </li>
          </ul>
        </div>
        <div className={card.pickClasp}>◆</div>
        <div className={card.pickBody}>
          <p className={card.pickDesc}>
            <Skeleton>{GHOST_DESC}</Skeleton>
          </p>
          <div className={card.pickStats}>
            <section className={card.pickGroup}>
              <h4 className={card.pickGroupTitle}>Pontos de vida</h4>
              <dl className={card.pickRows}>{renderRows(GHOST_HIT_POINTS)}</dl>
            </section>
            <section className={card.pickGroup}>
              <h4 className={card.pickGroupTitle}>Proficiências</h4>
              <dl className={card.pickRows}>
                {renderRows(GHOST_PROFICIENCIES)}
              </dl>
            </section>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`${grid.codex}${
        compact ? ` ${applyModifiers(grid.codex, 'compact')}` : ''
      }`}
      aria-busy="true"
    >
      <SkeletonStatus>Carregando classes…</SkeletonStatus>

      {compact ? (
        <div className={grid.codexEmbedHead}>
          <EmbedBackLink />
          <h1 className={grid.codexTitle}>Classes</h1>
          {search}
        </div>
      ) : (
        <>
          <header className={grid.codexHeader}>
            <h1 className={grid.codexTitle}>CLASSES</h1>
            <p className={grid.codexSubtitle}>
              O que cada classe adquire a cada nível, e as magias que ela
              conjura.
            </p>
          </header>
          <div className={grid.codexTools} inert>
            {search}
            {canEdit && (
              <div className={grid.codexActions}>
                <button type="button" className={grid.codexAction}>
                  <DownloadIcon />
                  <span className={grid.codexActionLabel}>
                    Importar do fórum
                  </span>
                </button>
                <button type="button" className={grid.codexAction}>
                  <LinkIcon />
                  <span className={grid.codexActionLabel}>Vincular magias</span>
                </button>
                <button
                  type="button"
                  className={`${grid.codexAction} ${grid.codexAction}--primary`}
                >
                  <PlusIcon />
                  <span className={grid.codexActionLabel}>Nova classe</span>
                </button>
              </div>
            )}
          </div>
        </>
      )}

      <div className={carousel.pick} inert>
        <div className={carousel.pickStage}>
          <span
            className={`${carousel.pickArrow} ${applyModifiers(carousel.pickArrow, 'prev')} ${applyModifiers(carousel.pickArrow, 'skeleton')}`}
          >
            <ChevronRightIcon />
          </span>
          <div
            className={`${carousel.pickTrack} ${applyModifiers(carousel.pickTrack, 'skeleton')}`}
          >
            {OFFSETS.map(renderCard)}
          </div>
          <span
            className={`${carousel.pickArrow} ${applyModifiers(carousel.pickArrow, 'next')} ${applyModifiers(carousel.pickArrow, 'skeleton')}`}
          >
            <ChevronRightIcon />
          </span>
        </div>
        <div className={carousel.pickPager}>
          <span className={carousel.pickCount}>
            <Skeleton>01 / 22</Skeleton>
          </span>
          <div
            className={`${carousel.pickPips} ${applyModifiers(carousel.pickPips, 'window')}`}
            aria-hidden="true"
          >
            {/* A mesma tira da tela real, parada: 7 losangos sob o destaque
                fixo da janela — mesma largura e altura. */}
            <span className={carousel.pickPipsReel}>
              {OFFSETS.map((offset) => (
                <span key={offset} className={carousel.pickPip} />
              ))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassGridSkeleton;
