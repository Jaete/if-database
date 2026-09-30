import type { IPublicPlayer } from '@/db/players/publicFields';
import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import { formatModifier } from '@/lib/stats';
import { DASH } from '../sheetData';
import SpellsPanelHandles from './handles';

interface IProps {
  player: IPublicPlayer;
}

const CIRCLE_LABELS = [
  'Truques',
  '1º Círculo',
  '2º Círculo',
  '3º Círculo',
  '4º Círculo',
  '5º Círculo',
  '6º Círculo',
  '7º Círculo',
  '8º Círculo',
  '9º Círculo',
];

const SpellsPanel = ({ player }: IProps) => {
  const handles = useCssHandles(SpellsPanelHandles);
  const sc = player.playerSpellcasting;
  if (!sc) return null;

  const cells: [string, string][] = [
    ['Atributo', sc.ability || DASH],
    ['CD de resistência', sc.saveDC !== undefined ? String(sc.saveDC) : DASH],
    [
      'Ataque mágico',
      sc.attackBonus !== undefined ? formatModifier(sc.attackBonus) : DASH,
    ],
    [
      'Nível de conjurador',
      sc.casterLevel !== undefined ? String(sc.casterLevel) : DASH,
    ],
  ];
  if (sc.cantripsKnown !== undefined)
    cells.push(['Truques conhecidos', String(sc.cantripsKnown)]);
  if (sc.spellsKnown !== undefined)
    cells.push(['Magias conhecidas', String(sc.spellsKnown)]);

  const levels = [...(sc.spellLevels ?? [])].sort((a, b) => a.level - b.level);

  return (
    <>
      <div className={handles.sheetCastbar}>
        {cells.map(([label, value]) => (
          <div key={label} className={handles.sheetCastCell}>
            <span className={handles.sheetCaption}>{label}</span>
            <b
              className={`${handles.sheetCastValue}${
                label === 'Atributo'
                  ? ` ${applyModifiers(handles.sheetCastValue, 'text')}`
                  : ''
              }`}
            >
              {value}
            </b>
          </div>
        ))}
      </div>

      {levels.map((circle) => {
        const total = circle.slotsTotal ?? 0;
        const free = Math.max(0, total - (circle.slotsUsed ?? 0));
        const label = CIRCLE_LABELS[circle.level] ?? `${circle.level}º Círculo`;
        const spells = circle.spells ?? [];

        return (
          <section
            key={circle.level}
            className={handles.sheetCircle}
            aria-label={label}
          >
            <div className={handles.sheetCircleHead}>
              <span className={handles.sheetCircleTitle}>{label}</span>
              {circle.level === 0 ? (
                <span className={handles.sheetSlotsNote}>à vontade</span>
              ) : (
                <span
                  className={handles.sheetSlots}
                  role="img"
                  aria-label={`${free} de ${total} espaços livres`}
                >
                  {Array.from({ length: total }, (_, i) => (
                    <i
                      key={i}
                      className={`${handles.sheetSlot}${
                        i < free ? ` ${handles.sheetSlot}--free` : ''
                      }`}
                    />
                  ))}
                  <span className={handles.sheetSlotsNote}>
                    {free}/{total} livres
                  </span>
                </span>
              )}
            </div>
            {spells.length > 0 ? (
              <ul className={handles.sheetSpells}>
                {spells.map((spell, i) => (
                  <li
                    key={`${spell.name}:${i}`}
                    className={`${handles.sheetSpell}${
                      spell.prepared ? '' : ` ${handles.sheetSpell}--off`
                    }`}
                  >
                    <span>{spell.name}</span>
                    {circle.level !== 0 && (
                      <span
                        className={`${handles.sheetSpellBadge} ${applyModifiers(
                          handles.sheetSpellBadge,
                          spell.prepared ? 'prepared' : 'known'
                        )}`}
                      >
                        {spell.prepared ? 'Preparada' : 'Conhecida'}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className={handles.sheetEmpty}>Nenhuma magia registrada.</p>
            )}
          </section>
        );
      })}

      {levels.length === 0 && (
        <p className={handles.sheetEmpty}>
          Nenhum círculo de magia registrado.
        </p>
      )}
    </>
  );
};

export default SpellsPanel;
