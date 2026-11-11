'use client';

import { useCssHandles } from '@/hooks/useCssHandles';
import { PencilIcon } from '../../Icons';
import RaceIconButton from '../../RaceIconButton';
import { TRAIT_FIELDS } from '../fields';
import type { IRaceView } from '../types';
import SheetHandles from './handles';

interface IProps {
  race: IRaceView;
  canEdit: boolean;
  onEdit: () => void;
}

/** A ficha lateral: os traços que valem para toda a raça. */
const Sheet = ({ race, canEdit, onEdit }: IProps) => {
  const handles = useCssHandles(SheetHandles);
  const rows = TRAIT_FIELDS.filter(({ name }) => race[name]);

  return (
    <aside className={handles.raceSheet} aria-labelledby="race-h-tracos">
      <section id="tracos">
        <div className={handles.raceSheetHead}>
          <h2 id="race-h-tracos">Traços da raça</h2>
          {canEdit && (
            <RaceIconButton
              small
              label="Editar traços da raça"
              icon={<PencilIcon />}
              onClick={onEdit}
            />
          )}
        </div>
        {race.subraces.length > 0 && (
          <p className={handles.raceSheetNote}>
            Valem para toda a raça. Uma sub-raça pode substituir algum deles.
          </p>
        )}
        {rows.length > 0 ? (
          <dl className={handles.raceSheetList}>
            {rows.map(({ name, label }) => (
              <div key={name}>
                <dt>{label}</dt>
                <dd>{race[name]}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className={handles.raceSheetNote}>Nenhum traço preenchido.</p>
        )}
      </section>
    </aside>
  );
};

export default Sheet;
