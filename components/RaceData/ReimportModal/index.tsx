'use client';

import { useState } from 'react';
import type { IRaceImportResult } from '@/services/race.service';
import { plural } from '@/lib/plural';
import { useCssHandles } from '@/hooks/useCssHandles';
import { SyncIcon } from '../../Icons';
import RaceButton from '../../RaceButton';
import RaceField from '../../RaceField';
import RaceModal from '../../RaceModal';
import { LORE_FIELDS, TRAIT_FIELDS } from '../fields';
import type { IRaceView } from '../types';
import ReimportModalHandles from './handles';

interface IProps {
  race: IRaceView;
  /** Chamado depois de gravar, com os avisos do parser. */
  onDone: (warnings: string[]) => Promise<boolean>;
  onClose: () => void;
}

// Vazio, ausente e lista vazia são a mesma coisa para o documento, e a ordem
// das chaves não importa: o Mongoose devolve as chaves numa ordem e o parser
// em outra.
const canonical = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.length === 0 ? null : value.map(canonical);
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .map(([k, v]) => [k, canonical(v)] as const)
      .filter(([, v]) => v !== null)
      .sort(([a], [b]) => a.localeCompare(b));
    return entries.length === 0 ? null : Object.fromEntries(entries);
  }
  return value === undefined || value === '' ? null : value;
};

const same = (a: unknown, b: unknown) =>
  JSON.stringify(canonical(a)) === JSON.stringify(canonical(b));

/** Sem a imagem: a reimportação mantém as imagens gravadas. */
const withoutImage = <T extends { image?: unknown }>(sub: T) => {
  const { image: _image, ...rest } = sub;
  void _image;
  return rest;
};

/** O que a reimportação vai sobrescrever, campo a campo. */
export function diffRace(
  current: IRaceView,
  parsed: Omit<IRaceView, 'images'>
): [string, string][] {
  const out: [string, string][] = [];
  if (current.name !== parsed.name) {
    out.push(['Nome', `“${current.name}” volta a “${parsed.name}”`]);
  }
  if (current.unique !== parsed.unique) {
    out.push([
      'Raça única',
      parsed.unique ? 'volta a ligado' : 'volta a desligado',
    ]);
  }
  for (const { name, label } of [...TRAIT_FIELDS, ...LORE_FIELDS]) {
    if (!same(current[name], parsed[name])) {
      out.push([
        label,
        current[name] && !parsed[name]
          ? 'some (o tópico não tem)'
          : 'texto editado volta ao do tópico',
      ]);
    }
  }
  if (!same(current.traits, parsed.traits)) {
    out.push([
      'Habilidades',
      `${current.traits.length} → ${parsed.traits.length}, com o texto do tópico`,
    ]);
  }
  if (!same(current.baseOnlyTraits, parsed.baseOnlyTraits)) {
    out.push(['Só da raça base', 'volta ao tópico']);
  }
  if (!same(current.notes, parsed.notes))
    out.push(['Notas', 'voltam ao tópico']);
  if (!same(current.choiceRules, parsed.choiceRules)) {
    out.push(['Regras de escolha', 'voltam ao tópico']);
  }
  const incoming = new Map(parsed.subraces.map((s) => [s.slug, s]));
  for (const sub of current.subraces) {
    const match = incoming.get(sub.slug);
    if (!match) {
      out.push([`Sub-raça ${sub.name}`, 'criada à mão: será removida']);
    } else if (!same(withoutImage(sub), withoutImage(match))) {
      out.push([`Sub-raça ${sub.name}`, 'edições voltam ao tópico']);
    }
  }
  for (const sub of parsed.subraces) {
    if (!current.subraces.some((s) => s.slug === sub.slug)) {
      out.push([`Sub-raça ${sub.name}`, 'excluída à mão: volta']);
    }
  }
  return out;
}

/** Reimporta a raça do tópico, mostrando antes o que será sobrescrito. */
const ReimportModal = ({ race, onDone, onClose }: IProps) => {
  const handles = useCssHandles(ReimportModalHandles);
  const [url, setUrl] = useState(race.sourceUrl ?? '');
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
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? 'Não consegui ler o tópico.');
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
    const result = await call(false);
    if (!result) return false;
    return onDone(result.warnings);
  };

  const fresh = preview && preview.url === url.trim() ? preview.result : null;
  const parsed = fresh?.parsed;
  const diff = parsed ? diffRace(race, parsed) : [];
  const otherRace = fresh ? fresh.slug !== race.slug : false;

  return (
    <RaceModal
      title="Reimportar do fórum"
      wide
      onClose={onClose}
      onSave={save}
      saveLabel={
        fresh && diff.length === 0 && !otherRace
          ? 'Nada para reimportar'
          : 'Reimportar e sobrescrever'
      }
      saveKind="danger"
      saveDisabled={!fresh || otherRace || diff.length === 0}
      error={error}
    >
      <RaceField label="Tópico" type="url" value={url} onChange={setUrl} />
      <div>
        <RaceButton
          icon={<SyncIcon />}
          onClick={runPreview}
          disabled={!url.trim() || loading}
        >
          {loading ? 'Lendo o tópico…' : 'Pré-visualizar (sem gravar)'}
        </RaceButton>
      </div>

      {fresh && parsed && (
        <div className={handles.raceReDry} aria-live="polite">
          <span className={handles.raceReCap}>Prévia · nada foi gravado</span>
          <p className={handles.raceReSum}>
            O tópico tem {plural(fresh.traits, 'habilidade', 'habilidades')} e{' '}
            {plural(fresh.subraces, 'sub-raça', 'sub-raças')}.
          </p>
          {otherRace && (
            <div className={handles.raceReDanger}>
              <b>Este tópico é outra raça.</b>
              <p>
                O endereço lido é “{fresh.slug}”, e esta raça é “{race.slug}”.
                Importe-o pela listagem.
              </p>
            </div>
          )}
          {!otherRace &&
            (diff.length > 0 ? (
              <div className={handles.raceReDanger}>
                <b>
                  A reimportação sobrescreve{' '}
                  {plural(diff.length, 'edição manual', 'edições manuais')}:
                </b>
                <ul>
                  {diff.map(([field, what], i) => (
                    <li key={`${i}-${field}`}>
                      <span>{field}</span> {what}
                    </li>
                  ))}
                </ul>
                <p>Não dá para desfazer. As imagens e os focos são mantidos.</p>
              </div>
            ) : (
              <p className={handles.raceReOk}>
                Nada muda: o que está gravado bate com o tópico.
              </p>
            ))}
          {fresh.warnings.length > 0 && (
            <div className={handles.raceReWarn}>
              <span>Avisos do parser · só admin vê</span>
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

export default ReimportModal;
