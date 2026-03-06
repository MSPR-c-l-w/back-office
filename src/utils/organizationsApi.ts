import api from "@/utils/axios";
import type {
  BrandingConfig,
  Organization,
} from "@/utils/interfaces/organization";

export type CreateOrganizationInput = {
  name: string;
  type: string;
  branding_config?: BrandingConfig;
  /**
   * Certains backends attendent un champ camelCase côté body (ex: NestJS DTO).
   * Si l'API ne le supporte pas, elle renverra un 400 "property ... should not exist".
   */
  isActive?: boolean;
  /**
   * D’autres backends exposent le champ en snake_case (comme sur ton Swagger).
   */
  is_active?: boolean;
};

export type UpdateOrganizationInput = Partial<CreateOrganizationInput>;

export async function listOrganizations(): Promise<Organization[]> {
  const { data } = await api.get<unknown>("/organizations");
  if (!Array.isArray(data)) {
    throw new Error("ORGANIZATIONS_API_INVALID_RESPONSE");
  }
  return data as Organization[];
}

export async function getOrganization(id: number): Promise<Organization> {
  const { data } = await api.get<Organization>(`/organizations/${id}`);
  return data;
}

export async function createOrganization(
  payload: CreateOrganizationInput
): Promise<Organization> {
  const { data } = await api.post<Organization>("/organizations", payload);
  return data;
}

export async function updateOrganization(
  id: number,
  payload: UpdateOrganizationInput
): Promise<Organization> {
  const { data } = await api.put<Organization>(`/organizations/${id}`, payload);
  return data;
}

export async function deleteOrganization(id: number): Promise<void> {
  await api.delete(`/organizations/${id}`);
}
