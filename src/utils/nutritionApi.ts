import api from "@/utils/axios";
import type { Nutrition } from "@/utils/interfaces/nutrition";

export type UpdateNutritionInput = Partial<
  Pick<
    Nutrition,
    | "name"
    | "category"
    | "calories_kcal"
    | "protein_g"
    | "carbohydrates_g"
    | "fat_g"
    | "fiber_g"
    | "sugar_g"
    | "sodium_mg"
    | "cholesterol_mg"
    | "meal_type_name"
    | "water_intake_ml"
    | "picture_url"
  >
>;

function normalizeNutrition(raw: unknown): Nutrition {
  const r = (raw ?? {}) as Record<string, unknown>;
  return {
    id: Number(r.id ?? 0),
    name: String(r.name ?? ""),
    category: String(r.category ?? ""),
    calories_kcal: Number(r.calories_kcal ?? 0),
    protein_g: Number(r.protein_g ?? 0),
    carbohydrates_g: Number(r.carbohydrates_g ?? 0),
    fat_g: Number(r.fat_g ?? 0),
    fiber_g: Number(r.fiber_g ?? 0),
    sugar_g: Number(r.sugar_g ?? 0),
    sodium_mg: Number(r.sodium_mg ?? 0),
    cholesterol_mg: Number(r.cholesterol_mg ?? 0),
    meal_type_name: String(r.meal_type_name ?? ""),
    water_intake_ml: Number(r.water_intake_ml ?? 0),
    picture_url: r.picture_url == null ? null : String(r.picture_url),
  };
}

export type ListNutritionsResult = {
  items: Nutrition[];
  total: number;
};

const PAGE_SIZE = 100;

export async function listNutritions(params?: {
  page?: number;
  limit?: number;
  all?: boolean;
}): Promise<ListNutritionsResult> {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? PAGE_SIZE;

  try {
    const { data } = await api.get<{ data: unknown[]; total: number }>(
      "/nutrition",
      { params: { page, limit } }
    );

    const items = (data?.data ?? []).map(normalizeNutrition);
    const total = Number(data?.total ?? 0);
    return { items, total };
  } catch (err: unknown) {
    const status = (err as { response?: { status?: number } })?.response
      ?.status;
    if (status === 404) {
      return { items: [], total: 0 };
    }
    throw err;
  }
}

/** Charge toutes les Nutrition en bouclant sur les pages (backend limit 100 max). */
export async function listAllNutritions(): Promise<Nutrition[]> {
  const all: Nutrition[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const { items, total } = await listNutritions({
      page,
      limit: PAGE_SIZE,
    });
    all.push(...items);
    hasMore = all.length < total;
    page += 1;
  }

  return all;
}

export async function getNutrition(id: number): Promise<Nutrition> {
  const { data } = await api.get<unknown>(`/nutrition/${id}`);
  return normalizeNutrition(data);
}

export async function updateNutrition(
  id: number,
  payload: UpdateNutritionInput
): Promise<Nutrition> {
  const { data } = await api.put<unknown>(`/nutrition/${id}`, payload);
  return normalizeNutrition(data);
}

export async function deleteNutrition(id: number): Promise<void> {
  await api.delete(`/nutrition/${id}`);
}
