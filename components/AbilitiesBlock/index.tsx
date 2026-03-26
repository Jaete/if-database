import { useCssHandles } from '@/hooks/useCssHandles';
import AbilitiesBlockHandles from './handles';
import { IAbilities } from '@/db/monsters/monsters.d';

interface IProps {
  abilities: IAbilities[];
  title?: string;
}

const AbilitiesBlock = ({ abilities, title }: IProps) => {
  const handles = useCssHandles(AbilitiesBlockHandles);

  return (
    <div className={handles.statSection}>
      <h3>{title || 'Habilidades'}</h3>
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
