'use client';

import { abilityChips } from '@/lib/raceAbilityChips';
import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import RaceArt from '@/components/RaceArt';
import RaceChips from '@/components/RaceChips';
import { useEditing } from '../EditingContext';
import { useRacePicker } from '../RacePickerContext';
import { useRaceChoice } from '../useRaceChoice';
import Block from '../Block';
import LineagePlateHandles from './handles';

interface IProps {
  /** Vai para a tela de Habilidades, onde as raciais estão listadas. */
  onOpenAbilities: () => void;
}

/** "Deslocamento 9 m · voo 12 m" sai do texto do tópico, que é prosa. */
const shortSpeed = (text?: string) => {
  if (!text) return '—';
  const found = [
    ...text.matchAll(/(\d+(?:[.,]\d+)?)\s*metros?(?:\s+em\s+(voo|terra))?/gi),
  ];
  if (found.length === 0) return '—';
  return found
    .map((m) => `${m[2]?.toLowerCase() === 'voo' ? 'voo ' : ''}${m[1]} m`)
    .join(' · ');
};

const shortSize = (text?: string) => {
  const folded = (text ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
  const sizes: [string, string][] = [
    ['pequen', 'Pequeno'],
    ['medi', 'Médio'],
    ['grande', 'Grande'],
  ];
  const found = sizes.filter(([key]) => folded.includes(key)).map(([, l]) => l);
  return found.length > 0 ? found.join(' a ') : '—';
};

const shortLanguages = (text?: string) => {
  const match = text?.match(/escrever\s+(?:em\s+)?(.+?)[.]/i);
  return match
    ? match[1].replace(/\s+e\s+/g, ', ').replace(/^./, (c) => c.toUpperCase())
    : null;
};

/**
 * A placa de linhagem do Status: a raça da ficha, em arte, números e links.
 *
 * Aparece mesmo sem vínculo com o códice — a ficha de texto livre ganha o aviso
 * de que as habilidades raciais ficaram de fora — porque some-la esconderia
 * justamente a razão de o vínculo existir.
 */
const LineagePlate = ({ onOpenAbilities }: IProps) => {
  const handles = useCssHandles(LineagePlateHandles);
  const { editable } = useEditing();
  const picker = useRacePicker();
  const { lineage, freeText } = useRaceChoice();

  const modifier = (name: string, variant?: string) =>
    variant ? ` ${applyModifiers(name, variant)}` : '';

  if (!lineage) {
    if (!freeText && !editable) return null;
    return (
      <Block title="Raça">
        <div className={handles.sheetLineage}>
          <div
            className={`${handles.sheetLineageArt}${modifier(handles.sheetLineageArt, 'none')}`}
            aria-hidden="true"
          />
          <div className={handles.sheetLineageMain}>
            <div className={handles.sheetLineageTop}>
              <span className={handles.sheetLineageCaption}>Texto livre</span>
              <span
                className={`${handles.sheetLineagePill}${modifier(handles.sheetLineagePill, 'muted')}`}
              >
                sem vínculo
              </span>
            </div>
            <div className={handles.sheetLineageName}>
              {freeText || 'Sem raça'}
            </div>
            <p className={handles.sheetLineageNote}>
              Esta raça não está ligada ao códice, então as habilidades raciais
              ficam fora da ficha.
            </p>
            {editable && (
              <div className={handles.sheetLineageActions}>
                <button
                  type="button"
                  className={`${handles.sheetLineageButton}${modifier(handles.sheetLineageButton, 'primary')}`}
                  onClick={() => picker.open()}
                >
                  Vincular raça do códice
                </button>
              </div>
            )}
          </div>
        </div>
      </Block>
    );
  }

  const incomplete = lineage.issues.length > 0;
  const chips = lineage.abilityScoreIncrease.flatMap((text) =>
    abilityChips(text)
  );
  const language = shortLanguages(lineage.languages);
  const link = `/embed/races/${lineage.slug}`;
  const traits = `${lineage.traitCount} ${
    lineage.traitCount === 1 ? 'habilidade' : 'habilidades'
  } ›`;

  return (
    <Block title="Raça">
      <div className={handles.sheetLineage}>
        <div className={handles.sheetLineageArt} aria-hidden="true">
          {lineage.mixed && lineage.parents.length > 0 ? (
            lineage.parents.map((parent) => (
              <span
                key={parent.slug}
                className={`${handles.sheetLineageArtPane}${
                  parent.dominant
                    ? modifier(handles.sheetLineageArtPane, 'dominant')
                    : ''
                }`}
              >
                <RaceArt image={parent.image} label={parent.name} />
              </span>
            ))
          ) : (
            <span className={handles.sheetLineageArtPane}>
              <RaceArt image={lineage.image} label={lineage.name} />
            </span>
          )}
        </div>

        <div className={handles.sheetLineageMain}>
          <div className={handles.sheetLineageTop}>
            <span className={handles.sheetLineageCaption}>
              {lineage.mixed
                ? 'Raça'
                : lineage.subrace
                  ? 'Raça · sub-raça'
                  : 'Raça'}
            </span>
            {lineage.mixed && (
              <span className={handles.sheetLineagePill}>mista</span>
            )}
            {lineage.unique && (
              <span
                className={`${handles.sheetLineagePill}${modifier(handles.sheetLineagePill, 'unique')}`}
              >
                raça única
              </span>
            )}
            {incomplete && !editable && (
              <span
                className={`${handles.sheetLineagePill}${modifier(handles.sheetLineagePill, 'warn')}`}
              >
                incompleta
              </span>
            )}
          </div>

          <div className={handles.sheetLineageName}>
            {lineage.mixed ? 'Mestiço' : lineage.name}{' '}
            <small className={handles.sheetLineageSub}>
              {lineage.mixed
                ? lineage.parents.length > 0
                  ? `· ${lineage.parents.map((p) => p.name).join(' e ')}`
                  : '· origens a escolher'
                : lineage.subrace
                  ? `· ${lineage.subrace.name}`
                  : lineage.hasSubraces
                    ? '· raça base'
                    : null}
            </small>
          </div>

          {!lineage.mixed && chips.length > 0 && <RaceChips chips={chips} />}

          <dl className={handles.sheetLineageFacts}>
            {lineage.mixed ? (
              <>
                <Fact label="Sangue Forte">
                  {lineage.parents.find((p) => p.dominant) ? (
                    <a
                      href={`/embed/races/${lineage.parents.find((p) => p.dominant)?.slug}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {lineage.parents.find((p) => p.dominant)?.name}
                    </a>
                  ) : (
                    '—'
                  )}
                </Fact>
                <Fact label="Origens">
                  {lineage.parents.length > 0
                    ? lineage.parents.map((parent, i) => (
                        <span key={parent.slug}>
                          {i > 0 && ', '}
                          <a
                            href={`/embed/races/${parent.slug}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {parent.name}
                          </a>
                        </span>
                      ))
                    : '—'}
                </Fact>
                <Fact
                  label={`Herança Híbrida · ${lineage.hybridPicked ?? 0}/${lineage.hybridCount ?? 2}`}
                >
                  {lineage.hybridNames && lineage.hybridNames.length > 0
                    ? lineage.hybridNames.join(', ')
                    : '—'}
                </Fact>
              </>
            ) : (
              <>
                <Fact label="Deslocamento">{shortSpeed(lineage.speed)}</Fact>
                <Fact label="Tamanho">{shortSize(lineage.size)}</Fact>
                {language && <Fact label="Idiomas">{language}</Fact>}
              </>
            )}
          </dl>

          <div className={handles.sheetLineageLinks}>
            <a
              className={handles.sheetLineageLink}
              href={link}
              target="_blank"
              rel="noreferrer"
            >
              {lineage.mixed ? 'Página dos Mestiços ›' : 'Página da raça ›'}
            </a>
            <button
              type="button"
              className={handles.sheetLineageLink}
              onClick={onOpenAbilities}
            >
              {traits}
            </button>
          </div>

          {editable && (
            <div className={handles.sheetLineageActions}>
              <button
                type="button"
                className={`${handles.sheetLineageButton}${modifier(handles.sheetLineageButton, 'secondary')}`}
                onClick={() => picker.open()}
              >
                Trocar raça
              </button>
              {!lineage.mixed && lineage.hasSubraces && (
                <button
                  type="button"
                  className={`${handles.sheetLineageButton}${modifier(handles.sheetLineageButton, 'ghost')}`}
                  onClick={() => picker.open('subraca')}
                >
                  {lineage.subrace ? 'Trocar sub-raça' : 'Escolher sub-raça'}
                </button>
              )}
            </div>
          )}

          {editable && incomplete && (
            <div className={handles.sheetLineageWarn}>
              <span>
                <b>Escolha incompleta.</b> {lineage.issues[0]}
              </span>
              <button
                type="button"
                className={`${handles.sheetLineageButton}${modifier(handles.sheetLineageButton, 'secondary')}`}
                onClick={() => picker.open(lineage.issueStep)}
              >
                Concluir escolha
              </button>
            </div>
          )}
        </div>
      </div>
    </Block>
  );
};

const Fact = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  const handles = useCssHandles(LineagePlateHandles);
  return (
    <div className={handles.sheetLineageFact}>
      <dt className={handles.sheetLineageFactTerm}>{label}</dt>
      <dd className={handles.sheetLineageFactValue}>{children}</dd>
    </div>
  );
};

export default LineagePlate;
