'use client';

import { Fragment, type CSSProperties, type MouseEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import type { IClassOption } from '../ClassGrid/useClassGrid';
import {
  AstrolabeIcon,
  ClassRoleIcon,
  PencilIcon,
  SpellbookIcon,
  SwordIcon,
  UserIcon,
} from '../Icons';
import ClassRoles from '../ClassRoles';
import { useClassCard } from './useClassCard';
import ClassCardHandles from './handles';
import '@/styles/components/classCard.scss';

interface IProps {
  klass: IClassOption;
  index: number;
  total: number;
  /** O card mais próximo do centro do trilho. */
  focused: boolean;
  /** Repetição de uma classe já à vista (poucas classes): escondida e inerte. */
  clone?: boolean;
  /** Posição relativa ao card central, em passos: -1 é o vizinho da esquerda. */
  offset: number;
  /** Longe do centro (buffer fora da tela): inerte, fora da ordem do Tab. */
  dormant?: boolean;
  basePath: string;
  /** Só o app mostra o lápis; o embed é somente leitura. */
  canEdit: boolean;
  onEdit: (klass: IClassOption) => void;
  /** Clique num vizinho: só o traz ao centro, sem navegar. */
  onCenter: () => void;
  /** Clique no card em foco: abre a classe sem sair do seletor. */
  onOpen: (klass: IClassOption) => void;
}

type Row = [label: string, value: string | undefined];

/**
 * Um card do seletor de classes.
 *
 * O link do nome cobre o card inteiro (`::after` com `inset: 0`); o lápis e o
 * "Ver tudo" são irmãos dele, com z-index maior, e não filhos — um botão
 * dentro de um `<a>` seria HTML inválido.
 */
const ClassCard = ({
  klass,
  index,
  total,
  focused,
  clone = false,
  offset,
  dormant = false,
  basePath,
  canEdit,
  onEdit,
  onCenter,
  onOpen,
}: IProps) => {
  const handles = useCssHandles(ClassCardHandles);
  const { bodyRef, open, overflowing, toggle } = useClassCard(focused);

  const [primary] = klass.roles ?? [];
  const kind = klass.isSpellcaster ? 'Classe mágica' : 'Classe marcial';
  const KindIcon = klass.isSpellcaster ? SpellbookIcon : SwordIcon;
  const proficiencies = klass.proficiencies;
  const players = klass.playerCount ?? 0;
  const playersLabel =
    players === 1
      ? '1 jogador com esta classe'
      : `${players} jogadores com esta classe`;

  const hitPoints: Row[] = [
    ['Dado de vida', klass.hitDie],
    ['1º nível', klass.hpAtFirstLevel],
    ['Níveis seguintes', klass.hpPerLevel],
  ];
  const proficiencyRows: Row[] = [
    ['Armaduras', proficiencies?.armor],
    ['Armas', proficiencies?.weapons],
    ['Ferramentas', proficiencies?.tools],
    ['Testes de resistência', proficiencies?.savingThrows],
    ['Perícias', proficiencies?.skills],
  ];

  const onLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
    // Ctrl/Cmd/Shift-clique e botão do meio são do navegador (nova aba).
    if (
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.button !== 0
    ) {
      return;
    }
    event.preventDefault();
    if (focused) onOpen(klass);
    else onCenter();
  };

  // O corpo fica acima do véu do link, então o clique que cai nele chega aqui.
  // Botões e o link já tratam o próprio clique; um arrasto para selecionar
  // texto não conta como clique.
  const onCardClick = (event: MouseEvent<HTMLElement>) => {
    if (event.defaultPrevented) return;
    if ((event.target as HTMLElement).closest('a, button')) return;
    if (window.getSelection()?.toString()) return;
    if (focused) onOpen(klass);
    else onCenter();
  };

  const renderGroup = (title: string, rows: Row[]) => {
    const filled = rows.filter(([, value]) => value);
    if (filled.length === 0) return null;
    return (
      <section className={handles.pickGroup}>
        <h4 className={handles.pickGroupTitle}>{title}</h4>
        <dl className={handles.pickRows}>
          {filled.map(([label, value]) => (
            <Fragment key={label}>
              <dt>{label}</dt>
              <dd title={value}>{value}</dd>
            </Fragment>
          ))}
        </dl>
      </section>
    );
  };

  const modifiers = [
    focused ? applyModifiers(handles.pickCard, 'focused') : '',
    open ? applyModifiers(handles.pickCard, 'open') : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <article
      className={`${handles.pickCard}${modifiers ? ` ${modifiers}` : ''}`}
      role="group"
      aria-roledescription="classe"
      aria-label={`${index + 1} de ${total}: ${klass.name}`}
      aria-hidden={clone || undefined}
      inert={clone || dormant || undefined}
      style={{ '--pick-offset': offset } as CSSProperties}
      onClick={onCardClick}
    >
      <div
        className={`${handles.pickArt}${
          klass.image ? '' : ` ${applyModifiers(handles.pickArt, 'empty')}`
        }`}
      >
        {klass.image ? (
          <Image
            className={handles.pickArtImage}
            src={klass.image}
            alt=""
            fill
            sizes="21rem"
            // A URL é cadastrada à mão e pode ser de qualquer host: o
            // otimizador exigiria cada domínio liberado no next.config.
            // Os cards de buffer já têm a arte quando deslizam para dentro.
            loading="eager"
            unoptimized
          />
        ) : (
          <div className={handles.pickSigil}>
            <AstrolabeIcon className={handles.pickSigilRing} />
            <span className={handles.pickSigilRole}>
              {primary ? <ClassRoleIcon role={primary} /> : <KindIcon />}
            </span>
          </div>
        )}
      </div>

      <div className={handles.pickTop}>
        <span
          className={handles.pickKind}
          role="img"
          aria-label={kind}
          title={kind}
        >
          <KindIcon />
        </span>
        <span
          className={`${handles.pickPlayers}${
            players === 0
              ? ` ${applyModifiers(handles.pickPlayers, 'empty')}`
              : ''
          }`}
          role="img"
          aria-label={playersLabel}
          title={playersLabel}
        >
          <UserIcon />
          <span className={handles.pickPlayersCount}>{players}</span>
        </span>
        {canEdit && (
          <button
            type="button"
            className={handles.pickEdit}
            onClick={() => onEdit(klass)}
            aria-label={`Editar ${klass.name}`}
            title="Editar classe"
          >
            <PencilIcon />
          </button>
        )}
      </div>

      <div className={handles.pickSpacer} />

      <div className={handles.pickHead}>
        {klass.isUnique && (
          <span
            className={handles.pickUnique}
            title={
              klass.takenBy
                ? `Classe única, com ${klass.takenBy.name}`
                : 'Classe única, sem dono no momento'
            }
          >
            {klass.takenBy ? `única · ${klass.takenBy.name}` : 'única'}
          </span>
        )}
        <h3 className={handles.pickName}>
          <Link
            href={`${basePath}/${klass.slug}`}
            className={handles.pickNameLink}
            prefetch={false}
            onClick={onLinkClick}
          >
            {klass.name}
          </Link>
        </h3>
        <ClassRoles roles={klass.roles} />
      </div>

      <div className={handles.pickClasp} aria-hidden="true">
        ◆
      </div>

      <div className={handles.pickBody} ref={bodyRef}>
        {klass.shortDescription && (
          <p className={handles.pickDesc} title={klass.shortDescription}>
            {klass.shortDescription}
          </p>
        )}
        <div className={handles.pickStats}>
          {renderGroup('Pontos de vida', hitPoints)}
          {renderGroup('Proficiências', proficiencyRows)}
        </div>
        {/* Presente em todo card que trunca, e só escondido fora de foco: se
            entrasse no DOM ao ganhar o foco, empurraria o card inteiro para
            cima no meio da animação. */}
        {(overflowing || open) && (
          <button
            type="button"
            className={handles.pickMore}
            tabIndex={focused ? undefined : -1}
            aria-hidden={focused ? undefined : true}
            aria-expanded={open}
            onClick={toggle}
          >
            {open ? 'Ver menos' : 'Ver tudo'}
          </button>
        )}
      </div>
    </article>
  );
};

export default ClassCard;
