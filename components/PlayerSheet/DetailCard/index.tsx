import { useCssHandles } from '@/hooks/useCssHandles';
import DetailCardHandles from './handles';

interface IProps {
  id: string;
  kicker: string;
  title: string;
  text?: string;
  /** Ficha curta (ex.: escola, alcance) entre o título e o texto. */
  meta?: { label: string; value: string; wide?: boolean }[];
}

const DetailCard = ({ id, kicker, title, text, meta }: IProps) => {
  const handles = useCssHandles(DetailCardHandles);

  return (
    <div className={handles.sheetDetail} id={id} aria-live="polite">
      {/* Re-keyed on change so the fade replays for each selection. */}
      <div key={`${kicker}:${title}`} className={handles.sheetDetailBody}>
        <span className={handles.sheetDetailKicker}>{kicker}</span>
        <h4 className={handles.sheetDetailTitle}>{title}</h4>
        {meta && meta.length > 0 && (
          <dl className={handles.sheetDetailMeta}>
            {meta.map((item) => (
              <div
                key={item.label}
                className={`${handles.sheetDetailMetaItem}${
                  item.wide ? ` ${handles.sheetDetailMetaItem}--wide` : ''
                }`}
              >
                <dt className={handles.sheetDetailMetaKey}>{item.label}</dt>
                <dd className={handles.sheetDetailMetaValue}>{item.value}</dd>
              </div>
            ))}
          </dl>
        )}
        <p className={handles.sheetDetailText}>{text || 'Sem descrição.'}</p>
      </div>
    </div>
  );
};

export default DetailCard;
