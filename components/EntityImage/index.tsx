'use client';

import { useCssHandles } from '@/hooks/useCssHandles';
import EntityImageHandles from './handles';
import '@/styles/components/entityImage.scss';

interface IProps {
  src: string;
  alt: string;
}

const EntityImage = ({ src, alt }: IProps) => {
  const handles = useCssHandles(EntityImageHandles);

  return (
    <div className={handles.entityImageContainer}>
      <div className={handles.entityImageLoader} />
      <img
        src={src}
        alt={alt}
        onLoad={(e) => e.currentTarget.classList.add('loaded')}
        className={handles.entityImage}
      />
    </div>
  );
};

export default EntityImage;
