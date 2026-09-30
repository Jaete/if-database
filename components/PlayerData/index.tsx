'use client';

import type IPlayer from '@/db/players/player';
import { useCssHandles } from '@/hooks/useCssHandles';
import CitizenData from '../CitizenData';
import StatSection from '../StatSection';
import InfoRow from '../InfoRow';
import PlayerDataHandles from './handles';
import '@/styles/components/playerData.scss';

interface IProps {
  player: IPlayer;
}

// A ficha em si é a de cidadão — IPlayer estende ICitizen. O que jogadores
// acrescentam é a procedência: de quem é o personagem e de onde veio a ficha.
const PlayerData = ({ player }: IProps) => {
  const handles = useCssHandles(PlayerDataHandles);
  const hasOrigin = player.ownerUsername || player.forumTopicUrl;

  return (
    <>
      {hasOrigin && (
        <StatSection title="Jogador">
          {player.ownerUsername && (
            <InfoRow label="Jogador:">{player.ownerUsername}</InfoRow>
          )}
          {player.forumTopicUrl && (
            <InfoRow label="Ficha:">
              <a
                className={handles.playerOwnerLink}
                href={player.forumTopicUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Abrir no fórum
              </a>
            </InfoRow>
          )}
        </StatSection>
      )}
      <CitizenData citizen={player} />
    </>
  );
};

export default PlayerData;
