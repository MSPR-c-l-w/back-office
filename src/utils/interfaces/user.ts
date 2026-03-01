import { Organization } from "./organization";
import { Role } from "./role";

/**
 * Utilisateur tel que renvoyé par l’API (ex. GET /auth/me).
 * L’organisation et le rôle sont des objets imbriqués ; pour l’id d’organisation, utiliser `user.organization?.id`.
 */
export interface User {
  id: number;
  organization?: Organization;
  role?: Role;
  email: string;
  first_name: string;
  last_name: string;
  date_of_birth: Date;
  gender: string;
  height: number;
  created_at: Date;
  updated_at: Date;
  deletedAt?: Date;
  is_active: boolean;
  is_deleted: boolean;
}
