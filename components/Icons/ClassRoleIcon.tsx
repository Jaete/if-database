import type { ComponentType, SVGProps } from 'react';
import type { ClassRole } from '@/db/classes/class.d';
import RoleControlIcon from './RoleControlIcon';
import RoleDpsIcon from './RoleDpsIcon';
import RoleHealerIcon from './RoleHealerIcon';
import RoleSupportIcon from './RoleSupportIcon';
import RoleTankIcon from './RoleTankIcon';
import RoleUtilityIcon from './RoleUtilityIcon';

const ICONS = {
  dps: RoleDpsIcon,
  tank: RoleTankIcon,
  suporte: RoleSupportIcon,
  curandeiro: RoleHealerIcon,
  controle: RoleControlIcon,
  utilidade: RoleUtilityIcon,
} satisfies Record<ClassRole, ComponentType<SVGProps<SVGSVGElement>>>;

/** O desenho do papel, escolhido pelo id. */
const ClassRoleIcon = ({
  role,
  ...props
}: SVGProps<SVGSVGElement> & { role: ClassRole }) => {
  const Icon = ICONS[role];
  return <Icon {...props} />;
};

export default ClassRoleIcon;
