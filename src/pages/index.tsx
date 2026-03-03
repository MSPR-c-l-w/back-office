import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer } from "recharts";
import { NextPageWithLayout } from "@/utils/types/globals";
import { ReactElement, useEffect, useMemo, useState } from "react";
import { AgeDistribution } from "@/components/dashboard/dashboard-pilotage/AgeDistribution";
import { AlertCard } from "@/components/dashboard/dashboard-pilotage/AlertCard";
import { DataQualityTrend } from "@/components/dashboard/dashboard-pilotage/DataQualityTrend";
import { KpiCard } from "@/components/dashboard/dashboard-pilotage/KpiCard";
import {
  ageDistribution,
  alerts,
  dataQualityTrend,
  kpiData,
  objectivesData,
} from "@/components/dashboard/dashboard-pilotage/mocks";
import { ObjectivesDataChart } from "@/components/dashboard/dashboard-pilotage/ObjectivesDataChart";
import { PageLayout } from "@/components/layout/PageLayout";
import { getUsersSummary } from "@/utils/usersApi";

const DashboardPage: NextPageWithLayout = () => {
  const [usersSummary, setUsersSummary] = useState<{
    total: number;
    active: number;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    getUsersSummary()
      .then((summary) => {
        if (cancelled) return;
        setUsersSummary(summary);
      })
      .catch(() => {
        if (cancelled) return;
        setUsersSummary(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const kpis = useMemo(() => {
    return kpiData.map((kpi) => {
      if (kpi.label !== "Utilisateurs Actifs") return kpi;

      if (!usersSummary) {
        return {
          ...kpi,
          value: "—",
          trend: "—",
        };
      }

      const pctActive =
        usersSummary.total > 0
          ? Math.round((usersSummary.active / usersSummary.total) * 100)
          : 0;

      return {
        ...kpi,
        value: usersSummary.active.toLocaleString("fr-FR"),
        trend: `${pctActive}% actifs`,
      };
    });
  }, [usersSummary]);

  return (
    <div className="space-y-6">
      <section aria-labelledby="kpi-section">
        <h3 id="kpi-section" className="sr-only">
          Indicateurs clés de performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Objectifs Utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <ObjectivesDataChart objectivesData={objectivesData} />
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Alertes Pipeline d&apos;Ingestion</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3" role="list">
              {alerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

DashboardPage.getLayout = function (page: ReactElement) {
  return <PageLayout pageTitle="Dashboard">{page}</PageLayout>;
};

export default DashboardPage;
