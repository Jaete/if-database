'use client';

import { useId, useState } from 'react';
import type { IPublicPlayer } from '@/db/players/publicFields';
import { useCssHandles } from '@/hooks/useCssHandles';
import { PaperDollIcon } from '../../Icons';
import Block from '../Block';
import DetailCard from '../DetailCard';
import {
  DASH,
  EQUIPMENT_SLOTS,
  formatNumber,
  readItem,
  splitBackpack,
} from '../sheetData';
import EquipmentPanelHandles from './handles';

interface IProps {
  player: IPublicPlayer;
}

const EquipmentPanel = ({ player }: IProps) => {
  const handles = useCssHandles(EquipmentPanelHandles);
  const detailId = useId();
  const [selected, setSelected] = useState(0);

  const equipment = player.equipment;
  const slot = EQUIPMENT_SLOTS[selected];
  const item = readItem(equipment?.[slot.key]);
  const pack = splitBackpack(equipment?.backpack);

  return (
    <>
      <div className={handles.sheetDoll} data-listnav>
        {EQUIPMENT_SLOTS.map((s, i) => {
          const it = readItem(equipment?.[s.key]);
          const isRight = i % 2 === 1;
          return (
            <button
              key={s.key}
              type="button"
              className={`${handles.sheetEquipSlot}${
                isRight ? ` ${handles.sheetEquipSlot}--right` : ''
              }${it ? '' : ` ${handles.sheetEquipSlot}--empty`}`}
              style={{ gridRow: Math.floor(i / 2) + 1 }}
              data-opt
              aria-pressed={i === selected}
              aria-controls={detailId}
              onFocus={() => setSelected(i)}
              onMouseEnter={() => setSelected(i)}
              onClick={() => setSelected(i)}
            >
              <span className={handles.sheetCaption}>{s.label}</span>
              <span className={handles.sheetEquipSlotName}>
                {it ? it.name : 'Vazio'}
              </span>
            </button>
          );
        })}
        <div className={handles.sheetDollFigure} aria-hidden="true">
          <PaperDollIcon activeSlot={slot.key} />
        </div>
      </div>

      <DetailCard
        id={detailId}
        kicker={slot.label}
        title={item ? item.name : 'Espaço vazio'}
        text={item ? item.description : 'Nenhum item equipado neste espaço.'}
      />

      <Block title="Bolsa">
        <div className={handles.sheetPurse}>
          <div className={handles.sheetGil}>
            <span className={handles.sheetCaption}>Gil</span>
            <b className={handles.sheetGilValue}>
              {equipment?.gil !== undefined
                ? formatNumber(equipment.gil)
                : DASH}
            </b>
          </div>
          <div>
            <span className={handles.sheetCaption}>
              Mochila · {pack.length} {pack.length === 1 ? 'item' : 'itens'}
            </span>
            {pack.length > 0 ? (
              <ul className={handles.sheetPack}>
                {pack.map((entry, i) => (
                  <li key={`${entry}:${i}`} className={handles.sheetPackItem}>
                    {entry}
                  </li>
                ))}
              </ul>
            ) : (
              <p className={handles.sheetEmpty}>Mochila vazia.</p>
            )}
          </div>
        </div>
      </Block>
    </>
  );
};

export default EquipmentPanel;
