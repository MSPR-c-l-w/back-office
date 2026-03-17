import api from "@/utils/axios";
import type { Role } from "@/utils/interfaces/role";

export async function listRoles(): Promise<Role[]> {
  const { data } = await api.get<unknown>("/roles");
  if (!Array.isArray(data)) {
    throw new Error("ROLES_API_INVALID_RESPONSE");
  }
  return data as Role[];
}

