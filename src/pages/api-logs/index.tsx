import { ApiCallsChart } from "@/components/dashboard/api-logs/ApiCallsChart";
import { EndpointsStatistics } from "@/components/dashboard/api-logs/endpoints-statistics/EndpointsStatistics";
import { KPICards } from "@/components/dashboard/api-logs/kpi/KPICards";
import { LogEtlPipeline } from "@/components/dashboard/api-logs/log-etl-pipeline/LogEtlPipeline";
import { ServersStatus } from "@/components/dashboard/api-logs/servers-status/ServersStatus";
import {
  ApiCallPoint,
  ApiLogsRange,
  EndpointStat,
  EtlRecentLog,
  KPICard,
  ServerStatus,
} from "@/components/dashboard/api-logs/types";
import { PageLayout } from "@/components/layout/PageLayout";
import { useRequireRole } from "@/hooks/useRequireRole";
import api from "@/utils/axios";
import { NextPageWithLayout } from "@/utils/types/globals";
import { ReactElement, useEffect, useMemo, useState } from "react";
import { Activity, AlertTriangle, CheckCircle, Clock } from "lucide-react";

const ApiLogsPage: NextPageWithLayout = () => {
  useRequireRole("ADMIN");
  const [range, setRange] = useState<ApiLogsRange>("24h");
  const [kpiCards, setKpiCards] = useState<KPICard[]>([]);
  const [apiCallsData, setApiCallsData] = useState<ApiCallPoint[]>([]);
  const [server, setServer] = useState<ServerStatus | null>(null);
  const [endpointsStats, setEndpointsStats] = useState<EndpointStat[]>([]);
  const [recentLogs, setRecentLogs] = useState<EtlRecentLog[]>([]);

  const kpiIcons = useMemo(
    () => ({
      total: { icon: Activity, color: "#4A90E2" },
      success: { icon: CheckCircle, color: "#5CC58C" },
      latency: { icon: Clock, color: "#7FD8BE" },
      errors: { icon: AlertTriangle, color: "#FF887B" },
    }),
    []
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const [dashboardRes, etlLogsRes] = await Promise.all([
        api.get<{
          kpis: {
            totalCalls: number;
            successRatePercent: number;
            averageLatencyMs: number;
            totalErrors: number;
          };
          timeseries: ApiCallPoint[];
          endpoints: EndpointStat[];
          server: ServerStatus;
        }>(`/analytics/api-logs/dashboard?range=${range}`),
        api.get<{
          items: Array<{
            pipelineId: "nutrition" | "exercise" | "health-profile";
            level: string;
            message: string;
            timestamp: string;
          }>;
        }>(`/etl/logs/recent?level=error&limit=20`),
      ]);

      if (cancelled) return;

      const dashboard = dashboardRes.data;
      setApiCallsData(dashboard.timeseries ?? []);
      setEndpointsStats(dashboard.endpoints ?? []);
      setServer(dashboard.server);

      setKpiCards([
        {
          label: "Total Appels API",
          value: dashboard.kpis.totalCalls.toLocaleString("fr-FR"),
          icon: kpiIcons.total.icon,
          color: kpiIcons.total.color,
        },
        {
          label: "Taux de Succès",
          value: `${dashboard.kpis.successRatePercent}%`,
          icon: kpiIcons.success.icon,
          color: kpiIcons.success.color,
        },
        {
          label: "Latence Moyenne",
          value: `${dashboard.kpis.averageLatencyMs}ms`,
          icon: kpiIcons.latency.icon,
          color: kpiIcons.latency.color,
        },
        {
          label: "Erreurs Totales",
          value: dashboard.kpis.totalErrors.toLocaleString("fr-FR"),
          icon: kpiIcons.errors.icon,
          color: kpiIcons.errors.color,
        },
      ]);

      setRecentLogs(
        (etlLogsRes.data.items ?? []).map((l, idx) => ({
          id: `${l.pipelineId}-${l.timestamp}-${idx}`,
          timestamp: new Date(l.timestamp).toLocaleString("fr-FR"),
          level: l.level,
          service: `ETL ${l.pipelineId}`,
          message: l.message,
        }))
      );
    }

    load().catch(() => {
      if (cancelled) return;
      setKpiCards([]);
      setApiCallsData([]);
      setEndpointsStats([]);
      setRecentLogs([]);
      setServer(null);
    });

    return () => {
      cancelled = true;
    };
  }, [kpiIcons, range]);

  useEffect(() => {
    let stopped = false;
    let intervalId: number | null = null;

    async function refreshServer() {
      try {
        const res = await api.get<ServerStatus>(
          "/analytics/api-logs/server-status"
        );
        if (stopped) return;
        setServer(res.data);
      } catch {
        // On garde la dernière valeur connue pour éviter le clignotement.
      }
    }

    refreshServer().catch(() => null);
    intervalId = window.setInterval(() => {
      refreshServer().catch(() => null);
    }, 2000);

    return () => {
      stopped = true;
      if (intervalId != null) {
        window.clearInterval(intervalId);
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <KPICards kpiCards={kpiCards} />
      <ApiCallsChart
        apiCallsData={apiCallsData}
        defaultRange={range}
        onRangeChange={setRange}
      />
      {server ? <ServersStatus server={server} /> : null}
      <EndpointsStatistics endpointsStats={endpointsStats} />
      <LogEtlPipeline recentLogs={recentLogs} />
    </div>
  );
};

ApiLogsPage.getLayout = function (page: ReactElement) {
  return <PageLayout pageTitle="API & Logs">{page}</PageLayout>;
};

export default ApiLogsPage;
