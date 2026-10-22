import type { IPublicPlayer } from '@/db/players/publicFields';
import { useCssHandles } from '@/hooks/useCssHandles';
import Block from '../Block';
import Portrait from '../Portrait';
import { formatDate, isHttpUrl, splitLines } from '../sheetData';
import ChroniclePanelHandles from './handles';
import { useEditing } from '../EditingContext';
import EditableText from '../EditableText';

interface IProps {
  player: IPublicPlayer;
}

const ChroniclePanel = ({ player }: IProps) => {
  const handles = useCssHandles(ChroniclePanelHandles);
  const { editable } = useEditing();

  const appearance = splitLines(player.appearance);
  const backstory = splitLines(player.backstory);
  const importedAt = formatDate(player.importedAt);
  const topicUrl = isHttpUrl(player.forumTopicUrl)
    ? player.forumTopicUrl
    : undefined;

  const hasRegistry = !!player.ownerUsername || !!topicUrl || !!importedAt;
  const hasText = appearance.length > 0 || backstory.length > 0;

  // Em edição os dois textos longos viram uma textarea cada, com o conteúdo
  // cru: quebrar em parágrafos é apresentação, e editar o texto já quebrado
  // perderia as quebras de linha originais.
  const prose = (
    path: 'appearance' | 'backstory',
    label: string,
    paragraphs: string[]
  ) => (
    <div className={handles.sheetProse}>
      <EditableText
        path={path}
        label={label}
        as="multiline"
        placeholder={`Sem ${label.toLowerCase()}`}
      >
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </EditableText>
    </div>
  );

  return (
    <>
      <div className={handles.sheetChronicle}>
        <Portrait image={player.image} name={player.name} variant="chronicle" />
        <div>
          {(editable || player.subtitle) && (
            <span className={handles.sheetEpithet}>
              <EditableText
                path="subtitle"
                label="Epíteto"
                placeholder="Epíteto"
              >
                {player.subtitle}
              </EditableText>
            </span>
          )}
          {(editable || appearance.length > 0) && (
            <Block title="Aparência">
              {prose('appearance', 'Aparência', appearance)}
            </Block>
          )}
        </div>
      </div>

      {(editable || backstory.length > 0) && (
        <Block title="História">
          {prose('backstory', 'História', backstory)}
        </Block>
      )}

      {!hasText && !editable && (
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
