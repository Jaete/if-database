'use client';

import { useState } from 'react';
import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import { ChevronDownIcon, CloseIcon } from '../../Icons';
import Block from '../Block';
import DetailCard from '../DetailCard';
import { useSideReader } from '../useSideReader';
import { useCatalogRequest } from '../CatalogLayerContext';
import { useEditing } from '../EditingContext';
import { useTalents } from '../useTalents';
import type { ITalentGroup } from '../useTalents';
import { requiredLevel, shortCategory } from '../sheetData';
import TalentsPanelHandles from './handles';

/** "4", "4 e 9", "4, 9 e 12". */
const joinLevels = (levels: number[]) =>
  levels.length <= 1
    ? levels.join('')
    : `${levels.slice(0, -1).join(', ')} e ${levels[levels.length - 1]}`;

/**
 * Os talentos do personagem e os marcos da classe em que se escolhe um.
 *
 * Tem tela própria, e não um grupo dentro de Habilidades, pelo mesmo motivo do
 * Arquétipo: é uma escolha com teto, e o teto precisa aparecer em algum lugar.
 * A contagem só informa: um marco sem talento pode ter ido para atributos, e a
 * ficha não sabe disso — por isso nada aqui bloqueia a escolha.
 */
const TalentsPanel = () => {
  const handles = useCssHandles(TalentsPanelHandles);
  const { editable, isDirtyUnder, revertField } = useEditing();
  const talents = useTalents();
  const catalog = useCatalogRequest();
  const reader = useSideReader<ITalentGroup>();
  // Narrow panels read the description inline; wide ones use the reader.
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(new Set());

  const { progress, groups, slots, level, className } = talents;
  const { nodes, reached, taken, over } = progress;
  const firstOpen = nodes.find((n) => n.state === 'open');
  const actionable = nodes.filter(
    (n) => !n.talent && (n.state === 'open' || n.state === 'attribute')
  );
  const pending = isDirtyUnder('talents') || isDirtyUnder('talentMilestones');
  const shown = groups.find((g) => g.key === reader.selectedKey) ?? groups[0];

  const toggle = (key: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const reachedCount = nodes.filter((n) => n.level <= level).length;
  const reach =
    reachedCount <= 1 || nodes.length <= 1
      ? '0%'
      : `calc((100% - 100% / ${nodes.length}) * ${(reachedCount - 1) / (nodes.length - 1)})`;

  return (
    <>
      <Block title="Marcos">
        {nodes.length > 0 ? (
          <div
            className={handles.sheetTalentTrack}
            style={
              {
                '--talent-nodes': nodes.length,
                '--talent-reach': reach,
              } as React.CSSProperties
            }
            role="list"
            aria-label={`Marcos de talento${className ? ` de ${className}` : ''}`}
          >
            <i className={handles.sheetTalentReach} aria-hidden="true" />
            {nodes.map((node, i) => {
              const label = node.talent
                ? node.talent.name
                : node.state === 'attribute'
                  ? 'atributos'
                  : node.state === 'open'
                    ? node.kind === 'class'
                      ? 'livre · classe'
                      : 'livre'
                    : 'futuro';
              return (
                <div
                  key={`${node.level}:${node.kind}:${i}`}
                  className={`${handles.sheetTalentNode} ${applyModifiers(handles.sheetTalentNode, node.state)}`}
                  role="listitem"
                  title={`Nível ${node.level}${node.kind === 'class' ? ' (só da classe)' : ''}: ${label}`}
                >
                  <span className={handles.sheetTalentPip} aria-hidden="true" />
                  <span className={handles.sheetTalentLevel}>
                    Nv {node.level}
                  </span>
                  <span className={handles.sheetTalentState}>{label}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className={handles.sheetEmpty}>
            {slots
              ? `${className} não tem marco de talento na tabela de progressão.`
              : 'Sem classe ligada ao códice, a ficha não sabe os marcos de talento.'}
          </p>
        )}

        {editable && actionable.length > 0 && (
          <ul
            className={handles.sheetTalentOpenList}
            aria-label="Marcos sem talento"
          >
            {actionable.map((node) => (
              <li
                key={`${node.level}:${node.kind}`}
                className={handles.sheetTalentOpenItem}
              >
                <span className={handles.sheetTalentOpenLabel}>
                  {`Nv ${node.level} · ${node.kind === 'class' ? 'só da classe' : 'geral'}`}
                  {node.state === 'attribute' && ' · foi para atributos'}
                </span>
                {node.state === 'open' && (
                  <button
                    type="button"
                    className={handles.sheetTalentNodeBtn}
                    onClick={() =>
                      catalog.open({ kind: 'talents', at: node.level })
                    }
                  >
                    Escolher talento
                  </button>
                )}
                {node.kind === 'general' && (
                  <button
                    type="button"
                    className={handles.sheetTalentNodeBtn}
                    aria-pressed={node.state === 'attribute'}
                    onClick={() =>
                      talents.setMilestone(
                        node.level,
                        node.state === 'attribute' ? undefined : 'attribute'
                      )
                    }
                  >
                    {node.state === 'attribute'
                      ? 'Foi para talento'
                      : 'Usei em atributos'}
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}

        <div className={handles.sheetTalentSlotLine}>
          <span>
            <b>{reached}</b>{' '}
            {reached === 1 ? 'talento disponível' : 'talentos disponíveis'} até
            o nível {level}
            {progress.attributeCount > 0 &&
              ` · ${progress.attributeCount} marco${progress.attributeCount === 1 ? '' : 's'} em atributos`}
          </span>
          <span
            className={
              over
                ? `${handles.sheetTalentFlag} ${applyModifiers(handles.sheetTalentFlag, 'strong')}`
                : undefined
            }
          >
            {over
              ? `${taken} escolhidos para ${reached} marcos: confira com o mestre`
              : `${taken} ${taken === 1 ? 'escolhido' : 'escolhidos'}`}
          </span>
        </div>
        {/* Os marcos vêm da tabela da classe GRAVADA; com a classe trocada no
            rascunho eles só se atualizam depois de salvar. */}
        {isDirtyUnder('classId') && (
          <p className={handles.sheetTalentLegend}>
            A classe foi alterada: salve para atualizar os marcos.
          </p>
        )}
        {slots && nodes.length > 0 && (
          <p className={handles.sheetTalentLegend}>
            {slots.general.length > 0 &&
              `Nos níveis ${joinLevels(slots.general)}, ${className} escolhe entre +2 em um atributo, +1 em dois ou um talento, geral ou da classe. Marque o que foi para atributos. `}
            {slots.classOnly.length > 0 &&
              `${slots.classOnly.length === 1 ? 'No nível' : 'Nos níveis'} ${joinLevels(slots.classOnly)}, a classe concede um talento só dela.`}
          </p>
        )}
      </Block>

      <div className={handles.sheetMasterLayout}>
        <div className={handles.sheetMasterList} data-listnav>
          <div
            className={handles.sheetMasterGroup}
            role="group"
            aria-label="Talentos escolhidos"
          >
            <span
              className={handles.sheetCaption}
            >{`Escolhidos · ${taken}`}</span>

            {groups.map((group) => (
              <Row
                key={group.key}
                group={group}
                level={level}
                className={className}
                current={group.key === shown?.key}
                open={expanded.has(group.key)}
                onPreview={() => reader.preview(group.key)}
                onSelect={() => {
                  reader.preview(group.key);
                  toggle(group.key);
                }}
                editable={editable}
                onLevel={talents.setLevel}
                onRemove={talents.remove}
              />
            ))}

            {groups.length === 0 && (
              <p className={handles.sheetEmpty}>
                {reached > 0
                  ? 'Nenhum talento escolhido.'
                  : nodes.length > 0
                    ? `O primeiro marco de talento${className ? ` de ${className}` : ''} é no nível ${nodes[0].level}.`
                    : 'Nenhum talento escolhido.'}
              </p>
            )}

            {editable && (
              <button
                type="button"
                className={handles.sheetMasterAdd}
                onClick={() =>
                  catalog.open({
                    kind: 'talents',
                    at: firstOpen?.level ?? Math.max(1, level),
                  })
                }
              >
                {`+ Escolher talento · ${Math.max(0, progress.nodes.filter((n) => n.state === 'open').length)} livres`}
              </button>
            )}
            {editable && pending && (
              <span className={handles.sheetTalentPending}>
                <span>não salvo</span>
                <button
                  type="button"
                  onClick={() => {
                    revertField('talents');
                    revertField('talentMilestones');
                  }}
                >
                  Desfazer
                </button>
              </span>
            )}
          </div>
        </div>

        {shown && (
          <DetailCard
            id={reader.detailId}
            kicker={
              shown.talent.scope === 'class'
                ? `Talento de ${className || 'classe'}`
                : `Talento geral${shown.talent.category ? ` · ${shortCategory(shown.talent.category)}` : ''}`
            }
            title={shown.talent.name}
            meta={[
              {
                label: 'Tomado no nível',
                value: joinLevels(shown.picks.map((p) => p.level)),
              },
              {
                label: 'Escopo',
                value: shown.talent.scope === 'class' ? 'Classe' : 'Geral',
              },
              {
                label: 'Pré-requisitos',
                value: shown.talent.prerequisites || '—',
                wide: true,
              },
            ]}
            text={shown.talent.description}
          />
        )}
      </div>
    </>
  );
};

interface IRowProps {
  group: ITalentGroup;
  level: number;
  className: string;
  current: boolean;
  open: boolean;
  editable: boolean;
  onPreview: () => void;
  onSelect: () => void;
  onLevel: (at: number, level: number) => void;
  onRemove: (at: number) => void;
}

/** Uma linha de talento; o pego várias vezes mostra ×N e um nível por vez. */
const Row = ({
  group,
  level,
  className,
  current,
  open,
  editable,
  onPreview,
  onSelect,
  onLevel,
  onRemove,
}: IRowProps) => {
  const handles = useCssHandles(TalentsPanelHandles);
  const { talent, picks } = group;
  const many = picks.length > 1;
  const needs = requiredLevel(talent.prerequisites, className);
  const levels = Array.from({ length: Math.max(1, level) }, (_, i) => i + 1);

  const levelSelect = (at: number, value: number, label: string) => (
    <select
      key={at}
      className={handles.sheetTalentSealSelect}
      aria-label={label}
      value={value}
      onChange={(event) => onLevel(at, Number(event.target.value))}
    >
      {levels.includes(value) ? null : <option value={value}>{value}</option>}
      {levels.map((lv) => (
        <option key={lv} value={lv}>
          {lv}
        </option>
      ))}
    </select>
  );

  return (
    <div
      className={`${handles.sheetTalentRow}${
        current ? ` ${applyModifiers(handles.sheetTalentRow, 'current')}` : ''
      }${editable ? ` ${applyModifiers(handles.sheetTalentRow, 'editing')}` : ''}`}
    >
      {editable && !many ? (
        levelSelect(
          picks[0].at,
          picks[0].level,
          `Nível em que ${talent.name} foi tomado`
        )
      ) : (
        <span
          className={handles.sheetTalentSeal}
          title={`Tomado no nível ${picks[0].level}`}
          aria-label={`Nível ${picks[0].level}`}
        >
          {picks[0].level}
        </span>
      )}

      <button
        type="button"
        className={handles.sheetTalentMain}
        data-opt
        onClick={onSelect}
        onMouseEnter={onPreview}
        onFocus={onPreview}
      >
        <span className={handles.sheetTalentName}>
          {talent.name}
          {many && (
            <span className={handles.sheetTalentCount}>×{picks.length}</span>
          )}
        </span>
        <span className={handles.sheetTalentTags}>
          <span
            className={`${handles.sheetTalentScope}${
              talent.scope === 'class'
                ? ` ${applyModifiers(handles.sheetTalentScope, 'class')}`
                : ''
            }`}
          >
            {talent.scope === 'class' ? 'classe' : 'geral'}
          </span>
          <span>
            {talent.scope === 'class'
              ? talent.group || className
              : shortCategory(talent.category)}
          </span>
          {talent.orphan && (
            <span className={handles.sheetTalentFlag}>fora do catálogo</span>
          )}
        </span>
        {many && (
          <span className={handles.sheetTalentTags}>
            {`Tomado nos níveis ${joinLevels(picks.map((p) => p.level))}`}
          </span>
        )}
        {talent.prerequisites && (
          <span className={handles.sheetTalentPrereq}>
            <b>Pré-requisito:</b> {talent.prerequisites}
            {needs > level && (
              <span className={handles.sheetTalentFlag}>
                {' '}
                pede nível {needs}
              </span>
            )}
          </span>
        )}
      </button>

      <span className={handles.sheetTalentActions}>
        <button
          type="button"
          className={handles.sheetMasterRead}
          aria-expanded={open}
          aria-label={`${open ? 'Fechar' : 'Ler'} ${talent.name}`}
          onClick={onSelect}
        >
          <ChevronDownIcon />
        </button>
        {editable && !many && (
          <button
            type="button"
            className={handles.sheetMasterEdit}
            onClick={() => onRemove(picks[0].at)}
            aria-label={`Remover ${talent.name}`}
          >
            <CloseIcon />
          </button>
        )}
      </span>

      {editable && many && (
        <div className={handles.sheetTalentPicks}>
          {picks.map((pick) => (
            <span key={pick.at} className={handles.sheetTalentPick}>
              {levelSelect(
                pick.at,
                pick.level,
                `Nível da ${picks.indexOf(pick) + 1}ª vez de ${talent.name}`
              )}
              <button
                type="button"
                className={handles.sheetMasterEdit}
                onClick={() => onRemove(pick.at)}
                aria-label={`Remover uma vez ${talent.name} (nível ${pick.level})`}
              >
                <CloseIcon />
              </button>
            </span>
          ))}
        </div>
      )}

      {open && (
        <div className={handles.sheetTalentMore}>
          <p>{talent.description || 'Sem descrição.'}</p>
        </div>
      )}
    </div>
  );
};

export default TalentsPanel;
