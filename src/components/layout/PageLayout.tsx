import {
  LayoutDashboard,
  Database,
  BarChart3,
  Server,
  Users as UsersIcon,
} from "lucide-react";
import { Sidebar } from "@/components/misc/Sidebar";
import { Routes } from "@/utils/types/globals";
import { Header } from "../misc/Header";
import { ReactNode, useState } from "react";

const routes: Routes[] = [
  {
    path: "/",
    label: "Dashboard de Pilotage",
    icon: LayoutDashboard,
  },
  {
    path: "/users",
    label: "Gestion Utilisateurs",
    icon: UsersIcon,
  },
  {
    path: "/data",
    label: "Gestion & Nettoyage",
    icon: Database,
  },
  {
    path: "/analytics",
    label: "Analytics Business",
    icon: BarChart3,
  },
  {
    path: "/api-logs",
    label: "API & Logs",
    icon: Server,
  },
];

const NOTIFICATIONS_COUNT = 3;

type Props = {
  children: ReactNode;
  pageTitle: string;
};

export function PageLayout({ children, pageTitle }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-[#F8FAFB]">
      {/* Backdrop mobile (sidebar ouvert) */}
      <button
        type="button"
        aria-label="Fermer le menu"
        onClick={() => setSidebarOpen(false)}
        className="fixed inset-0 z-30 bg-black/50 transition-opacity lg:hidden"
        style={{
          opacity: sidebarOpen ? 1 : 0,
          pointerEvents: sidebarOpen ? "auto" : "none",
        }}
      />

      {/* Sidebar */}
      <Sidebar
        routes={routes}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden w-full">
        {/* Header */}
        <Header
          notifications_count={NOTIFICATIONS_COUNT}
          pageTitle={pageTitle}
          onMenuClick={() => setSidebarOpen((v) => !v)}
        />

        <main
          className="min-h-0 flex-1 overflow-auto p-4 sm:p-6 lg:p-8 mt-[92px] lg:ml-64"
          role="main"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
