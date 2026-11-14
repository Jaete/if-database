// Quem é quem em relação a UMA ficha. Pura, sem banco: o servidor usa para
// montar o `IActor` e os testes a exercitam direto.
//
// Regra geral: na ficha da qual a pessoa É DONA (`ownerForumUserId` igual à
// conta), os poderes de staff não valem. Ela é tratada só como jogadora, para
// ser moderada por OUTRO membro da staff. O dono vence o papel.

/** Os papéis que moderam fichas dos outros. Alargar é mudar esta linha. */
export const SHEET_STAFF_ROLES: readonly string[] = ['admin', 'editor'];

export const isStaffRole = (role?: string | null): boolean =>
  !!role && SHEET_STAFF_ROLES.includes(role);

export interface ISheetFlags {
  /** A conta é a dona da ficha. */
  isOwner: boolean;
  /** Tem poder de staff NESTA ficha: papel de staff e não é a dona. */
  isStaff: boolean;
  /** Tem papel de staff (mesmo sendo a dona): só serve para a mensagem. */
  hasStaffRole: boolean;
}

/** A única fonte de verdade dos poderes de staff sobre uma ficha. */
export function isSheetStaff(
  role: string | null | undefined,
  isOwner: boolean
): boolean {
  return isStaffRole(role) && !isOwner;
}

export function sheetFlags(
  role: string | null | undefined,
  isOwner: boolean
): ISheetFlags {
  return {
    isOwner,
    isStaff: isSheetStaff(role, isOwner),
    hasStaffRole: isStaffRole(role),
  };
}

export const OWN_SHEET_MESSAGE =
  'Outro membro da staff precisa moderar a sua própria ficha.';
export const OWN_SHEET_EDIT_MESSAGE =
  'Outro membro da staff precisa editar a sua própria ficha.';

/**
 * Staff não se põe como dona de ficha pela edição genérica: a ficha própria
 * nasce em branco (`/api/players/blank`), é preenchida como jogadora e
 * aprovada por OUTRO membro da staff. Sem isto, bastaria criar (ou assumir)
 * uma ficha já pronta com o próprio `ownerForumUserId`.
 */
export const SELF_OWNER_MESSAGE =
  'Você não pode se pôr como dono de uma ficha. Crie uma ficha vazia para você e peça a outro membro da staff para aprovar.';
