'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import { sheetSounds } from '@/lib/sheetSounds';
import { SpeakerIcon, SpeakerOffIcon } from '../../Icons';
import { useSoundSettings } from '../useSheetSounds';
import SoundButtonHandles from './handles';

interface IProps {
  /** Para que lado o seletor abre: o rodapé abre para cima. */
  place?: 'up' | 'down';
}

/**
 * O alto-falante que abre as duas chaves de som: Eventos e Interface. A escolha
 * é da pessoa (localStorage), não da ficha.
 */
const SoundButton = ({ place = 'down' }: IProps) => {
  const handles = useCssHandles(SoundButtonHandles);
  const { evt, ui, setGroup } = useSoundSettings();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLSpanElement>(null);
  const popId = useId();

  const any = evt || ui;
  const label =
    evt && ui ? 'Som' : evt ? 'Só eventos' : ui ? 'Só interface' : 'Sem som';

  // Clicar fora ou apertar Esc fecha o seletor.
  useEffect(() => {
    if (!open) return;
    const onDown = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey, true);
    };
  }, [open]);

  return (
    <span ref={wrapRef} className={handles.sheetSoundWrap}>
      <button
        type="button"
        className={handles.sheetSoundBtn}
        aria-expanded={open}
        aria-controls={open ? popId : undefined}
        aria-pressed={any}
        aria-label={`Sons: ${label}`}
        onClick={() => {
          setOpen((v) => !v);
          sheetSounds.play('latch');
        }}
      >
        {any ? <SpeakerIcon /> : <SpeakerOffIcon />}
        {label}
      </button>
      {open && (
        <div
          id={popId}
          className={`${handles.sheetSoundPop} ${handles.sheetSoundPop}--${place}`}
          role="group"
          aria-label="Sons da ficha"
        >
          <span className={handles.sheetSoundCap}>Sons · só você ouve</span>
          <label className={handles.sheetSoundSwitch}>
            <b>Eventos</b>
            <small>Subida de nível, XP, selos</small>
            <input
              type="checkbox"
              checked={evt}
              onChange={(e) => setGroup('evt', e.target.checked)}
            />
          </label>
          <label className={handles.sheetSoundSwitch}>
            <b>Interface</b>
            <small>Páginas, escolhas, magias, itens</small>
            <input
              type="checkbox"
              checked={ui}
              onChange={(e) => setGroup('ui', e.target.checked)}
            />
          </label>
        </div>
      )}
    </span>
  );
};

export default SoundButton;
