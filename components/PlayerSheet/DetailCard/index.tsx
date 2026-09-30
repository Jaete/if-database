import { useCssHandles } from '@/hooks/useCssHandles';
import DetailCardHandles from './handles';

interface IProps {
  id: string;
  kicker: string;
  title: string;
  text?: string;
}

const DetailCard = ({ id, kicker, title, text }: IProps) => {
  const handles = useCssHandles(DetailCardHandles);

  return (
    <div className={handles.sheetDetail} id={id} aria-live="polite">
      {/* Re-keyed on change so the fade replays for each selection. */}
      <div key={`${kicker}:${title}`} className={handles.sheetDetailBody}>
        <span className={handles.sheetDetailKicker}>{kicker}</span>
        <h4 className={handles.sheetDetailTitle}>{title}</h4>
        <p className={handles.sheetDetailText}>{text || 'Sem descrição.'}</p>
      </div>
    </div>
  );
};

export default DetailCard;
