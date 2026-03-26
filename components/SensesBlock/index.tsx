import { useCssHandles } from '@/hooks/useCssHandles';
import SensesBlockHandles from './handles';
import { ISenses } from '@/db/monsters/monsters.d';
import './SensesBlock.scss';

interface IProps {
  senses: ISenses;
}

const SensesBlock = ({ senses }: IProps) => {
  const handles = useCssHandles(SensesBlockHandles);

  return (
    <div className={handles.statSection}>
      <h4>Sentidos</h4>
      <div className={handles.sensesList}>
        <div className={handles.infoRow}>
          <span className={handles.infoLabel}>Percepção passiva:</span>{' '}
          <span id="sense-perception">{senses.passivePerception ?? '---'}</span>
        </div>
        <div className={handles.infoRow}>
          <span className={handles.infoLabel}>Visão no escuro:</span>{' '}
          <span id="sense-darkvision">{senses.darkvision ?? '---'}</span>
        </div>
      </div>
    </div>
  );
};

export default SensesBlock;
