'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { IRaceImportResult } from '@/services/race.service';
import { useCssHandles } from '@/hooks/useCssHandles';
import { SyncIcon } from '../../Icons';
import RaceButton from '../../RaceButton';
import RaceField from '../../RaceField';
import RaceModal from '../../RaceModal';
import ImportModalHandles from './handles';

interface IProps {
  onClose: () => void;
}

const readError = async (res: Response, fallback: string) => {
  const body = await res.json().catch(() => ({}));
  return (body.error as string | undefined) ?? fallback;
};

/**
 * Importa uma raça de um tópico do fórum: a prévia roda o parser sem gravar
 * (dry-run) e só depois de vê-la o admin confirma a gravação.
 */
const ImportModal = ({ onClose }: IProps) => {
  const handles = useCssHandles(ImportModalHandles);
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [preview, setPreview] = useState<{
    url: string;
    result: IRaceImportResult;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const call = async (dryRun: boolean) => {
    let res: Response;
    try {
      res = await fetch('/api/races/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim(), dryRun }),
      });
    } catch {
      setError('Sem conexão com o servidor. Tente de novo.');
      return null;
    }
    if (!res.ok) {
      setError(await readError(res, 'Não consegui ler o tópico.'));
      return null;
    }
    return (await res.json()) as IRaceImportResult;
  };

  const runPreview = async () => {
    setError(null);
    setLoading(true);
    const result = await call(true);
    setLoading(false);
    setPreview(result ? { url: url.trim(), result } : null);
  };

  const save = async () => {
    setError(null);
    const result = await call(false);
    if (!result) return false;
    router.push(`/races/${result.slug}`);
    return true;
  };

  const fresh = preview && preview.url === url.trim() ? preview.result : null;
  const exists = fresh ? !fresh.created : false;

  return (
    <RaceModal
      title="Importar do fórum"
      wide
      onClose={onClose}
      onSave={save}
      saveLabel="Importar raça"
      saveDisabled={!fresh || exists}
      error={error}
    >
      <RaceField
        label="Link do tópico"
        type="url"
        value={url}
        onChange={setUrl}
        placeholder="https://isekaifantasy.forumbrasil.net/t310-gnomos"
        hint="Um tópico de /f27-racas. Nada é gravado antes de você confirmar."
        autoFocus
      />
      <div>
        <RaceButton
          icon={<SyncIcon />}
          onClick={runPreview}
          disabled={!url.trim() || loading}
        >
          {loading ? 'Lendo o tópico…' : 'Pré-visualizar (sem gravar)'}
        </RaceButton>
      </div>

      {fresh && (
        <div className={handles.raceImportDry} aria-live="polite">
          <span className={handles.raceImportNote}>
            Prévia · nada foi gravado
          </span>
          <dl className={handles.raceImportDl}>
            <div>
              <dt>Nome</dt>
              <dd>{fresh.name}</dd>
            </div>
            <div>
              <dt>Selo</dt>
              <dd>{fresh.parsed?.unique ? 'Raça única' : '—'}</dd>
            </div>
            <div>
              <dt>Sub-raças</dt>
              <dd>{fresh.subraces}</dd>
            </div>
            <div>
              <dt>Habilidades</dt>
              <dd>{fresh.traits}</dd>
            </div>
          </dl>
          {exists && (
            <div className={handles.raceImportWarn}>
              <span className={handles.raceImportNote}>Já importado</span>
              <p>
                Este tópico já é a raça <b>{fresh.name}</b>. Para trazer o texto
                novo, abra a raça e use “Reimportar do fórum”.
              </p>
            </div>
          )}
          {fresh.warnings.length > 0 && (
            <div className={handles.raceImportWarn}>
              <span className={handles.raceImportNote}>
                Avisos do parser · só admin vê
              </span>
              {fresh.warnings.map((w) => (
                <p key={w}>{w}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </RaceModal>
  );
};

export default ImportModal;
