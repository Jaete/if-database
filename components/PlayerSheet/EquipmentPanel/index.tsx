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
import { useEditing } from '../EditingContext';
import EditableText from '../EditableText';

interface IProps {
  player: IPublicPlayer;
}

const EquipmentPanel = ({ player }: IProps) => {
  const handles = useCssHandles(EquipmentPanelHandles);
  const { editable } = useEditing();
  const detailId = useId();
  const [selected, setSelected] = useState(0);

  const equipment = player.equipment;
  const slot = EQUIPMENT_SLOTS[selected];
  const item = readItem(equipment?.[slot.key]);
  const pack = splitBackpack(equipment?.backpack);

  // Os slots existem no banco como string crua OU como objeto { name,
  // description }. Escrever uma string por cima de um objeto apagaria a
  // descrição, então o caminho editado depende da forma que já está lá.
  const slotPath = (key: string) => {
    const raw = equipment?.[key as keyof typeof equipment];
    return raw && typeof raw === 'object'
      ? `equipment.${key}.name`
      : `equipment.${key}`;
  };

  return (
    <>
      <div className={handles.sheetDoll} data-listnav>
        {EQUIPMENT_SLOTS.map((s, i) => {
          const it = readItem(equipment?.[s.key]);
          const isRight = i % 2 === 1;
          const className = `${handles.sheetEquipSlot}${
            isRight ? ` ${handles.sheetEquipSlot}--right` : ''
          }${it ? '' : ` ${handles.sheetEquipSlot}--empty`}`;
          const gridRow = Math.floor(i / 2) + 1;

          // Em edição o slot deixa de ser <button>: um input dentro de um botão
          // é HTML inválido, e o onFocus/onMouseEnter do botão roubaria a
          // seleção assim que o campo recebesse foco.
          if (editable) {
            return (
              <div key={s.key} className={className} style={{ gridRow }}>
                <span className={handles.sheetCaption}>{s.label}</span>
                <span className={handles.sheetEquipSlotName}>
                  <EditableText
                    path={slotPath(s.key)}
                    label={s.label}
                    placeholder="Vazio"
                  >
                    {it ? it.name : 'Vazio'}
                  </EditableText>
                </span>
              </div>
            );
          }

          return (
            <button
              key={s.key}
              type="button"
              className={className}
              style={{ gridRow }}
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
              <EditableText path="equipment.gil" label="Gil" as="number">
                {equipment?.gil !== undefined
                  ? formatNumber(equipment.gil)
                  : DASH}
              </EditableText>
            </b>
          </div>
          <div>
            <span className={handles.sheetCaption}>
              Mochila · {pack.length} {pack.length === 1 ? 'item' : 'itens'}
            </span>
            {/* A mochila é um texto só, separado por ";" ou quebra de linha —
                por isso edita como textarea e não como lista. */}
            <EditableText
              path="equipment.backpack"
              label="Mochila"
              as="multiline"
              placeholder="Mochila vazia"
            >
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
            </EditableText>
          </div>
        </div>
      </Block>
    </>
  );
};

export default EquipmentPanel;
