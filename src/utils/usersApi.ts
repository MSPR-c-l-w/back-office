import api from "@/utils/axios";
import type { User } from "@/utils/interfaces/user";

export type UpdateUserInput = {
  email?: string;
  first_name?: string;
  last_name?: string;
  height?: number;
  organization_id?: number;
};

export type UpdateUserRoleInput = {
  role_id?: number | null;
};

export async function updateUser(
  id: number,
  payload: UpdateUserInput
): Promise<User> {
  const { data } = await api.put<User>(`/users/${id}`, payload);
  return data;
}

export async function updateUserRole(
  id: number,
  payload: UpdateUserRoleInput
): Promise<User> {
  const { data } = await api.patch<User>(`/users/${id}/role`, payload);
  return data;
}

export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/users/${id}`);
}
