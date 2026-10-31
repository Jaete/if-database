'use client';

import Image from 'next/image';
import type ICharacterClass from '@/db/classes/class.d';
import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import ClassRoles from '../../ClassRoles';
import {
  AstrolabeIcon,
  ClassRoleIcon,
  PencilIcon,
  PlusIcon,
  SpellbookIcon,
  SwordIcon,
} from '../../Icons';
import ClassWheel from '../ClassWheel';
import type { ISectionNode } from '../sections';
import HeroHandles from './handles';

interface IProps {
  characterClass: ICharacterClass;
  /** Com quem está a classe, quando ela é única. */
  takenBy?: { name: string };
  nodes: ISectionNode[];
  openId: string | null;
  onOpen: (id: string) => void;
  /** Presentes só para quem edita. */
  onEditImage?: () => void;
  onAddList?: () => void;
}

/**
 * O topo da página: a identidade da classe à esquerda e o astrolábio (a roda
 * de seções, com o retrato no centro) à direita. No mobile o retrato sobe para
 * borda a borda e a roda vira lista.
 */
/**
 * "1d10 por nível de Druida" → o dado em destaque e o resto como nota. Texto
 * que não começa por um dado fica inteiro no destaque.
 */
const splitHitDie = (text = '') => {
  const match = text.match(/^\s*(\d*d\d+)\s*(.*)$/i);
  return match
    ? { value: match[1], note: match[2].trim() }
    : { value: text, note: '' };
};

const Hero = ({
  characterClass: k,
  takenBy,
  nodes,
  openId,
  onOpen,
  onEditImage,
  onAddList,
}: IProps) => {
  const handles = useCssHandles(HeroHandles);
  const die = splitHitDie(k.hitDie);

  const [primary] = k.roles ?? [];
  const kind = k.isSpellcaster ? 'Classe mágica' : 'Classe marcial';
  const KindIcon = k.isSpellcaster ? SpellbookIcon : SwordIcon;

  const sigil = (
    <div className={handles.clsSigil} aria-hidden="true">
      <AstrolabeIcon className={handles.clsSigilRing} />
      <span className={handles.clsSigilRole}>
        {primary ? <ClassRoleIcon role={primary} /> : <KindIcon />}
      </span>
    </div>
  );

  const imageButton = onEditImage && (
    <button type="button" className={handles.clsImageBtn} onClick={onEditImage}>
      {k.image ? <PencilIcon /> : <PlusIcon />}
      {k.image ? 'Trocar imagem' : 'Imagem'}
    </button>
  );

  const image = k.image && (
    <Image
      className={handles.clsPortraitImage}
      src={k.image}
      alt={`Arte da classe ${k.name}`}
      fill
      sizes="(max-width: 749px) 100vw, 20rem"
      // A URL é cadastrada à mão e pode ser de qualquer host: o otimizador
      // exigiria cada domínio liberado no next.config.
      unoptimized
    />
  );

  const modifier = (name: string) =>
    k.image ? '' : ` ${applyModifiers(name, 'empty')}`;

  return (
    <header className={handles.clsHero}>
      {/* Retrato de topo: só no mobile. */}
      <div className={`${handles.clsArt}${modifier(handles.clsArt)}`}>
        {k.image ? image : sigil}
        {imageButton}
      </div>

      <div className={handles.clsIdent}>
        <div className={handles.clsKicker}>
          <span className={handles.clsKind}>
            <i className={handles.clsKindIcon}>
              <KindIcon />
            </i>
            {kind}
          </span>
          {k.isUnique && (
            <span
              className={handles.clsUnique}
              title={
                takenBy
                  ? `Classe única, com ${takenBy.name}`
                  : 'Classe única, sem dono no momento'
              }
            >
              {takenBy ? `única · ${takenBy.name}` : 'única'}
            </span>
          )}
        </div>
        <h1 className={handles.clsName}>{k.name}</h1>
        <ClassRoles roles={k.roles} />
        <div className={handles.clsClasp} aria-hidden="true">
          ◆
        </div>
        {k.shortDescription && (
          <p className={handles.clsLead}>{k.shortDescription}</p>
        )}
        {(k.hitDie || k.hpAtFirstLevel || k.hpPerLevel) && (
          <dl className={handles.clsVitals}>
            {k.hitDie && (
              <div
                className={`${handles.clsVital} ${applyModifiers(handles.clsVital, 'die')}`}
              >
                <dt>Dado de vida</dt>
                <dd>
                  <span className={handles.clsVitalDie}>{die.value}</span>
                  {die.note && (
                    <span className={handles.clsVitalNote}>{die.note}</span>
                  )}
                </dd>
              </div>
            )}
            {k.hpAtFirstLevel && (
              <div className={handles.clsVital}>
                <dt>PV no 1º nível</dt>
                <dd>{k.hpAtFirstLevel}</dd>
              </div>
            )}
            {k.hpPerLevel && (
              <div className={handles.clsVital}>
                <dt>PV por nível</dt>
                <dd>{k.hpPerLevel}</dd>
              </div>
            )}
          </dl>
        )}
      </div>

      <ClassWheel
        nodes={nodes}
        openId={openId}
        onOpen={onOpen}
        onAddList={onAddList}
      >
        <figure
          className={`${handles.clsPortrait}${modifier(handles.clsPortrait)}`}
        >
          {k.image ? image : sigil}
          {imageButton}
        </figure>
      </ClassWheel>
    </header>
  );
};

export default Hero;
