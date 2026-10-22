import type { IPublicPlayer } from '@/db/players/publicFields';
import { useCssHandles } from '@/hooks/useCssHandles';
import { formatModifier } from '@/lib/stats';
import Portrait from '../Portrait';
import { DASH, formatMeters, formatNumber } from '../sheetData';
import HeaderHandles from './handles';
import { useEditing } from '../EditingContext';
import EditableText from '../EditableText';

interface IProps {
  player: IPublicPlayer;
}

const Header = ({ player }: IProps) => {
  const handles = useCssHandles(HeaderHandles);
  const { editable, value } = useEditing();
  const { combat, experience, chi, senses } = player;

  const eyebrow = [
    player.kingdom,
    player.ownerUsername && `jogador ${player.ownerUsername}`,
  ]
    .filter(Boolean)
    .join(' · ');

  const hasXp = editable || (!!experience && experience.nextLevel > 0);
  // `hasXp` também é verdadeiro no modo de edição, quando ainda pode não haver
  // experiência nenhuma — daí a barra ter a sua própria checagem.
  const xpRatio =
    experience && experience.nextLevel > 0
      ? Math.min(1, Math.max(0, experience.current / experience.nextLevel))
      : 0;
  const hasChi = editable || (!!chi && (chi.max > 0 || chi.current > 0));
  const hasChiBar = !!chi && chi.max > 0;
  const hpValue = combat?.hp?.value;
  // The schema only stores max HP, so the bar is always full.
  const hasHpBar = typeof hpValue === 'number' && hpValue > 0;
  const chiRatio = hasChiBar
    ? Math.min(1, Math.max(0, chi.current / chi.max))
    : 0;

  const speed = combat?.speed;
  const speedNote =
    speed?.note || (speed?.walk !== undefined ? 'caminhada' : '');

  const bar = (
    ratio: number,
    label: string,
    now: number,
    max: number,
    variant?: 'hp'
  ) => (
    <div
      className={handles.sheetBar}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={now}
    >
      <i
        className={`${handles.sheetBarFill}${
          variant ? ` ${handles.sheetBarFill}--${variant}` : ''
        }`}
        style={{ transform: `scaleX(${ratio})` }}
      />
    </div>
  );

  return (
    <header className={handles.sheetHud}>
      <Portrait
        image={player.image}
        name={player.name}
        badge={player.level !== undefined ? `Nv ${player.level}` : undefined}
      />

      <div className={handles.sheetWho}>
        {eyebrow && <span className={handles.sheetEyebrow}>{eyebrow}</span>}
        <h1 className={handles.sheetName}>
          <EditableText path="name" label="Nome">
            {player.name}
          </EditableText>
        </h1>
        <div className={handles.sheetLine}>
          <EditableText path="class" label="Classe">
            {player.class}
          </EditableText>{' '}
          <span className={handles.sheetLineMuted}>·</span>{' '}
          <EditableText path="race" label="Raça">
            {player.race}
          </EditableText>
        </div>
        {hasXp && (
          <div className={handles.sheetXp}>
            <div className={handles.sheetXpRow}>
              <span>Experiência</span>
              <b>
                {editable ? (
                  <>
                    <EditableText
                      path="experience.current"
                      label="Experiência atual"
                      as="number"
                      placeholder="0"
                    >
                      {value('experience.current')}
                    </EditableText>{' '}
                    /{' '}
                    <EditableText
                      path="experience.nextLevel"
                      label="Experiência do próximo nível"
                      as="number"
                      placeholder="0"
                    >
                      {value('experience.nextLevel')}
                    </EditableText>
                  </>
                ) : (
                  <>
                    {formatNumber(experience!.current)} /{' '}
                    {formatNumber(experience!.nextLevel)}
                  </>
                )}
              </b>
            </div>
            {experience &&
              bar(
                xpRatio,
                `Experiência para o nível ${(player.level ?? 0) + 1}`,
                experience.current,
                experience.nextLevel
              )}
          </div>
        )}
      </div>

      <div className={handles.sheetResources}>
        <div className={handles.sheetResource}>
          <span className={handles.sheetResourceKey}>HP</span>
          <span className={handles.sheetResourceValue}>
            <EditableText
              path="combat.hp.value"
              label="Pontos de vida"
              as="number"
            >
              {combat?.hp?.value ?? DASH}
            </EditableText>
          </span>
          {hasHpBar && bar(1, 'Vida máxima', hpValue, hpValue, 'hp')}
          {(editable || combat?.hp?.formula) && (
            <span className={handles.sheetResourceFormula}>
              <EditableText
                path="combat.hp.formula"
                label="Fórmula dos pontos de vida"
                placeholder="Fórmula"
              >
                {combat?.hp?.formula}
              </EditableText>
            </span>
          )}
        </div>
        {hasChi && (
          <div className={handles.sheetResource}>
            <span className={handles.sheetResourceKey}>Chi</span>
            <span className={handles.sheetResourceValue}>
              <EditableText path="chi.current" label="Chi atual" as="number">
                {chi?.current}
              </EditableText>
              <small className={handles.sheetResourceTotal}>
                {' / '}
                <EditableText path="chi.max" label="Chi máximo" as="number">
                  {chi?.max}
                </EditableText>
              </small>
            </span>
            {hasChiBar && chi && bar(chiRatio, 'Chi', chi.current, chi.max)}
          </div>
        )}
      </div>

      <div className={handles.sheetStrip}>
        <div className={handles.sheetStripCell} title={combat?.ac?.formula}>
          <span className={handles.sheetStripKey}>CA</span>
          <span className={handles.sheetStripValue}>
            <EditableText
              path="combat.ac.value"
              label="Classe de armadura"
              as="number"
            >
              {combat?.ac?.value ?? DASH}
            </EditableText>
          </span>
          {(editable || combat?.ac?.formula) && (
            <span className={handles.sheetStripNote}>
              <EditableText
                path="combat.ac.formula"
                label="Fórmula da classe de armadura"
                placeholder="Fórmula"
              >
                {combat?.ac?.formula}
              </EditableText>
            </span>
          )}
        </div>
        <div className={handles.sheetStripCell}>
          <span className={handles.sheetStripKey}>Velocidade</span>
          <span className={handles.sheetStripValue}>
            <EditableText
              path="combat.speed.walk"
              label="Velocidade de caminhada, em metros"
              as="number"
            >
              {speed?.walk !== undefined ? formatMeters(speed.walk) : DASH}
            </EditableText>
          </span>
          {(editable || speedNote) && (
            <span className={handles.sheetStripNote}>
              <EditableText
                path="combat.speed.note"
                label="Observação da velocidade"
                placeholder="Observação"
              >
                {speedNote}
              </EditableText>
            </span>
          )}
        </div>
        <div className={handles.sheetStripCell}>
          <span className={handles.sheetStripKey}>Proficiência</span>
          <span className={handles.sheetStripValue}>
            <EditableText
              path="proficiencyBonus"
              label="Bônus de proficiência"
              as="number"
            >
              {player.proficiencyBonus !== undefined
                ? formatModifier(player.proficiencyBonus)
                : DASH}
            </EditableText>
          </span>
          <span className={handles.sheetStripNote}>bônus</span>
        </div>
        <div className={handles.sheetStripCell}>
          <span className={handles.sheetStripKey}>Percepção</span>
          <span className={handles.sheetStripValue}>
            <EditableText
              path="senses.passivePerception"
              label="Percepção passiva"
              as="number"
            >
              {senses?.passivePerception ?? DASH}
            </EditableText>
          </span>
          <span className={handles.sheetStripNote}>passiva</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
