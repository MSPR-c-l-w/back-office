import api from "@/utils/axios";
import type { Plan } from "@/utils/interfaces/plan";

export type CreatePlanInput = {
  name: string;
  price: number;
  features: string[];
};

export type UpdatePlanInput = Partial<CreatePlanInput>;

export async function listPlans(): Promise<Plan[]> {
  const { data } = await api.get<unknown>("/plan");
  if (!Array.isArray(data)) throw new Error("PLANS_API_INVALID_RESPONSE");
  return data as Plan[];
}

export async function getPlan(id: number): Promise<Plan> {
  const { data } = await api.get<Plan>(`/plan/${id}`);
  return data;
}

export async function createPlan(payload: CreatePlanInput): Promise<Plan> {
  const { data } = await api.post<Plan>("/plan", payload);
  return data;
}

export async function updatePlan(id: number, payload: UpdatePlanInput): Promise<Plan> {
  const { data } = await api.put<Plan>(`/plan/${id}`, payload);
  return data;
}

export async function deletePlan(id: number): Promise<void> {
  await api.delete(`/plan/${id}`);
}

