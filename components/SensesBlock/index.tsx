import { useCssHandles } from '@/hooks/useCssHandles';
import SensesBlockHandles from './handles';
import { ISenses } from '@/db/creatures/creatures.d';

interface IProps {
  senses: ISenses;
}

const SensesBlock = ({ senses }: IProps) => {
  const handles = useCssHandles(SensesBlockHandles);

  return (
    <div className={handles.statSection}>
      <h3>Sentidos</h3>
      <div className={handles.sensesList}>
        <div className={handles.infoRow}>
          <span className={handles.infoLabel}>Percepção passiva:</span>{' '}
          <span id="sense-perception">{senses.passivePerception ?? '---'}</span>
        </div>
        {senses.darkvision !== undefined && senses.darkvision > 0 && (
          <div className={handles.infoRow}>
            <span className={handles.infoLabel}>Visão no escuro:</span>{' '}
            <span id="sense-darkvision">{senses.darkvision} pés</span>
          </div>
        )}
        {senses.blindsight !== undefined && senses.blindsight > 0 && (
          <div className={handles.infoRow}>
            <span className={handles.infoLabel}>Visão às cegas:</span>{' '}
            <span id="sense-blindsight">{senses.blindsight} pés</span>
          </div>
        )}
        {senses.tremorsense !== undefined && senses.tremorsense > 0 && (
          <div className={handles.infoRow}>
            <span className={handles.infoLabel}>Percepção sísmica:</span>{' '}
            <span id="sense-tremorsense">{senses.tremorsense} pés</span>
          </div>
        )}
        {senses.truesight !== undefined && senses.truesight > 0 && (
          <div className={handles.infoRow}>
            <span className={handles.infoLabel}>Visão verdadeira:</span>{' '}
            <span id="sense-truesight">{senses.truesight} pés</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SensesBlock;
