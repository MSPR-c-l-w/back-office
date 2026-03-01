/**
 * Rôle ayant accès au back-office. Seuls les utilisateurs avec le rôle ADMIN
 * peuvent se connecter au back-office.
 */
export const BACK_OFFICE_ROLES = ["ADMIN"] as const;

export type BackOfficeRole = (typeof BACK_OFFICE_ROLES)[number];

export function hasBackOfficeAccess(roleName: string | undefined | null): boolean {
  if (!roleName) return false;
  return BACK_OFFICE_ROLES.includes(roleName as BackOfficeRole);
}

/**
 * Vérifie si l'utilisateur a l'un des rôles requis (ex. pour afficher un lien ou une page).
 */
export function hasRequiredRole(
  userRoleName: string | undefined | null,
  required: BackOfficeRole | BackOfficeRole[]
): boolean {
  if (!userRoleName) return false;
  const allowed = Array.isArray(required) ? required : [required];
  return allowed.includes(userRoleName as BackOfficeRole);
}
