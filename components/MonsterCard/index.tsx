import Image from 'next/image';

import type IMonster from '@/db/monsters/monsters.d';
import { useCssHandles } from '@/hooks/useCssHandles';

import MonsterCardHandles from './handles';
import '@/styles/components/monsterCard.scss';

interface IProps {
  monster: IMonster;
  onClick: (monster: IMonster) => void;
}

const MonsterCard = ({ monster, onClick }: IProps) => {
  const handles = useCssHandles(MonsterCardHandles);

  const handleEditClick = (e: React.MouseEvent, monster: IMonster) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `/monsters/edit/${monster.slug}`;
  };

  return (
    <div className={handles.card} onClick={() => onClick(monster)}>
      <div className={handles.cardImage}>
        <Image
          src={monster.image ?? '/monster-placeholder.png'}
          alt={monster.name}
          width={300}
          height={300}
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
        />
        <div className={handles.cardImageOverlay} />
      </div>
      <div className={handles.cardInfo}>
        <div className={handles.cardRarity}>{monster.rarity}</div>
        <h3 className={handles.cardName}>{monster.name}</h3>
        <button
          className={handles.cardButton}
          onClick={(e) => handleEditClick(e, monster)}
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

export default MonsterCard;
