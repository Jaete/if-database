'use client';

import { useState } from 'react';
import Image from 'next/image';
import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import { PortraitPlaceholderIcon } from '../../Icons';
import { isHttpUrl } from '../sheetData';
import PortraitHandles from './handles';

interface IProps {
  image?: string;
  name: string;
  variant?: 'hud' | 'chronicle';
  badge?: string;
}

const Portrait = ({ image, name, variant = 'hud', badge }: IProps) => {
  const handles = useCssHandles(PortraitHandles);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = isHttpUrl(image) && failedSrc !== image;

  return (
    <div
      className={`${handles.sheetPortrait} ${applyModifiers(handles.sheetPortrait, variant)}`}
    >
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
      {badge && <span className={handles.sheetPortraitBadge}>{badge}</span>}
    </div>
  );
};

export default Portrait;
