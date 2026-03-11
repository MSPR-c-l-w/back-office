import api from "@/utils/axios";
import type { User } from "@/utils/interfaces/user";

function looksLikeHtml(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const s = value.trimStart().toLowerCase();
  return s.startsWith("<!doctype html") || s.startsWith("<html");
}

export type UsersSummary = {
  total: number;
  active: number;
  totalGrowthPctThisMonth: number | null;
};

function parseDate(value: unknown): Date | null {
  if (value instanceof Date)
    return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value === "string" || typeof value === "number") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
}

export async function getUsersSummary(): Promise<UsersSummary> {
  const { data } = await api.get<unknown>("/users");
  if (looksLikeHtml(data)) {
    throw new Error(
      "USERS_API_MISCONFIGURED: NEXT_PUBLIC_API_URL pointe vers le front (HTML) au lieu du backend."
    );
  }
  if (!Array.isArray(data)) throw new Error("USERS_API_INVALID_RESPONSE");
  const users = data as User[];
  const total = users.length;
  const active = users.filter((u) => {
    const v =
      (u as unknown as { is_active?: unknown; isActive?: unknown }).is_active ??
      (u as unknown as { isActive?: unknown }).isActive;
    return v === true || v === 1 || v === "1";
  }).length;

  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const prevTotal = users.filter((u) => {
    const createdAt = parseDate(
      (u as unknown as { created_at?: unknown }).created_at
    );
    return createdAt ? createdAt < startOfThisMonth : false;
  }).length;
  const newThisMonth = users.filter((u) => {
    const createdAt = parseDate(
      (u as unknown as { created_at?: unknown }).created_at
    );
    return createdAt ? createdAt >= startOfThisMonth : false;
  }).length;

  const totalGrowthPctThisMonth =
    prevTotal > 0 ? (newThisMonth / prevTotal) * 100 : null;

  return { total, active, totalGrowthPctThisMonth };
}
