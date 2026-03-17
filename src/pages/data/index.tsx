import { Button } from "@/components/ui/button";
import { Download, Play } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DataQualityAnomalies } from "@/components/dashboard/data-management/DataQualityAnomalies";
import { DataQualityValidation } from "@/components/dashboard/data-management/DataQualityValidation";
import { DatasetCard } from "@/components/dashboard/data-management/DatasetCard";
import { datasets } from "@/components/dashboard/data-management/mocks";
import { PipelineLog } from "@/components/dashboard/data-management/PipelineLog";
import { PageLayout } from "@/components/layout/PageLayout";
import { NextPageWithLayout } from "@/utils/types/globals";
import { ReactElement } from "react";
import { useEtlLogs, type PipelineId } from "@/hooks/useEtlLogs";
import api from "@/utils/axios";
import { useNotifications } from "@/contexts/NotificationsContext";

const DATASET_TO_PIPELINE: Record<string, PipelineId> = {
  nutrition: "nutrition",
  exercises: "exercise",
  biometry: "health-profile",
};

const PIPELINE_TO_API_PATH: Record<PipelineId, string> = {
  nutrition: "/nutrition/import",
  exercise: "/exercise/import",
  "health-profile": "/health-profile/import",
};

type PipelineDisplayStatus = "idle" | "running" | "success" | "error";
type PipelineSummary = {
  anomalies: number;
  lastSync: string | null;
};

const DEFAULT_PIPELINE_SUMMARY: Record<PipelineId, PipelineSummary> = {
  nutrition: { anomalies: 0, lastSync: null },
  exercise: { anomalies: 0, lastSync: null },
  "health-profile": { anomalies: 0, lastSync: null },
};

function formatRelativeSync(lastSyncIso: string | null): string {
  if (!lastSyncIso) return "Jamais";
  const last = new Date(lastSyncIso);
  if (Number.isNaN(last.getTime())) return "Inconnue";
  const diffMs = Date.now() - last.getTime();
  if (diffMs < 60_000) return "À l'instant";
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h`;
  const days = Math.floor(hours / 24);
  return `${days} j`;
}

const DataPage: NextPageWithLayout = () => {
  const { pushNotification } = useNotifications();
  const [launchingByPipeline, setLaunchingByPipeline] = useState<
    Record<PipelineId, boolean>
  >({
    nutrition: false,
    exercise: false,
    "health-profile": false,
  });
  const [runningByPipeline, setRunningByPipeline] = useState<
    Record<PipelineId, boolean>
  >({
    nutrition: false,
    exercise: false,
    "health-profile": false,
  });
  const [statusByPipeline, setStatusByPipeline] = useState<
    Record<PipelineId, PipelineDisplayStatus>
  >({
    nutrition: "idle",
    exercise: "idle",
    "health-profile": "idle",
  });
  const [selectedDataset, setSelectedDataset] = useState("nutrition");
  const [refreshSignal, setRefreshSignal] = useState(0);
  const [isExportingFinalData, setIsExportingFinalData] = useState(false);
  const [pipelineSummaryById, setPipelineSummaryById] = useState<
    Record<PipelineId, PipelineSummary>
  >(DEFAULT_PIPELINE_SUMMARY);

  const {
    logs: pipelineLogs,
    clearLogs,
    subscribe,
    isConnected,
  } = useEtlLogs();
  const pipelineId = DATASET_TO_PIPELINE[selectedDataset] ?? "nutrition";
  const isCurrentPipelineRunning = runningByPipeline[pipelineId];
  const isCurrentPipelineLaunching = launchingByPipeline[pipelineId];
  const pipelineStatus = useMemo<PipelineDisplayStatus>(() => {
    if (isCurrentPipelineRunning || isCurrentPipelineLaunching)
      return "running";
    return statusByPipeline[pipelineId];
  }, [
    isCurrentPipelineRunning,
    isCurrentPipelineLaunching,
    pipelineId,
    statusByPipeline,
  ]);
  const displayDatasets = useMemo(
    () =>
      datasets.map((dataset) => {
        const mappedPipeline = DATASET_TO_PIPELINE[dataset.id] ?? "nutrition";
        const summary = pipelineSummaryById[mappedPipeline];
        const anomalies = summary?.anomalies ?? 0;
        return {
          ...dataset,
          issues: anomalies,
          lastSync: formatRelativeSync(summary?.lastSync ?? null),
          status: anomalies > 0 ? "warning" : "success",
        };
      }),
    [pipelineSummaryById]
  );

  useEffect(() => {
    subscribe(pipelineId);
  }, [pipelineId, subscribe]);

  const refreshPipelineStatuses = useCallback(async () => {
    try {
      const { data } = await api.get<Record<PipelineId, boolean>>(
        "/etl/pipelines/status"
      );
      setRunningByPipeline({
        nutrition: !!data?.nutrition,
        exercise: !!data?.exercise,
        "health-profile": !!data?.["health-profile"],
      });
    } catch {
      // Pas bloquant pour l'UI: on garde le dernier état connu.
    }
  }, []);

  const refreshPipelineSummary = useCallback(async () => {
    try {
      const { data } = await api.get<Record<PipelineId, PipelineSummary>>(
        "/etl/pipelines/summary"
      );
      setPipelineSummaryById({
        nutrition: data?.nutrition ?? DEFAULT_PIPELINE_SUMMARY.nutrition,
        exercise: data?.exercise ?? DEFAULT_PIPELINE_SUMMARY.exercise,
        "health-profile":
          data?.["health-profile"] ??
          DEFAULT_PIPELINE_SUMMARY["health-profile"],
      });
    } catch {
      // Pas bloquant pour l'UI: on conserve les dernières métriques connues.
    }
  }, []);

  useEffect(() => {
    refreshPipelineStatuses();
    const timer = setInterval(refreshPipelineStatuses, 2500);
    return () => clearInterval(timer);
  }, [refreshPipelineStatuses]);

  useEffect(() => {
    refreshPipelineSummary();
    const timer = setInterval(refreshPipelineSummary, 10_000);
    return () => clearInterval(timer);
  }, [refreshPipelineSummary]);

  const handleLaunchPipeline = async () => {
    const targetPipeline = pipelineId;
    if (
      runningByPipeline[targetPipeline] ||
      launchingByPipeline[targetPipeline]
    ) {
      return;
    }
    clearLogs(targetPipeline);
    setLaunchingByPipeline((prev) => ({ ...prev, [targetPipeline]: true }));
    setStatusByPipeline((prev) => ({ ...prev, [targetPipeline]: "running" }));
    setRunningByPipeline((prev) => ({ ...prev, [targetPipeline]: true }));
    subscribe(targetPipeline);
    const path = PIPELINE_TO_API_PATH[targetPipeline];
    try {
      pushNotification({
        id: `etl-start-${targetPipeline}-${Date.now()}`,
        type: "info",
        title: "Pipeline ETL",
        message: `Pipeline ${targetPipeline} démarré`,
        createdAt: new Date().toISOString(),
        source: "etl",
        read: false,
      });
      await api.post(path);
      setStatusByPipeline((prev) => ({ ...prev, [targetPipeline]: "success" }));
      pushNotification({
        id: `etl-success-${targetPipeline}-${Date.now()}`,
        type: "success",
        title: "Pipeline ETL",
        message: `Pipeline ${targetPipeline} terminé avec succès`,
        createdAt: new Date().toISOString(),
        source: "etl",
        read: false,
      });
    } catch {
      setStatusByPipeline((prev) => ({ ...prev, [targetPipeline]: "error" }));
      pushNotification({
        id: `etl-error-${targetPipeline}-${Date.now()}`,
        type: "error",
        title: "Pipeline ETL",
        message: `Erreur lors de l'exécution du pipeline ${targetPipeline}`,
        createdAt: new Date().toISOString(),
        source: "etl",
        read: false,
      });
    } finally {
      setLaunchingByPipeline((prev) => ({ ...prev, [targetPipeline]: false }));
      await refreshPipelineStatuses();
      await refreshPipelineSummary();
      setRefreshSignal((value) => value + 1);
    }
  };

  const handleExportFinalData = async () => {
    if (isExportingFinalData) return;
    setIsExportingFinalData(true);
    try {
      const response = await api.get<Blob>("/etl/export/final", {
        params: { pipeline: pipelineId },
        responseType: "blob",
      });

      const contentDisposition = response.headers["content-disposition"];
      const filenameMatch =
        typeof contentDisposition === "string"
          ? contentDisposition.match(/filename="([^"]+)"/)
          : null;
      const filename = filenameMatch?.[1] ?? `${pipelineId}.csv`;

      const blob = new Blob([response.data], {
        type: "text/csv;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } finally {
      setIsExportingFinalData(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#4A5568]">
          Datasets Disponibles
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="default"
            className="border-slate-300 bg-white text-black hover:bg-slate-100 hover:text-black gap-2"
            onClick={handleExportFinalData}
            disabled={isExportingFinalData}
          >
            <Download
              className={`w-4 h-4 ${isExportingFinalData ? "animate-pulse" : ""}`}
            />
            {isExportingFinalData ? "Export CSV..." : "Exporter CSV"}
          </Button>
          <Button
            size="default"
            className="bg-[#FF887B] hover:bg-[#ff7066] text-white gap-2"
            onClick={handleLaunchPipeline}
            disabled={isCurrentPipelineRunning || isCurrentPipelineLaunching}
          >
            <Play
              className={`w-4 h-4 ${
                isCurrentPipelineLaunching ? "animate-spin" : ""
              }`}
            />
            {isCurrentPipelineRunning
              ? "Pipeline déjà en cours..."
              : isCurrentPipelineLaunching
                ? "Lancement..."
                : "Lancer le Pipeline ETL"}
          </Button>
        </div>
      </div>

      <section aria-labelledby="datasets-section">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayDatasets.map((dataset) => (
            <DatasetCard
              key={dataset.id}
              dataset={dataset}
              selectedDataset={selectedDataset}
              setSelectedDataset={setSelectedDataset}
            />
          ))}
        </div>
      </section>

      <PipelineLog
        pipelineStatus={pipelineStatus}
        pipelineLogs={pipelineLogs}
        onClear={clearLogs}
        isConnected={isConnected}
      />

      <DataQualityAnomalies
        pipeline={pipelineId}
        pipelineLabel={
          displayDatasets.find((d) => d.id === selectedDataset)?.name ??
          selectedDataset
        }
        refreshSignal={refreshSignal}
        onDataChanged={() => setRefreshSignal((value) => value + 1)}
      />

      <DataQualityValidation
        pipeline={pipelineId}
        pipelineLabel={
          displayDatasets.find((d) => d.id === selectedDataset)?.name ??
          selectedDataset
        }
        refreshSignal={refreshSignal}
        onDataChanged={() => setRefreshSignal((value) => value + 1)}
      />
    </div>
  );
};

DataPage.getLayout = function (page: ReactElement) {
  return <PageLayout pageTitle="Gestion & Nettoyage">{page}</PageLayout>;
};

export default DataPage;
