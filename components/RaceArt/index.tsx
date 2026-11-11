'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { CSSProperties } from 'react';
import type { IRaceImage } from '@/db/races/race.d';
import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import RaceArtHandles from './handles';
import '@/styles/components/raceArt.scss';

interface IProps {
  /** Sem imagem (ou com a URL quebrada), vira a trama de losangos com a inicial. */
  image?: IRaceImage;
  /** Nome que dá a inicial do fallback. */
  label: string;
  /** Texto alternativo; vazio quando a arte é decoração. */
  alt?: string;
  /** Arte emprestada da raça: apagada e com um tom próprio. */
  borrowed?: boolean;
  /** Giro de matiz da arte emprestada, em graus. */
  hue?: number;
  /** Legenda pequena sob a inicial ("Sem arte"). */
  note?: string;
}

/**
 * A arte de uma raça: a imagem real preenchendo o pai, com o ponto de foco no
 * recorte. O pai precisa ser `position: relative` (ou posicionado).
 */
const RaceArt = ({
  image,
  label,
  alt = '',
  borrowed,
  hue = 0,
  note,
}: IProps) => {
  const handles = useCssHandles(RaceArtHandles);
  // Guarda a URL que falhou, e não um booleano: trocar a imagem recomeça sem efeito.
  const [failed, setFailed] = useState<string | null>(null);

  if (!image?.url || failed === image.url) {
    return (
      <span
        className={handles.raceMono}
        role={alt ? 'img' : undefined}
        aria-label={alt || undefined}
      >
        <span className={handles.raceMonoDia}>
          <b className={handles.raceMonoLetter}>
            {label.trim().charAt(0).toUpperCase() || '?'}
          </b>
        </span>
        {note && <small className={handles.raceMonoNote}>{note}</small>}
      </span>
    );
  }

  return (
    <span
      className={`${handles.raceArt}${
        borrowed ? ` ${applyModifiers(handles.raceArt, 'borrowed')}` : ''
      }`}
      style={{ '--race-hue': `${hue}deg` } as CSSProperties}
    >
      <Image
        className={handles.raceArtImg}
        src={image.url}
        alt={alt}
        fill
        sizes="(max-width: 749px) 100vw, 50vw"
        // As URLs vêm de vários hosts (servimg, 2img, storage do Google) e são
        // cadastradas à mão: o otimizador as exigiria liberadas uma a uma.
        unoptimized
        style={{ objectPosition: image.focus || 'center' }}
        onError={() => setFailed(image.url)}
      />
    </span>
  );
};

export default RaceArt;
