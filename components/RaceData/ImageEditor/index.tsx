'use client';

import { useState } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import Image from 'next/image';
import type { IRaceImage } from '@/db/races/race.d';
import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import { ChevronDownIcon, ChevronUpIcon, TrashIcon } from '../../Icons';
import RaceArt from '../../RaceArt';
import RaceFieldHandles from '../../RaceField/handles';
import RaceGhostAdd from '../../RaceGhostAdd';
import RaceIconButton from '../../RaceIconButton';
import ImageEditorHandles from './handles';

interface IProps {
  items: IRaceImage[];
  onChange: (items: IRaceImage[]) => void;
  /** 1 é uma imagem só (sub-raça); acima disso, a primeira é a capa. */
  max?: number;
  /** Nome mostrado nas prévias. */
  name: string;
}

const CENTER = '50% 50%';

const PRESETS = [
  ['0% 0%', 'Topo à esquerda'],
  ['50% 0%', 'Topo'],
  ['100% 0%', 'Topo à direita'],
  ['0% 50%', 'Esquerda'],
  ['50% 50%', 'Centro'],
  ['100% 50%', 'Direita'],
  ['0% 100%', 'Base à esquerda'],
  ['50% 100%', 'Base'],
  ['100% 100%', 'Base à direita'],
] as const;

const clamp = (n: number) => Math.min(100, Math.max(0, n));
const parseFocus = (focus: string | undefined) => {
  const [x, y] = (focus || CENTER).split(' ').map(parseFloat);
  return [Number.isFinite(x) ? x : 50, Number.isFinite(y) ? y : 50] as const;
};

/**
 * Edita as imagens de uma raça: o link de cada uma e o PONTO DE FOCO — o
 * trecho da arte que o recorte preserva. A mesma arte vira card em retrato,
 * topo em paisagem e faixa estreita, e cada recorte corta um pedaço
 * diferente; as três prévias mostram o resultado ao vivo.
 */
const ImageEditor = ({ items, onChange, max = 8, name }: IProps) => {
  const handles = useCssHandles(ImageEditorHandles);
  const fld = useCssHandles(RaceFieldHandles);
  const [selected, setSelected] = useState(0);
  const sel = Math.min(selected, Math.max(items.length - 1, 0));
  const item = items[sel];
  const focus = item?.focus || CENTER;
  const [fx, fy] = parseFocus(focus);
  const multi = max > 1;

  const update = (index: number, patch: Partial<IRaceImage>) =>
    onChange(items.map((it, i) => (i === index ? { ...it, ...patch } : it)));

  const move = (from: number, step: -1 | 1) => {
    const to = from + step;
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    [next[from], next[to]] = [next[to], next[from]];
    onChange(next);
    setSelected(to);
  };

  const setFocus = (value: string) => update(sel, { focus: value });

  const pickFromImage = (event: MouseEvent<HTMLElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    setFocus(
      `${Math.round(clamp(((event.clientX - box.left) / box.width) * 100))}% ${Math.round(
        clamp(((event.clientY - box.top) / box.height) * 100)
      )}%`
    );
  };

  const onPickKey = (event: KeyboardEvent) => {
    const step = (
      {
        ArrowLeft: [-2, 0],
        ArrowRight: [2, 0],
        ArrowUp: [0, -2],
        ArrowDown: [0, 2],
      } as Record<string, [number, number]>
    )[event.key];
    if (!step) return;
    event.preventDefault();
    setFocus(`${clamp(fx + step[0])}% ${clamp(fy + step[1])}%`);
  };

  const preview = (kind: 'card' | 'hero' | 'mob', caption: string) => (
    <figure
      className={`${handles.raceImgPreview} ${applyModifiers(handles.raceImgPreview, kind)}`}
    >
      <RaceArt image={{ url: item?.url ?? '', focus }} label={name} />
      <b className={handles.raceImgPreviewName}>{name || 'Nome'}</b>
      <figcaption className={handles.raceImgPreviewCap}>{caption}</figcaption>
    </figure>
  );

  return (
    <div>
      <div className={handles.raceImgList}>
        {items.map((it, k) => (
          <div
            key={k}
            className={`${handles.raceImgRow}${
              k === sel ? ` ${applyModifiers(handles.raceImgRow, 'sel')}` : ''
            }`}
          >
            <button
              type="button"
              className={handles.raceImgThumb}
              aria-label={`Ajustar foco da imagem ${k + 1}`}
              aria-pressed={k === sel}
              onClick={() => setSelected(k)}
            >
              {it.url && <RaceArt image={it} label={name} />}
            </button>
            <label className={handles.raceImgUrl}>
              <span className={fld.raceFldLabel}>
                {multi ? (k === 0 ? 'Capa' : `Galeria ${k}`) : 'Imagem'}
                {k === 0 && multi && (
                  <span
                    className={`${fld.racePill} ${applyModifiers(fld.racePill, 'own')}`}
                  >
                    fundo da listagem e do topo
                  </span>
                )}
              </span>
              <input
                className={fld.raceInp}
                value={it.url}
                inputMode="url"
                placeholder="https://… (link da imagem)"
                onFocus={() => setSelected(k)}
                onChange={(e) => update(k, { url: e.target.value.trim() })}
              />
            </label>
            <span className={handles.raceImgActs}>
              {multi && (
                <>
                  <RaceIconButton
                    small
                    off={k === 0}
                    label="Subir imagem"
                    icon={<ChevronUpIcon />}
                    onClick={() => move(k, -1)}
                  />
                  <RaceIconButton
                    small
                    off={k === items.length - 1}
                    label="Descer imagem"
                    icon={<ChevronDownIcon />}
                    onClick={() => move(k, 1)}
                  />
                </>
              )}
              <RaceIconButton
                small
                danger
                label="Remover imagem"
                icon={<TrashIcon />}
                onClick={() => {
                  onChange(items.filter((_, i) => i !== k));
                  setSelected(0);
                }}
              />
            </span>
          </div>
        ))}
      </div>
      {items.length < max && (
        <RaceGhostAdd
          label={items.length ? 'Imagem' : 'Adicionar imagem'}
          onClick={() => {
            onChange([...items, { url: '' }]);
            setSelected(items.length);
          }}
        />
      )}

      {item?.url ? (
        <div className={handles.raceImgFocus}>
          <div className={handles.raceImgFocusCol}>
            <span className={fld.raceFldLabel}>
              Ponto de foco{' '}
              <span className={handles.raceImgValue} aria-live="polite">
                {focus}
              </span>
            </span>
            <div
              className={handles.raceImgPick}
              tabIndex={0}
              role="slider"
              aria-label="Ponto de foco: clique na imagem ou use as setas"
              aria-valuetext={focus}
              aria-valuenow={Math.round(fx)}
              onClick={pickFromImage}
              onKeyDown={onPickKey}
            >
              <Image
                src={item.url}
                alt=""
                width={0}
                height={0}
                sizes="30rem"
                unoptimized
                draggable={false}
                style={{ width: 'auto', height: 'auto' }}
              />
              <span
                className={handles.raceImgMark}
                style={{ left: `${fx}%`, top: `${fy}%` }}
              />
            </div>
            <small className={fld.raceFldHint}>
              Clique onde está o assunto da arte (rosto, figura). Setas ajustam
              de 2 em 2%.
            </small>
            <div
              className={handles.raceImgPresets}
              role="group"
              aria-label="Atalhos de foco"
            >
              {PRESETS.map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  aria-label={label}
                  title={label}
                  aria-pressed={value === focus}
                  onClick={() => setFocus(value)}
                />
              ))}
            </div>
          </div>
          <div className={handles.raceImgFocusCol}>
            <span className={fld.raceFldLabel}>Como fica</span>
            <div className={handles.raceImgPreviews}>
              {preview('card', 'Card')}
              {preview('hero', 'Topo · computador')}
              {preview('mob', 'Topo · celular')}
            </div>
          </div>
        </div>
      ) : (
        <p className={fld.raceFldHint}>
          {items.length
            ? 'Cole o link para ajustar o foco.'
            : 'Sem imagem, o topo usa a trama de losangos com a inicial.'}
        </p>
      )}
    </div>
  );
};

export default ImageEditor;
