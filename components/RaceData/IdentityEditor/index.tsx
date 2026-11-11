'use client';

import { useState } from 'react';
import type { IRaceImage } from '@/db/races/race.d';
import { useCssHandles } from '@/hooks/useCssHandles';
import RaceField from '../../RaceField';
import RaceFieldHandles from '../../RaceField/handles';
import RaceModal from '../../RaceModal';
import ImageEditor from '../ImageEditor';
import type { IRaceView } from '../types';

interface IProps {
  race: IRaceView;
  error: string | null;
  onSave: (
    patch: Pick<IRaceView, 'name' | 'unique' | 'images' | 'sourceUrl'>
  ) => Promise<boolean>;
  onClose: () => void;
}

/** Nome, selo "Raça única", tópico de origem e as imagens com o ponto de foco. */
const IdentityEditor = ({ race, error, onSave, onClose }: IProps) => {
  const fld = useCssHandles(RaceFieldHandles);
  const [name, setName] = useState(race.name);
  const [sourceUrl, setSourceUrl] = useState(race.sourceUrl ?? '');
  const [unique, setUnique] = useState(race.unique);
  const [images, setImages] = useState<IRaceImage[]>(race.images);
  const [missing, setMissing] = useState(false);

  const save = () => {
    if (!name.trim()) {
      setMissing(true);
      return Promise.resolve(false);
    }
    return onSave({
      name: name.trim(),
      unique,
      sourceUrl: sourceUrl.trim(),
      images: images
        .filter((image) => image.url)
        .map((image) =>
          image.focus && image.focus !== '50% 50%'
            ? { url: image.url, focus: image.focus }
            : { url: image.url }
        ),
    });
  };

  return (
    <RaceModal
      title="Nome, selo e arte"
      wide
      onClose={onClose}
      error={error ?? (missing ? 'Dê um nome à raça.' : null)}
      onSave={save}
    >
      <RaceField
        label="Nome"
        value={name}
        onChange={setName}
        hint={`Endereço: /races/${race.slug} (não muda ao renomear)`}
        autoFocus
      />
      <RaceField
        label="Tópico de origem"
        type="url"
        value={sourceUrl}
        onChange={setSourceUrl}
        placeholder="https://isekaifantasy.forumbrasil.net/t…"
        hint="Usado pelo “Reimportar do fórum”."
      />
      <label className={fld.raceChk}>
        <input
          type="checkbox"
          checked={unique}
          onChange={(e) => setUnique(e.target.checked)}
        />
        <span>
          <b>Raça única</b>
          <small>
            Só um personagem pode ter esta raça. Aparece como selo no card e no
            topo.
          </small>
        </span>
      </label>
      <fieldset className={fld.raceFieldset}>
        <legend>Imagens · a primeira é a capa</legend>
        <ImageEditor items={images} onChange={setImages} name={name} />
      </fieldset>
    </RaceModal>
  );
};

export default IdentityEditor;
