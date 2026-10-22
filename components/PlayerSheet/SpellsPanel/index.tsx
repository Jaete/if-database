'use client';

import { useState } from 'react';
import type { IPlayerSpell, IPlayerSpellLevel } from '@/db/citizens/citizen';
import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import { formatModifier, modifierOf, spellSaveDC } from '@/lib/stats';
import { CloseIcon, EyeIcon, PencilIcon } from '../../Icons';
import Modal from '@/components/Modal';
import PromptModal from '@/components/PromptModal';
import SpellPicker from './SpellPicker';
import { useSpellsPanel } from './useSpellsPanel';
import EditableText from '../EditableText';
import { useEditing } from '../EditingContext';
import { ATTRIBUTES, DASH, attrFromName } from '../sheetData';
import {
  SPELL_FIELDS,
  hasSpellDetail,
  spellFromPrompt,
  spellPromptFields,
} from '@/db/l10n/spells';
import type { AttrKey } from '../sheetData';
import SpellsPanelHandles from './handles';

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

const SC = 'playerSpellcasting';
const LEVELS_PATH = `${SC}.spellLevels`;

const castFields = (
  writeAbility: (value: string | number | undefined) => void
): readonly {
  label: string;
  path: string;
  as: 'text' | 'number';
  /** Só aparece na leitura quando preenchido — no modo de edição, sempre. */
  optional?: boolean;
  modifier?: boolean;
  /** Calculado a partir dos outros campos em vez de digitado. */
  derived?: boolean;
  writer?: (value: string | number | undefined) => void;
  options?: readonly { value: string; label: string }[];
}[] => [
  {
    label: 'Atributo',
    path: `${SC}.ability`,
    as: 'text',
    writer: writeAbility,
    // Lista fechada: é o atributo de conjuração que determina o CD, e um nome
    // digitado fora do padrão deixaria a conta sem como ser feita.
    options: ATTRIBUTES.map((a) => ({ value: a.label, label: a.label })),
  },
  {
    label: 'CD de resistência',
    path: `${SC}.saveDC`,
    as: 'number',
    derived: true,
  },
  {
    label: 'Ataque mágico',
    path: `${SC}.attackBonus`,
    as: 'number',
    modifier: true,
  },
  { label: 'Nível de conjurador', path: `${SC}.casterLevel`, as: 'number' },
  {
    label: 'Truques conhecidos',
    path: `${SC}.cantripsKnown`,
    as: 'number',
    optional: true,
  },
  {
    label: 'Magias conhecidas',
    path: `${SC}.spellsKnown`,
    as: 'number',
    optional: true,
  },
];

/** Magia em edição ou em leitura, com o círculo e a posição que a localizam. */
type Picked = { level: number; at: number; spell: IPlayerSpell } | null;

const SpellsPanel = () => {
  const handles = useCssHandles(SpellsPanelHandles);
  const { editable, value, objects, setField } = useEditing();
  const [editingSpell, setEditingSpell] = useState<Picked>(null);
  const [reading, setReading] = useState<IPlayerSpell | null>(null);
  // Círculo cujo seletor está aberto. `null` fechado — e não um booleano,
  // porque o catálogo é buscado por círculo.
  const [picking, setPicking] = useState<number | null>(null);
  const casting = useSpellsPanel();

  // Mesmo caminho de leitura de readAttribute(), mas pelo contexto, para o CD
  // acompanhar o rascunho enquanto não se salva.
  const attrModifier = (key: AttrKey): number | undefined => {
    const mod = value(`playerStats.${key}.modifier`);
    if (typeof mod === 'number') return mod;
    const flat = value(`stats.${key}`);
    return typeof flat === 'number' ? modifierOf(flat) : undefined;
  };

  const proficiency = Number(value('proficiencyBonus')) || 0;
  const abilityKey = attrFromName(String(value(`${SC}.ability`) ?? ''));
  const abilityMod = abilityKey !== null ? attrModifier(abilityKey) : undefined;
  // O CD é derivado sempre que o atributo de conjuração é reconhecido; só uma
  // ficha com atributo em branco ou escrito fora do padrão cai no valor
  // gravado, que aí continua editável à mão.
  const derivedDC =
    abilityMod !== undefined ? spellSaveDC(abilityMod, proficiency) : undefined;
  const dcFormula =
    abilityMod !== undefined && abilityKey !== null
      ? `8 + ${ATTRIBUTES.find((a) => a.key === abilityKey)?.abbr} ${formatModifier(abilityMod)} + prof. ${formatModifier(proficiency)}`
      : undefined;

  /** Grava o atributo de conjuração junto com o CD que ele determina. */
  const writeAbility = (next: string | number | undefined) => {
    setField(`${SC}.ability`, next);
    const key = attrFromName(String(next ?? ''));
    const mod = key !== null ? attrModifier(key) : undefined;
    if (mod !== undefined) {
      setField(`${SC}.saveDC`, spellSaveDC(mod, proficiency));
    }
  };

  const stored = objects<IPlayerSpellLevel>(LEVELS_PATH);
  const hasCasting =
    stored.length > 0 ||
    castFields(writeAbility).some((f) => value(f.path) !== undefined);

  if (!hasCasting && !editable) return null;

  // Com classe ligada, os círculos são os que a tabela dela concede — nem um a
  // mais: oferecer um 4º círculo a quem não conjura 4º círculo seria oferecer o
  // que a regra proíbe. Sem classe, a edição abre os dez, porque aí não há
  // tabela nenhuma dizendo quais existem.
  const levels: IPlayerSpellLevel[] = casting.linked
    ? [...stored].sort((a, b) => a.level - b.level)
    : editable
      ? Array.from(
          { length: 10 },
          (_, level) =>
            stored.find((l) => l.level === level) ?? {
              level,
              slotsTotal: 0,
              slotsUsed: 0,
            }
        )
      : [...stored].sort((a, b) => a.level - b.level);

  /** Regrava um círculo, criando-o se ainda não existir, sempre em ordem. */
  const writeLevel = (level: number, patch: Partial<IPlayerSpellLevel>) => {
    const at = stored.findIndex((l) => l.level === level);
    const base = stored[at] ?? { level, slotsTotal: 0, slotsUsed: 0 };
    const next = { ...base, ...patch };
    setField(
      LEVELS_PATH,
      (at >= 0
        ? stored.map((l, i) => (i === at ? next : l))
        : [...stored, next]
      ).sort((a, b) => a.level - b.level)
    );
  };

  const writeSpell = (
    level: number,
    at: number,
    spell: IPlayerSpell | null
  ) => {
    const list = stored.find((l) => l.level === level)?.spells ?? [];
    writeLevel(level, {
      spells:
        spell === null
          ? list.filter((_, i) => i !== at)
          : at < 0
            ? [...list, spell]
            : list.map((s, i) => (i === at ? spell : s)),
    });
  };

  const castCells = castFields(writeAbility).filter(
    (f) => editable || !f.optional || value(f.path) !== undefined
  );

  // Numa ficha ligada à classe estes três números não são campos: saem da
  // tabela da classe e da contagem do que está preparado. Entram como texto,
  // porque editá-los só produziria um valor que a regra contradiz.
  const castOverride: Record<string, string> = casting.linked
    ? {
        'Truques conhecidos': `${casting.cantripCount}/${casting.cantripsKnown}`,
        Preparadas: `${casting.spellCount}/${casting.preparedLimit}`,
      }
    : {};

  const cells = casting.linked
    ? [
        ...castCells.filter(
          (f) => f.label !== 'Truques conhecidos' || casting.cantripsKnown > 0
        ),
        { label: 'Preparadas', path: '', as: 'text' as const },
      ]
    : castCells;

  const metaList = (spell: IPlayerSpell) => (
    <dl className={handles.sheetSpellMeta}>
      {SPELL_FIELDS.filter((f) => spell[f.name]).map((f) => (
        <div key={f.name}>
          <dt className={handles.sheetSpellMetaKey}>{f.label}</dt>
          <dd className={handles.sheetSpellMetaValue}>{spell[f.name]}</dd>
        </div>
      ))}
    </dl>
  );

  return (
    <>
      <div className={handles.sheetCastbar}>
        {cells.map((field) => {
          const fixed = castOverride[field.label];
          const computed = field.derived ? derivedDC : undefined;
          const raw = computed ?? value(field.path);
          const display =
            fixed ??
            (raw === undefined
              ? DASH
              : field.modifier
                ? formatModifier(Number(raw))
                : String(raw));
          return (
            <div key={field.label} className={handles.sheetCastCell}>
              <span className={handles.sheetCaption}>{field.label}</span>
              <b
                className={`${handles.sheetCastValue}${
                  field.label === 'Atributo'
                    ? ` ${applyModifiers(handles.sheetCastValue, 'text')}`
                    : ''
                }`}
                title={computed !== undefined ? dcFormula : undefined}
              >
                {/* Um campo derivado não vira input: editá-lo à mão só
                    produziria um número que contradiz o atributo ao lado. */}
                {fixed !== undefined || computed !== undefined ? (
                  display
                ) : (
                  <EditableText
                    path={field.path}
                    label={field.label}
                    as={field.as}
                    onWrite={field.writer}
                    options={field.options}
                    placeholder={field.options ? 'Nenhum' : undefined}
                  >
                    {display}
                  </EditableText>
                )}
              </b>
              {editable && computed !== undefined && (
                <span className={handles.sheetCastNote}>{dcFormula}</span>
              )}
            </div>
          );
        })}
      </div>

      {levels.map((circle) => {
        const total = circle.slotsTotal ?? 0;
        const free = Math.max(0, total - (circle.slotsUsed ?? 0));
        const label = CIRCLE_LABELS[circle.level] ?? `${circle.level}º Círculo`;
        const spells = circle.spells ?? [];
        // No modo ligado a lista é a das preparadas, montada das referências:
        // os círculos resolvidos ainda não conhecem a escolha feita agora.
        const linkedSpells = casting.linked
          ? casting.inCircle(circle.level)
          : null;
        const count = linkedSpells ? linkedSpells.length : spells.length;
        const at = stored.findIndex((l) => l.level === circle.level);
        // O caminho só existe depois que o círculo existe; antes disso os
        // espaços são escritos por writeLevel, que o cria.
        const slotPath = (key: 'slotsUsed' | 'slotsTotal') =>
          at >= 0 ? `${LEVELS_PATH}.${at}.${key}` : '';

        return (
          <section
            key={circle.level}
            className={handles.sheetCircle}
            aria-label={label}
          >
            <div className={handles.sheetCircleHead}>
              <span className={handles.sheetCircleTitle}>{label}</span>
              {circle.level === 0 ? (
                <span className={handles.sheetSlotsNote}>
                  {casting.linked
                    ? `${casting.cantripCount}/${casting.cantripsKnown} conhecidos`
                    : 'à vontade'}
                </span>
              ) : (
                <span
                  className={handles.sheetSlots}
                  role={editable ? undefined : 'img'}
                  aria-label={
                    editable ? undefined : `${free} de ${total} espaços livres`
                  }
                >
                  <span className={handles.sheetSlotGrid}>
                    {Array.from({ length: total }, (_, i) => (
                      <i
                        key={i}
                        className={`${handles.sheetSlot}${
                          i < free ? ` ${handles.sheetSlot}--free` : ''
                        }`}
                      />
                    ))}
                  </span>
                  <span className={handles.sheetSlotsNote}>
                    {editable && casting.linked ? (
                      <>
                        <EditableText
                          path={slotPath('slotsUsed')}
                          label={`${label}: espaços usados`}
                          as="number"
                          placeholder="0"
                          onWrite={(v) =>
                            writeLevel(circle.level, {
                              slotsUsed: Number(v) || 0,
                            })
                          }
                        >
                          {circle.slotsUsed ?? 0}
                        </EditableText>
                        {` usados de ${total}`}
                      </>
                    ) : editable ? (
                      <>
                        <EditableText
                          path={slotPath('slotsUsed')}
                          label={`${label}: espaços usados`}
                          as="number"
                          placeholder="0"
                          onWrite={(v) =>
                            writeLevel(circle.level, {
                              slotsUsed: Number(v) || 0,
                            })
                          }
                        >
                          {circle.slotsUsed ?? 0}
                        </EditableText>
                        {' usados de '}
                        <EditableText
                          path={slotPath('slotsTotal')}
                          label={`${label}: espaços totais`}
                          as="number"
                          placeholder="0"
                          onWrite={(v) =>
                            writeLevel(circle.level, {
                              slotsTotal: Number(v) || 0,
                            })
                          }
                        >
                          {total}
                        </EditableText>
                      </>
                    ) : (
                      `${free}/${total} livres`
                    )}
                  </span>
                </span>
              )}
            </div>
            {linkedSpells ? (
              count > 0 ? (
                <ul className={handles.sheetSpells}>
                  {linkedSpells.map(({ spellId, spell }) => (
                    <li key={spellId} className={handles.sheetSpell}>
                      {/* O nome só vira botão quando há ficha para abrir; uma
                          magia escolhida agora ainda não tem a ficha do
                          grimório, que chega na próxima leitura. */}
                      {hasSpellDetail(spell) ? (
                        <>
                          <button
                            type="button"
                            className={handles.sheetSpellName}
                            onClick={() => setReading(spell)}
                          >
                            {spell.name}
                          </button>
                          {/* O nome inteiro continua clicável; o olho é o que
                              diz que ele é. Sem ele, a única pista de que há
                              descrição para ler era passar o ponteiro. */}
                          <button
                            type="button"
                            className={handles.sheetSpellRead}
                            onClick={() => setReading(spell)}
                            aria-label={`Ler ${spell.name}`}
                            tabIndex={-1}
                          >
                            <EyeIcon />
                          </button>
                        </>
                      ) : (
                        <span>{spell.name}</span>
                      )}
                      {editable && (
                        <button
                          type="button"
                          className={handles.sheetSpellEdit}
                          onClick={() => casting.unprepare(spellId)}
                          aria-label={`Desmarcar ${spell.name}`}
                        >
                          <CloseIcon />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                !editable && (
                  <p className={handles.sheetEmpty}>
                    {circle.level === 0
                      ? 'Nenhum truque conhecido.'
                      : 'Nenhuma magia preparada.'}
                  </p>
                )
              )
            ) : spells.length > 0 ? (
              <ul className={handles.sheetSpells}>
                {spells.map((spell, i) => (
                  <li
                    key={`${spell.name}:${i}`}
                    className={`${handles.sheetSpell}${
                      spell.prepared ? '' : ` ${handles.sheetSpell}--off`
                    }`}
                  >
                    {/* O nome só vira botão quando há ficha para abrir; sem
                        detalhe, continua o mesmo <span> de sempre. */}
                    {hasSpellDetail(spell) ? (
                      <>
                        <button
                          type="button"
                          className={handles.sheetSpellName}
                          onClick={() => setReading(spell)}
                        >
                          {spell.name}
                        </button>
                        <button
                          type="button"
                          className={handles.sheetSpellRead}
                          onClick={() => setReading(spell)}
                          aria-label={`Ler ${spell.name}`}
                          tabIndex={-1}
                        >
                          <EyeIcon />
                        </button>
                      </>
                    ) : (
                      <span>{spell.name}</span>
                    )}
                    {circle.level !== 0 &&
                      (editable ? (
                        <button
                          type="button"
                          className={`${handles.sheetSpellBadge} ${applyModifiers(
                            handles.sheetSpellBadge,
                            spell.prepared ? 'prepared' : 'known'
                          )}`}
                          onClick={() =>
                            writeSpell(circle.level, i, {
                              ...spell,
                              prepared: !spell.prepared,
                            })
                          }
                          aria-pressed={spell.prepared}
                        >
                          {spell.prepared ? 'Preparada' : 'Conhecida'}
                        </button>
                      ) : (
                        <span
                          className={`${handles.sheetSpellBadge} ${applyModifiers(
                            handles.sheetSpellBadge,
                            spell.prepared ? 'prepared' : 'known'
                          )}`}
                        >
                          {spell.prepared ? 'Preparada' : 'Conhecida'}
                        </span>
                      ))}
                    {editable && (
                      <button
                        type="button"
                        className={handles.sheetSpellEdit}
                        onClick={() =>
                          setEditingSpell({ level: circle.level, at: i, spell })
                        }
                        aria-label={`Editar ${spell.name}`}
                      >
                        <PencilIcon />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              !editable && (
                <p className={handles.sheetEmpty}>Nenhuma magia registrada.</p>
              )
            )}
            {editable &&
              (casting.linked ? (
                // Ligada à classe, a magia se escolhe; não se digita. O botão
                // continua clicável sem espaço livre: o seletor é também onde
                // se vê o que a classe conhece.
                <button
                  type="button"
                  className={handles.sheetSpellAdd}
                  onClick={() => setPicking(circle.level)}
                >
                  {circle.level === 0
                    ? '+ Escolher truque'
                    : '+ Preparar magia'}
                  {` (${casting.countOf(circle.level)}/${casting.limitOf(circle.level)})`}
                </button>
              ) : (
                <button
                  type="button"
                  className={handles.sheetSpellAdd}
                  onClick={() =>
                    setEditingSpell({
                      level: circle.level,
                      at: -1,
                      // Truque não se prepara: já nasce ativo.
                      spell: { name: '', prepared: circle.level === 0 },
                    })
                  }
                >
                  + Adicionar magia
                </button>
              ))}
          </section>
        );
      })}

      {levels.length === 0 && (
        <p className={handles.sheetEmpty}>
          Nenhum círculo de magia registrado.
        </p>
      )}

      {casting.linked && (
        <SpellPicker
          isOpen={picking !== null}
          onClose={() => setPicking(null)}
          classId={casting.classId}
          circle={picking ?? 0}
          label={
            picking !== null
              ? (CIRCLE_LABELS[picking] ?? `${picking}º Círculo`)
              : ''
          }
          taken={casting.takenIds}
          remaining={picking !== null ? casting.remainingOf(picking) : 0}
          onPick={(spell) => {
            casting.prepare(spell);
            setPicking(null);
          }}
        />
      )}

      <Modal
        isOpen={reading !== null}
        onClose={() => setReading(null)}
        title={reading?.name ?? ''}
      >
        {reading && (
          <>
            {metaList(reading)}
            {reading.description && (
              <p className={handles.sheetSpellText}>{reading.description}</p>
            )}
          </>
        )}
      </Modal>

      <PromptModal
        isOpen={editingSpell !== null}
        onClose={() => setEditingSpell(null)}
        title={
          editingSpell && editingSpell.at >= 0 ? 'Editar magia' : 'Nova magia'
        }
        confirmLabel={
          editingSpell && editingSpell.at >= 0 ? 'Salvar' : 'Adicionar'
        }
        onDelete={
          editingSpell && editingSpell.at >= 0
            ? () => writeSpell(editingSpell.level, editingSpell.at, null)
            : undefined
        }
        fields={spellPromptFields(editingSpell?.spell)}
        onSubmit={(values) => {
          if (!editingSpell) return;
          writeSpell(
            editingSpell.level,
            editingSpell.at,
            spellFromPrompt(values, editingSpell.spell)
          );
        }}
      />
    </>
  );
};

export default SpellsPanel;
