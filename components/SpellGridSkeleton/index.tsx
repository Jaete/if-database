'use client';

import { circleLabel } from '@/db/l10n/spells';
import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import { useOptionalAuth } from '@/app/context/AuthContext';
import { DownloadIcon, PlusIcon, SearchIcon } from '../Icons';
import EmbedBackLink from '../EmbedBackLink';
import Skeleton, { SkeletonStatus } from '../Skeleton';
import SpellGridHandles from '../SpellGrid/handles';
import SpellRowHandles from '../SpellRow/handles';
import '@/styles/components/spellGrid.scss';
import '@/styles/components/spellRow.scss';
import '@/styles/components/spellGridSkeleton.scss';

interface IProps {
  /** Embed no fórum: título e busca numa linha, sem barra de ações. */
  compact?: boolean;
  /** Esconde a barra de ações, mesmo para quem pode editar. */
  readOnly?: boolean;
}

// Texto representativo (nome, escola): só a largura importa. 24 linhas enchem
// uma tela de até ~1350px de altura.
const GHOST_SPELLS: [name: string, school: string][] = [
  ['Mãos Mágicas', 'Conjuração'],
  ['Raio de Gelo', 'Evocação'],
  ['Luz', 'Evocação'],
  ['Mensagem', 'Transmutação'],
  ['Ilusão Menor', 'Ilusão'],
  ['Toque Chocante', 'Evocação'],
  ['Orientação', 'Adivinhação'],
  ['Resistência', 'Abjuração'],
  ['Chama Sagrada', 'Evocação'],
  ['Prestidigitação', 'Transmutação'],
  ['Rajada de Veneno', 'Conjuração'],
  ['Toque Necrótico', 'Necromancia'],
  ['Amizade', 'Encantamento'],
  ['Proteção contra Lâminas', 'Abjuração'],
  ['Estalo Trovejante', 'Evocação'],
  ['Druidismo', 'Transmutação'],
  ['Lâmina Verde-Chama', 'Evocação'],
  ['Zombaria Viciosa', 'Encantamento'],
  ['Moldar a Terra', 'Transmutação'],
  ['Infestação', 'Conjuração'],
  ['Golpe Certeiro', 'Adivinhação'],
  ['Raio de Fogo', 'Evocação'],
  ['Consertar', 'Transmutação'],
  ['Chicote de Espinhos', 'Transmutação'],
];

const CIRCLES = Array.from({ length: 10 }, (_, circle) => circle);

/**
 * O grimório enquanto a lista carrega: mesmos contêineres e classes da tela
 * real. O primeiro grupo é sempre o dos truques, então o índice, o cabeçalho
 * "Truques" e o selo "T" das linhas são reais; nomes, escolas e contagens são
 * texto fantasma.
 */
const SpellGridSkeleton = ({ compact = false, readOnly = false }: IProps) => {
  const grid = useCssHandles(SpellGridHandles);
  const row = useCssHandles(SpellRowHandles);
  // Quem edita já é conhecido: o `AuthGate` só monta os filhos depois de
  // verificar a sessão. O embed não tem AuthProvider.
  const auth = useOptionalAuth();
  const canEdit = !readOnly && (auth?.canEdit ?? false);

  const search = (
    <span className={grid.spellbookSearchWrap} inert>
      <SearchIcon className={grid.spellbookSearchIcon} />
      <input
        className={grid.spellbookSearch}
        placeholder={compact ? 'Buscar magia...' : 'Buscar magia pelo nome...'}
        aria-label="Buscar magia pelo nome"
        readOnly
      />
    </span>
  );

  const count = (
    <p className={grid.spellbookCount}>
      <Skeleton>000 magias</Skeleton>
    </p>
  );

  return (
    <div
      className={`${grid.spellbook}${
        compact ? ` ${applyModifiers(grid.spellbook, 'compact')}` : ''
      }`}
      aria-busy="true"
    >
      <div className={grid.spellbookInner}>
        <SkeletonStatus>Carregando magias…</SkeletonStatus>

        {compact ? (
          <div className={grid.spellbookEmbedHead}>
            <EmbedBackLink />
            <h1 className={grid.spellbookTitle}>Grimório</h1>
            {search}
            {count}
          </div>
        ) : (
          <>
            <header className={grid.spellbookHeader}>
              <h1 className={grid.spellbookTitle}>GRIMÓRIO</h1>
              <p className={grid.spellbookSubtitle}>
                Catálogo de magias de Terralém, compartilhado por todas as
                fichas.
              </p>
            </header>
            <div className={grid.spellbookTools} inert>
              {search}
              {canEdit && (
                <div className={grid.spellbookActions}>
                  <button
                    type="button"
                    className={`${grid.spellbookButton} ${grid.spellbookImport}`}
                  >
                    <DownloadIcon />
                    Importar do fórum
                  </button>
                  <button type="button" className={grid.spellbookButton}>
                    <PlusIcon />
                    Nova magia
                  </button>
                </div>
              )}
            </div>
            {count}
          </>
        )}

        <div
          className={`${grid.spellbookBody} ${applyModifiers(grid.spellbookBody, 'skeleton')}`}
          inert
        >
          <nav className={grid.spellbookIndex} aria-label="Ir para o círculo">
            {CIRCLES.map((circle) => (
              <button
                key={circle}
                type="button"
                className={grid.spellbookIndexItem}
                aria-current={circle === 0 || undefined}
              >
                {circleLabel(circle)}
              </button>
            ))}
          </nav>

          <div className={grid.spellbookGroups}>
            <section className={grid.spellbookGroup}>
              <div className={grid.spellbookGroupHead}>
                <h2 className={grid.spellbookGroupTitle}>Truques</h2>
                <span className={grid.spellbookGroupRule} />
                <span className={grid.spellbookGroupCount}>
                  <Skeleton>00 magias</Skeleton>
                </span>
              </div>
              <ul className={grid.spellbookList}>
                {GHOST_SPELLS.map(([name, school]) => (
                  <li key={name}>
                    <button
                      type="button"
                      className={`${row.spellbookRow} ${applyModifiers(row.spellbookRow, 'skeleton')}`}
                    >
                      <span className={row.spellbookRowCircle}>
                        {circleLabel(0)}
                      </span>
                      <span className={row.spellbookRowText}>
                        <span className={row.spellbookRowName}>
                          <Skeleton>{name}</Skeleton>
                        </span>
                        <span className={row.spellbookRowSchool}>
                          <Skeleton>{school}</Skeleton>
                        </span>
                      </span>
                      <span className={row.spellbookRowArt}>
                        <Skeleton />
                      </span>
                      <span className={row.spellbookRowSchoolBar} />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpellGridSkeleton;
