import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  totalUsers: number;
  activeUsers: number;
  premiumUsers: number;
  b2bUsers: number;
  loading?: boolean;
};

export function UsersStatsCards({
  totalUsers,
  activeUsers,
  premiumUsers,
  b2bUsers,
  loading,
}: Props) {
  const display = loading ? "—" : undefined;

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      role="status"
      aria-live="polite"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-[#4A5568] opacity-80">
            Total Utilisateurs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-[#4A5568]">
            {loading ? display : totalUsers}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-[#4A5568] opacity-80">
            Utilisateurs Actifs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-[#4A5568]">
            {loading ? display : activeUsers}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-[#4A5568] opacity-80">
            Premium
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-[#4A5568]">
            {loading ? display : premiumUsers}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-[#4A5568] opacity-80">
            B2B (Marque Blanche)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-[#4A5568]">
            {loading ? display : b2bUsers}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
