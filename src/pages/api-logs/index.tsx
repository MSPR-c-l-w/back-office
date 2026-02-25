import { ApiCallsChart } from "@/components/dashboard/api-logs/ApiCallsChart";
import { EndpointsStatistics } from "@/components/dashboard/api-logs/endpoints-statistics/EndpointsStatistics";
import { KPICards } from "@/components/dashboard/api-logs/kpi/KPICards";
import { LogEtlPipeline } from "@/components/dashboard/api-logs/log-etl-pipeline/LogEtlPipeline";
import { apiCallsDat, endpointsStats, kpiCards, recentLogs, servers } from "@/components/dashboard/api-logs/mocks";
import { ServersStatus } from "@/components/dashboard/api-logs/servers-status/ServersStatus";
import { PageLayout } from "@/components/layout/PageLayout";
import { NextPageWithLayout } from "@/utils/types/globals";
import { ReactElement } from "react";

const ApiLogsPage: NextPageWithLayout = () => {
  return (
    <div className="space-y-6">
      {/* KPIs */}
      <KPICards kpiCards={kpiCards} />

      {/* API Calls Chart */}
      <ApiCallsChart apiCallsData={apiCallsDat} />

      {/* Servers Status */}
      <ServersStatus servers={servers} />

      {/* Endpoints Statistics */}
      <EndpointsStatistics endpointsStats={endpointsStats} />

      {/* Logs ETL Pipeline */}
      <LogEtlPipeline recentLogs={recentLogs} />
    </div>
  );
};

ApiLogsPage.getLayout = function (page: ReactElement) {
  return <PageLayout pageTitle="API & Logs">{page}</PageLayout>;
};

export default ApiLogsPage;
