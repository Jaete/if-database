import type { ReactNode, SVGProps } from 'react';
import type { SpellSchoolKey } from '@/db/l10n/spells';

const RAYS = [0, 45, 90, 135, 180, 225, 270, 315];

const GLYPHS: Record<SpellSchoolKey, ReactNode> = {
  abjuracao: (
    <>
      <path d="M12 3l7 3v5c0 4.6-3 8-7 10-4-2-7-5.4-7-10V6z" />
      <path d="M12 7v10M8.5 11h7" />
    </>
  ),
  adivinhacao: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  conjuracao: (
    <>
      <circle cx="12" cy="12" r="9" />
      <ellipse cx="12" cy="12" rx="3.5" ry="9" />
    </>
  ),
  encantamento: (
    <>
      <circle cx="9" cy="12" r="5.5" />
      <circle cx="15" cy="12" r="5.5" />
    </>
  ),
  evocacao: (
    <>
      <circle cx="12" cy="12" r="2.2" />
      {RAYS.map((angle) => (
        <path key={angle} transform={`rotate(${angle} 12 12)`} d="M12 2.5v5" />
      ))}
    </>
  ),
  ilusao: (
    <>
      <path d="M10 3.5l6.5 6.5-6.5 6.5L3.5 10z" />
      <path d="M14 7.5l6.5 6.5-6.5 6.5L7.5 14z" strokeDasharray="2 2" />
    </>
  ),
  necromancia: (
    <>
      <path d="M6.5 3h11M6.5 21h11" />
      <path d="M8 3c0 5.5 8 5.5 8 9s-8 3.5-8 9M16 3c0 5.5-8 5.5-8 9s8 3.5 8 9" />
    </>
  ),
  transmutacao: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 5.5l6 10.5H6z" />
    </>
  ),
  outra: <path d="M12 4l8 8-8 8-8-8z" />,
};

interface IProps extends SVGProps<SVGSVGElement> {
  school: SpellSchoolKey;
}

/** O glifo de uma escola de magia, a mesma chave de `spellSchoolKey`. */
const SpellSchoolIcon = ({ school, ...props }: IProps) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    {GLYPHS[school]}
  </svg>
);

export default SpellSchoolIcon;
