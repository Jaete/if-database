import type { IPublicPlayer } from '@/db/players/publicFields';
import { useCssHandles } from '@/hooks/useCssHandles';
import { readProfessions } from '../sheetData';
import ProfessionsPanelHandles from './handles';
import EditNote from '../EditNote';

interface IProps {
  player: IPublicPlayer;
}

const ProfessionsPanel = ({ player }: IProps) => {
  const handles = useCssHandles(ProfessionsPanelHandles);
  const professions = readProfessions(player);

  // O aviso também vale no estado vazio: é justamente aí que a pessoa tenta
  // clicar para adicionar e não acontece nada.
  if (professions.length === 0) {
    return (
      <>
        <p className={handles.sheetEmpty}>Nenhuma profissão registrada.</p>
        <EditNote>
          {
            'Profissões ainda não são editáveis pela ficha embutida — use o formulário completo no app.'
          }
        </EditNote>
      </>
    );
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
      <EditNote>
        {
          'Profissões ainda não são editáveis pela ficha embutida — use o formulário completo no app.'
        }
      </EditNote>
    </div>
  );
};

export default ProfessionsPanel;
