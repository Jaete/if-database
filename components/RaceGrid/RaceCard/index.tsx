'use client';

import Link from 'next/link';
import type { PointerEvent } from 'react';
import { abilityChips } from '@/lib/raceAbilityChips';
import { plural } from '@/lib/plural';
import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import { PencilIcon } from '../../Icons';
import RaceArt from '../../RaceArt';
import RaceChips from '../../RaceChips';
import RaceIconButtonHandles from '../../RaceIconButton/handles';
import type { IRaceOption } from '../useRaceGrid';
import RaceCardHandles from './handles';

interface IProps {
  race: IRaceOption;
  canEdit: boolean;
  basePath: string;
  onFocusRace: (slug: string) => void;
}

/** O card de uma raça na listagem: a capa, o nome, os chips e as sub-raças. */
const RaceCard = ({ race, canEdit, basePath, onFocusRace }: IProps) => {
  const handles = useCssHandles(RaceCardHandles);
  const iconBtn = useCssHandles(RaceIconButtonHandles);
  const cover = race.images[0];
  const count = race.subraces.length;

  // Parallax da arte: a posição do ponteiro vira duas variáveis CSS. Com
  // movimento reduzido o SCSS anula o deslocamento.
  const track = (e: PointerEvent<HTMLLIElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty(
      '--px',
      ((e.clientX - box.left) / box.width - 0.5).toFixed(3)
    );
    e.currentTarget.style.setProperty(
      '--py',
      ((e.clientY - box.top) / box.height - 0.5).toFixed(3)
    );
  };
  const reset = (e: PointerEvent<HTMLLIElement>) => {
    e.currentTarget.style.setProperty('--px', '0');
    e.currentTarget.style.setProperty('--py', '0');
  };

  return (
    <li
      className={`${handles.racePlate}${
        cover ? '' : ` ${applyModifiers(handles.racePlate, 'noart')}`
      }`}
      onPointerEnter={() => onFocusRace(race.slug)}
      onFocus={() => onFocusRace(race.slug)}
      onPointerMove={track}
      onPointerLeave={reset}
    >
      <div className={handles.racePlateArt}>
        <RaceArt
          image={cover}
          label={race.name}
          alt={cover ? `Arte de ${race.name}` : undefined}
          note={canEdit ? 'Sem arte · adicione no editor' : 'Sem arte'}
        />
      </div>

      <div className={handles.racePlateFlags}>
        {race.unique && (
          <span className={handles.racePlatePill}>Raça única</span>
        )}
      </div>

      {canEdit && (
        <Link
          href={`${basePath}/${race.slug}`}
          prefetch={false}
          className={`${iconBtn.raceIconBtn} ${applyModifiers(iconBtn.raceIconBtn, 'art')} ${handles.racePlateEdit}`}
          aria-label={`Editar ${race.name}`}
          title="Editar"
        >
          <PencilIcon />
        </Link>
      )}

      <div className={handles.racePlateBody}>
        <h2 className={handles.racePlateName}>
          <Link
            href={`${basePath}/${race.slug}`}
            prefetch={false}
            className={handles.racePlateLink}
          >
            {race.name}
          </Link>
        </h2>
        <span className={handles.racePlateClasp} aria-hidden="true">
          ◆
        </span>
        <RaceChips chips={abilityChips(race.abilityScoreIncrease)} />
        <p className={handles.racePlateSubs}>
          {count > 0 ? (
            <>
              <b>{plural(count, 'sub-raça', 'sub-raças')}:</b>{' '}
              {race.subraces.map((s) => s.name).join(', ')}
            </>
          ) : (
            'Sem sub-raças'
          )}
        </p>
      </div>
    </li>
  );
};

export default RaceCard;
