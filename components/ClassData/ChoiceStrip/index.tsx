'use client';

import type ICharacterClass from '@/db/classes/class.d';
import type { IArchetypeChoice, IClassChoice } from '@/lib/catalogChoice';
import { useCssHandles } from '@/hooks/useCssHandles';
import ChoiceTag from '../../ChoiceTag';
import ClassChoiceStripHandles from './handles';
import '@/styles/components/classChoiceStrip.scss';

interface IProps {
  characterClass: ICharacterClass;
  choice: IClassChoice | IArchetypeChoice;
  /** Abre a seção de arquétipos (a escolha de arquétipo vive nela). */
  onOpenArchetypes: () => void;
}

/** A faixa de escolha no topo da página da classe (modo escolha). */
const ChoiceStrip = ({
  characterClass: k,
  choice,
  onOpenArchetypes,
}: IProps) => {
  const handles = useCssHandles(ClassChoiceStripHandles);

  if (choice.kind === 'archetype') {
    const current = k.archetypes?.find((a) => a.slug === choice.currentSlug);
    return (
      <div className={handles.classPickStrip}>
        <div className={handles.classPickStripHead}>
          <h2 className={handles.classPickStripTitle}>Arquétipo de {k.name}</h2>
          {current && (
            <ChoiceTag kind="current">Atual · {current.name}</ChoiceTag>
          )}
        </div>
        <p className={handles.classPickStripNote}>
          Leia as habilidades de cada arquétipo e escolha um. A escolha vale
          para o nível {choice.level}.
        </p>
        <button
          type="button"
          className={handles.classPickStripBtn}
          onClick={onOpenArchetypes}
        >
          Ver os arquétipos
        </button>
      </div>
    );
  }

  const takenBy = choice.takenUnique[String(k._id)];
  const isCurrent = choice.currentId === String(k._id);
  const isChosen = choice.draftId === String(k._id);
  return (
    <div className={handles.classPickStrip}>
      <div className={handles.classPickStripHead}>
        <h2 className={handles.classPickStripTitle}>{k.name}</h2>
        {isCurrent && <ChoiceTag kind="current">Atual</ChoiceTag>}
        {isChosen && !isCurrent && (
          <ChoiceTag kind="chosen">Escolhida</ChoiceTag>
        )}
        {k.isUnique && (
          <ChoiceTag kind={takenBy ? 'blocked' : 'unique'}>
            {takenBy ? `Classe única · ${takenBy}` : 'Classe única'}
          </ChoiceTag>
        )}
      </div>
      {takenBy && (
        <p className={handles.classPickStripNote}>
          {k.name} é uma classe única e já pertence a {takenBy}.
        </p>
      )}
      <button
        type="button"
        className={handles.classPickStripBtn}
        disabled={!!takenBy || isCurrent || isChosen}
        onClick={() =>
          choice.onPick({ _id: String(k._id), name: k.name, slug: k.slug })
        }
      >
        {isCurrent
          ? 'Classe atual'
          : isChosen
            ? 'Classe escolhida'
            : `Escolher ${k.name}`}
      </button>
    </div>
  );
};

export default ChoiceStrip;
