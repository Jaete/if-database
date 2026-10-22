'use client';

import type IPlayer from '@/db/players/player';
import { fichaTag } from '@/lib/forumTag';
import CitizenCard from '../CitizenCard';
import { CopyIcon } from '../Icons';

interface IProps {
  player: IPlayer;
  onClick: (player: IPlayer) => void;
  onEdit?: (player: IPlayer) => void;
  onDelete?: (player: IPlayer) => void;
  onEditInNewTab?: (player: IPlayer) => void;
}

// IPlayer estende ICitizen, então o card é o mesmo; o que muda é o subtítulo,
// que aqui mostra de quem é o personagem.
const PlayerCard = ({
  player,
  onClick,
  onEdit,
  onDelete,
  onEditInNewTab,
}: IProps) => {
  const subtitle = [player.race, player.class, player.ownerUsername]
    .filter(Boolean)
    .join(' · ');

  return (
    <CitizenCard
      citizen={player}
      subtitle={subtitle}
      menuItems={[
        {
          label: 'Copiar BBCode da ficha',
          icon: <CopyIcon />,
          // O menu se fecha ao clicar, então não há onde mostrar "copiado"
          // aqui; o painel do jogador tem o botão com retorno visível.
          onClick: () => {
            void navigator.clipboard
              .writeText(fichaTag(String(player._id)))
              .catch(() => {});
          },
        },
      ]}
      onClick={onClick as (citizen: IPlayer) => void}
      onEdit={onEdit as ((citizen: IPlayer) => void) | undefined}
      onDelete={onDelete as ((citizen: IPlayer) => void) | undefined}
      onEditInNewTab={
        onEditInNewTab as ((citizen: IPlayer) => void) | undefined
      }
    />
  );
};

export default PlayerCard;
