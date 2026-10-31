'use client';

import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import {
  CLASS_ROLES,
  classRoleLabel,
  parseClassRoles,
} from '@/db/l10n/classes';
import type { ClassRole } from '@/db/classes/class.d';
import { ClassRoleIcon } from '../../Icons';
import RolesFieldHandles from './handles';

interface IProps {
  /** Os ids separados por vírgula, na ordem de prioridade: "controle,dps". */
  value: string;
  onChange: (next: string) => void;
}

/**
 * Os papéis da classe como chips. A ordem em que são marcados é a prioridade:
 * o primeiro é o principal, o destaque do card.
 *
 * Fala texto com o formulário (como o `SlotsField`): recebe e devolve a lista
 * separada por vírgula, e `classFromPrompt` valida de novo na gravação.
 */
const RolesField = ({ value, onChange }: IProps) => {
  const handles = useCssHandles(RolesFieldHandles);
  const selected = parseClassRoles(value);

  const write = (next: ClassRole[]) => onChange(next.join(','));

  const toggle = (role: ClassRole) =>
    write(
      selected.includes(role)
        ? selected.filter((item) => item !== role)
        : [...selected, role]
    );

  const makePrimary = (role: ClassRole) =>
    write([role, ...selected.filter((item) => item !== role)]);

  const secondary = selected.slice(1);

  return (
    <div className={handles.rolesField}>
      <div className={handles.rolesChips}>
        {CLASS_ROLES.map(({ id, label }) => {
          const order = selected.indexOf(id);
          const isPrimary = order === 0;
          return (
            <button
              key={id}
              type="button"
              className={`${handles.rolesChip}${
                isPrimary
                  ? ` ${applyModifiers(handles.rolesChip, 'primary')}`
                  : ''
              }`}
              aria-pressed={order >= 0}
              onClick={() => toggle(id)}
            >
              {order >= 0 && (
                <span className={handles.rolesOrder} aria-hidden="true">
                  {order + 1}
                </span>
              )}
              <ClassRoleIcon role={id} />
              {label}
              {isPrimary && (
                <span className={handles.rolesSrOnly}> (principal)</span>
              )}
            </button>
          );
        })}
      </div>
      <p className={handles.rolesHelp}>
        {selected.length === 0 ? (
          'Nenhum papel. A ordem em que você marca define a prioridade: o primeiro é o principal.'
        ) : (
          <>
            <b>Principal: {classRoleLabel(selected[0])}</b>
            {secondary.length > 0 && ' · Secundários: '}
            {secondary.map((role, index) => (
              <span key={role}>
                {index > 0 && ', '}
                {classRoleLabel(role)} (
                <button
                  type="button"
                  className={handles.rolesMakePrimary}
                  onClick={() => makePrimary(role)}
                >
                  tornar principal
                </button>
                )
              </span>
            ))}
          </>
        )}
      </p>
    </div>
  );
};

export default RolesField;
