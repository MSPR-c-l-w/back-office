import Link from "next/link";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import { Routes } from "@/utils/types/globals";
import { useAuth } from "@/hooks/useAuth";
import { hasRequiredRole } from "@/utils/roles";
import { useEffect, useRef, useState } from "react";

type SidebarProps = {
  id?: string;
  routes: Routes[];
  open?: boolean;
  onClose?: () => void;
};

export const Sidebar = ({
  id,
  routes,
  open = false,
  onClose,
}: SidebarProps) => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const sidebarRef = useRef<HTMLElement | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const updateIsDesktop = (event?: MediaQueryListEvent) => {
      setIsDesktop(event ? event.matches : mediaQuery.matches);
    };

    updateIsDesktop();
    mediaQuery.addEventListener("change", updateIsDesktop);
    return () => {
      mediaQuery.removeEventListener("change", updateIsDesktop);
    };
  }, []);

  useEffect(() => {
    if (!open || isDesktop) return;

    const firstFocusable = sidebarRef.current?.querySelector<
      HTMLAnchorElement | HTMLButtonElement
    >("a[href], button:not([disabled])");
    firstFocusable?.focus();

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isDesktop, open, onClose]);

  if (loading) return <p className="p-4 text-[#4A5568]">Chargement...</p>;

  return (
    <aside
      id={id}
      ref={sidebarRef}
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col border-r border-gray-200 bg-white transition-transform duration-200 ease-out lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}
      role="navigation"
      aria-label="Navigation principale"
      aria-hidden={!isDesktop && !open}
      tabIndex={!isDesktop && open ? -1 : undefined}
      {...(!isDesktop && !open ? { inert: true } : {})}
    >
      <div className="px-6 h-[92px] border-b border-gray-200 flex flex-col justify-center">
        <p className="text-xl font-bold text-[#4A5568] leading-tight">
          HealthAI Coach
        </p>
        <p className="mt-1 text-sm text-[#475569]">Back-office Admin</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2" role="list">
          {routes
            .filter(
              (item) =>
                !item.requiredRole ||
                hasRequiredRole(user?.role?.name ?? null, item.requiredRole)
            )
            .map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === "/"
                  ? router.pathname === "/"
                  : router.pathname === item.path ||
                    router.pathname.startsWith(item.path + "/");
              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    onClick={() => onClose?.()}
                    className={cn(
                      "inline-flex w-full items-center justify-start gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-[#4A90E2] text-white hover:bg-[#4A90E2]/90"
                        : "text-[#4A5568] hover:bg-gray-100"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="bg-[#4A90E2] text-white">
              DS
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium text-[#4A5568]">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-xs text-[#475569]">
              {user?.role?.name || "MEMBER"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
