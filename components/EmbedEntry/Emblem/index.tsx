'use client';

import type { ClassRole } from '@/db/classes/class.d';
import type { SpellSchoolKey } from '@/db/l10n/spells';
import { useCssHandles } from '@/hooks/useCssHandles';
import {
  AstrolabeIcon,
  ClassRoleIcon,
  HaloSwordIcon,
  SpellbookIcon,
  SpellSchoolIcon,
} from '../../Icons';
import EmblemHandles from './handles';

interface IProps {
  kind: 'classes' | 'spells';
}

const ROLES: ClassRole[] = [
  'tank',
  'dps',
  'curandeiro',
  'suporte',
  'controle',
  'utilidade',
];

const SCHOOLS: SpellSchoolKey[] = [
  'abjuracao',
  'adivinhacao',
  'conjuracao',
  'encantamento',
  'evocacao',
  'ilusao',
  'necromancia',
  'transmutacao',
];

const RING_RADIUS = 78;
const ICON_SIZE = 14;

/**
 * O ornamento de um painel sem imagem: astrolábio com os glifos no anel e a
 * marca no centro. Um SVG único, com os ícones aninhados.
 */
const Emblem = ({ kind }: IProps) => {
  const handles = useCssHandles(EmblemHandles);
  const items = kind === 'classes' ? ROLES : SCHOOLS;

  return (
    <span className={handles.embedEntryGlyph} aria-hidden="true">
      <svg viewBox="0 0 200 200" fill="none" stroke="currentColor">
        <AstrolabeIcon
          x={0}
          y={0}
          width={200}
          height={200}
          ringClassName={handles.embedEntryGlyphRing}
        />
        {items.map((item, index) => {
          const angle = (index / items.length) * Math.PI * 2 - Math.PI / 2;
          const cx = 100 + RING_RADIUS * Math.cos(angle);
          const cy = 100 + RING_RADIUS * Math.sin(angle);
          const position = {
            x: cx - ICON_SIZE / 2,
            y: cy - ICON_SIZE / 2,
            width: ICON_SIZE,
            height: ICON_SIZE,
          };
          return (
            <g key={item}>
              {/* Apaga o anel tracejado atrás do glifo */}
              <circle
                className={handles.embedEntryGlyphMask}
                cx={cx}
                cy={cy}
                r={ICON_SIZE / 2 + 2}
              />
              {kind === 'classes' ? (
                <ClassRoleIcon
                  role={item as ClassRole}
                  strokeWidth={1.6}
                  {...position}
                />
              ) : (
                <SpellSchoolIcon
                  school={item as SpellSchoolKey}
                  strokeWidth={1.5}
                  {...position}
                />
              )}
            </g>
          );
        })}
        {kind === 'classes' ? (
          <HaloSwordIcon x={88} y={84} width={24} height={32} />
        ) : (
          <SpellbookIcon
            x={86}
            y={86}
            width={28}
            height={28}
            strokeWidth={1.4}
          />
        )}
      </svg>
    </span>
  );
};

export default Emblem;
