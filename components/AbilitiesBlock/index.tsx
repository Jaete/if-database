import { useCssHandles } from '@/hooks/useCssHandles';
import AbilitiesBlockHandles from './handles';
import { IAbilities } from '@/db/monsters/monsters.d';
import './AbilitiesBlock.scss';

interface IProps {
  abilities: IAbilities[];
}

const AbilitiesBlock = ({ abilities }: IProps) => {
  const handles = useCssHandles(AbilitiesBlockHandles);

  return (
    <div className={handles.statSection}>
      <h3>Habilidades</h3>
      <div className={handles.abilitiesContainer}>
        {abilities?.map((ability) => (
          <div key={ability.name} className={handles.ability}>
            <span className={handles.abilityName}>{ability.name}: </span>
            <span className={handles.abilityDescription}>
              {ability.description}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AbilitiesBlock;
