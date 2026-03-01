import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Clock, Target, TrendingUp } from "lucide-react";
import type { UserListItem } from "./mocks";

type Props = { allUsers: UserListItem[] };

export function UsersStatsCards({ allUsers }: Props) {
  const activeCount = allUsers.filter((u) => u.status === "active").length;
  const premiumCount = allUsers.filter((u) => u.plan === "Premium").length;
  const b2bCount = allUsers.filter((u) => u.plan === "B2B").length;

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
            {allUsers.length}
          </div>
          <p className="text-sm text-[#5CC58C] flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4" />
            +12.5% ce mois
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
          <div className="text-3xl font-bold text-[#4A5568]">{activeCount}</div>
          <p className="text-sm text-[#5CC58C] flex items-center gap-1 mt-2">
            <Activity className="w-4 h-4" />
            {allUsers.length > 0
              ? ((activeCount / allUsers.length) * 100).toFixed(1)
              : 0}
            % actifs
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
            {premiumCount}
          </div>
          <p className="text-sm text-[#4A90E2] flex items-center gap-1 mt-2">
            <Target className="w-4 h-4" />
            {allUsers.length > 0
              ? ((premiumCount / allUsers.length) * 100).toFixed(1)
              : 0}
            % conversion
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
          <div className="text-3xl font-bold text-[#4A5568]">{b2bCount}</div>
          <p className="text-sm text-[#7FD8BE] flex items-center gap-1 mt-2">
            <Clock className="w-4 h-4" />
            Entreprises clientes
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
