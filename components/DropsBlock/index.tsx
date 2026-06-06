import { useCssHandles } from '@/hooks/useCssHandles';
import DropsBlockHandles from './handles';
import { IDrop } from '@/db/monsters/monster';

interface IProps {
  drops: IDrop[];
}

const DropsBlock = ({ drops }: IProps) => {
  const handles = useCssHandles(DropsBlockHandles);

  return (
    <div className={handles.statSection}>
      <h3>Itens de Drop</h3>
      <table className={handles.dropsTable}>
        <tbody id="creature-drops">
          {drops?.map((drop, index) => (
            <tr key={`${drop.item || 'item'}-${index}`}>
              <td className={handles.dropRange}>{drop.chance ?? 100}%</td>
              <td className={handles.dropItem}>{drop.item ?? '---'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DropsBlock;
