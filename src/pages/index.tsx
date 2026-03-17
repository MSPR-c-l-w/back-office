import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer } from "recharts";
import { NextPageWithLayout } from "@/utils/types/globals";
import { ReactElement, useEffect } from "react";
import { AgeDistribution } from "@/components/dashboard/dashboard-pilotage/AgeDistribution";
import { AlertCard } from "@/components/dashboard/dashboard-pilotage/AlertCard";
import { DataQualityTrend } from "@/components/dashboard/dashboard-pilotage/DataQualityTrend";
import { KpiCard } from "@/components/dashboard/dashboard-pilotage/KpiCard";
import { PageLayout } from "@/components/layout/PageLayout";
import { useDashboardPilotage } from "@/hooks/useDashboardPilotage";
import { useNotifications } from "@/contexts/NotificationsContext";

const DashboardPage: NextPageWithLayout = () => {
  const { pushNotification } = useNotifications();
  const {
    kpiData,
    dataQualityTrend,
    ageDistribution,
    alerts,
    loading,
    error,
    refetch,
  } = useDashboardPilotage();

  const sortedAlerts = [...alerts].sort((a, b) => b.id - a.id);

  useEffect(() => {
    alerts.forEach((alert) => {
      pushNotification({
        id: `dashboard-${alert.id}`,
        type:
          alert.type === "error"
            ? "error"
            : alert.type === "warning"
              ? "warning"
              : "success",
        title: "Alerte pipeline d'ingestion",
        message: alert.message,
        createdAt: new Date().toISOString(),
        source: "dashboard",
        read: false,
      });
    });
  }, [alerts, pushNotification]);

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
        <p className="font-medium">Erreur de chargement du pilotage</p>
        <p className="text-sm mt-1">{error}</p>
        <button
          type="button"
          onClick={refetch}
          className="mt-3 text-sm font-medium underline focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-[#4A5568]">
        Chargement du pilotage…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section aria-labelledby="kpi-section">
        <h3 id="kpi-section" className="sr-only">
          Indicateurs clés de performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiData.map((kpi) => (
            <KpiCard key={kpi.label} kpi={kpi} />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tendance Qualité des Données (7 jours)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <DataQualityTrend dataQualityTrend={dataQualityTrend} />
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <AgeDistribution ageDistribution={ageDistribution} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alertes Pipeline d&apos;Ingestion</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3" role="list">
            {sortedAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

DashboardPage.getLayout = function (page: ReactElement) {
  return <PageLayout pageTitle="Dashboard">{page}</PageLayout>;
};

export default DashboardPage;
