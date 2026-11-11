'use client';

import type { ReactNode } from 'react';
import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import { abilityChips } from '@/lib/raceAbilityChips';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ExternalLinkIcon,
  PencilIcon,
} from '../../Icons';
import RaceArt from '../../RaceArt';
import RaceButton from '../../RaceButton';
import RaceChips from '../../RaceChips';
import RaceIconButton from '../../RaceIconButton';
import { paragraphs } from '../fields';
import type { IRaceActions, IRaceView } from '../types';
import { useHeroLead } from './useHeroLead';
import HeroHandles from './handles';

interface IProps {
  race: IRaceView;
  imageIndex: number;
  onPickImage: (index: number) => void;
  actions: IRaceActions;
}

/** O topo: arte integrada, identidade, números e a galeria de artes. */
const Hero = ({ race, imageIndex, onPickImage, actions }: IProps) => {
  const { canEdit } = actions;
  const handles = useCssHandles(HeroHandles);
  const images = race.images;
  const current = images[Math.min(imageIndex, Math.max(images.length - 1, 0))];
  const mixed = (race.choiceRules?.length ?? 0) > 0;
  const chips = abilityChips(race.abilityScoreIncrease);
  const abilityCount = race.traits.length + (race.baseOnlyTraits?.length ?? 0);
  // O resumo escrito à mão vence; sem ele, vale o 1º parágrafo da História.
  const lead = race.summary?.trim() || paragraphs(race.history ?? '')[0];
  const { leadRef, expanded, overflows, toggle, style } = useHeroLead(
    lead ?? ''
  );

  const goTo = (id: string) => {
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: still ? 'auto' : 'smooth' });
  };

  /** Para admin o contador vira atalho; o número continua calculado. */
  const vital = (content: ReactNode, hint: string, onClick: () => void) =>
    canEdit ? (
      <button
        type="button"
        className={handles.raceHeroVitalBtn}
        title={hint}
        aria-label={`${hint}. Abrir`}
        onClick={onClick}
      >
        {content}
      </button>
    ) : (
      content
    );

  return (
    <header
      className={`${handles.raceHero}${
        images.length ? '' : ` ${applyModifiers(handles.raceHero, 'noart')}`
      }`}
    >
      <div className={handles.raceHeroArt}>
        {/* A chave refaz o nó ao trocar de arte: o fade vem do CSS. */}
        <RaceArt
          key={current?.url ?? 'none'}
          image={current}
          label={race.name}
          alt={current ? `Arte de ${race.name}` : undefined}
        />
      </div>
      <div className={handles.raceHeroScrim} />
      {canEdit && (
        <div className={handles.raceHeroEdit}>
          <RaceButton
            small
            icon={<PencilIcon />}
            onClick={actions.editIdentity}
          >
            Nome, selo e arte
          </RaceButton>
        </div>
      )}
      <div className={handles.raceHeroIn}>
        <div>
          <div className={handles.raceHeroKicker}>
            <span>Raça de Terralém</span>
            {race.unique && (
              <b title="Só um personagem pode ter esta raça">Raça única</b>
            )}
            {race.sourceUrl && (
              <a
                href={race.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Tópico no fórum <ExternalLinkIcon />
              </a>
            )}
          </div>
          <h1 className={handles.raceHeroName}>{race.name}</h1>
          <span className={handles.raceHeroClasp} aria-hidden="true">
            ◆
          </span>
          <dl className={handles.raceHeroVitals}>
            <div>
              <dt>Incremento</dt>
              <dd>
                {vital(
                  chips.length > 0 ? (
                    <RaceChips chips={chips} />
                  ) : mixed ? (
                    <RaceChips
                      chips={[{ label: 'Das raças de origem', kind: 'free' }]}
                    />
                  ) : (
                    '—'
                  ),
                  'Calculado do texto de incremento de atributo, nos traços da raça',
                  actions.editTraits
                )}
              </dd>
            </div>
            <div>
              <dt>{mixed ? 'Regras de escolha' : 'Habilidades'}</dt>
              <dd>
                {vital(
                  // +1: a regra "Raças de origem" é fixa (vem da ficha) e não
                  // está em `choiceRules`, mas a página a mostra primeiro.
                  mixed ? 1 + (race.choiceRules?.length ?? 0) : abilityCount,
                  mixed
                    ? 'Calculado das regras de escolha da raça'
                    : 'Calculado das habilidades da raça, comuns e só da raça base',
                  () => goTo('habilidades')
                )}
              </dd>
            </div>
            <div>
              <dt>Sub-raças</dt>
              <dd>
                {vital(
                  race.subraces.length || '—',
                  race.subraces.length
                    ? 'Calculado da lista de sub-raças'
                    : 'Nenhuma sub-raça ainda. Abre o cadastro de uma',
                  () =>
                    race.subraces.length ? goTo('sub-racas') : actions.addSub()
                )}
              </dd>
            </div>
          </dl>
          {(lead || canEdit) && (
            <div className={handles.raceHeroLeadRow}>
              {lead ? (
                <div className={handles.raceHeroLeadBox}>
                  <p
                    id="race-hero-lead"
                    ref={leadRef}
                    style={style}
                    className={`${handles.raceHeroLead}${
                      overflows && !expanded
                        ? ` ${applyModifiers(handles.raceHeroLead, 'clamped')}`
                        : ''
                    }`}
                  >
                    {lead}
                  </p>
                  {overflows && (
                    <button
                      type="button"
                      className={handles.raceHeroMore}
                      aria-expanded={expanded}
                      aria-controls="race-hero-lead"
                      onClick={toggle}
                    >
                      {expanded ? 'Ver menos' : 'Ver mais'}
                      {expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    </button>
                  )}
                </div>
              ) : (
                <p className={handles.raceHeroLead}>Sem resumo ainda.</p>
              )}
              {canEdit && (
                <RaceIconButton
                  small
                  onArt
                  label="Editar o resumo do topo"
                  icon={<PencilIcon />}
                  onClick={actions.editSummary}
                />
              )}
            </div>
          )}
        </div>
        {images.length > 1 && !mixed && (
          <div className={handles.raceHeroGallery}>
            <span>
              Arte {Math.min(imageIndex, images.length - 1) + 1} de{' '}
              {images.length}
            </span>
            <div
              className={handles.raceHeroThumbs}
              role="group"
              aria-label="Galeria: trocar a arte do topo"
            >
              {images.map((image, k) => (
                <button
                  key={`${k}-${image.url}`}
                  type="button"
                  aria-current={image === current}
                  aria-label={`Ver arte ${k + 1} de ${images.length}`}
                  onClick={() => onPickImage(k)}
                >
                  <RaceArt image={image} label={race.name} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Hero;
