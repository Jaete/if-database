import type { IPublicPlayer } from '@/db/players/publicFields';
import { useCssHandles } from '@/hooks/useCssHandles';
import { readProfessions } from '../sheetData';
import ProfessionsPanelHandles from './handles';

interface IProps {
  player: IPublicPlayer;
}

const ProfessionsPanel = ({ player }: IProps) => {
  const handles = useCssHandles(ProfessionsPanelHandles);
  const professions = readProfessions(player);

  if (professions.length === 0) {
    return <p className={handles.sheetEmpty}>Nenhuma profissão registrada.</p>;
  }

  return (
    <div className={handles.sheetProfessions}>
      {professions.map((profession, i) => {
        const subs = (profession.subProfessions ?? []).filter((s) => s?.name);
        return (
          <section
            key={`${profession.name}:${i}`}
            className={handles.sheetProfession}
          >
            <span className={handles.sheetCaption}>Profissão</span>
            <h3 className={handles.sheetProfessionTitle}>{profession.name}</h3>
            {subs.length > 0 ? (
              <ul
                className={handles.sheetTree}
                aria-label={`Sub-profissões de ${profession.name}`}
              >
                {subs.map((s, j) => (
                  <li key={`${s.name}:${j}`}>{s.name}</li>
                ))}
              </ul>
            ) : (
              <span className={handles.sheetEmpty}>Sem especialização</span>
            )}
          </section>
        );
      })}
    </div>
  );
};

export default ProfessionsPanel;
