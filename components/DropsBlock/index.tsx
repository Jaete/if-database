import { useCssHandles } from '@/hooks/useCssHandles';
import DropsBlockHandles from './handles';
import { IDrops } from '@/db/monsters/monsters.d';

interface IProps {
  drops: IDrops[];
}

const DropsBlock = ({ drops }: IProps) => {
  const handles = useCssHandles(DropsBlockHandles);

  return (
    <div className={handles.statSection}>
      <h3>Itens de Drop</h3>
      <table className={handles.dropsTable}>
        <tbody id="creature-drops">
          {drops?.map((drop) => (
            <tr key={drop.item}>
              <td className={handles.dropRange}>{drop.range}</td>
              <td className={handles.dropItem}>{drop.item}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DropsBlock;
