import type { IPublicPlayer } from '@/db/players/publicFields';
import { useCssHandles } from '@/hooks/useCssHandles';
import Block from '../Block';
import Portrait from '../Portrait';
import { formatDate, isHttpUrl, splitLines } from '../sheetData';
import ChroniclePanelHandles from './handles';

interface IProps {
  player: IPublicPlayer;
}

const ChroniclePanel = ({ player }: IProps) => {
  const handles = useCssHandles(ChroniclePanelHandles);

  const appearance = splitLines(player.appearance);
  const backstory = splitLines(player.backstory);
  const importedAt = formatDate(player.importedAt);
  const topicUrl = isHttpUrl(player.forumTopicUrl)
    ? player.forumTopicUrl
    : undefined;

  const hasRegistry = !!player.ownerUsername || !!topicUrl || !!importedAt;
  const hasText = appearance.length > 0 || backstory.length > 0;

  return (
    <>
      <div className={handles.sheetChronicle}>
        <Portrait image={player.image} name={player.name} variant="chronicle" />
        <div>
          {player.subtitle && (
            <span className={handles.sheetEpithet}>{player.subtitle}</span>
          )}
          {appearance.length > 0 && (
            <Block title="Aparência">
              <div className={handles.sheetProse}>
                {appearance.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </Block>
          )}
        </div>
      </div>

      {backstory.length > 0 && (
        <Block title="História">
          <div className={handles.sheetProse}>
            {backstory.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Block>
      )}

      {!hasText && (
        <p className={handles.sheetEmpty}>Nenhuma crônica registrada.</p>
      )}

      {hasRegistry && (
        <div className={handles.sheetRegistry}>
          {player.ownerUsername && (
            <div className={handles.sheetRegistryItem}>
              <span className={handles.sheetCaption}>Jogador</span>
              <span className={handles.sheetRegistryValue}>
                {player.ownerUsername}
              </span>
            </div>
          )}
          {topicUrl && (
            <div className={handles.sheetRegistryItem}>
              <span className={handles.sheetCaption}>Tópico de origem</span>
              <a
                className={handles.sheetRegistryLink}
                href={topicUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {topicUrl.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          {importedAt && (
            <div className={handles.sheetRegistryItem}>
              <span className={handles.sheetCaption}>Importada em</span>
              <span className={handles.sheetRegistryValue}>{importedAt}</span>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ChroniclePanel;
