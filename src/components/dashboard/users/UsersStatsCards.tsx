import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Clock, Target, TrendingUp } from "lucide-react";
<<<<<<< SCRUM-115-back-office-card-utilisateurs-actifs
import type { UsersSummary } from "@/utils/usersApi";
import type { UserListItem } from "./mocks";
=======
import type { UserListItem } from "@/utils/types/users";
>>>>>>> main

type Props = {
  summary: UsersSummary | null;
  loading: boolean;
  error: string | null;
  /**
   * Données optionnelles pour conserver les cartes "Premium" / "B2B" (actuellement mockées).
   * À remplacer par un endpoint backend quand il existera.
   */
  allUsersForExtras?: UserListItem[];
};

function getKpiHint(error: string | null) {
  if (!error) return "—";
  if (error.includes("USERS_API_MISCONFIGURED")) return "Config API";
  return "API indispo";
}

export function UsersStatsCards({
  summary,
  loading,
  error,
  allUsersForExtras,
}: Props) {
  const total = summary?.total ?? 0;
  const activeCount = summary?.active ?? 0;
  const totalTrend =
    summary?.totalGrowthPctThisMonth == null
      ? "Pas encore de données pour ce mois-ci"
      : `+${summary.totalGrowthPctThisMonth.toFixed(1)}% ce mois`;
  const pctActive =
    summary && total > 0 ? ((activeCount / total) * 100).toFixed(1) : "0.0";

  const extrasTotal = allUsersForExtras?.length ?? 0;
  const premiumCount =
    allUsersForExtras?.filter((u) => u.plan === "Premium").length ?? 0;
  const b2bCount =
    allUsersForExtras?.filter((u) => u.plan === "B2B").length ?? 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-[#4A5568] opacity-70">
            Total Utilisateurs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-[#4A5568]">
            {loading ? "…" : summary ? total.toLocaleString("fr-FR") : "—"}
          </div>
          <p className="text-sm text-[#5CC58C] flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4" />
            {loading ? "Chargement" : summary ? totalTrend : getKpiHint(error)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-[#4A5568] opacity-70">
            Utilisateurs Actifs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-[#4A5568]">
            {loading
              ? "…"
              : summary
                ? activeCount.toLocaleString("fr-FR")
                : "—"}
          </div>
          <p className="text-sm text-[#5CC58C] flex items-center gap-1 mt-2">
            <Activity className="w-4 h-4" />
            {loading
              ? "Chargement"
              : summary
                ? `${pctActive}% actifs`
                : getKpiHint(error)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-[#4A5568] opacity-70">
            Premium
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-[#4A5568]">
            {allUsersForExtras ? premiumCount.toLocaleString("fr-FR") : "—"}
          </div>
          <p className="text-sm text-[#4A90E2] flex items-center gap-1 mt-2">
            <Target className="w-4 h-4" />
            {allUsersForExtras
              ? `${extrasTotal > 0 ? ((premiumCount / extrasTotal) * 100).toFixed(1) : "0.0"}% conversion`
              : "—"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-[#4A5568] opacity-70">
            B2B (Marque Blanche)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-[#4A5568]">
            {allUsersForExtras ? b2bCount.toLocaleString("fr-FR") : "—"}
          </div>
          <p className="text-sm text-[#7FD8BE] flex items-center gap-1 mt-2">
            <Clock className="w-4 h-4" />
            {allUsersForExtras ? "Entreprises clientes" : "—"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
