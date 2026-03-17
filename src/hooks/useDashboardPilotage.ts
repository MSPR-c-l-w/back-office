"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, CreditCard, Database, Users } from "lucide-react";
import api from "@/utils/axios";
import type {
  AgeDistributionType,
  AlertType,
  DataQualityTrendType,
  ObjectivesDataType,
} from "@/components/dashboard/dashboard-pilotage/mocks";
import type { KPIDataType } from "@/components/dashboard/dashboard-pilotage/mocks";

export type DashboardPilotageApiResponse = {
  kpis: {
    dataQuality: { value: string; trend: string };
    activeUsers: { value: string; trend: string };
    premiumConversion: { value: string; trend: string };
    pipelineErrors: { value: string; trend: string };
  };
  dataQualityTrend: DataQualityTrendType[];
  ageDistribution: AgeDistributionType[];
  objectivesData: ObjectivesDataType[];
  alerts: AlertType[];
};

const KPI_CONFIG: Pick<KPIDataType, "label" | "icon" | "color">[] = [
  { label: "Qualité des Données", icon: Database, color: "#5CC58C" },
  { label: "Utilisateurs Actifs", icon: Users, color: "#4A90E2" },
  { label: "Conversion Premium", icon: CreditCard, color: "#7FD8BE" },
  { label: "Erreurs Pipeline", icon: AlertTriangle, color: "#FF887B" },
];

function mapApiToKpiData(
  kpis: DashboardPilotageApiResponse["kpis"]
): KPIDataType[] {
  const entries: [keyof typeof kpis, number][] = [
    ["dataQuality", 0],
    ["activeUsers", 1],
    ["premiumConversion", 2],
    ["pipelineErrors", 3],
  ];
  return entries.map(([key], i) => {
    const kpi = kpis[key];
    const config = KPI_CONFIG[i];
    const status =
      key === "pipelineErrors" && parseInt(kpi.value, 10) > 0
        ? "warning"
        : "success";
    return {
      ...config,
      value: kpi.value,
      trend: kpi.trend,
      status,
    } as KPIDataType;
  });
}

export type UseDashboardPilotageResult = {
  kpiData: KPIDataType[];
  dataQualityTrend: DataQualityTrendType[];
  ageDistribution: AgeDistributionType[];
  objectivesData: ObjectivesDataType[];
  alerts: AlertType[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

export function useDashboardPilotage(): UseDashboardPilotageResult {
  const [data, setData] = useState<DashboardPilotageApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPilotage = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await api.get<DashboardPilotageApiResponse>(
        "/dashboard/pilotage"
      );
      setData(res);
    } catch (err) {
      setError(
        err && typeof err === "object" && "message" in err
          ? String((err as { message?: string }).message)
          : "Erreur lors du chargement du pilotage"
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPilotage();
  }, [fetchPilotage]);

  const kpiData = data ? mapApiToKpiData(data.kpis) : [];
  const dataQualityTrend = data?.dataQualityTrend ?? [];
  const ageDistribution = data?.ageDistribution ?? [];
  const objectivesData = data?.objectivesData ?? [];
  const alerts = data?.alerts ?? [];

  return {
    kpiData,
    dataQualityTrend,
    ageDistribution,
    objectivesData,
    alerts,
    loading,
    error,
    refetch: fetchPilotage,
  };
}
