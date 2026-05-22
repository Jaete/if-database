import Image from 'next/image';

import type ICreature from '@/db/creatures/creatures.d';
import { useCssHandles } from '@/hooks/useCssHandles';

import CreatureCardHandles from './handles';
import '@/styles/components/creatureCard.scss';

interface IProps {
  creature: ICreature;
  onClick: (creature: ICreature) => void;
}

const CreatureCard = ({ creature, onClick }: IProps) => {
  const handles = useCssHandles(CreatureCardHandles);

  const handleEditClick = (e: React.MouseEvent, creature: ICreature) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `/creatures/edit/${creature.slug}`;
  };

  return (
    <div className={handles.card} onClick={() => onClick(creature)}>
      <div className={handles.cardImage}>
        <Image
          src={creature.image ?? '/creature-placeholder.png'}
          alt={creature.name}
          width={300}
          height={300}
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
        />
        <div className={handles.cardImageOverlay} />
      </div>
      <div className={handles.cardInfo}>
        <div className={handles.cardRarity}>{creature.rarity}</div>
        <h3 className={handles.cardName}>{creature.name}</h3>
        <button
          className={handles.cardButton}
          onClick={(e) => handleEditClick(e, creature)}
        >
          <svg
            className={handles.cardButtonIcon}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          EDITAR
        </button>
      </div>
    </div>
  );
};

export default CreatureCard;
