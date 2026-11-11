'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { classSlug } from '@/db/l10n/classes';
import RaceField from '../../RaceField';
import RaceFieldHandles from '../../RaceField/handles';
import RaceModal from '../../RaceModal';
import { useCssHandles } from '@/hooks/useCssHandles';

interface IProps {
  /** Endereços já usados, para o novo não colidir. */
  takenSlugs: string[];
  onClose: () => void;
}

/** Acha um endereço livre: "gnomos", "gnomos-2", "gnomos-3"… */
const freeSlug = (base: string, taken: string[]) => {
  let slug = base;
  let n = 2;
  while (taken.includes(slug)) slug = `${base}-${n++}`;
  return slug;
};

/** Nova raça: nasce vazia e abre na página, pronta para a edição. */
const NewRaceModal = ({ takenSlugs, onClose }: IProps) => {
  const fld = useCssHandles(RaceFieldHandles);
  const router = useRouter();
  const [name, setName] = useState('');
  const [unique, setUnique] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    const trimmed = name.trim();
    const base = classSlug(trimmed);
    if (!base) {
      setError('Dê um nome à raça.');
      return false;
    }
    const slug = freeSlug(base, takenSlugs);
    let res: Response;
    try {
      res = await fetch('/api/races', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmed,
          slug,
          unique,
          images: [],
          traits: [],
          subraces: [],
        }),
      });
    } catch {
      setError('Sem conexão com o servidor. Tente de novo.');
      return false;
    }
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      // O slug é único no banco: uma colisão chega como 500 com o erro cru do
      // Mongo (E11000), que não diz nada a quem cadastra.
      const duplicate =
        res.status === 409 ||
        res.status === 500 ||
        /E11000|duplicate/i.test(String(body.error ?? ''));
      setError(
        duplicate
          ? 'Já existe uma raça com esse nome.'
          : (body.error ?? 'Não consegui criar a raça.')
      );
      return false;
    }
    router.push(`/races/${slug}`);
    return true;
  };

  return (
    <RaceModal
      title="Nova raça"
      onClose={onClose}
      onSave={save}
      saveLabel="Criar raça"
      error={error}
    >
      <RaceField
        label="Nome"
        value={name}
        onChange={setName}
        placeholder="Ex.: Gnomos"
        autoFocus
      />
      <label className={fld.raceChk}>
        <input
          type="checkbox"
          checked={unique}
          onChange={(e) => setUnique(e.target.checked)}
        />
        <span>
          <b>Raça única</b>
          <small>Só um personagem pode ter esta raça.</small>
        </span>
      </label>
      <p className={fld.raceFldHint}>
        A raça nasce vazia e abre no modo de edição. Para trazer o texto de um
        tópico, use “Importar do fórum”.
      </p>
    </RaceModal>
  );
};

export default NewRaceModal;
