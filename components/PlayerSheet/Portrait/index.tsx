'use client';

import { useState } from 'react';
import Image from 'next/image';
import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import { LevelUpIcon, PortraitPlaceholderIcon } from '../../Icons';
import { isHttpUrl } from '../sheetData';
import PortraitHandles from './handles';

interface IProps {
  image?: string;
  name: string;
  variant?: 'hud' | 'chronicle';
  badge?: string;
  /** Há nível para subir (só para o dono): anel girando, brilho e faíscas. */
  ready?: boolean;
}

const Portrait = ({ image, name, variant = 'hud', badge, ready }: IProps) => {
  const handles = useCssHandles(PortraitHandles);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = isHttpUrl(image) && failedSrc !== image;

  return (
    <div
      className={`${handles.sheetPortrait} ${applyModifiers(handles.sheetPortrait, variant)}${
        ready ? ` ${handles.sheetPortrait}--ready` : ''
      }`}
    >
      {ready && (
        <span className={handles.sheetPortraitSparks} aria-hidden="true">
          {[12, 30, 52, 70, 88].map((x, i) => (
            <i
              key={i}
              style={{ left: `${x}%`, animationDelay: `${i * 0.45}s` }}
            />
          ))}
        </span>
      )}
      {showImage ? (
        <Image
          className={handles.sheetPortraitImage}
          src={image}
          alt={`Retrato de ${name}`}
          fill
          sizes="(max-width: 749px) 140px, 160px"
          // The forum hosts its own images; skip the optimizer round-trip.
          unoptimized
          onError={() => setFailedSrc(image)}
        />
      ) : (
        <div
          className={handles.sheetPortraitPlaceholder}
          role="img"
          aria-label={`Retrato de ${name} (sem imagem)`}
        >
          <PortraitPlaceholderIcon />
        </div>
      )}
      {badge && (
        <span className={handles.sheetPortraitBadge}>
          {ready && <LevelUpIcon width={12} height={12} />}
          {badge}
        </span>
      )}
    </div>
  );
};

export default Portrait;
