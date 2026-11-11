'use client';

import { useState } from 'react';
import { plural } from '@/lib/plural';
import { useCssHandles } from '@/hooks/useCssHandles';
import { useOptionalAuth } from '@/app/context/AuthContext';
import { DownloadIcon, PlusIcon, SearchIcon } from '../Icons';
import RaceArt from '../RaceArt';
import RaceButton from '../RaceButton';
import ImportModal from './ImportModal';
import NewRaceModal from './NewRaceModal';
import RaceCard from './RaceCard';
import { useRaceGrid, type IRaceOption, type RaceFilter } from './useRaceGrid';
import RaceGridHandles from './handles';
import '@/styles/components/raceGrid.scss';

interface IProps {
  races: IRaceOption[];
  /** Raça cuja capa forra o topo até algo entrar em foco; sorteada na página. */
  initialCover?: string;
  /** Rota do detalhe: `/races` no site, `/embed/races` no iframe do fórum. */
  basePath?: string;
  /** Esconde importar, criar e editar, mesmo para quem pode editar. */
  readOnly?: boolean;
}

const FILTERS: readonly { value: RaceFilter; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'with', label: 'Com sub-raças' },
  { value: 'without', label: 'Sem sub-raças' },
];

/**
 * O catálogo de raças: busca, filtro e os cards. O fundo do título é a capa
 * da raça em foco (ponteiro ou teclado).
 */
const RaceGrid = ({
  races,
  initialCover,
  basePath = '/races',
  readOnly = false,
}: IProps) => {
  const handles = useCssHandles(RaceGridHandles);
  const auth = useOptionalAuth();
  const canEdit = !readOnly && (auth?.canEdit ?? false);
  const { query, setQuery, filter, setFilter, visible, cover, focusRace } =
    useRaceGrid(races, initialCover);
  const [importing, setImporting] = useState(false);
  const [creating, setCreating] = useState(false);

  const count =
    visible.length === races.length
      ? plural(races.length, 'raça', 'raças')
      : `${visible.length} de ${plural(races.length, 'raça', 'raças')}`;

  // Seta troca o filtro como num radiogroup: o foco anda junto.
  const moveFilter = (index: number, key: string) => {
    const step = key === 'ArrowRight' || key === 'ArrowDown' ? 1 : -1;
    if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(key)) {
      return;
    }
    const next = (index + step + FILTERS.length) % FILTERS.length;
    setFilter(FILTERS[next].value);
    document.getElementById(`race-filter-${FILTERS[next].value}`)?.focus();
  };

  return (
    <div className={handles.raceAtlas}>
      <section className={handles.raceAtlasTop}>
        <div className={handles.raceAtlasBand} aria-hidden="true">
          {cover && (
            // A chave refaz o nó a cada raça: a entrada em fade vem do CSS.
            <div key={cover.slug} className={handles.raceAtlasBandArt}>
              <RaceArt image={cover.images[0]} label={cover.name} />
            </div>
          )}
        </div>
        <div className={handles.raceAtlasVeil} aria-hidden="true" />
        {cover && (
          <span className={handles.raceAtlasCaption}>
            Fundo · capa de {cover.name}
          </span>
        )}
        <div className={handles.raceAtlasHead}>
          <div>
            <span className={handles.raceAtlasKicker}>
              Bestiário de Terralém
            </span>
            <h1 className={handles.raceAtlasTitle}>Raças</h1>
            <p className={handles.raceAtlasLead}>
              Os povos que um personagem pode ser. Cada raça traz seus traços e
              habilidades; muitas se dividem em sub-raças que mudam parte deles.
            </p>
          </div>
          <div className={handles.raceAtlasTools}>
            {canEdit && (
              <div className={handles.raceAtlasActs}>
                <RaceButton
                  small
                  icon={<DownloadIcon />}
                  onClick={() => setImporting(true)}
                >
                  Importar do fórum
                </RaceButton>
                <RaceButton
                  small
                  variant="primary"
                  icon={<PlusIcon />}
                  onClick={() => setCreating(true)}
                >
                  Nova raça
                </RaceButton>
              </div>
            )}
            <label className={handles.raceAtlasSearch}>
              <SearchIcon aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar raça ou sub-raça"
                aria-label="Buscar raça ou sub-raça"
                autoComplete="off"
              />
            </label>
            <div
              className={handles.raceAtlasSeg}
              role="radiogroup"
              aria-label="Filtrar"
            >
              {FILTERS.map((item, index) => (
                <button
                  key={item.value}
                  id={`race-filter-${item.value}`}
                  type="button"
                  role="radio"
                  aria-checked={filter === item.value}
                  tabIndex={filter === item.value ? 0 : -1}
                  className={handles.raceAtlasSegBtn}
                  onClick={() => setFilter(item.value)}
                  onKeyDown={(e) => {
                    if (e.key.startsWith('Arrow')) {
                      e.preventDefault();
                      moveFilter(index, e.key);
                    }
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className={handles.raceAtlasBody}>
        <p className={handles.raceAtlasCount} aria-live="polite">
          {count}
        </p>
        {visible.length === 0 ? (
          <p className={handles.raceAtlasEmpty}>
            Nenhuma raça ou sub-raça encontrada para “{query}”.
          </p>
        ) : (
          <ul className={handles.raceAtlasPlates}>
            {visible.map((race) => (
              <RaceCard
                key={race.slug}
                race={race}
                canEdit={canEdit}
                basePath={basePath}
                onFocusRace={focusRace}
              />
            ))}
          </ul>
        )}
      </div>

      {importing && <ImportModal onClose={() => setImporting(false)} />}
      {creating && (
        <NewRaceModal
          takenSlugs={races.map((r) => r.slug)}
          onClose={() => setCreating(false)}
        />
      )}
    </div>
  );
};

export default RaceGrid;
