import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import TagListHandles from './handles';

interface IProps {
  items: string[];
  emptyLabel?: string;
}

const TagList = ({ items, emptyLabel = 'Nenhuma' }: IProps) => {
  const handles = useCssHandles(TagListHandles);

  return (
    <div className={handles.sheetTags}>
      {items.length > 0 ? (
        items.map((item) => (
          <span key={item} className={handles.sheetTag}>
            {item}
          </span>
        ))
      ) : (
        <span
          className={`${handles.sheetTag} ${applyModifiers(handles.sheetTag, 'none')}`}
        >
          {emptyLabel}
        </span>
      )}
    </div>
  );
};

export default TagList;
