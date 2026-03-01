import { useAuth } from "@/hooks/useAuth";
import { hasBackOfficeAccess } from "@/utils/roles";
import { useRouter } from "next/router";
import { useEffect, type ReactNode } from "react";

const LOGIN_PATH = "/auth/login";

type Props = { children: ReactNode };

/**
 * Redirige vers la page de connexion si l'utilisateur connecté n'a pas
 * accès au back-office (rôle autre que ADMIN). À placer dans _app pour
 * protéger toutes les pages (hors login).
 */
export function BackOfficeGuard({ children }: Props) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading || router.pathname === LOGIN_PATH) return;
    if (user && !hasBackOfficeAccess(user.role?.name)) {
      logout(`${LOGIN_PATH}?error=forbidden`);
    }
  }, [loading, user, router.pathname, logout]);

  return <>{children}</>;
}
