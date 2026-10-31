'use client';

import type { ClassRole } from '@/db/classes/class.d';
import { classRoleLabel } from '@/db/l10n/classes';
import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import { ClassRoleIcon } from '../Icons';
import ClassRolesHandles from './handles';
import '@/styles/components/classRoles.scss';

interface IProps {
  /** Em ordem de prioridade: o primeiro é o selo grande. */
  roles?: ClassRole[];
}

/**
 * Os papéis da classe: selo grande para o principal, pílulas para o resto.
 * Compartilhado pelo card do seletor e pelo topo da página de detalhe.
 */
const ClassRoles = ({ roles }: IProps) => {
  const handles = useCssHandles(ClassRolesHandles);
  const [primary, ...secondary] = roles ?? [];
  if (!primary) return null;

  return (
    <ul className={handles.classRoles} aria-label="Papéis">
      <li
        className={`${handles.classRole} ${applyModifiers(handles.classRole, 'primary')}`}
      >
        <span className={handles.classRoleIcon}>
          <ClassRoleIcon role={primary} />
        </span>
        {classRoleLabel(primary)}
        <span className={handles.classRoleSr}> (principal)</span>
      </li>
      {secondary.map((role) => (
        <li key={role} className={handles.classRole}>
          <ClassRoleIcon role={role} />
          {classRoleLabel(role)}
        </li>
      ))}
    </ul>
  );
};

export default ClassRoles;
