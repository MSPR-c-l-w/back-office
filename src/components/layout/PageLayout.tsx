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
import { ReactNode } from "react";

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
  return (
    <div className="flex min-h-screen w-full bg-[#F8FAFB]">
        {/* Sidebar */}
        <Sidebar routes={routes} />

        {/* Main Content */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          {/* Header */}
          <Header
            notifications_count={NOTIFICATIONS_COUNT}
            pageTitle={pageTitle}
          />

          <main className="min-h-0 flex-1 overflow-auto p-8 ml-64 mt-[92px]" role="main">
            {children}
          </main>
        </div>
      </div>
  );
}
