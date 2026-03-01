"use client";

import { useAuth } from "@/hooks/useAuth";
import { hasRequiredRole as checkRequiredRole } from "@/utils/roles";
import type { BackOfficeRole } from "@/utils/roles";
import { useRouter } from "next/router";
import { useEffect } from "react";

/**
 * Hook pour restreindre l'accès à une page à certains rôles (ex. ADMIN uniquement).
 * Redirige vers la page d'accueil si l'utilisateur n'a pas le rôle requis.
 *
 * @example
 * // Page réservée aux admins
 * function AdminUsersPage() {
 *   useRequireRole("ADMIN");
 *   return <div>...</div>;
 * }
 *
 * @example
 * // Page accessible aux admins uniquement
 * useRequireRole("ADMIN");
 */
export function useRequireRole(
  requiredRole: BackOfficeRole | BackOfficeRole[]
): void {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    const allowed = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    const hasAccess = checkRequiredRole(user?.role?.name ?? null, allowed);
    if (!hasAccess) {
      router.replace("/");
    }
  }, [loading, user?.role?.name, requiredRole, router]);
}
