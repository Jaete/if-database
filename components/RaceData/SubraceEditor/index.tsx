'use client';

import { useState } from 'react';
import type { IRaceImage, ISubrace } from '@/db/races/race.d';
import { classSlug } from '@/db/l10n/classes';
import { useCssHandles } from '@/hooks/useCssHandles';
import RaceField from '../../RaceField';
import RaceFieldHandles from '../../RaceField/handles';
import RaceModal from '../../RaceModal';
import ImageEditor from '../ImageEditor';
import SubraceEditorHandles from './handles';

interface IProps {
  /** `null`: sub-raça nova. */
  sub: ISubrace | null;
  /** Os grupos que a raça já usa, para o campo sugerir. */
  groups: string[];
  /** Endereços das outras sub-raças, para o novo não colidir. */
  takenSlugs: string[];
  error: string | null;
  onSave: (sub: ISubrace) => Promise<boolean>;
  onDelete?: () => void;
  onClose: () => void;
}

/** Nome, grupo e arte de uma sub-raça; traços e crônica ficam no painel. */
const SubraceEditor = ({
  sub,
  groups,
  takenSlugs,
  error,
  onSave,
  onDelete,
  onClose,
}: IProps) => {
  const handles = useCssHandles(SubraceEditorHandles);
  const fld = useCssHandles(RaceFieldHandles);
  const [name, setName] = useState(sub?.name ?? '');
  const [group, setGroup] = useState(sub?.group ?? '');
  const [images, setImages] = useState<IRaceImage[]>(
    sub?.image ? [sub.image] : []
  );
  const [missing, setMissing] = useState(false);

  const save = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setMissing(true);
      return Promise.resolve(false);
    }
    let slug = sub?.slug ?? classSlug(trimmed);
    if (!sub) {
      const base = slug || 'sub-raca';
      slug = base;
      for (let n = 2; takenSlugs.includes(slug); n++) slug = `${base}-${n}`;
    }
    const image = images.find((i) => i.url);
    const next: ISubrace = {
      ...sub,
      name: trimmed,
      slug,
      traits: sub?.traits ?? [],
    };
    // O PUT substitui a sub-raça inteira: um campo apagado precisa sumir.
    if (group.trim()) next.group = group.trim();
    else delete next.group;
    if (image) {
      next.image =
        image.focus && image.focus !== '50% 50%'
          ? { url: image.url, focus: image.focus }
          : { url: image.url };
    } else {
      delete next.image;
    }
    return onSave(next);
  };

  return (
    <RaceModal
      title={sub ? 'Nome, grupo e arte' : 'Nova sub-raça'}
      wide
      onClose={onClose}
      error={error ?? (missing ? 'Dê um nome à sub-raça.' : null)}
      onSave={save}
      onDelete={onDelete}
      deleteLabel="Excluir sub-raça"
    >
      <div className={handles.raceSubEdGrid}>
        <RaceField
          label="Nome"
          value={name}
          onChange={setName}
          placeholder="Ex.: Yokai Lupinos"
          hint={
            sub ? `Endereço: ?sub=${sub.slug}` : 'O endereço é gerado do nome.'
          }
          autoFocus
        />
        <RaceField
          label="Grupo"
          value={group}
          onChange={setGroup}
          list="race-group-list"
          placeholder={groups.length ? 'Escolha ou digite' : 'Sem grupo'}
          hint="Só quando a raça divide as sub-raças em grupos (como os Yokais). Vazio = sem grupo."
        />
        <datalist id="race-group-list">
          {groups.map((g) => (
            <option key={g} value={g} />
          ))}
        </datalist>
      </div>
      <fieldset className={fld.raceFieldset}>
        <legend>Imagem</legend>
        <small className={fld.raceFldHint}>
          Sem imagem própria, o painel usa a capa da raça, apagada e num tom
          próprio.
        </small>
        <ImageEditor
          items={images}
          onChange={setImages}
          max={1}
          name={name || 'Sub-raça'}
        />
      </fieldset>
      {!sub && (
        <p className={fld.raceFldHint}>
          Traços, habilidades e crônica são editados no painel depois de criar.
          Tudo começa herdando da raça.
        </p>
      )}
    </RaceModal>
  );
};

export default SubraceEditor;
