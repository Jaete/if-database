import type { IPublicPlayer } from '@/db/players/publicFields';
import { useCssHandles } from '@/hooks/useCssHandles';
import { formatModifier } from '@/lib/stats';
import Portrait from '../Portrait';
import { DASH, formatMeters, formatNumber } from '../sheetData';
import HeaderHandles from './handles';

interface IProps {
  player: IPublicPlayer;
}

const Header = ({ player }: IProps) => {
  const handles = useCssHandles(HeaderHandles);
  const { combat, experience, chi, senses } = player;

  const eyebrow = [
    player.kingdom,
    player.ownerUsername && `jogador ${player.ownerUsername}`,
  ]
    .filter(Boolean)
    .join(' · ');

  const hasXp = !!experience && experience.nextLevel > 0;
  const xpRatio = hasXp
    ? Math.min(1, Math.max(0, experience.current / experience.nextLevel))
    : 0;
  const hasChi = !!chi && (chi.max > 0 || chi.current > 0);
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
        <h1 className={handles.sheetName}>{player.name}</h1>
        <div className={handles.sheetLine}>
          {player.class} <span className={handles.sheetLineMuted}>·</span>{' '}
          {player.race}
        </div>
        {hasXp && (
          <div className={handles.sheetXp}>
            <div className={handles.sheetXpRow}>
              <span>Experiência</span>
              <b>
                {formatNumber(experience.current)} /{' '}
                {formatNumber(experience.nextLevel)}
              </b>
            </div>
            {bar(
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
            {combat?.hp?.value ?? DASH}
          </span>
          {hasHpBar && bar(1, 'Vida máxima', hpValue, hpValue, 'hp')}
          {combat?.hp?.formula && (
            <span className={handles.sheetResourceFormula}>
              {combat.hp.formula}
            </span>
          )}
        </div>
        {hasChi && chi && (
          <div className={handles.sheetResource}>
            <span className={handles.sheetResourceKey}>Chi</span>
            <span className={handles.sheetResourceValue}>
              {chi.current}
              <small className={handles.sheetResourceTotal}> / {chi.max}</small>
            </span>
            {hasChiBar && bar(chiRatio, 'Chi', chi.current, chi.max)}
          </div>
        )}
      </div>

      <div className={handles.sheetStrip}>
        <div className={handles.sheetStripCell} title={combat?.ac?.formula}>
          <span className={handles.sheetStripKey}>CA</span>
          <span className={handles.sheetStripValue}>
            {combat?.ac?.value ?? DASH}
          </span>
          {combat?.ac?.formula && (
            <span className={handles.sheetStripNote}>{combat.ac.formula}</span>
          )}
        </div>
        <div className={handles.sheetStripCell}>
          <span className={handles.sheetStripKey}>Velocidade</span>
          <span className={handles.sheetStripValue}>
            {speed?.walk !== undefined ? formatMeters(speed.walk) : DASH}
          </span>
          {speedNote && (
            <span className={handles.sheetStripNote}>{speedNote}</span>
          )}
        </div>
        <div className={handles.sheetStripCell}>
          <span className={handles.sheetStripKey}>Proficiência</span>
          <span className={handles.sheetStripValue}>
            {player.proficiencyBonus !== undefined
              ? formatModifier(player.proficiencyBonus)
              : DASH}
          </span>
          <span className={handles.sheetStripNote}>bônus</span>
        </div>
        <div className={handles.sheetStripCell}>
          <span className={handles.sheetStripKey}>Percepção</span>
          <span className={handles.sheetStripValue}>
            {senses?.passivePerception ?? DASH}
          </span>
          <span className={handles.sheetStripNote}>passiva</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
