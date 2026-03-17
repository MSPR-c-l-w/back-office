import type { UserApiItem } from "@/utils/types/users";
import type { UserListItem } from "@/utils/types/users";

function computeAge(dateOfBirth: string | null): number {
  if (!dateOfBirth) return 0;
  const birth = new Date(dateOfBirth);
  if (Number.isNaN(birth.getTime())) return 0;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return Math.max(0, age);
}

function formatLastActivity(updatedAt: string): string {
  const date = new Date(updatedAt);
  if (Number.isNaN(date.getTime())) return "—";
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  const diffH = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffH / 24);
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  if (diffH < 24) return `Il y a ${diffH} h`;
  return `Il y a ${diffDays} j`;
}

function normalizePlanName(raw?: string): "Freemium" | "Premium" | "B2B" {
  if (!raw) return "Freemium";
  const normalized = raw.trim().toLowerCase();
  if (normalized === "premium") return "Premium";
  if (normalized === "b2b") return "B2B";
  return "Freemium";
}

function computeObjective(item: UserApiItem): string {
  const target = item.healthProfile?.daily_calories_target;
  if (typeof target === "number" && Number.isFinite(target)) {
    return `${target} kcal/j`;
  }
  const activity = item.healthProfile?.physical_activity_level?.trim();
  return activity ? activity : "—";
}

export function mapUserApiItemToListItem(item: UserApiItem): UserListItem {
  const name =
    [item.first_name, item.last_name].filter(Boolean).join(" ") || "—";
  const joinDate = item.created_at
    ? new Date(item.created_at).toLocaleDateString("fr-FR")
    : "—";
  const latestSessionAt = item.sessions?.[0]?.created_at ?? item.updated_at;
  const planName = item.subscriptions?.[0]?.plan?.name;
  return {
    id: item.id,
    name,
    email: item.email,
    age: computeAge(item.date_of_birth),
    gender: item.gender ?? "—",
    objective: computeObjective(item),
    plan: normalizePlanName(planName),
    status: item.is_active ? "active" : "inactive",
    joinDate,
    lastActivity: formatLastActivity(latestSessionAt),
  };
}
