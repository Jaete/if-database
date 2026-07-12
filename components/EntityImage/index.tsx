'use client';

import { useState } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import { CopyIcon } from '@/components/Icons';
import EntityImageHandles from './handles';
import '@/styles/components/entityImage.scss';

interface IProps {
  src: string;
  alt: string;
  iconSrc?: string;
}

const EntityImage = ({ src, alt, iconSrc }: IProps) => {
  const handles = useCssHandles(EntityImageHandles);
  const [copied, setCopied] = useState<'image' | 'icon' | null>(null);

  const handleCopyLink = (target: 'image' | 'icon', link: string) => {
    navigator.clipboard.writeText(link).then(() => {
      setCopied(target);
      setTimeout(() => setCopied(null), 1500);
    });
  };

  return (
    <div className={handles.entityImageContainer}>
      <div className={handles.entityImageLoader} />
      <img
        src={src}
        alt={alt}
        onLoad={(e) => e.currentTarget.classList.add('loaded')}
        className={handles.entityImage}
      />
      <div className={handles.copyLinkActions}>
        {src && (
          <button
            type="button"
            className={handles.copyLinkButton}
            onClick={() => handleCopyLink('image', src)}
            title="Copiar link da imagem"
          >
            <CopyIcon />
            {copied === 'image' ? 'Copiado!' : 'Copiar link da imagem'}
          </button>
        )}
        {iconSrc && (
          <button
            type="button"
            className={handles.copyLinkButton}
            onClick={() => handleCopyLink('icon', iconSrc)}
            title="Copiar link da miniatura"
          >
            <CopyIcon />
            {copied === 'icon' ? 'Copiado!' : 'Copiar miniatura'}
          </button>
        )}
      </div>
    </div>
  );
};

export default EntityImage;
