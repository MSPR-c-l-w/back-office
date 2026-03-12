import api from "@/utils/axios";
import type { Exercise } from "@/utils/interfaces/exercise";

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type Paginated<T> = {
  items: T[];
  meta: PaginationMeta;
};

type UnknownPaginatedResponse<T> =
  | T[]
  | {
      data?: T[];
      items?: T[];
      results?: T[];
      exercises?: T[];
      meta?: Partial<PaginationMeta>;
      pagination?: Partial<PaginationMeta>;
      total?: number;
      page?: number;
      limit?: number;
    };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readNumber(obj: unknown, keys: string[]): number | null {
  if (!isRecord(obj)) return null;
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string" && v.trim() !== "") {
      const n = Number(v);
      if (Number.isFinite(n)) return n;
    }
  }
  return null;
}

function pickArray(obj: unknown): unknown[] | null {
  if (Array.isArray(obj)) return obj;
  if (!isRecord(obj)) return null;

  const direct = obj.data ?? obj.items ?? obj.results ?? obj.exercises ?? obj.rows;
  if (Array.isArray(direct)) return direct;

  // Parfois: { data: { items: [...] } }
  if (isRecord(obj.data)) {
    const nested = (obj.data as Record<string, unknown>).items ??
      (obj.data as Record<string, unknown>).data ??
      (obj.data as Record<string, unknown>).results ??
      (obj.data as Record<string, unknown>).exercises ??
      (obj.data as Record<string, unknown>).rows;
    if (Array.isArray(nested)) return nested;
  }

  // Fallback: si un seul champ est un tableau, on le prend.
  const arrays = Object.values(obj).filter(Array.isArray) as unknown[][];
  if (arrays.length === 1) return arrays[0];

  return null;
}

function pickMetaLike(obj: unknown): unknown {
  if (!isRecord(obj)) return {};
  const meta = obj.meta ?? obj.pagination ?? obj.pageable ?? obj.paging;
  if (isRecord(meta)) return meta;
  // Parfois: { data: { meta: {...} } }
  if (isRecord(obj.data)) {
    const nested = (obj.data as Record<string, unknown>).meta ??
      (obj.data as Record<string, unknown>).pagination ??
      (obj.data as Record<string, unknown>).pageable ??
      (obj.data as Record<string, unknown>).paging;
    if (isRecord(nested)) return nested;
  }
  return {};
}

function extractPaginated<T>(
  data: UnknownPaginatedResponse<T>,
  page: number,
  limit: number
): Paginated<T> {
  if (Array.isArray(data)) {
    return {
      items: data,
      meta: { page, limit, total: data.length, totalPages: 1 },
    };
  }
  if (!isRecord(data)) {
    return { items: [], meta: { page, limit, total: 0, totalPages: 0 } };
  }
  const picked = pickArray(data) ?? [];
  const items = picked as unknown as T[];
  const metaLike = pickMetaLike(data);

  const effectivePage =
    readNumber(metaLike, ["page", "currentPage", "current_page"]) ??
    readNumber(data, ["page", "currentPage", "current_page"]) ??
    page;

  const effectiveLimit =
    readNumber(metaLike, [
      "limit",
      "perPage",
      "per_page",
      "pageSize",
      "page_size",
      "itemsPerPage",
      "items_per_page",
      "take",
    ]) ??
    readNumber(data, [
      "limit",
      "perPage",
      "per_page",
      "pageSize",
      "page_size",
      "itemsPerPage",
      "items_per_page",
      "take",
    ]) ??
    limit;

  const totalFromPayload =
    readNumber(metaLike, [
      "total",
      "totalItems",
      "total_items",
      "totalCount",
      "total_count",
      "totalElements",
      "total_elements",
      "totalRecords",
      "total_records",
      "itemCount",
      "item_count",
      "count",
      "itemsCount",
      "items_count",
      "nbItems",
      "nb_items",
    ]) ?? readNumber(data, ["total", "totalItems", "total_items", "totalCount", "total_count", "count"]);

  const totalPagesFromPayload =
    readNumber(metaLike, [
      "totalPages",
      "total_pages",
      "pageCount",
      "page_count",
      "pagesCount",
      "pages_count",
      "pages",
      "lastPage",
      "last_page",
    ]) ?? readNumber(data, ["totalPages", "total_pages", "pageCount", "page_count", "pages", "lastPage", "last_page"]);

  const total =
    totalFromPayload ??
    (totalPagesFromPayload && effectiveLimit > 0
      ? totalPagesFromPayload * effectiveLimit
      : items.length);

  const totalPages =
    totalPagesFromPayload ??
    (effectiveLimit > 0 ? Math.ceil(total / effectiveLimit) : 0);

  return {
    items,
    meta: {
      page: effectivePage,
      limit: effectiveLimit,
      total,
      totalPages,
    },
  };
}

function normalizeExercise(raw: unknown): Exercise {
  const r = (raw ?? {}) as Record<string, unknown>;
  // Backend: `image_urls` (array)
  const imagesCandidate = r.image_urls;

  const instructionsCandidate = r.instructions ?? r.instruction ?? r.steps;

  return {
    id: Number(r.id ?? 0),
    name: String(r.name ?? ""),
    primary_muscles: Array.isArray(r.primary_muscles) ? (r.primary_muscles as string[]) : [],
    secondary_muscles: Array.isArray(r.secondary_muscles)
      ? (r.secondary_muscles as string[])
      : [],
    level: String(r.level ?? ""),
    mechanic: (r.mechanic == null ? null : String(r.mechanic)) as string | null,
    equipment: (r.equipment == null ? null : String(r.equipment)) as string | null,
    category: String(r.category ?? ""),
    instructions: Array.isArray(instructionsCandidate)
      ? (instructionsCandidate as string[])
      : [],
    images_urls: Array.isArray(imagesCandidate) ? (imagesCandidate as string[]) : [],
    exercise_type: String(r.exercise_type ?? r.type ?? ""),
  };
}

export async function listExercises(params: {
  page: number;
  limit: number;
}): Promise<Paginated<Exercise>> {
  const { data } = await api.get<UnknownPaginatedResponse<Exercise>>("/exercise", {
    params,
  });
  if (Array.isArray(data)) {
    const items = (data as unknown[]).map(normalizeExercise);
    const hasNext = data.length === params.limit;
    return {
      items,
      meta: {
        page: params.page,
        limit: params.limit,
        total: -1,
        totalPages: hasNext ? params.page + 1 : params.page,
      },
    };
  }
  const res = extractPaginated(data, params.page, params.limit);
  return { ...res, items: (res.items as unknown[]).map(normalizeExercise) };
}

export async function searchExercises(params: {
  muscle?: string;
  level?: string;
  equipment?: string;
  category?: string;
  page: number;
  limit: number;
}): Promise<Paginated<Exercise>> {
  const { data } = await api.get<UnknownPaginatedResponse<Exercise>>(
    "/exercise/search",
    {
      params: {
        muscle: params.muscle || undefined,
        level: params.level || undefined,
        equipment: params.equipment || undefined,
        category: params.category || undefined,
        page: params.page,
        limit: params.limit,
      },
    }
  );
  if (Array.isArray(data)) {
    const items = (data as unknown[]).map(normalizeExercise);
    const hasNext = data.length === params.limit;
    return {
      items,
      meta: {
        page: params.page,
        limit: params.limit,
        total: -1,
        totalPages: hasNext ? params.page + 1 : params.page,
      },
    };
  }
  const res = extractPaginated(data, params.page, params.limit);
  return { ...res, items: (res.items as unknown[]).map(normalizeExercise) };
}

export async function getExercise(id: number): Promise<Exercise> {
  const { data } = await api.get<Exercise>(`/exercise/${id}`);
  return normalizeExercise(data);
}

export type UpdateExerciseInput = Partial<
  Pick<
    Exercise,
    | "name"
    | "primary_muscles"
    | "secondary_muscles"
    | "level"
    | "mechanic"
    | "equipment"
    | "category"
    | "instructions"
    | "exercise_type"
  >
> & {
  image_urls?: string[];
};

export async function updateExercise(
  id: number,
  payload: UpdateExerciseInput
): Promise<Exercise> {
  const { image_urls, ...rest } = payload;
  const backendPayload = image_urls ? { ...rest, image_urls } : rest;
  const { data } = await api.put<Exercise>(`/exercise/${id}`, backendPayload);
  return normalizeExercise(data);
}

export async function deleteExercise(id: number): Promise<void> {
  await api.delete(`/exercise/${id}`);
}

