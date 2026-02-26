import { AgeDistribution } from "@/components/dashboard/dashboard-pilotage/AgeDistribution";
import { AlertCard } from "@/components/dashboard/dashboard-pilotage/AlertCard";
import { DataQualityTrend } from "@/components/dashboard/dashboard-pilotage/DataQualityTrend";
import { KpiCard } from "@/components/dashboard/dashboard-pilotage/KpiCard";
import { kpiData, dataQualityTrend, ageDistribution, objectivesData, alerts } from "@/components/dashboard/dashboard-pilotage/mocks";
import { ObjectivesDataChart } from "@/components/dashboard/dashboard-pilotage/ObjectivesDataChart";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { NextPageWithLayout } from "@/utils/types/globals";
import { ReactElement } from "react";
import { ResponsiveContainer } from "recharts";

const DashboardPage: NextPageWithLayout = () => {
  return (
    <div className="space-y-6">
      {/* KPIs Grid */}
      <section aria-labelledby="kpi-section">
        <h3 id="kpi-section" className="sr-only">Indicateurs clés de performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((kpi) => <KpiCard key={kpi.label} kpi={kpi}/>)}
        </div>
      </section>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Quality Trend */}
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

        {/* Age Distribution */}
        <AgeDistribution ageDistribution={ageDistribution}/>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Objectives Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Objectifs Utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <ObjectivesDataChart objectivesData={objectivesData}/>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Alerts */}
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