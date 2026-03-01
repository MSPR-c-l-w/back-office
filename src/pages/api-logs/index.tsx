import {
  apiCallsDat,
  endpointsStats,
  kpiCards,
  recentLogs,
  servers,
} from "@/components/dashboard/api-logs/mocks";
import { ApiCallsChart } from "@/components/dashboard/api-logs/ApiCallsChart";
import { EndpointsStatistics } from "@/components/dashboard/api-logs/endpoints-statistics/EndpointsStatistics";
import { KPICards } from "@/components/dashboard/api-logs/kpi/KPICards";
import { LogEtlPipeline } from "@/components/dashboard/api-logs/log-etl-pipeline/LogEtlPipeline";
import { ServersStatus } from "@/components/dashboard/api-logs/servers-status/ServersStatus";
import { PageLayout } from "@/components/layout/PageLayout";
import { useRequireRole } from "@/hooks/useRequireRole";
import { NextPageWithLayout } from "@/utils/types/globals";
import { ReactElement } from "react";

const ApiLogsPage: NextPageWithLayout = () => {
  useRequireRole("ADMIN");
  return (
    <div className="space-y-6">
      <KPICards kpiCards={kpiCards} />
      <ApiCallsChart apiCallsData={apiCallsDat} />
      <ServersStatus servers={servers} />
      <EndpointsStatistics endpointsStats={endpointsStats} />
      <LogEtlPipeline recentLogs={recentLogs} />
    </div>
  );
};

ApiLogsPage.getLayout = function (page: ReactElement) {
  return <PageLayout pageTitle="API & Logs">{page}</PageLayout>;
};

export default ApiLogsPage;
