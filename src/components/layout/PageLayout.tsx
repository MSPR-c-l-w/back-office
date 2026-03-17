import {
  LayoutDashboard,
  Database,
  BarChart3,
  Server,
  Users as UsersIcon,
  CreditCard,
  Building2,
  Dumbbell,
  UtensilsCrossed,
} from "lucide-react";
import { Sidebar } from "@/components/misc/Sidebar";
import { Routes } from "@/utils/types/globals";
import { Header } from "../misc/Header";
import { ReactNode, useState } from "react";
import Head from "next/head";

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
    path: "/plans",
    label: "Gestion Plans",
    icon: CreditCard,
  },
  {
    path: "/organizations",
    label: "Gestion Organisations",
    icon: Building2,
  },
  {
    path: "/exercises",
    label: "Gestion Exercices",
    icon: Dumbbell,
  },
  {
    path: "/nutrition",
    label: "Gestion Nutrition",
    icon: UtensilsCrossed,
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

type Props = {
  children: ReactNode;
  pageTitle: string;
};

export function PageLayout({ children, pageTitle }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarId = "primary-sidebar";
  const mainContentId = "main-content";

  return (
    <div className="flex min-h-screen w-full bg-[#F8FAFB]">
      <Head>
        <title>{`${pageTitle} | HealthAI Coach`}</title>
      </Head>
      <a
        href={`#${mainContentId}`}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-60 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-[#1F2937] focus:shadow-md"
      >
        Aller au contenu principal
      </a>

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Fermer le menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 transition-opacity lg:hidden"
        />
      )}

      {/* Sidebar */}
      <Sidebar
        id={sidebarId}
        routes={routes}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden w-full">
        {/* Header */}
        <Header
          pageTitle={pageTitle}
          sidebarId={sidebarId}
          notificationsPanelId="notifications-panel"
          onMenuClick={() => setSidebarOpen((v) => !v)}
          isSidebarOpen={sidebarOpen}
        />

        <main
          id={mainContentId}
          className="min-h-0 flex-1 overflow-auto p-4 sm:p-6 lg:p-8 mt-[92px] lg:ml-64"
          role="main"
          tabIndex={-1}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
